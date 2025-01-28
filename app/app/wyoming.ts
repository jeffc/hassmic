// exposes the microphone as a wyoming satellite
import TcpSocket from "react-native-tcp-socket";
import { HMLogger } from "./util";
import { APP_VERSION, AUDIO_INFO } from "./constants";

// Represents a wyoming protocol packet (JSON and optional payload)
class WyomingPacket {
  private _type: string = "";
  private _data: { [key: string]: any } = {};
  private _payload: Uint8Array = new Uint8Array();

  // Validates a packet. Logs a warning if invalid and returns false. Otherwise
  // returns true.
  validate: () => boolean = () => {
    if (!this._type) {
      HMLogger.warning("WyomingPacket missing type");
      return false;
    }
    if (this.getPayloadLength() != this._payload.length) {
      HMLogger.warning(
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
      HMLogger.error(`Error writing packet: ${e}`);
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
    this._byteHandler.next();
  }

  // This is the main point of interaction. Feeds bytes to the state machine.
  handleBytes = (b: Uint8Array) => {
    this._byteHandler.next(b);
  };

  // State machine, implemented as a generator function. The function consumes
  // bytes (fed in by next()) and emits Wyoming packets using the callback
  // passed in the constructor.
  private _byteHandler = (function* (ethis) {
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
        HMLogger.error("Error parsing wyoming json message: " + e);
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
          HMLogger.error("Error parsing wyoming json data: " + e);
          continue;
        }
      }

      // If there was a payload, read in a similar way. The difference is that
      // this is simply raw bytes, not JSON, so we can just allocate an array to
      // hold it and not worry about converting to/from codepoints or JSON.
      let payload_bytes = pktout.getProp("payload_length") || 0;
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
      ethis._handleCompletePacket(pktout);
    }
  })(this);
}

// Class that actually defines a Wyoming protocol server. A single instance of
// this class is constructed on startup and exported from this file.
class WyomingServer_ {
  private _server: TcpSocket.Server | null = null;
  private _sock: TcpSocket.Socket | null = null;
  private _packetBuilder = new RecvStateMachine((p: WyomingPacket) =>
    this._onCompletePacket(p)
  );

  // Whether or not we've sent an audio-start command to the server
  private _pipelineRunning: boolean = false;

  private _handleIncomingData = async (d: Uint8Array) => {
    this._packetBuilder.handleBytes(d);
  };

  private _wyomingWrite(p: WyomingPacket) {
    if (!p.validate()) {
      HMLogger.error("can't write invalid wyoming packet");
      return;
    }
    if (this._sock) {
      try {
        p.writeToSocket(this._sock);
      } catch (e) {
        HMLogger.error(`Error writing to wyoming socket: ${e}`);
        return;
      }
    } else {
      HMLogger.warning("Not writing wyomingpacket to closed socket");
    }
  }

  private _onCompletePacket = (p: WyomingPacket) => {
    if (!p) {
      HMLogger.error("Wyoming got null packet");
      return;
    }

    let ptype = p.getType();
    try {
      switch (ptype) {
        case "describe":
          HMLogger.info("Got wyoming `describe` request, responding with info");
          let p = new WyomingPacket({
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
                snd_format: null,
              },
            },
          });
          this._wyomingWrite(p);
          break;
        case "run-satellite":
          HMLogger.info("Starting satellite at server request");
          this.runPipeline();
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
          HMLogger.warning(`Unknown packet type: "${ptype}"`);
      }
    } catch (e: any) {
      HMLogger.error(`Error processing incoming packet: ${e}`);
    }
  };

  // Send a chunk of pcm audio
  sendAudioData = (data: Uint8Array) => {
    if (!data || data.length == 0) {
      HMLogger.warning("Not sending empty audio data");
      return;
    }
    if (!this._pipelineRunning) {
      HMLogger.warning("Pipeline not running; not sending audio chunk");
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
      HMLogger.error(`Error writing audio packet: ${e}`);
    }
  };

  // start a pipeline
  runPipeline = () => {
    let pkt = new WyomingPacket({
      type: "run-pipeline",
      data: {
        start_stage: "wake",
        end_stage: "handle",
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
      HMLogger.error(`Error writing run-pipeline packet: ${e}`);
      this._pipelineRunning = false;
    }
    this._pipelineRunning = true;
  };

  startServer = async () => {
    if (this._server) {
      HMLogger.error("Error: wyoming startserver() called twice");
      return;
    }

    this._server = TcpSocket.createServer((socket: TcpSocket.Socket) => {
      HMLogger.info(`Wyoming Got connection`);
      if (!this._sock) {
        this._sock = socket;
        this._sock.setTimeout(60e3);
        HMLogger.info("Wyoming all set up -- waiting");
      } else {
        HMLogger.warn("Wyoming already have a socket, dropping new connection");
        this._sock.destroy();
      }

      socket.on("error", (err: Error) => {
        HMLogger.info(`Socket error: ${err}`);
      });

      socket.on("close", (had_error: boolean) => {
        HMLogger.info(`Closed connection (${had_error ? "had" : "no"} errors)`);
        if (this._sock == socket) {
          this._sock = null;
        }
        //this._setConnectionState(false);
      });

      socket.on("timeout", () => {
        HMLogger.info("Socket timed out");
        if (this._sock) {
          HMLogger.warning("Socket timed out; closing connection");
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
