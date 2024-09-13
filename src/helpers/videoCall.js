import remoteConfig from "@react-native-firebase/remote-config";

import * as RootNavigation from "../navigation/RootNavigation";
import { VideoCallReceived, gateOpenClose } from "../api/video_call";
import { checkBothPermissions, headers } from "../helpers";
import RNCallKeep from "react-native-callkeep";
import SimpleToast from "react-native-simple-toast";
import { Platform } from "react-native";

export const acceptCall = async ({
  id,
  callerName,
  current_tenant,
  unit_number,
  // data,
  exit,
  ver,
  room_id,
  token,
}) => {
  console.log("global.isHavepermission cccept call before");

  const areBothPermissionsGranted = await checkBothPermissions();
  console.log("global.isHavepermission cccept call", areBothPermissionsGranted);

  if (areBothPermissionsGranted || Platform.OS == "android") {
    RootNavigation.navigate("ActiveVideoCall", {
      data: {
        roomName: id,
        participant: callerName,
        enableApprovalBlock: true,
        current_tenant: current_tenant,
        unit_number: unit_number,
        // data: data,
        exit: exit,
        ver: ver,
        room_id: room_id,
        token: token,
      },
    });
  } else {
    SimpleToast.show("Please turn on camera and microphone permission", 3);
    RNCallKeep.endAllCalls();
  }
};

export const rejectCall = (id, ver) => {
  let params = "";
  if (ver == "v2") {
    params = { status: "busy" };
  } else {
    params = { gate_open: "declined", status: "busy" };
  }
  console.log("reject calllllll", params);
  gateOpenClose(id, params, ver)
    .then((data) => {
      RootNavigation.navigate("BottomTab");
    })
    .catch((err) => {
      console.log(err, "err in reject call");
    });
};

export const callRejectInBackground = async (id, ver) => {
  console.log("remotconfog api rejection");
  let params = "";
  if (ver == "v2") {
    params = { status: "busy" };
  } else {
    params = { gate_open: "declined", status: "busy" };
  }
  console.log("reject calllllll background ", params);
  gateOpenClose(id, params, ver)
    .then((data) => {
      console.log(data, "data");
    })
    .catch((err) => {
      console.log(err, err);
    });
};
