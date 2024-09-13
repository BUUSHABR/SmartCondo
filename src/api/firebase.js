import messaging from "@react-native-firebase/messaging";
import remoteConfig from "@react-native-firebase/remote-config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Appearance,
  DeviceEventEmitter,
  NativeModules,
  PermissionsAndroid,
  Platform,
  NativeEventEmitter,
} from "react-native";
import * as RootNavigation from "../navigation/RootNavigation";
import { showFloatingFcm } from "../helpers";

import {
  acceptCall,
  rejectCall,
  callRejectInBackground,
} from "../helpers/videoCall";
import RNCallKeep from "react-native-callkeep";
import { switchUnit } from "../redux/actions/switch_unit";
import { setTheme } from "../redux/actions/profile";
import { IsRoomActive, joinRoom, VideoCallReceived } from "./video_call";
import { ToastMessage } from "../components";
import { log } from "react-native-reanimated";
import moment from "moment";
const { IncomingCall } = NativeModules;

const options = {
  ios: {
    appName: "SmartCondo",
    supportsVideo: true,
    displayCallReachabilityTimeout: 1000,
  },
  android: {
    alertTitle: "Permissions required",
    alertDescription: "This application needs to access your phone accounts",
    cancelButton: "Cancel",
    okButton: "ok",
    imageName: "phone_account_icon",
    additionalPermissions: [PermissionsAndroid.PERMISSIONS.example],
    foregroundService: {
      channelId: "com.company.my",
      channelName: "Foreground service for my app",
      notificationTitle: "My app is running on background",
      notificationIcon: "Path to the resource icon of the notification",
    },
  },
};

export const fcmPermission = async () => {
  const authStatus = await messaging().requestPermission();
  return (
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL
  );
};

export const fcmToken = async () => {
  const token = await messaging().getToken();
  // const apnsToken = await messaging().getAPNSToken();
  console.log(token, "dcm token");
  await AsyncStorage.setItem("fcm_token", JSON.stringify(token));
  return token;
};

export const registerIosDevice = async () => {
  const register = await messaging().registerDeviceForRemoteMessages();
  console.log(register, "regsisterr");
  return register;
};

export const remoteConfigAPI = async (setUpdateFirebase) => {
  console.log("remotconfog api");
  // global.host = remoteConfig().getValue("host").asString();
  await remoteConfig().fetch(0);
  await remoteConfig()
    .setConfigSettings({
      isDeveloperModeEnabled: __DEV__,
    })
    .then(
      () => console.log("after dev mode"),
      await remoteConfig()
        .setDefaults({
          host: "https://api-bms-app.katomaran.tech",
        })
        .then((value) => {
          console.log("remote config fetchand activate1", value);
          return remoteConfig().fetchAndActivate();
        })
        .then((activated) => {
          console.log("Remote config activated...: ", activated);
          let env = { version: 1 };
          //if(activated) {
          let configData = undefined;
          FCM_ARGS = [];
          FCM_ARGS.forEach((entry) => {
            configData = remoteConfig().getValue(entry);
            env[entry] = configData.value;
          });
          console.log("Values in env: ", env);
          return Promise.resolve(env);
        })
        .catch((err) => {
          console.log("Default values set.", err);
        })
    );

  global.appLink = remoteConfig()
    .getValue("appLink")
    .asString();
  global.isAppUpdate = remoteConfig()
    .getValue("appUpdate")
    .asString();
  setUpdateFirebase(global.isAppUpdate);

  console.log(global.isAppUpdate, "ifniwnfwifn");
  const initMode = await AsyncStorage.getItem("mode");
  const isLogin = await AsyncStorage.getItem("isLogin");
  console.log(isLogin, "existingHost")
  if (isLogin == "true") {
    console.log(global.host, "host already present ", isLogin)
  } else {
    console.log(global.host, "host set", isLogin)
    global.host = await remoteConfig()
      .getValue("host")
      .asString();
    console.log("itenary", global.host);
    await AsyncStorage.setItem("host", global.host);//
  }




  // await AsyncStorage.setItem("host", global.host);

  // console.log("mrdddrfrfrf firebase js", global.host);
  if (initMode == null) {
    const theme =
      initMode == null || Appearance.getColorScheme() === "light"
        ? "light"
        : "dark";
    await AsyncStorage.setItem("mode", theme);
    dispatch(setTheme(theme));
  }
};

