import {
  AppRegistry,
  Text,
  TextInput,
  DeviceEventEmitter,
  NativeModules,
  PermissionsAndroid,
  Platform,
  NativeEventEmitter,
} from "react-native";
import App from "./App";
import { name as appName } from "./app.json";
import messaging from "@react-native-firebase/messaging";
import {
  acceptCall,
  callRejectInBackground,
  rejectCall,
} from "./src/helpers/videoCall";
import { showFloatingFcm } from "./src/helpers";
import * as RootNavigation from "./src/navigation/RootNavigation";
import RNCallKeep from "react-native-callkeep";
import VoipPushNotification from "react-native-voip-push-notification";
import {
  IsRoomActive,
  joinRoom,
  VideoCallReceived,
} from "./src/api/video_call";
import { ToastMessage } from "./src/components";
import moment from "moment";
const { IncomingCall } = NativeModules;
let eventEmitter;
if (Platform.OS === "android") {
  eventEmitter = new NativeEventEmitter(NativeModules.IncomingCall);
}
global.navigate = false;
global.isAlive = false;
let timeout;
global.remoteMessage = {};
global.roomData = {};
global.videoCallProps = {};

const options = {
  ios: {
    appName: "SmartCondo",
    supportsVideo: true,
    displayCallReachabilityTimeout: 30000,
  },
  android: {
    alertTitle: "Permissions required",
    alertDescription: "This application needs to access your phone accounts",
    cancelButton: "Cancel",
    okButton: "ok",
    imageName: "phone_account_icon",
    additionalPermissions: [PermissionsAndroid.PERMISSIONS.example],
    // Required to get audio in background when using Android 11
    foregroundService: {
      channelId: "com.company.my",
      channelName: "Foreground service for my app",
      notificationTitle: "My app is running on background",
      notificationIcon: "Path to the resource icon of the notification",
    },
  },
};

// android video call listners for answer call and end call

DeviceEventEmitter.addListener("endCall", (payload) => {
  global.navigate = false;
  const isVersion2 = global.remoteMessage.data.version == "v2";
  const { id, res_token, room_id, created_at, status } = global?.roomData?.data;

  isVersion2 &&
    VideoCallReceived(id, { status: "busy" }).then((data) => {
      console.log("data", data);
    });
  callRejectInBackground(payload?.uuid, global.remoteMessage.data.version);
});

DeviceEventEmitter.addListener("answerCall", (payload) => {
  global.navigate = true;
  global.videoCallProp = {
    data: {
      roomName: payload?.uuid,
      participant: global.remoteMessage.data.callerName,
      enableApprovalBlock: true,
      current_tenant: global.remoteMessage.data.current_tenant,
      unit_number: global.remoteMessage.data.unit_number,
      // data: data,
      exit: true,
      ver: global.remoteMessage.data.version,
      room_id: room_id,
      token: res_token,
    },
  };
  const isVersion2 = global.remoteMessage.data.version == "v2";

  const { id, res_token, room_id, created_at, status } = global?.roomData?.data;

  isVersion2 &&
    VideoCallReceived(id, { status: "answered" }).then((data) => {
      console.log("data", data);
    });

  acceptCall({
    id: payload?.uuid,
    callerName: global.remoteMessage.data.callerName,
    current_tenant: global.remoteMessage.data.current_tenant,
    unit_number: global.remoteMessage.data.unit_number,
    // data: Token,
    exit: true,
    ver: global.remoteMessage.data.version,
    token: res_token,
    room_id: room_id,
  });

  if (payload.isHeadless) {
    NativeModules.OpenSettings.openApp((data) => {
      setTimeout(() => {
        RootNavigation.navigate("ActiveVideoCall", {
          data: {
            roomName: payload?.uuid,
            participant: global.remoteMessage.data.callerName,
            enableApprovalBlock: true,
            current_tenant: global.remoteMessage.data.current_tenant,
            unit_number: global.remoteMessage.data.unit_number,
            // data: Token,
            exit: true,
            ver: global.remoteMessage.data.version,
            token: res_token,
            room_id: room_id,
          },
        });
      }, 5000);
    });
  } else {
    console.log("hey back to forground");
    IncomingCall.backToForeground();
    acceptCall({
      id: payload?.uuid,
      callerName: global.remoteMessage.data.callerName,
      current_tenant: global.remoteMessage.data.current_tenant,
      unit_number: global.remoteMessage.data.unit_number,
      // data: Token,
      exit: true,
      ver: global.remoteMessage.data.version,
      token: res_token,
      room_id: room_id,
    });
  }
});

