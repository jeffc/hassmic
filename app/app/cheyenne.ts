import TcpSocket from 'react-native-tcp-socket';
import {APP_VERSION} from './constants';
import {Buffer} from 'buffer';
import {NativeManager} from './nativemgr';
import {Settings} from './settings';
import {UUIDManager} from './util';
import {HMLogger} from './logger';

import {
  AudioData,
  ClientInfo,
  ClientEvent,
  ClientMessage,
  MediaPlayerId,
  Ping,
  HassmicCommand,
} from './proto/hassmic';

const Logger = new HMLogger('cheyenne.ts');

type CallbackType<T> = ((s: T) => void) | null;

// "Cheyenne" protocol server
class CheyenneServer {
  // Keep track of the socket
  private _sock: TcpSocket.Socket | null = null;

  // also track the server object
  private _server: TcpSocket.Server | null = null;

  // the UUID for this device
  private _uuid: string = '';

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
    NativeManager.addClientEventListener(async (ce: ClientEvent) => {
      Logger.debug(`Sending ClientEvent: ${ce}`);
      let cm = ClientMessage.create({
        msg: {
          oneofKind: 'clientEvent',
          clientEvent: ce,
        },
      });
      Logger.debug(`Client message: ${ClientMessage.toJsonString(cm)}`);
      CheyenneSocket.sendMessage(cm);
    });
  }

  sendMessage = (m: ClientMessage) => {
    if (this._sock) {
      try {
        let msg = ClientMessage.toBinary(m);
        let b64 = Buffer.from(msg).toString('base64');
        this._sock.write(b64 + '\n');
      } catch (e: any) {
        Logger.error(`Error sending message: ${e.toString()}`);
      }
    }
  };

  sendInfo = (uuid: string) => {
    try {
      this.sendMessage(
        ClientMessage.create({
          msg: {
            oneofKind: 'clientInfo',
            clientInfo: {
              uuid: uuid,
              version: APP_VERSION,
            },
          },
        }),
      );
    } catch (e: any) {
      Logger.error(`Error sending clientInfo: ${e}`);
    }
    try {
      let m = ClientMessage.create({
        msg: {
          oneofKind: 'savedSettings',
          savedSettings: Settings.getSavedSettings(),
        },
      });
      this.sendMessage(m);
    } catch (e: any) {
      Logger.error(`Error sending savedSettings: ${e}`);
    }
  };

  // sends a ping every 10 seconds while the socket is open.
  startPing = () => {
    return (async () => {
      while (this._sock) {
        try {
          this.sendMessage(
            ClientMessage.create({
              msg: {
                oneofKind: 'ping',
                ping: {},
              },
            }),
          );
        } catch (e: any) {
          Logger.info(e.toString());
        }
        await new Promise(resolve => setTimeout(resolve, 10 * 1e3));
      }
      Logger.debug('done ping');
    })().then(() => {});
  };

  startServer = async () => {
    this._uuid = await UUIDManager.getUUID();

    this._server = TcpSocket.createServer(socket => {
      socket.on('error', err => {
        Logger.info(`Socket error: ${err}`);
      });

      socket.on('close', err => {
        Logger.info(`Closed connection`);
        if (this._sock == socket) {
          this._sock = null;
        }
        this._setConnectionState(false);
      });

      socket.on('timeout', () => {
        Logger.info('Socket timed out');
        socket.destroy();
        this._setConnectionState(false);
      });

      socket.on('data', (d: string | Buffer) => {
        if (typeof d == 'string') {
          this._handleIncomingData(
            Uint8Array.from(Array.from(d).map(l => l.charCodeAt(0) || 0)),
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
        Logger.info('All set up -- waiting');
      } else {
        Logger.warn('Cheyenne already has a socket, dropping new connection');
        socket.destroy();
      }
    }).listen({port: 11700, host: '0.0.0.0'});
  };

  stopServer = async () => {
    Logger.info('stopping server...');
    const p = new Promise<void>(resolve => {
      this._server?.close(() => resolve());
    });
    this._sock?.destroy();
    await p;
    Logger.info('Server stopped');
  };

  private _handleIncomingData = async (d: Uint8Array) => {
    Logger.debug(`Handling incoming data: ${d}`);
    try {
      // compound statement does the following:
      //   1. Remove the last character in the incoming data (which should be a
      //      newline) using slice()
      //   2. Use Buffer.from(...).toString() to convert those bytes to a string
      //   3. Interpret that string back to bytes using base64 encoding
      //   4. Make a HassmicCommand from the resulting bytes
      let m = HassmicCommand.fromBinary(
        Buffer.from(Buffer.from(d.slice(0, -1)).toString(), 'base64'),
      );

      switch (m.msg.oneofKind) {
        case 'setMicMute':
          Logger.info('Got set_mic_mute message');
          const shouldMute: boolean = m.msg.setMicMute;
          Logger.info(`Setting mic mute to ${shouldMute}`);
          this._mic_muted = shouldMute;
          break;
        // Actions that need to be handled by native code
        case 'playAudio':
        case 'setPlayerVolume':
        case 'command':
          Logger.debug(
            `Got "${m.msg.oneofKind}" HassmicCommand; passing it to native code`,
          );
          NativeManager.handleHassmicCommand(m);
          break;
        default:
          Logger.warning(`Got unknown message type '${m.msg.oneofKind}'`);
      }
    } catch (e: any) {
      Logger.error(`Error handling incoming data: ${e.toString()}`);
      Logger.error(`Data was: ${d}`);
    }
  };
}

export const CheyenneSocket: CheyenneServer = new CheyenneServer();
