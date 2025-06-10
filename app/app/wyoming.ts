// exposes the microphone as a wyoming satellite
import TcpSocket from 'react-native-tcp-socket';
import {HMLogger} from './logger';
import {
  APP_VERSION,
  AUDIO_INFO,
  STORAGE_MIC_GAIN,
  WYOMING_PORT,
} from './constants';
import {Settings} from './settings';
import {PCMPlayer} from './pcm';
import {
  SavedSettings,
  ClientMessage,
  ClientEvent,
  WyomingEvent,
} from './proto/hassmic';
import {CheyenneSocket} from './cheyenne';
import {DeviceEventEmitter} from 'react-native';

const Logger = new HMLogger('wyoming.ts');
type CallbackType<T> = ((s: T) => void) | null;

// Represents a wyoming protocol packet (JSON and optional payload)
class WyomingPacket {
  private _type: string = '';
  private _data: {[key: string]: any} = {};
  private _payload: Uint8Array = new Uint8Array();

  // Validates a packet. Logs a warning if invalid and returns false. Otherwise
  // returns true.
  validate: () => boolean = () => {
    if (!this._type) {
      Logger.warning('WyomingPacket missing type');
      return false;
    }
    if (this.getPayloadLength() != this._payload.length) {
      Logger.warning(
        `WyomingPacket payload length does not match stated length: ${this.getPayloadLength()} != ${
          this._payload.length
        }`,
      );
      return false;
    }

    return true;
  };

  // Set a property on the packet.
  setProp(prop: string, val: any) {
    this._data[prop] = val;
  }

  // Get a property on the packet.
  getProp(prop: string) {
    return this._data[prop] || undefined;
  }

  // Set the payload and update the payload length.
  setPayload(payload: Uint8Array | null) {
    if (!payload) {
      this._payload = new Uint8Array();
    } else {
      this._payload = payload;
    }
  }

  // Return the payload
  getPayload = () => {
    return this._payload;
  };

  // Return the payload length, or zero if there is no payload.
  private getPayloadLength = () => {
    return this._payload.length;
  };

  getData = () => {
    return JSON.stringify(this._data);
  };

  setData = (data: {[key: string]: any}) => {
    if (data && typeof data === 'object') {
      this._data = data;
    } else {
      Logger.error('Invalid data for WyomingPacket, must be an object');
      this._data = {};
    }
  };

  getDataLength = () => {
    return JSON.stringify(this._data).length;
  };

  // Shortcut method for getting the type of this packet.
  getType = () => {
    return this._type;
  };

  // If this packet has any data in it, return it as a JSON string. Otherwise
  // return a placeholder.
  toString = () => {
    return JSON.stringify({
      type: this._type,
      data: this._data,
      payload_length: this.getPayloadLength(),
    });
  };

  toProto = () => {
    try {
      // replace audio-chunk with audioChunk and similar to match compiler
      let kind = this.getType().replaceAll(/-([a-z])/g, match =>
        match[1].toUpperCase(),
      );
      Logger.info(`Sending wyoming packet: ${this.toString()}`);
      let p: WyomingEvent = WyomingEvent.create({
        rawJson: this.toString(),
        payload: this.getPayload(),
        event: {
          oneofKind: kind,
          [kind]: JSON.parse(this.getData()),
        },
      });
      if (!p.event.oneofKind) {
        Logger.warning(`Wyoming event type '${kind}' not defined!`);
      }
      return p;
    } catch (e: any) {
      Logger.error(`Error building proto: ${e}`);
      return WyomingEvent.create();
    }
  };

  // Construct a packet from a blob of data
  constructor(fromData: any | undefined) {
    if (fromData) {
      this._type = fromData['type'] || '';
      if ('data' in fromData) {
        for (let [k, v] of Object.entries(fromData['data'])) {
          this._data[k] = v;
        }
      }
    }
  }

  toBytes = () => {
    let pl = this._payload.length;
    let jsonstr = JSON.stringify({
      type: this._type,
      payload_length: pl,
      data: this._data,
    });
    let outBytes = new Uint8Array(jsonstr.length + this._payload.length + 1);
    let j = 0;
    for (let i = 0; i < jsonstr.length; i++) {
      outBytes[j] = jsonstr[i].codePointAt(0) || 0;
      j++;
    }
    outBytes[j] = '\n'.codePointAt(0) || 0;
    j++;
    for (let i = 0; i < this._payload.length; i++) {
      outBytes[j] = this._payload[i];
      j++;
    }
    return outBytes;
  };

