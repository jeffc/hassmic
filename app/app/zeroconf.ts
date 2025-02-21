import Zeroconf from "react-native-zeroconf";

import { HASSMIC_PORT, WYOMING_PORT } from "./constants";
import { Settings } from "./settings";
import { HMLogger } from "./logger";

const Logger = new HMLogger("zeroconf.ts");

class ZeroconfManager_ {
  zeroconf = new Zeroconf();

  StartZeroconf = async () => {
    let zcuuid: string = await Settings.getHMUUID();

    Logger.debug(`Starting HM Zeroconf using UUID ${zcuuid}`);
    this.zeroconf.publishService(
      "hassmic",
      "tcp",
      "local.",
      zcuuid,
      HASSMIC_PORT
    );

    Logger.debug(`Starting Wyoming Zeroconf using UUID ${zcuuid}`);
    this.zeroconf.publishService(
      "wyoming",
      "tcp",
      "local.",
      "wy-" + zcuuid,
      WYOMING_PORT
    );
  };

  StopZeroconf = async () => {
    let zcuuid: string = await Settings.getHMUUID();

    Logger.debug(`Stopping Zeroconf`);
    this.zeroconf.unpublishService(zcuuid);
    this.zeroconf.unpublishService("wy-" + zcuuid);
  };
}

export const ZeroconfManager: ZeroconfManager_ = new ZeroconfManager_();
