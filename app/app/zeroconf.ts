import Zeroconf from "react-native-zeroconf";

import { HASSMIC_PORT, STORAGE_KEY_UUID } from "./constants";
import { UUIDManager } from "./util";
import { HMLogger } from "./logger";

const Logger = new HMLogger("zeroconf.ts");

class ZeroconfManager_ {
  zeroconf = new Zeroconf();

  StartZeroconf = async () => {
    let zcuuid: string = await UUIDManager.getUUID();

    Logger.debug(`Starting Zeroconf using UUID ${zcuuid}`);
    this.zeroconf.publishService(
      "hassmic",
      "tcp",
      "local.",
      zcuuid,
      HASSMIC_PORT
    );
  };

  StopZeroconf = async () => {
    let zcuuid: string = await UUIDManager.getUUID();

    Logger.debug(`Stopping Zeroconf using UUID ${zcuuid}`);
    this.zeroconf.unpublishService(zcuuid);
  };
}

export const ZeroconfManager: ZeroconfManager_ = new ZeroconfManager_();