  // Check that this packet is valid, then write it to a given socket.
  _writeToSocket = (s: TcpSocket.Socket | null) => {
    if (!s) {
      throw new Error("Can't write to null socket");
    }
    if (!this.validate()) {
      throw new Error('Not writing invalid wyoming packet');
    }

    try {
      if (!s.write(this.toBytes())) {
        Logger.error(
          `Error writing wyoming packet to socket ${s.remotePort}: ${this._type}`,
        );
      }
    } catch (e: any) {
      Logger.error(`Error writing packet: ${e}`);
    }
  };
}

// state machine that handles bytes as they come in from the stream and emits
// complete wyoming packets as they're ready.
class ReceiveStateMachine {
  // incoming data queue
  private _handleCompletePacket: (p: WyomingPacket) => void = p => {};
  private _dataQueue: any = [];
  private start = 0;

  // construct with a callback for what to do when a packet is formed.
  constructor(cb: (p: WyomingPacket) => void) {
    this._handleCompletePacket = cb;
    // initialize the generator. Not sure why it needs an empty call to next()
    // before it works properly, but it does.
    this._byteHandler.next().then();
  }

  // This is the main point of interaction. Feeds bytes to the state machine.
  handleBytes = async (b: Uint8Array) => {
    // Ensure Uint8Array is constructed with ArrayBuffer
    this._dataQueue.push(...b);
    // If we're waiting for data, we can just continue processing
    await this._byteHandler.next();
  };

  dataQueueShift() {
    if (this.start >= this._dataQueue.length) {
      return undefined;
    }
    const result = this._dataQueue[this.start++];
    if (this.start >= this._dataQueue.length - this.start) {
      //move all the elements into the free space at beginning
      let d = 0;
      for (let i = this.start; i < this._dataQueue.length; ++i) {
        this._dataQueue[d++] = this._dataQueue[i];
      }
      this.start = 0;
      this._dataQueue.length = d;
    }
    return result;
  }

  // State machine, implemented as a generator function. The function consumes
  // bytes (fed in by next()) and emits Wyoming packets using the callback
  // passed in the constructor.
  private _byteHandler = (async function* (ethis) {
    while (true) {
      let jsonBytes: string[] = [];
      let pktout: WyomingPacket = new WyomingPacket({});
      let d: number | undefined = 0;

      do {
        d = ethis.dataQueueShift();
        if (d === undefined) {
          // If we run out of data, we need to wait for more
          yield;
          // If we were waiting for data, we can continue processing
          continue;
        } else {
          jsonBytes.push(String.fromCharCode(d || 0));
        }
      } while (d != '\n'.charCodeAt(0));

      // if we only got a newline, ignore it and start over.
      if (jsonBytes.length == 1) {
        continue;
      }

      // otherwise, try to parse the message
      let pktobj: {[key: string]: any} = {};
      try {
        pktobj = JSON.parse(jsonBytes.join(''));
        pktout = new WyomingPacket(pktobj);
        jsonBytes = [];
      } catch (e) {
        Logger.debug(
          `Error parsing wyoming json message: ${jsonBytes.join('')}`,
        );
        continue;
      }

      // If there's data, we have to read it.
      //TODO: Need to manage index of data if end of buffer is reached
      let data_bytes = pktobj['data_length'] || 0;
      if (data_bytes > 0) {
        let objData = [];

        do {
          d = ethis.dataQueueShift();
          if (d === undefined) {
            // If we run out of data, we need to wait for more
            yield;
            continue;
          }
          objData.push(String.fromCharCode(d));
        } while (objData.length < pktobj['data_length']);

        if (objData.length > 0) {
          try {
            pktout.setData(JSON.parse(objData.join('')));
          } catch (e) {
            Logger.debug(
              'Error parsing wyoming json data: ' + objData.join(''),
            );
            continue;
          }
        }
      }

      // If there was a payload, read in a similar way. The difference is that
      // this is simply raw bytes, not JSON, so we can just allocate an array to
      // hold it and not worry about converting to/from codepoints or JSON.
      let payload_bytes = pktobj['payload_length'] || 0;
      let payload_idx = 0;
      if (payload_bytes > 0) {
        let objPayload = new Uint8Array(payload_bytes);
        do {
          d = ethis.dataQueueShift();
          if (d === undefined) {
            // If we run out of data, we need to wait for more
            yield;
            continue;
          }
          objPayload[payload_idx] = d;
          payload_idx++;
        } while (payload_idx < payload_bytes);

        // If we got here, we have enough data to read the payload
        pktout.setPayload(objPayload);
      }

      // Finally, emit the packet. ethis is bound to the RecvStateMachine
      // instance.
      await ethis._handleCompletePacket(pktout);
    }
  })(this);
}