// after incoming call displays IntervalTick triggers every one seconds
if (Platform.OS === "android") {
  eventEmitter.addListener("IncomingCallDisplay", (params) => {
    // Handle the event and trigger the display of the incoming call screen
    const {
      id,
      res_token,
      room_id,
      created_at,
      status,
    } = global?.roomData?.data;

    console.log("IncomingCallDisplay", params);
    const isVersion2 = global.remoteMessage.data.version == "v2";

    isVersion2 &&
      VideoCallReceived(id, { status: "ringing" }).then((data) => {
        console.log("data", data);
      });
  });

  eventEmitter.addListener("IntervalTick", () => {
    const {
      id,
      res_token,
      room_id,
      created_at,
      status,
    } = global?.roomData?.data;
    console.log("Interval tick");
    const expireTime = moment(created_at);
    const expireTimeWithSeconds = expireTime.add(30, "seconds");
    const currentTime = moment();
    const diffSeconds = expireTimeWithSeconds.diff(currentTime, "seconds");

    console.log(
      diffSeconds,
      "diffSeconds index setBackgroundMessageHandler firebase"
    );
    IsRoomActive(id)
      .then((Data) => {
        console.log(Data, "Interval isRoomAcitive details api");
        if (
          diffSeconds == 0 ||
          Data.data.status == "answered" ||
          Data.data.status == "canceled"
        ) {
          Data.data.status == "canceled" &&
            ToastMessage(200, "Call is canceled by visitor");
          Data.data.status == "answered" &&
            ToastMessage(200, "Call is answered by resident");
          (!Data.data.answered_by_you || Data.data.status == "canceled") &&
            IncomingCall.endCall();
        }
      })
      .catch((err) => {
        console.log(err, "Interval isRoomAcitive details api error");
      });
  });
}
// ios video call listners for answer call and end call
Platform.OS !== "android" &&
  RNCallKeep.setup(options).then((accepted) => {
    console.log(accepted, "acceptcall ios");
  });
VoipPushNotification.addEventListener("notification", (notification) => {
  global.navigate = false;
  global.isAlive = true;

  const { id, name, handle, created_at } = notification;
  console.log(notification, "VoipPushNotification.addEventListener");
  IsRoomActive(id)
    .then((data) => {
      const { id, res_token, room_id, created_at, status } = data.data;
      global.roomData = data;
      notification.version == "v2" &&
        VideoCallReceived(id, { status: "ringing" })
          .then((data) => {
            console.log(data, "backgroind inactive data index");
          })
          .catch((err) => {
            console.log(err, "from background isactive");
          });

      if (data.data.status == "created" || data.data.status == "ringing") {
        setTimeout(() => {
          clearInterval(global.iosInterval);
        }, 30000);
        global.iosInterval = setInterval(() => {
          console.log("Interval tick");
          const expireTime = moment(created_at);
          const expireTimeWithSeconds = expireTime.add(30, "seconds");
          const currentTime = moment();
          const diffSeconds = expireTimeWithSeconds.diff(
            currentTime,
            "seconds"
          );

          console.log(
            diffSeconds,
            "diffSeconds index setBackgroundMessageHandler firebase"
          );
          IsRoomActive(id)
            .then((Data) => {
              console.log(Data, "Interval isRoomAcitive details api");
              if (
                diffSeconds == 0 ||
                Data.data.status == "answered" ||
                Data.data.status == "canceled"
              ) {
                Data.data.status == "canceled" &&
                  ToastMessage(200, "Call is canceled by visitor");
                Data.data.status == "answered" &&
                  ToastMessage(200, "Call is answered by resident");

                (!Data.data.answered_by_you ||
                  Data.data.status == "canceled") &&
                  RNCallKeep.endCall(id);
              }
            })
            .catch((err) => {
              console.log(err, "Interval isRoomAcitive details api error");
            });
        }, 1000);
        console.log(
          id,
          "RNCallKeep.backToForeground RNCallKeep.backToForeground"
        );
        RNCallKeep.displayIncomingCall(id, "", name, handle, true);
        RNCallKeep.backToForeground();
      }
    })
    .catch((err) => {
      ToastMessage(err[0], err[1].data[0], err);
    });

  VoipPushNotification.onVoipNotificationCompleted(id);
});

