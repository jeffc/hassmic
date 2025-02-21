import {
  Button,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  Switch,
  Text,
  View,
} from "react-native";
import { APP_VERSION } from "./constants";
import { BackgroundTaskManager, TaskState } from "./backgroundtask";
import { CheyenneSocket } from "./cheyenne";
import { NetworkInfo } from "react-native-network-info";
import { UUIDManager } from "./util";
import { WyomingServer } from "./wyoming";
import { ZeroconfManager } from "./zeroconf";
import { Settings } from "./settings";
import { useState, useEffect } from "react";
import { SavedSettings } from "./proto/hassmic";

// note - patched version from
// https://github.com/jeffc/react-native-live-audio-stream
import LiveAudioStream from "react-native-live-audio-stream";

const Separator = () => (
  <View
    style={{
      marginVertical: 8,
      borderBottomColor: "#737373",
      borderBottomWidth: StyleSheet.hairlineWidth,
    }}
  />
);

const ANDROID_VERSION: number = +Platform.Version;

export default function Index() {
  const [hasAudioPermission, setHasAudioPermission] = useState(false);
  const [hasNotificationPermission, setHasNotificationPermission] = useState<
    boolean | null
  >(false);
  const [isCheyenneConnected, setIsCheyenneConnected] = useState(false);
  const [isWyomingConnected, setIsWyomingConnected] = useState(false);
  const [localIP, setLocalIP] = useState<string | null>("");
  const [isBackgroundTaskEnabled, setBackgroundTaskEnabled] = useState(false);
  const [backgroundTaskState, setBackgroundTaskState] = useState(
    TaskState.UNKNOWN
  );
  const [uuid, setUUID] = useState("");

  // check audio permission silently
  const checkAudioPermission = async (): Promise<boolean> => {
    const audio_ok = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
    );
    setHasAudioPermission(audio_ok);
    return audio_ok;
  };

  // check notification permission silently
  const checkNotificationPermission = async (): Promise<boolean | null> => {
    if (ANDROID_VERSION < 33) {
      // notification permission does not exist before API 33
      setHasNotificationPermission(null);
      return null;
    }
    const notify_ok = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
    );
    setHasNotificationPermission(notify_ok);
    return notify_ok;
  };

  // ask for permissions, if need
  const requestPermissions = async () => {
    const audio_ok = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
    );
    setHasAudioPermission(audio_ok == PermissionsAndroid.RESULTS.GRANTED);
    console.log(`Audio permission: ${audio_ok}`);

    const notif_ok =
      ANDROID_VERSION < 33
        ? null
        : await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
          );
    setHasNotificationPermission(
      ANDROID_VERSION < 33
        ? null
        : notif_ok == PermissionsAndroid.RESULTS.GRANTED
    );
    console.log(`Notify permission: ${notif_ok}`);
  };

  const stopStream = async () => {
    LiveAudioStream.stop();
  };

  const bgSwitchChanged = async (newValue: boolean) => {
    console.log(`Background switch changed: ${newValue}`);
    BackgroundTaskManager.setEnabled(newValue);
    if (newValue) {
      await BackgroundTaskManager.run();
    } else {
      BackgroundTaskManager.stop();
    }
  };

  const settingsUpdated = async (newSettings: SavedSettings) => {
    setUUID(newSettings.hassmicUuid);
  };

  // useEffect(..., []) means this code will be called once on component mount
  // (or twice in dev mode, maybe?). Do the setup stuff here.
  useEffect(() => {
    CheyenneSocket.setConnectionStateCallback(setIsCheyenneConnected);
    WyomingServer.setConnectionStateCallback(setIsWyomingConnected);
    NetworkInfo.getIPV4Address().then(setLocalIP);
    //UUIDManager.getUUID().then(setUUID);
    Settings.registerSettingsChangedCallback(settingsUpdated);

    // kill any existing instance of the background task (ie, task running even
    // though the app was killed)
    BackgroundTaskManager.kill();

    BackgroundTaskManager.setEnableStateCallback(setBackgroundTaskEnabled);
    BackgroundTaskManager.setTaskStateCallback(setBackgroundTaskState);

    // checkAudioPermission and checkNotificationPermission should set their
    // state state values, but in useEffect(..., []) that doesn't work. Using
    // .then() solves that problem.
    checkAudioPermission().then((ok) => {
      setHasAudioPermission(ok);
    });
    checkNotificationPermission().then((ok) => {
      setHasNotificationPermission(ok);
    });
  }, []);

  // when background task is toggled on or off, start or stop it accordingly.
  useEffect(() => {
    if (isBackgroundTaskEnabled) {
      if (backgroundTaskState != TaskState.RUNNING) {
        BackgroundTaskManager.run();
      }
    } else {
      if (backgroundTaskState == TaskState.RUNNING) {
        BackgroundTaskManager.stop();
      }
    }
  }, [isBackgroundTaskEnabled]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar backgroundColor="#000000" />
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <>
          {hasAudioPermission ? null : (
            <View>
              <Button title="Get Permissions" onPress={requestPermissions} />
            </View>
          )}
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
            }}
          >
            <Text
              style={{
                fontSize: 24,
              }}
            >
              Enable running in background:{" "}
            </Text>
            <Switch
              onValueChange={BackgroundTaskManager.setEnabled}
              value={isBackgroundTaskEnabled}
              disabled={!hasAudioPermission}
            />
          </View>
          <View
            style={{
              borderBottomColor: "black",
              borderBottomWidth: 1,
              height: 10,
            }}
          />
          <Text>
            Background Task: {isBackgroundTaskEnabled ? "enabled" : "disabled"}{" "}
            and{" "}
            {backgroundTaskState == TaskState.RUNNING
              ? "running"
              : "not running"}
          </Text>
          <Text>Local IP: {localIP}</Text>
          <Text>Device Unique ID: {uuid}</Text>
          <Text>Wyoming Connected: {isWyomingConnected ? "yes" : "no"}</Text>
          <Text>
            HassMic Integration Connected: {isCheyenneConnected ? "yes" : "no"}
          </Text>
          <Text>
            Permission to record audio: {hasAudioPermission ? "yes" : "no"}
          </Text>
          <Text>
            Permission to show notification:{" "}
            {hasNotificationPermission === null
              ? "not required"
              : hasNotificationPermission
                ? "yes"
                : "no"}
          </Text>
          <Text>Version {APP_VERSION}</Text>
        </>
      </View>
    </SafeAreaView>
  );
}