class ClientHandler {
  private _socket: TcpSocket.Socket | null = null;
  private _packetBuilder = new ReceiveStateMachine(
    async (p: WyomingPacket) => await this._handleEvent(p),
  );
  private _writeBuffer: any = [];
  private _activePCMStream: number | null = null;
  private _pipelineRunning: boolean = false;
  private _audioStartTimestamp: number = 0;
  private _pingEvent: number = 0;
  streamAudio: boolean = false;

  constructor(socket: TcpSocket.Socket) {
    this._socket = socket;
    this._socket.setTimeout(60e3);

    // Handles incomming data from the socket
    socket.on('data', async (d: Buffer | string) => {
      if (typeof d == 'string') {
        await this._handleIncomingData(
          Uint8Array.from(Array.from(d).map(l => l.charCodeAt(0) || 0)),
        );
      } else {
        this._handleIncomingData(Uint8Array.from(d));
      }
    });

    // Handle socket buffer drain event so continue to send data
    socket.on('drain', () => {
      Logger.info(
        `Socket ${socket.remoteAddress}:${socket.remotePort} drained`,
      );
      this._byteWriterHandler.next();
    });
  }

  private _handleIncomingData = async (d: Uint8Array) => {
    await this._packetBuilder.handleBytes(d);
  };

  private _byteWriterHandler = (async function* (ethis) {
    while (true) {
      // Loop buffer and send over socket
      if (ethis._writeBuffer.length > 0) {
        let p = ethis._writeBuffer.shift();
        if (p && ethis._socket && ethis._socket.readyState === 'open') {
          try {
            // If the write failed, we need to wait for the socket to drain
            let repeatTry = false;
            while (!ethis._socket.write(p.toBytes())) {
              Logger.debug(
                `Socket ${
                  ethis._socket.remotePort
                } write failed [${p.getType()}]`,
              );
              yield;
              if (['audio-chunk', 'ping', 'pong'].indexOf(p.getType()) != -1) {
                p = ethis._writeBuffer.shift();
              } else {
                repeatTry = true;
              }
            }
            if (repeatTry) {
              Logger.debug(
                `Socket ${
                  ethis._socket.remotePort
                } write succeeded after retry: [${p.getType()}]`,
              );
            }
          } catch (e: any) {
            Logger.error(
              `Error writing to socket ${ethis._socket.remotePort}: ${e}`,
            );
          }
        } else {
          Logger.error('No socket to write to or socket not open');
        }
      }
      yield;
    }
  })(this);

  socket_port = () => {
    if (this._socket) {
      return this._socket.remotePort;
    }
  };

  socket_id = this._socket?._id || 0;

  writePkt = (p: WyomingPacket) => {
    if (this._socket) {
      this._writeBuffer.push(p);
      this._byteWriterHandler.next();
    }
  };

  end = () => {
    clearInterval(this._pingEvent);
    if (this._socket) {
      Logger.debug(
        `Closing socket ${this._socket.remoteAddress}:${this._socket.remotePort}`,
      );
      this._socket.end();
      this._socket = null;
    }
  };

  destroy = () => {
    clearInterval(this._pingEvent);
    if (this._socket) {
      Logger.debug(
        `Destroying socket ${this._socket.remoteAddress}:${this._socket.remotePort}`,
      );
      this._socket.destroy();
      this._socket = null;
    }
  };

  setMicAudioStreaming = (enable: boolean) => {
    Logger.info(`${enable ? 'Enabling' : 'Disabling'} audio streaming`);
    this.streamAudio = enable;
  };

