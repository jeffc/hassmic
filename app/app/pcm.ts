// allows playing PCM streams

import { NativeModules } from "react-native";
// fork at https://github.com/jeffc/react-native-pcm-audio
const { PcmAudio } = NativeModules;
import { HMLogger } from "./logger";
import { Buffer } from "buffer";

const Logger = new HMLogger("pcm.ts");

export class PCMPlayer {
  // Based on examples at
  // https://github.com/clshortfuse/react-native-pcm-audio
  private _pcmAudioSessionId = null;
  startAudioStream = (pcmOptions: any) => {
    return new Promise((resolve, reject) => {
      var callback = (event: string, data: any) => {
        switch (event) {
          case "onSessionId":
            this._pcmAudioSessionId = data;
            /* start playing audio immediately */
            Logger.info(`Got audio session id: ${data}`);
            resolve(data);
            break;
        }
      };
      PcmAudio.build(pcmOptions, callback);
    }).then(NativeModules.PcmAudio.play);
  };

  writeAudioStream = async (samples: Uint8Array) => {
    if (!samples) {
      Logger.error("Not writing null samples");
      return;
    } else if (!this._pcmAudioSessionId) {
      Logger.error("No audio session ID");
      return;
    }
    /* write pcm samples here */
    var base64Data = Buffer.from(samples).toString("base64");
    await PcmAudio.write(this._pcmAudioSessionId, base64Data);
  };

  stopAudioStream = async () => {
    if (!this._pcmAudioSessionId) {
      Logger.info("no audio stream");
    }
    PcmAudio.end(this._pcmAudioSessionId);
    //this._pcmAudioSessionId = null;
  };
}
