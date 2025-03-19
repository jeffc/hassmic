// Handles and abstracts away interactions with native java code

import AsyncStorage from '@react-native-async-storage/async-storage';
import {NativeModules, NativeEventEmitter} from 'react-native';
const {BackgroundTaskModule} = NativeModules;
import {Buffer} from 'buffer';
import {CLIENT_EVENT_KEY, STORAGE_KEY_SAVED_SETTINGS_PROTO} from './constants';
import {HMLogger} from './logger';
import {Settings} from './settings';
import {
  ClientEvent,
  ClientMessage,
  MediaPlayerId,
  SavedSettings,
  HassmicCommand,
} from './proto/hassmic';

const Logger = new HMLogger('nativemgr.ts');

class NativeManager_ {
  emitter = new NativeEventEmitter(BackgroundTaskModule);

  // use a promise to be able to flag when everything is initialized.
  private setReady: () => void = () => {};
  private ready_: Promise<void> | null = null;

  constructor() {
    this.ready_ = new Promise<void>(resolve => {
      this.setReady = resolve;
    });
    // run async init
    this.initialize_().then(
      ok => Logger.debug('Init ok'),
      nok => Logger.debug(`Init not ok: ${nok}`),
    );
  }

  // perform async initializiations
  private initialize_ = async () => {
    this.addClientEventListener(this.onClientEvent);

    Logger.debug('Native manager is ready.');
    this.setReady();
  };

  waitForReady = async () => {
    await this.ready_;
  };

  // Add a listener for ClientEvents sent by native code.
  addClientEventListener = (f: (ev: ClientEvent) => Promise<void>) => {
    this.emitter.addListener(CLIENT_EVENT_KEY, async ev => {
      Logger.debug(`Proto-valued event: "${ev}"`);
      try {
        let ce = ClientEvent.fromBinary(
          //Buffer.from(Buffer.from(ev.slice(0, -1)).toString(), 'base64'),
          Buffer.from(Buffer.from(ev).toString(), 'base64'),
        );
        await f(ce);
      } catch (e) {
        Logger.error(`Error in ClientEvent Listener: ${e}`);
      }
    });
  };

  // Process a message that needs to be handled by native code
  handleHassmicCommand(hm: HassmicCommand) {
    let hmb64: string = Buffer.from(HassmicCommand.toBinary(hm)).toString(
      'base64',
    );
    BackgroundTaskModule.handleHassmicCommand(hmb64);
  }

  // kill any existing instance of the task
  killService = () => {
    try {
      BackgroundTaskModule.stopService();
    } catch (e) {}
  };

  // start the task
  runService = () => {
    BackgroundTaskModule.startService();
  };

  // What to do on ClientEvent receipt from native code
  private onClientEvent = async (ce: ClientEvent) => {
    Logger.info(ClientEvent.toJsonString(ce));
    if (ce.event.oneofKind == 'mediaPlayerVolumeChange') {
      const vl = ce.event.mediaPlayerVolumeChange;
      switch (vl.player) {
        case MediaPlayerId.ID_ANNOUNCE:
          Logger.debug(`Setting new volume level for announce to ${vl.volume}`);
          Settings.setAnnounceVolume(vl.volume).then(() => {});
          break;
        case MediaPlayerId.ID_PLAYBACK:
          Logger.debug(`Setting new volume level for playback to ${vl.volume}`);
          Settings.setPlaybackVolume(vl.volume).then(() => {});
          break;
        default:
          Logger.error(`Unknown player in event: ${vl.player}`);
      }
    }
  };
}

export const NativeManager: NativeManager_ = new NativeManager_();
