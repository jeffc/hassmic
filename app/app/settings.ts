import AsyncStorage from '@react-native-async-storage/async-storage';
import Zeroconf from 'react-native-zeroconf';
import uuid from 'react-native-uuid';
import {Buffer} from 'buffer';
import {HMLogger} from './logger';
import {STORAGE_KEY_SAVED_SETTINGS_PROTO, STORAGE_KEY_UUID} from './constants';
import {SavedSettings} from './proto/hassmic';

const Logger = new HMLogger('settings.ts');

// Manages the app settings in storage
class SavedSettingsManager_ {
  private settings: SavedSettings = SavedSettings.create({});

  // use a promise to be able to flag when everything is initialized.
  private setReady: () => void = () => {};
  private ready_: Promise<void> | null = null;

  private settingsChangedCallbacks: Array<(s: SavedSettings) => Promise<void>> =
    [];

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
    let out = await this._settings_setup_promise;
    this.setReady();
    return out;
  };

  waitForReady = async () => {
    await this.ready_;
  };

  // when settings are changed, these callbacks are invoked with a *copy* of the
  // new settings object.
  registerSettingsChangedCallback = (
    cb: (s: SavedSettings) => Promise<void>,
  ) => {
    this.settingsChangedCallbacks.push(cb);
  };

  // adapted from https://www.jonmellman.com/posts/singleton-promises
  private _settings_setup_promise = new Promise<SavedSettings>(
    (resolve, fail) => {
      (async () => {
        let settings_b64: string = '';
        try {
          // keep the typechecker happy
          let from_storage: string | number[] | null =
            await AsyncStorage.getItem(STORAGE_KEY_SAVED_SETTINGS_PROTO);
          if (from_storage) {
            settings_b64 = from_storage.toString();
          }
        } catch (e) {
          Logger.error(`Error getting UUID: ${e}`);
          fail(e);
        }

        if (settings_b64) {
          try {
            let bts = Buffer.from(settings_b64, 'base64');
            this.settings = SavedSettings.fromBinary(bts);
          } catch (e) {
            Logger.error(`Error loading saved settings: ${e}`);
          }
        }

        if (this.settings.announceVolume === undefined) {
          this.settings.announceVolume = 1.0;
          Logger.info(
            `Setting previously-unset announceVolume to ${this.settings.announceVolume}`,
          );
        }

        if (this.settings.playbackVolume === undefined) {
          this.settings.playbackVolume = 1.0;
          Logger.info(
            `Setting previously-unset announceVolume to ${this.settings.announceVolume}`,
          );
        }

        if (this.settings.hassmicUuid == '') {
          // check if uuid exists in old configuration format
          let zcuuid = '';
          let zc_old: string | number[] | null = await AsyncStorage.getItem(
            STORAGE_KEY_UUID,
          );
          if (zc_old) {
            zcuuid = zc_old.toString();
            Logger.info(
              `Migrated hassmic zeroconf uuid from old format to settingsproto format: ${zcuuid}`,
            );
            AsyncStorage.removeItem(
              STORAGE_KEY_UUID,
              (e: Error | null | undefined) => {
                if (e) {
                  Logger.error(
                    `Error removing old zeroconf uuid storage: ${e.toString()}`,
                  );
                } else {
                  Logger.info('Successfully removed old zeroconf uuid storage');
                }
              },
            );
          } else {
            zcuuid = uuid.v4().toString();
            Logger.debug(`Generated UUID ${zcuuid}`);
          }
          this.settings.hassmicUuid = zcuuid;
        }

        await this.write();
        Logger.debug(`UUID is ${this.settings.hassmicUuid}`);
        resolve(this.settings);
      })();
    },
  );

  write = async (): Promise<boolean> => {
    Logger.debug('Writing saved settings');
    try {
      await AsyncStorage.setItem(
        STORAGE_KEY_SAVED_SETTINGS_PROTO,
        Buffer.from(SavedSettings.toBinary(this.settings)).toString('base64'),
      );
      Logger.debug('wrote settings OK');
    } catch (e) {
      Logger.error(`Error saving settings: ${e}`);
      return false;
    }
    Logger.debug(
      `Invoking ${this.settingsChangedCallbacks.length} settings changed callbacks`,
    );

    this.settingsChangedCallbacks.forEach(async cb => {
      try {
        let ss = this.getSavedSettings(); // get a copy
        await cb(ss);
      } catch (e: any) {
        Logger.error(`Got an error executing settings saved callback: ${e}`);
      }
    });

    return true;
  };

  getSavedSettings = (): SavedSettings => {
    // make a deep copy of the saved settings structure and return it
    let ssb64 = SavedSettings.toBinary(this.settings);
    Logger.debug(`Serialized saved settings: ${ssb64}`);
    return SavedSettings.fromBinary(ssb64);
  };

  getAnnounceVolume = async (): Promise<number> => {
    await this.waitForReady();
    let out = this.settings.announceVolume;
    if (out === undefined) {
      throw new Error('No announce volume set in settings!');
    }
    return out;
  };

  setAnnounceVolume = async (newVol: number) => {
    await this.waitForReady();
    if (newVol < 0 || newVol > 1.0) {
      Logger.warning(
        `New announce volume out of range; not saving it: ${newVol}`,
      );
      return;
    }
    this.settings.announceVolume = newVol;
    await this.write();
  };

  getPlaybackVolume = async (): Promise<number> => {
    await this.waitForReady();
    let out = this.settings.playbackVolume;
    if (out === undefined) {
      throw new Error('No playback volume set in settings!');
    }
    return out;
  };

  setPlaybackVolume = async (newVol: number) => {
    await this.waitForReady();
    if (newVol < 0 || newVol > 1.0) {
      Logger.warning(
        `New playback volume out of range; not saving it: ${newVol}`,
      );
      return;
    }
    this.settings.playbackVolume = newVol;
    await this.write();
  };

  getDeviceName = async (): Promise<string> => {
    await this.waitForReady();
    let out = this.settings.deviceName;
    if (out === undefined) {
      throw new Error('No device name set in settings!');
    }
    return out;
  };

  setDeviceName = async (newName: string) => {
    await this.waitForReady();
    this.settings.deviceName = newName;
    await this.write();
  };

  getHMUUID = async (): Promise<string> => {
    await this.waitForReady();
    let out = this.settings.hassmicUuid;
    if (out == '') {
      throw new Error('No UUID set in settings!');
    }
    return out;
  };
}

export const Settings = new SavedSettingsManager_();
