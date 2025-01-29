import {
  Button,
  PermissionsAndroid,
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
import { ZeroconfManager } from "./zeroconf";
import { useState, useEffect } from "react";

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

export default function Index() {
  const [hasAudioPermission, setHasAudioPermission] = useState(false);
  const [hasNotificationPermission, setHasNotificationPermission] =
    useState(false);
  const [isConnected, setIsConnected] = useState(false);
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
  const checkNotificationPermission = async (): Promise<boolean> => {
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

    const notif_ok = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
    );
    setHasNotificationPermission(
      notif_ok == PermissionsAndroid.RESULTS.GRANTED
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

  // useEffect(..., []) means this code will be called once on component mount
  // (or twice in dev mode, maybe?). Do the setup stuff here.
  useEffect(() => {
    CheyenneSocket.setConnectionStateCallback(setIsConnected);
    NetworkInfo.getIPV4Address().then(setLocalIP);
    console.log("GETTING UUID AAAH");
    UUIDManager.getUUID().then(setUUID);

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
          <Text>Connected: {isConnected ? "yes" : "no"}</Text>
          <Text>
            Permission to record audio: {hasAudioPermission ? "yes" : "no"}
          </Text>
          <Text>
            Permission to show notification:{" "}
            {hasNotificationPermission ? "yes" : "no"}
          </Text>
          <Text>Version {APP_VERSION}</Text>
        </>
      </View>
    </SafeAreaView>
  );
}