  private _handleEvent = async (p: WyomingPacket) => {
    let ptype = p.getType();

    if (['audio-chunk', 'ping', 'pong'].indexOf(ptype) == -1) {
      Logger.debug(`Received event [${this._socket?.remotePort}]: ${p}`);
      try {
        CheyenneSocket.sendMessage(
          ClientMessage.create({
            msg: {
              oneofKind: 'clientEvent',
              clientEvent: ClientEvent.create({
                event: {
                  oneofKind: 'wyomingEvent',
                  wyomingEvent: p.toProto(),
                },
              }),
            },
          }),
        );
      } catch (e) {
        Logger.error(
          `Error forwarding wyoming event to hassmic integration: ${e}`,
        );
      }
    }

    try {
      switch (ptype) {
        case 'describe':
          let zcuuid: string = await Settings.getHMUUID();
          Logger.info('Got wyoming `describe` request, responding with info');
          let resp = new WyomingPacket({
            type: 'info',
            data: {
              version: APP_VERSION,
              asr: [],
              tts: [],
              handle: [],
              intent: [],
              wake: [],
              satellite: {
                name: 'Hassmic Wyoming ' + zcuuid.slice(0, 8),
                attribution: {
                  name: '',
                  url: '',
                },
                installed: true,
                description: 'Hassmic Wyoming ' + zcuuid.slice(0, 8),
                version: APP_VERSION,
                area: null,
                snd_format: {
                  channels: 1,
                  rate: 16000,
                  width: 2,
                },
              },
            },
          });
          Logger.debug(
            `Sending info response to socket ${
              this._socket?.remotePort
            }: ${resp.toString()}`,
          );
          this.writePkt(resp);
          break;

        case 'run-satellite':
          zcuuid = await Settings.getHMUUID();
          Logger.info('Starting satellite at server request');
          resp = new WyomingPacket({
            type: 'run-pipeline',
            data: {
              name: 'Hassmic Wyoming ' + zcuuid.slice(0, 8),
              start_stage: 'wake',
              end_stage: 'tts',
              restart_on_end: true,
              snd_format: {
                rate: AUDIO_INFO.rate,
                width: AUDIO_INFO.width,
                channels: AUDIO_INFO.channels,
              },
            },
          });
          this.writePkt(resp);
          this._pipelineRunning = true;
          break;

        case 'pause-satellite':
          Logger.info('Stopping satellite at server request');
          //this.stopAudio();
          this._pipelineRunning = false;
          this.setMicAudioStreaming(false);
          break;

        case 'detect':
          Logger.info('Starting (on-server) wakeword detection...');
          DeviceEventEmitter.emit('wyoming-pipeline-start', {
            socket_id: this._socket?._id,
          });
          // Start streaming audio
          setTimeout(() => {
            this.setMicAudioStreaming(true);
          }, 1000);
          break;

        case 'error':
          Logger.debug(`Error from server: ${p.getProp('text')}`);
          this.setMicAudioStreaming(false);
          break;

        case 'detection':
          break;

        case 'transcribe':
          break;

        case 'voice-started':
          // Voice detection stopped, stop stremaing audio
          this.setMicAudioStreaming(true);
          break;

        case 'voice-stopped':
          // Voice detection stopped, stop stremaing audio
          this.setMicAudioStreaming(false);
          break;

        case 'audio-start':
          Logger.info('Starting audio stream...');
          this._activePCMStream = await PCMPlayer.startAudioStream({
            encoding: '16bit',
            usage: 'announce',
            sampleRate: p.getProp('rate') || 16000,
            channels: 1,
            mode: 'streaming',
            gain: 1,
          });
          this.setMicAudioStreaming(false);
          Logger.info(`Audio stream id: ${this._activePCMStream}`);
          break;

        case 'audio-chunk':
          Logger.info(`Playing audio chunk...[${p.getPayload().length} bytes]`);
          // Set timestamp of first chunk
          if (!this._audioStartTimestamp) {
            this._audioStartTimestamp = Date.now();
          }

          if (this._activePCMStream) {
            await PCMPlayer.writeAudioStream(
              this._activePCMStream,
              p.getPayload(),
            );
          } else {
            Logger.info('No active PCM stream!');
          }
          break;

        case 'audio-stop':
          Logger.info('Audio done.');
          const audioDuration = p.getProp('timestamp');
          if (this._activePCMStream) {
            await PCMPlayer.stopAudioStream(this._activePCMStream);
            this._activePCMStream = null;
          }

          // If we have a timestamp, wait for the audio to finish playing before
          // sending the played message. Otherwise, just send it after 0.5s.
          // KNOWN ISSUE: Wyoming in HA does not send timestamp for annoucements.
          let waitTime = 500;
          if (audioDuration) {
            waitTime =
              audioDuration * 1000 - (Date.now() - this._audioStartTimestamp);
          }
          setTimeout(() => {
            Logger.info(
              `Waited for ${Math.round(
                waitTime / 1000,
              )} seconds before sending audio played message`,
            );
            resp = new WyomingPacket({
              type: 'played',
            });
            Logger.debug(
              `Sending audio played message to socket ${this._socket?.remotePort}`,
            );
            this.writePkt(resp);
            this._audioStartTimestamp = 0;
            this.setMicAudioStreaming(true);
          }, waitTime);
          break;

        case 'ping':
          // don't log ping/pong responses because they spam the console.
          (resp = new WyomingPacket({
            type: 'pong',
          })),
            this.writePkt(resp);
          break;
      }
    } catch (e: any) {
      Logger.error(`Error processing incoming packet: ${e}`);
    }
  };

