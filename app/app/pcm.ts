// allows playing PCM streams

import { NativeModules } from "react-native";
// fork at https://github.com/jeffc/react-native-pcm-audio
const { PcmAudio } = NativeModules;
import { HMLogger } from "./logger";
import { Buffer } from "buffer";

const Logger = new HMLogger("pcm.ts");

class PCMPlayer_ {
  // Based on examples at
  // https://github.com/clshortfuse/react-native-pcm-audio
  startAudioStream = (pcmOptions: any): Promise<number> => {
    return new Promise<number>((resolve, reject) => {
      var callback = (event: string, data: any) => {
        switch (event) {
          case "onSessionId":
            /* start playing audio immediately */
            Logger.info(`Got audio session id: ${data}`);
            resolve(data);
            break;
        }
      };
      PcmAudio.build(pcmOptions, callback);
    }).then((id: number): number => {
      NativeModules.PcmAudio.play(id);
      return id;
    });
  };

  writeAudioStream = async (id: number, samples: Uint8Array) => {
    if (!samples) {
      Logger.error("Not writing null samples");
      return;
    } else if (!id) {
      Logger.error("No audio session ID");
      return;
    }
    /* write pcm samples here */
    var base64Data = Buffer.from(samples).toString("base64");
    await PcmAudio.write(id, base64Data);
  };

  stopAudioStream = async (id: number) => {
    if (!id) {
      Logger.info("no audio stream");
    }
    PcmAudio.end(id);
    //this._pcmAudioSessionId = null;
  };
}

export const PCMPlayer = new PCMPlayer_();