export const cloudMessagingAPI = async (dispatch) => {
  const fcmPermit = await fcmPermission();
  const token = await fcmToken();
  Platform.OS !== "android" &&
    RNCallKeep.setup(options).then((accepted) => {
      console.log(accepted, "acceptcall ios");
    });

  const TOPIC = "Subscribe";

  if (token.length > 5 && fcmPermit) {
    messaging()
      .getInitialNotification()
      .then(async (remoteMessage) => {
        let user = JSON.parse(await AsyncStorage.getItem("user"));
        console.log("initial notificationn", remoteMessage, user?.data?.current_unit?.id);
        // if (remoteMessage) {
          // console.log(remoteMessage?.data?.type === "Announcement" && remoteMessage?.data?.unit_id !== user?.data?.current_unit?.id)
          // if (remoteMessage?.data?.type === "Announcement" && remoteMessage?.data?.unit_id !== user?.data?.current_unit?.id) {

          //   ToastMessage(200, "Announcement is on your another condo");
    
          //   let data = {
          //     title: remoteMessage.data.title ? remoteMessage.data.title : "",
          //     type: remoteMessage.data.type,
          //     type_id:remoteMessage.data.type_id,
          //     message: remoteMessage.data.body,
          //     preferred_unit_id: remoteMessage.data.unit_id,
          //   };
            // setTimeout(() => {
              // RootNavigation.navigate("HomeScreen", { triggerSwitch:true,notification:data });

            // }, "1500");
          //   showFloatingFcm(remoteMessage);
          // } else {
         remoteMessage && showFloatingFcm(remoteMessage);
           

          // }
        // }
      });

    messaging().onNotificationOpenedApp(async (remoteMessage) => {
      console.log(remoteMessage, user.data.current_unit.id, remoteMessage.data.unit_id, "onNotificationOpenedApp");

      remoteMessage && showFloatingFcm(remoteMessage);
    });

    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      const {
        data: { type, callerName, id },
      } = remoteMessage;
      global.remoteMessage = remoteMessage;

      let user = JSON.parse(await AsyncStorage.getItem("user"));
      console.log("setbackground llllled", remoteMessage, user.data);
      console.log(
        user.data.current_unit.id,
        "keiuhdndhhd",
        remoteMessage.data.unit_id
      );
      if (remoteMessage.data.type != "IncomingVideoCall") {
        if (remoteMessage.data.type != "Announcement") {
          if (user.data.current_unit.id != remoteMessage.data.unit_id) {
            console.log(
              user.data.current_unit.id,
              "mismatch is dkudnljjd",
              remoteMessage.data.unit_id
            );
            await dispatch(
              switchUnit(
                "switch_id",
                remoteMessage.data.unit_id,
                remoteMessage.data.unit_id,
                false
              )
            );
          }
        }
      }

      if (type === "IncomingVideoCall") {
        console.log(id, callerName, "icccc", Platform.OS);
        IsRoomActive(id)
          .then((data) => {
            const {
              id,
              visitor_name,
              unit_number,
              current_tenant,
              version,
              res_token,
              room_id,
              created_at,
              status,
            } = data.data;
            global.roomData = data;
            console.log(data, "dwlkwdk");
            if (
              data.data.status == "created" ||
              data.data.status == "ringing"
            ) {
              Platform.OS === "android" &&
                IncomingCall.display(
                  id, // Call UUID v4
                  callerName, // Username
                  "https://docs-assets.katomaran.tech/images/smartcondo/user-logo/2022/04/user.png", // Avatar URL
                  "Incoming Video Call", // Info text
                  30000 // Timeout for end call after 20s
                );
            }
          })
          .catch((err) => {
            console.log(err);

            ToastMessage(err[0], err[1].data[0], err);
          });
      }
    });

    messaging().onMessage(async (remoteMessage) => {
      console.log(
        remoteMessage,
        "onMessage",
        "hello",
        JSON.stringify(IncomingCall)
      );
      // initializInterval();
      global.remoteMessage = remoteMessage;

      let user = JSON.parse(await AsyncStorage.getItem("user"));
      // console.log(user.data.current_unit.id, "keiuhdndhhd", remoteMessage);
      if (remoteMessage.data.type != "IncomingVideoCall") {
        if (remoteMessage.data.type != "Announcement") {
          if (user.data.current_unit.id != remoteMessage.data.unit_id) {
            // console.log(
            //   user.data.current_unit.id,
            //   "mismatch is dkudnljjd",
            //   remoteMessage.data.unit_id
            // );

            await dispatch(
              switchUnit(
                "switch_id",
                remoteMessage.data.unit_id,
                remoteMessage.data.unit_id,
                true
              )
            );
          }
        }
      }

      Platform.OS !== "android" &&
        RNCallKeep.setup(options).then((accepted) => {
          console.log(accepted, "acceptcall ios");
        });

      global.callStatus = false;
      const {
        data: { type, callerName, id },
      } = remoteMessage;
      // console.log(remoteMessage.data);

      if (type === "IncomingVideoCall") {
        // console.log(id, callerName, "icccc", Platform.OS);
        IsRoomActive(id)
          .then((data) => {
            console.log(data, "dwlkwdk");
            const {
              id,
              visitor_name,
              unit_number,
              current_tenant,
              version,
              res_token,
              created_at,
              room_id,
              status,
            } = data.data;
            global.roomData = data;
            if (
              data.data.status == "created" ||
              data.data.status == "ringing"
            ) {
              Platform.OS === "android" &&
                IncomingCall.display(
                  id, // Call UUID v4
                  callerName, // Username
                  "https://docs-assets.katomaran.tech/images/smartcondo/user-logo/2022/04/user.png", // Avatar URL
                  "Incoming Video Call", // Info text
                  30000 // Timeout for end call after 20s
                );
            }
          })
          .catch((err) => {
            console.log(err, "dd");
            ToastMessage(err[0], err[1].data[0], err);
          });
      }
    });

    messaging()
      .subscribeToTopic(TOPIC)
      .then(() => {
        console.log(`Topic: ${TOPIC} Suscribed`);
      });
  }
};
