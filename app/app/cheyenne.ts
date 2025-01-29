import TcpSocket from "react-native-tcp-socket";
import { APP_VERSION } from "./constants";
import { Buffer } from "buffer";
import { NativeManager } from "./nativemgr";
import { UUIDManager } from "./util";
import { HMLogger } from "./logger";

import {
  AudioData,
  ClientInfo,
  ClientEvent,
  ClientMessage,
  MediaPlayerId,
  Ping,
  ServerMessage,
} from "./proto/hassmic";

const Logger = new HMLogger("cheyenne.ts");

type CallbackType<T> = ((s: T) => void) | null;

// "Cheyenne" protocol server
class CheyenneServer {
  // Keep track of the socket
  private _sock: TcpSocket.Socket | null = null;

  // also track the server object
  private _server: TcpSocket.Server | null = null;

  // the UUID for this device
  private _uuid: string = "";

  // settable callback for connection state
  private _connectionStateCallback: CallbackType<boolean> = null;

  // Whether the mic should be muted
  private _mic_muted: boolean = false;

  setConnectionStateCallback = (cb: CallbackType<boolean>) => {
    this._connectionStateCallback = cb;
  };

  private _setConnectionState = (s: boolean) => {
    this._connectionStateCallback?.(s);
  };

  constructor() {
    NativeManager.addClientEventListener((ce: ClientEvent) => {
      let cm = ClientMessage.create({
        msg: {
          oneofKind: "clientEvent",
          clientEvent: ce,
        },
      });
      Logger.debug(`Client message: ${ClientMessage.toJsonString(cm)}`);
      CheyenneSocket.sendMessage(cm);
    });
  }

  streamAudio = (streamData: Uint8Array) => {
    if (this._sock && !this._mic_muted) {
      try {
        this.sendMessage(
          ClientMessage.create({
            msg: {
              oneofKind: "audioData",
              audioData: {
                data: streamData,
              },
            },
          })
        );
      } catch (e: any) {
        Logger.info(e.toString());
      }
    }
  };

  sendMessage = (m: ClientMessage) => {
    if (this._sock) {
      try {
        let msg = ClientMessage.toBinary(m);
        let b64 = Buffer.from(msg).toString("base64");
        this._sock.write(b64 + "\n");
      } catch (e: any) {
        Logger.error(e.toString());
      }
    }
  };

  sendInfo = (uuid: string) => {
    this.sendMessage(
      ClientMessage.create({
        msg: {
          oneofKind: "clientInfo",
          clientInfo: {
            uuid: uuid,
            version: APP_VERSION,
          },
        },
      })
    );
    this.sendMessage(
      ClientMessage.create({
        msg: {
          oneofKind: "savedSettings",
          savedSettings: NativeManager.getSavedSettings(),
        },
      })
    );
  };

  // sends a ping every 10 seconds while the socket is open.
  startPing = () => {
    return (async () => {
      while (this._sock) {
        try {
          this.sendMessage(
            ClientMessage.create({
              msg: {
                oneofKind: "ping",
                ping: {},
              },
            })
          );
        } catch (e: any) {
          Logger.info(e.toString());
        }
        await new Promise((resolve) => setTimeout(resolve, 10 * 1e3));
      }
      Logger.debug("done ping");
    })().then(() => {});
  };

  startServer = async () => {
    this._uuid = await UUIDManager.getUUID();

    this._server = TcpSocket.createServer((socket) => {
      socket.on("error", (err) => {
        Logger.info(`Socket error: ${err}`);
      });

      socket.on("close", (err) => {
        Logger.info(`Closed connection`);
        if (this._sock == socket) {
          this._sock = null;
        }
        this._setConnectionState(false);
      });

      socket.on("timeout", () => {
        Logger.info("Socket timed out");
        socket.destroy();
        this._setConnectionState(false);
      });

      socket.on("data", (d: string | Buffer) => {
        if (typeof d == "string") {
          this._handleIncomingData(
            Uint8Array.from(Array.from(d).map((l) => l.charCodeAt(0) || 0))
          );
        } else {
          this._handleIncomingData(Uint8Array.from(d));
        }
      });

      Logger.info(`Got connection`);
      if (this._sock == null) {
        this._sock = socket;
        socket.setTimeout(60e3);
        this._setConnectionState(true);
        this.sendInfo(this._uuid);
        this.startPing();
        Logger.info("All set up -- waiting");
      } else {
        Logger.warn("Already have a socket, dropping new connection");
        socket.destroy();
      }
    }).listen({ port: 11700, host: "0.0.0.0" });
  };

  stopServer = async () => {
    Logger.info("stopping server...");
    const p = new Promise<void>((resolve) => {
      this._server?.close(() => resolve());
    });
    this._sock?.destroy();
    await p;
    Logger.info("Server stopped");
  };

  private _handleIncomingData = async (d: Uint8Array) => {
    try {
      let b64 = d.toString().trim();
      let bts = Buffer.from(b64, "base64");
      let m = ServerMessage.fromBinary(bts);

      switch (m.msg.oneofKind) {
        case "setMicMute":
          Logger.info("Got set_mic_mute message");
          const shouldMute: boolean = m.msg.setMicMute;
          Logger.info(`Setting mic mute to ${shouldMute}`);
          this._mic_muted = shouldMute;
          break;
        // Actions that need to be handled by native code
        case "playAudio":
        case "setPlayerVolume":
        case "command":
          Logger.debug(
            `Got "${m.msg.oneofKind}" ServerMessage; passing it to native code`
          );
          NativeManager.handleServerMessage(m);
          break;
        default:
          Logger.warning(`Got unknown message type '${m.msg.oneofKind}'`);
      }
    } catch (e: any) {
      Logger.error(e.toString());
    }
  };
}

export const CheyenneSocket: CheyenneServer = new CheyenneServer();