RNCallKeep.addEventListener("answerCall", (payload) => {
  console.log("answer call RNCallKeep.addEventListener", payload.callUUID);

  global.navigate = true;
  let uId = payload;
  console.log(uId?.callUUID, "d565577757575757", typeof uId);

  clearInterval(global.iosInterval);

  IsRoomActive(uId.callUUID)
    .then(async ({ data }) => {
      const {
        id,
        visitor_name,
        unit_number,
        current_tenant,
        version,
        res_token,
        room_id,
      } = data;
      console.log("RnCall keep activeroom api succes", data);
      global.videoCallProp = {
        data: {
          roomName: id,
          participant: visitor_name,
          enableApprovalBlock: true,
          current_tenant: current_tenant,
          unit_number: unit_number,
          // data: data,
          exit: true,
          ver: version,
          room_id: room_id,
          token: res_token,
        },
      };

      console.log(
        "5678765456765",
        RootNavigation.navigationRef.current?.getCurrentRoute()
      );
      if (
        RootNavigation.navigationRef.current?.getCurrentRoute()?.name ==
        "Splash"
      ) {
        setTimeout(() => {
          acceptCall({
            id: id,
            callerName: visitor_name,
            current_tenant: current_tenant,
            unit_number: unit_number,
            exit: false,
            ver: version,
            token: res_token,
            room_id: room_id,
          });
        }, 4000);
      } else {
        setTimeout(() => {
          acceptCall({
            id: id,
            callerName: visitor_name,
            current_tenant: current_tenant,
            unit_number: unit_number,
            exit: false,
            ver: version,
            token: res_token,
            room_id: room_id,
          });
        }, 1000);
      }
      global.isAlive = false;
    })
    .catch((err) => {
      console.log("RnCall keep activeroom api failure", data);
      ToastMessage(err[0], err[1].data[0], err);
      RNCallKeep.endCall(uId.callUUID);
    });
  global.navigate = false;
  clearInterval(global.iosInterval);
});

RNCallKeep.addEventListener("endCall", (payload) => {
  let uId = payload;
  console.log(uId?.callUUID, "d5655777dd57575757", typeof uId);

  global.navigate = false;
  IsRoomActive(uId.callUUID)
    .then(({ data }) => {
      const { id, version } = data;

      if (version == "v2") {
        VideoCallReceived(id, { status: "busy" }).then((data) => {
          console.log("data", data);
        });
        console.log(id, "end call in onMessage");
      }
      RNCallKeep.endCall(id);
      rejectCall(id, version);
    })
    .catch((err) => {
      ToastMessage(err[0], err[1].data[0], err);
      RNCallKeep.endCall(uId.callUUID);
    });
  clearInterval(global.iosInterval);
});

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log("Message handled in the background!", remoteMessage);
  const {
    data: { type, callerName, id },
  } = remoteMessage;
  // TODO: VOIP Implementation
  global.remoteMessage = remoteMessage;

  global.callStatus = false;
  if (type === "IncomingVideoCall") {
    IsRoomActive(id)
      .then((data) => {
        const { id, res_token, room_id, created_at, status } = data.data;
        global.roomData = data;

        console.log(data, "dwlkwdk");

        console.log(id, callerName, "icccc", Platform.OS);
        if (data.data.status == "created" || data.data.status == "ringing") {
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
        ToastMessage(err[0], err[1].data[0], err);
      });
  } else {
    showFloatingFcm(remoteMessage, false);
  }
});

AppRegistry.registerComponent(appName, () => App);

if (Text.defaultProps == null) {
  Text.defaultProps = {};
  Text.defaultProps.allowFontScaling = false;
}

if (TextInput.defaultProps == null) {
  TextInput.defaultProps = {};
  TextInput.defaultProps.allowFontScaling = false;
}