  sendAudioData = (data: Uint8Array) => {
    if (!this.streamAudio) {
      return;
    }
    if (!data || data.length == 0) {
      Logger.warning('Not sending empty audio data');
      return;
    }
    if (!this._pipelineRunning) {
      //Logger.warning('Pipeline not running; not sending audio chunk');
      return;
    }
    let resp = new WyomingPacket({
      type: 'audio-chunk',
      data: {
        rate: 16000,
        width: 2,
        channels: 1,
      },
    });
    resp.setPayload(data);
    try {
      //Logger.debug(`Sending audio packet to socket ${this._socket?.remotePort}: ${resp.msgId}`);
      this.writePkt(resp);
    } catch (e: any) {
      Logger.error(
        `Error writing audio packet: ${this._socket?.remotePort}: ${e}`,
      );
    }
  };
}

// Class that actually defines a Wyoming protocol server. A single instance of
// this class is constructed on startup and exported from this file.
class WyomingServer_ {
  private _server: TcpSocket.Server | null = null;
  private _clients: Record<string, ClientHandler> = {};
  private _pipelineSocketId: string | null = null;
  private _pipelineStartEventListender: any = null;
  private _activePCMStream: number | null = null;

  constructor() {
    Settings.registerSettingsChangedCallback(async (s: SavedSettings) => {
      Logger.info('Got updated settings');
      if (s.announceVolume !== undefined && this._activePCMStream != null) {
        Logger.info(`Setting new gain to ${s.announceVolume}`);
        await PCMPlayer.setGain(this._activePCMStream, s.announceVolume);
      } else {
        Logger.info(
          `Not setting gain: ${s.announceVolume} ${this._activePCMStream}`,
        );
      }
    });
    this.loadMicGain().then(() => {
      Logger.info(`Wyoming server initialized with mic gain: ${this.micGain}`);
    });
  }

  // settable callback for connection state
  private _connectionStateCallback: CallbackType<boolean> = null;
  setConnectionStateCallback = (cb: CallbackType<boolean>) => {
    this._connectionStateCallback = cb;
  };
  private _setConnectionState = (s: boolean) => {
    this._connectionStateCallback?.(s);
  };

  micGain: number = 1; // default mic gain

  loadMicGain = async () => {
    return await Settings.getMicGain().then(gain => {
      this.micGain = gain;
      Logger.info(`Loaded mic gain: ${this.micGain}`);
      return this.micGain;
    }
  )};

  setMicGain = async (gain: number) => {
    this.micGain = gain;
    await Settings.setMicGain(gain);
  };

