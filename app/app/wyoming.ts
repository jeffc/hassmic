// exposes the microphone as a wyoming satellite
import TcpSocket from "react-native-tcp-socket";
import { HMLogger } from "./util";

class WyomingPacket {
  private _info: object = {};
  private _payload: Uint8Array = new Uint8Array();

  validate = () => {
    if (!this._info) {
      HMLogger.warning("WyomingPacket missing info");
      return false;
    }
    if (!this._info["type"]) {
      HMLogger.warning("WyomingPacket missing type");
      return false;
    }
    if (this.getPayloadLength != this._payload.length) {
      HMLogger.warning(
        `WyomingPacket payload length does not match stated length: ${this.getPayloadLength()} != ${this._payload.length}`
      );
      return false;
    }

    return true;
  };

  setProp(prop: string, val: any) {
    this._info[prop] = val;
  }

  getProp(prop: string) {
    return this._info[prop] || undefined;
  }

  setPayload(payload: Uint8Array | null) {
    if (!payload) {
      this._payload = new Uint8Array();
    } else {
      this._payload = payload;
    }
    this._info["payload_length"] = this._payload.length;
  }

  private getPayloadLength = () => {
    return this._info?.["payload_length"] || 0;
  };

  private getType = () => {
    return this._info?.["type"] || "";
  };

  toString = () => {
    if (!this._info) {
      return "<empty>";
    }
    return JSON.stringify(this._info);
  };

  constructor() {}

  constructor(fromObject: object) {
    this._info = fromObject;
  }

  constructor(fromObject: object, fromPayload: Uint8Array) {
    this._info = fromObject;
    this._payload = fromPayload;
  }

  writeToSocket(s) {
    if (!this.validate()) {
      throw new Error("Not writing invalid wyoming packet");
    }
    this._info["payload_length"] = this._payload.length;
    let jsonstr = JSON.stringify(this._info);
    let outBytes = new Uint8Array(jsonstr.length + this._payload.length + 1);
    let j = 0;
    for (let i = 0; i < jsonstr.length; i++) {
      outBytes[j] = jsonstr[i].codePointAt(0);
      j++;
    }
    outbytes[j] = "\n".codePointAt(0);
    for (let i = 0; i < this._payload.length; i++) {
      outbytes[j] = this._payload[i];
    }
    s.write(outbytes);
  }
}

// state machine that handles bytes as they come in from the stream and emits
// complete wyoming packets as they're ready.
class RecvStateMachine {
  // incoming data queue
  private _handleCompletePacket: (p: WyomingPacket) => void = (p) => {};

  // construct with a callback for what to do when a packet is formed.
  constructor(cb: (p: WyomingPacket) => {}) {
    this._handleCompletePacket = cb;
    // initialize the generator
    this._byteHandler.next();
  }

  handleBytes = (b: Uint8Array) => {
    this._byteHandler.next(b);
  };

  private _byteHandler = (function* (ethis) {
    let idx = 0;
    let data = new Uint8Array();
    while (true) {
      let pktout: WyomingPacket = new WyomingPacket();
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
      try {
        pktout = new WyomingPacket(JSON.parse(jsonBytes.join("")));
        jsonBytes = [];
      } catch (e) {
        HMLogger.error("Error parsing wyoming json message: " + e);
        continue;
      }

      let data_bytes_remaining = pktout.getProp("data_length") || 0;

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

      ethis._handleCompletePacket(pktout);
    }
  })(this);
}
class WyomingServer_ {
  private _server = null;
  private _sock = null;
  private _onCompletePacket = (p: WyomingPacket) => {
    if (!p) {
      HMLogger.error("Wyoming got null packet");
      return;
    }

    let ptype = p.getProp("type");

    HMLogger.info(p);
  };

  private _packetBuilder = new RecvStateMachine(this._onCompletePacket);

  private _handleIncomingData = async (d: UInt8Array) => {
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
    }
    HMLogger.warning("Not writing wyomingpacket to closed socket");
  }

  startServer = async () => {
    if (this._server) {
      HMLogger.error("Error: wyoming startserver() called twice");
      return;
    }

    this._server = TcpSocket.createServer((socket) => {
      socket.on("error", (err) => {
        HMLogger.info(`Socket error: ${err}`);
      });

      socket.on("close", (err) => {
        HMLogger.info(`Closed connection`);
        if (this._sock == socket) {
          this._sock = null;
        }
        //this._setConnectionState(false);
      });

      socket.on("timeout", () => {
        HMLogger.info("Socket timed out");
        socket.destroy();
        //this._setConnectionState(false);
      });

      socket.on("data", (d) => {
        this._handleIncomingData(d);
      });

      HMLogger.info(`Wyoming Got connection`);
      if (this._sock == null) {
        this._sock = socket;
        socket.setTimeout(60e3);
        HMLogger.info("Wyoming all set up -- waiting");
      } else {
        HMLogger.warn("Wyoming already have a socket, dropping new connection");
        socket.destroy();
      }
    }).listen({ port: 10700, host: "0.0.0.0" });
  };
}

export const WyomingServer: WyomingServer_ = new WyomingServer_();
