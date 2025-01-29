// Provides a logging interface
import { ClientMessage, Log, Log_Severity } from "./proto/hassmic";

export class HMLogger {
  private _tag: string = "";

  constructor(tag: string) {
    this._tag = tag;
  }
  private _log = (severity: Log_Severity, msg: string) => {
    // Remote debug logging disabled for now, since it causes issues.
    /*
    let m = ClientMessage.create({
      msg: {
        oneofKind: "clientEvent",
        clientEvent: {
          event: {
            oneofKind: "log",
            log: {
              severity: severity,
              logText: msg,
            },
          },
        },
      },
    });
    CheyenneSocket.sendMessage(m);
    */
  };

  private _wrapMessage(m: string) {
    return `[HM] [${this._tag}] ${m}`;
  }

  debug = (msg: string) => {
    let m = this._wrapMessage(msg);
    console.debug(m);
    this._log(Log_Severity.DEBUG, m);
  };

  info = (msg: string) => {
    let m = this._wrapMessage(msg);
    console.debug(m);
    this._log(Log_Severity.INFO, m);
  };

  warning = (msg: string) => {
    let m = this._wrapMessage(msg);
    console.warn(m);
    this._log(Log_Severity.WARNING, m);
  };

  warn = this.warning;

  error = (msg: string) => {
    let m = this._wrapMessage(msg);
    console.error(m);
    this._log(Log_Severity.ERROR, m);
  };
}