  _increaseVolume16BitPCM(data: Uint8Array, gain: number) {
    if (!(data instanceof Uint8Array)) {
      throw new Error('Input must be a Uint8Array.');
    }
    if (data.byteLength % 2 !== 0) {
      throw new Error('Uint8Array byteLength must be even for 16-bit samples.');
    }
    if (typeof gain !== 'number' || gain < 0) {
      throw new Error('Gain must be a non-negative number.');
    }

    // Create a DataView to read and write 16-bit integers
    const dataView = new DataView(data.buffer);
    const numSamples = data.byteLength / 2;

    // Create a new Uint8Array for the output
    const outputUint8Array = new Uint8Array(data.byteLength);
    const outputDataView = new DataView(outputUint8Array.buffer);

    const MAX_16_BIT = 32767;
    const MIN_16_BIT = -32768;

    for (let i = 0; i < numSamples; i++) {
      // Read the original 16-bit sample (little-endian)
      const sample = dataView.getInt16(i * 2, true); // true for little-endian

      // Apply gain
      let newSample = Math.round(sample * gain * (gain * 0.6)); // roughly increasing curve from 0 to 92x

      // Clip the sample to 16-bit limits
      if (newSample > MAX_16_BIT) {
        newSample = MAX_16_BIT;
      } else if (newSample < MIN_16_BIT) {
        newSample = MIN_16_BIT;
      }

      // Write the modified 16-bit sample back (little-endian)
      outputDataView.setInt16(i * 2, newSample, true); // true for little-endian
    }

    return outputUint8Array;
  }

  // Send a chunk of pcm audio
  sendAudioData = (data: Uint8Array) => {
    if (
      this._pipelineSocketId &&
      this._clients.hasOwnProperty(this._pipelineSocketId)
    ) {
      if (this._clients[this._pipelineSocketId].streamAudio) {
        if (this.micGain > 0) {
          data = this._increaseVolume16BitPCM(data, this.micGain);
        }
        this._clients[this._pipelineSocketId].sendAudioData(data);
      }
    }
  };

  startServer = async () => {
    this._pipelineStartEventListender = DeviceEventEmitter.addListener(
      'wyoming-pipeline-start',
      (data: any) => {
        this._pipelineSocketId = data.socket_id;
      },
    );

    if (!this._server) {
      Logger.debug('Starting TCP server');
      // Here you would start your TCP server
      try {
        this._server = TcpSocket.createServer((socket: TcpSocket.Socket) => {
          Logger.info(
            `Wyoming Got connection from ${socket.remoteAddress}:${socket.remotePort}`,
          );
          if (!this._clients.hasOwnProperty(socket._id)) {
            this._clients[socket._id] = new ClientHandler(socket);
            this._setConnectionState(true);
            Logger.info('Wyoming all set up -- waiting');
          } else {
            Logger.warn(
              'Wyoming already has this socket, dropping new connection',
            );
            socket.destroy();
          }

          socket.on('error', (err: Error) => {
            Logger.info(`Socket error: ${err}`);
          });

          socket.on('timeout', () => {
            Logger.info(
              `Socket timed out on ${socket.remoteAddress}:${socket.remotePort}`,
            );
            if (this._clients[socket._id]) {
              try {
                this._clients[socket._id].destroy();
              } catch (e: any) {
                Logger.error(`Error destroying socket: ${e}`);
              }
              delete this._clients[socket._id];
            }
          });

          socket.on('close', (had_error: boolean) => {
            Logger.info(
              `Closed connection to ${socket.remoteAddress}:${
                socket.remotePort
              } (${had_error ? 'had' : 'no'} errors)`,
            );
            if (this._clients[socket._id]) {
              this._clients[socket._id].end();
              delete this._clients[socket._id];
            }
            if (Object.keys(this._clients).length == 0) {
              this._setConnectionState(false);
            }
          });
        }).listen({port: WYOMING_PORT, host: '0.0.0.0'});
      } catch (e: any) {
        Logger.error(`Error starting TCP server: ${e}`);
        throw e; // Re-throw the error to handle it upstream
      }
    }
  };

  stopServer = async () => {
    Logger.info('stopping server...');
    this._pipelineStartEventListender?.remove();

    const p = new Promise<void>(resolve => {
      this._server?.close(() => resolve());
    });
    Object.entries(this._clients).map(([id, s]) => {
      Logger.info(`Closing socket ${id}`);
      s.destroy();
    });
    this._clients = {};
    await p;
    this._server = null;
    Logger.info('Server stopped');
  };
}

export const WyomingServer: WyomingServer_ = new WyomingServer_();
