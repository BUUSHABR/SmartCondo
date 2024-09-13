import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-simple-toast";
import { ToastMessage } from "../../components";

import {
  ON_SUBSCRIBE_NOTICE,
  LIST_SUBSCRIPTION,
  LIST_NOTICE,
  UPDATE_NOTIFICATION,
  STOP_LOADER,
} from "../actionTypes";

import {
  subscriptionList,
  subscribeNotice,
  notificationUpdate,
  notificationList,
  callSettings,
  bleSettings,
} from "../../api/notification";
import { stopLoader } from "./registration";
import { listUnits } from "./switch_unit";
import { addFcmToken } from "./login";

export const onSubscribeNotice = (id, value, fcm, sms) => {
  return (dispatch) => {
    dispatch({
      type: ON_SUBSCRIBE_NOTICE,
      payload: {
        id,
        value,
      },
    });
    let params = {
      sms: sms,
      fcm: fcm,
    };

    subscribeNotice({ id, params })
      .then((data) => {
        console.log(data, "subcribeee");
        // dispatch(listSubscription());
        ToastMessage(200, data.message);
      })
      .catch((err) => {
        ToastMessage(err[0], err[1].messsage);
        console.log(err, "errrrrrrrrrrr");
      });
  };
};

export const listSubscription = () => {
  console.log("listttt");
  return async (dispatch, getState) => {
    subscriptionList()
      .then((data) => {
        console.log(data, "list subscrinbbeeee");
        dispatch({
          type: LIST_SUBSCRIPTION,
          payload: {
            data,
          },
        });
      })
      .catch((err) => {
        console.log(err, "list api");

        ToastMessage(err[0], err[1].messsage);
      });
  };
};
export const callsettings =  (option, video_call) => {
  console.log("listttt", video_call);
  return async (dispatch, getState) => {
    let a = await AsyncStorage.getItem("user");
    let data = JSON.parse(a);
    console.log(data.data.current_unit.id, "ednjenjfe");
    callSettings(data.data.current_unit.id, { video_call: video_call })
      .then((data) => {
        console.log("Testing call setted",data);
        // dispatch(addFcmToken());
      })
      .catch((err) => {
        console.log(err, "list api");

        ToastMessage(err[0], err[1].messsage);
      });
  };
};
export const blesettings = (ble) => {
  console.log("listtxwlkwdtt", ble);
  return async (dispatch, getState) => {
    let a = await AsyncStorage.getItem("user");
    let data = JSON.parse(a);
    console.log(data.data.current_unit.id, "ednjenjfe");
    bleSettings(data.data.current_unit.id, { enable_ble: ble })
      .then((data) => {
        console.log(data, "dohdd jdiwdwdj dwidwd iwdwbdwijdnwjnwjnd");
      })
      .catch((err) => {
        console.log(err, "list api");

        ToastMessage(err[0], err[1].messsage);
      });
  };
};

export const listNotification = () => {
  return (dispatch) => {
    notificationList()
      .then((data) => {
        console.log(data, "list notiification");
        dispatch(stopLoader(false));

        dispatch({
          type: LIST_NOTICE,
          payload: {
            data,
          },
        });
        dispatch(listUnits());
      })
      .catch((err) => {
        console.log(err, "error");
        dispatch(stopLoader(false));

        ToastMessage(err[0], err[1]?.message);
      });
  };
};

export const updateNotification = (method, id, params) => {
  console.log(method, id, "actionss");
  return (dispatch, getState) => {
    // const {status}=getState().notification.
    notificationUpdate({ method, id, params })
      .then((data) => {
        console.log(data, "updte notification  ");
        // listNotification();

        dispatch({
          type: UPDATE_NOTIFICATION,
          payload: {
            method,
            id,
            params,
          },
        });
        dispatch(listNotification());
      })
      .catch((err) => {
        ToastMessage(err[0], err[1]?.message);

        console.log(err, "error");
      });
  };
};
