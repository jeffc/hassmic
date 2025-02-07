// exposes the microphone as a wyoming satellite
import TcpSocket from "react-native-tcp-socket";
import { HMLogger } from "./logger";
import { APP_VERSION, AUDIO_INFO } from "./constants";
import { PCMPlayer } from "./pcm";

const Logger = new HMLogger("wyoming.ts");

// Represents a wyoming protocol packet (JSON and optional payload)
class WyomingPacket {
  private _type: string = "";
  private _data: { [key: string]: any } = {};
  private _payload: Uint8Array = new Uint8Array();

  // Validates a packet. Logs a warning if invalid and returns false. Otherwise
  // returns true.
  validate: () => boolean = () => {
    if (!this._type) {
      Logger.warning("WyomingPacket missing type");
      return false;
    }
    if (this.getPayloadLength() != this._payload.length) {
      Logger.warning(
        `WyomingPacket payload length does not match stated length: ${this.getPayloadLength()} != ${this._payload.length}`
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

  // Construct a packet from a blob of data
  constructor(fromData: any | undefined) {
    if (fromData) {
      this._type = fromData["type"] || "";
      if ("data" in fromData) {
        for (let [k, v] of Object.entries(fromData["data"])) {
          this._data[k] = v;
        }
      }
    }
  }

  // Check that this packet is valid, then write it to a given socket.
  writeToSocket = (s: TcpSocket.Socket | null) => {
    if (!s) {
      throw new Error("Can't write to null socket");
    }
    if (!this.validate()) {
      throw new Error("Not writing invalid wyoming packet");
    }
    try {
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
      outBytes[j] = "\n".codePointAt(0) || 0;
      j++;
      for (let i = 0; i < this._payload.length; i++) {
        outBytes[j] = this._payload[i];
        j++;
      }
      s.write(outBytes);
    } catch (e: any) {
      Logger.error(`Error writing packet: ${e}`);
    }
  };
}

// state machine that handles bytes as they come in from the stream and emits
// complete wyoming packets as they're ready.
class RecvStateMachine {
  // incoming data queue
  private _handleCompletePacket: (p: WyomingPacket) => void = (p) => {};

  // construct with a callback for what to do when a packet is formed.
  constructor(cb: (p: WyomingPacket) => void) {
    this._handleCompletePacket = cb;
    // initialize the generator. Not sure why it needs an empty call to next()
    // before it works properly, but it does.
    this._byteHandler.next().then();
  }

  // This is the main point of interaction. Feeds bytes to the state machine.
  handleBytes = async (b: Uint8Array) => {
    await this._byteHandler.next(b);
  };

  // State machine, implemented as a generator function. The function consumes
  // bytes (fed in by next()) and emits Wyoming packets using the callback
  // passed in the constructor.
  private _byteHandler = (async function* (ethis) {
    let idx = 0;
    let data = new Uint8Array();
    while (true) {
      let pktout: WyomingPacket = new WyomingPacket({});
      let jsonBytes = [];
      let b = 0;

      // get JSON until a newline
      do {
        if (idx == data.length) {
          idx = 0;
          do {
            data = yield;
          } while (data.length == 0);
        }
        b = data[idx];
        idx++;
        jsonBytes.push(String.fromCharCode(b));
      } while (b != "\n".charCodeAt(0));

      // if we only got a newline, ignore it and start over.
      if (jsonBytes.length == 1) {
        continue;
      }

      // otherwise, try to parse the message
      let pktobj: { [key: string]: any } = {};
      try {
        pktobj = JSON.parse(jsonBytes.join(""));
        pktout = new WyomingPacket(pktobj);
        jsonBytes = [];
      } catch (e) {
        Logger.error("Error parsing wyoming json message: " + e);
        continue;
      }

      // If there's data, we have to read it.
      let data_bytes_remaining = pktobj["data_length"] || 0;

      while (data_bytes_remaining > 0) {
        if (idx == data.length) {
          idx = 0;
          do {
            data = yield;
          } while (data.length == 0);
        }
        b = data[idx];
        idx++;
        jsonBytes.push(String.fromCharCode(b));
        data_bytes_remaining--;
      }

      // And then parse it, if there was any.
      if (jsonBytes.length > 0) {
        try {
          let data = JSON.parse(jsonBytes.join(""));
          for (let [k, v] of Object.entries(data)) {
            pktout.setProp(k, v);
          }
          jsonBytes = [];
        } catch (e) {
          Logger.error("Error parsing wyoming json data: " + e);
          continue;
        }
      }

      // If there was a payload, read in a similar way. The difference is that
      // this is simply raw bytes, not JSON, so we can just allocate an array to
      // hold it and not worry about converting to/from codepoints or JSON.
      let payload_bytes = pktobj["payload_length"] || 0;
      let payload_idx = 0;
      let payload = new Uint8Array(payload_bytes);

      while (payload_idx < payload_bytes) {
        if (idx == data.length) {
          idx = 0;
          do {
            data = yield;
          } while (data.length == 0);
        }
        b = data[idx];
        idx++;
        payload[payload_idx] = b;
        payload_idx++;
      }

      pktout.setPayload(payload);

      // Finally, emit the packet. ethis is bound to the RecvStateMachine
      // instance.
      await ethis._handleCompletePacket(pktout);
    }
  })(this);
}

// Class that actually defines a Wyoming protocol server. A single instance of
// this class is constructed on startup and exported from this file.
class WyomingServer_ {
  private _server: TcpSocket.Server | null = null;
  private _sock: TcpSocket.Socket | null = null;
  private _packetBuilder = new RecvStateMachine(
    async (p: WyomingPacket) => await this._onCompletePacket(p)
  );

  private _activePCMStream: number | null = null;

  // Whether or not we've sent an audio-start command to the server
  private _pipelineRunning: boolean = false;

  private _handleIncomingData = async (d: Uint8Array) => {
    await this._packetBuilder.handleBytes(d);
  };

  private _wyomingWrite(p: WyomingPacket) {
    if (!p.validate()) {
      Logger.error("can't write invalid wyoming packet");
      return;
    }
    if (this._sock) {
      try {
        p.writeToSocket(this._sock);
      } catch (e) {
        Logger.error(`Error writing to wyoming socket: ${e}`);
        return;
      }
    } else {
      Logger.warning("Not writing wyomingpacket to closed socket");
    }
  }

  private _onCompletePacket = async (p: WyomingPacket) => {
    if (!p) {
      Logger.error("Wyoming got null packet");
      return;
    }

    let ptype = p.getType();
    try {
      switch (ptype) {
        case "describe":
          Logger.info("Got wyoming `describe` request, responding with info");
          let resp = new WyomingPacket({
            type: "info",
            data: {
              version: APP_VERSION,
              asr: [],
              tts: [],
              handle: [],
              intent: [],
              wake: [],
              satellite: {
                name: "Hassmic Wyoming",
                attribution: {
                  name: "",
                  url: "",
                },
                installed: true,
                description: "Hassmic Wyoming",
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
          this._wyomingWrite(resp);
          break;

        case "run-satellite":
          Logger.info("Starting satellite at server request");
          this.runPipeline();
          break;

        case "pause-satellite":
          Logger.info("Stopping satellite at server request");
          this.stopPipeline();
          break;

        case "detect":
          Logger.info("Starting (on-server) wakeword detection...");
          break;

        case "detection":
          Logger.info(
            `Got on-server wakeword detection: "${p.getProp("name")}"`
          );
          break;

        case "transcribe":
          Logger.info("Starting transcription...");
          break;

        case "voice-started":
          Logger.info("Starting voice processing...");
          break;

        case "voice-stopped":
          Logger.info("Voice processing complete");
          break;

        case "transcript":
          Logger.info(`Got transcript: "${p.getProp("text")}"`);
          break;

        case "synthesize":
          Logger.info(`Synthesizing text "${p.getProp("text")}"`);
          break;

        case "audio-start":
          Logger.info("Starting audio stream...");
          this._activePCMStream = await PCMPlayer.startAudioStream({
            encoding: "16bit",
            usage: "announce",
            sampleRate: 16000,
            channels: 1,
            mode: "streaming",
          });
          Logger.info(`Audio stream id: ${this._activePCMStream}`);
          break;

        case "audio-chunk":
          Logger.info("Playing audio chunk...");
          if (this._activePCMStream) {
            await PCMPlayer.writeAudioStream(
              this._activePCMStream,
              p.getPayload()
            );
          } else {
            Logger.error("No active PCM stream!");
          }
          break;

        case "audio-stop":
          Logger.info("Audio done.");
          if (this._activePCMStream) {
            await PCMPlayer.stopAudioStream(this._activePCMStream);
            this._activePCMStream = null;
          } else {
            Logger.error("No active PCM Stream!");
          }
          break;

        case "ping":
          // don't log ping/pong responses because they spam the console.
          this._wyomingWrite(
            new WyomingPacket({
              type: "pong",
            })
          );
          break;
        default:
          Logger.warning(`Unknown packet type: "${ptype}:"`);
          JSON.stringify(JSON.parse(p.toString()), null, 2)
            .split("\n")
            .forEach((l) => {
              Logger.warning(`\t${l}`);
            });
          break;
      }
    } catch (e: any) {
      Logger.error(`Error processing incoming packet: ${e}`);
    }
  };

  // Send a chunk of pcm audio
  sendAudioData = (data: Uint8Array) => {
    if (!data || data.length == 0) {
      Logger.warning("Not sending empty audio data");
      return;
    }
    if (!this._pipelineRunning) {
      Logger.warning("Pipeline not running; not sending audio chunk");
      return;
    }
    let pkt = new WyomingPacket({
      type: "audio-chunk",
      data: {
        rate: 16000,
        width: 2,
        channels: 1,
      },
    });
    pkt.setPayload(data);
    try {
      this._wyomingWrite(pkt);
    } catch (e: any) {
      Logger.error(`Error writing audio packet: ${e}`);
    }
  };

  // start a pipeline
  runPipeline = () => {
    let pkt = new WyomingPacket({
      type: "run-pipeline",
      data: {
        start_stage: "wake",
        end_stage: "tts",
        restart_on_end: true,
        snd_format: {
          rate: AUDIO_INFO.rate,
          width: AUDIO_INFO.width,
          channels: AUDIO_INFO.channels,
        },
      },
    });
    try {
      this._wyomingWrite(pkt);
    } catch (e: any) {
      Logger.error(`Error writing run-pipeline packet: ${e}`);
      this._pipelineRunning = false;
    }
    this._pipelineRunning = true;
  };

  stopPipeline = () => {
    this._pipelineRunning = false;
  };

  startServer = async () => {
    if (this._server) {
      Logger.error("Error: wyoming startserver() called twice");
      return;
    }

    this._server = TcpSocket.createServer((socket: TcpSocket.Socket) => {
      Logger.info(`Wyoming Got connection`);
      if (!this._sock) {
        this._sock = socket;
        this._sock.setTimeout(60e3);
        Logger.info("Wyoming all set up -- waiting");
      } else {
        Logger.warn("Wyoming already have a socket, dropping new connection");
        this._sock.destroy();
      }

      socket.on("error", (err: Error) => {
        Logger.info(`Socket error: ${err}`);
      });

      socket.on("close", (had_error: boolean) => {
        Logger.info(`Closed connection (${had_error ? "had" : "no"} errors)`);
        if (this._sock == socket) {
          this._sock = null;
        }
        //this._setConnectionState(false);
      });

      socket.on("timeout", () => {
        Logger.info("Socket timed out");
        if (this._sock) {
          Logger.warning("Socket timed out; closing connection");
          this._sock.destroy();
          this._sock = null;
        }
      });

      socket.on("data", (d: Buffer | string) => {
        if (typeof d == "string") {
          this._handleIncomingData(
            Uint8Array.from(Array.from(d).map((l) => l.charCodeAt(0) || 0))
          );
        } else {
          this._handleIncomingData(Uint8Array.from(d));
        }
      });
    }).listen({ port: 10700, host: "0.0.0.0" });
  };
}

export const WyomingServer: WyomingServer_ = new WyomingServer_();
