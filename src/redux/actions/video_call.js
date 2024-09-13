import React from "react";
import * as RootNavigation from "../../navigation/RootNavigation";
import { CallLog, CallLogs } from "../../api/video_call";
import {
  CALL_LOGS,
  ENTRIES,
  CALL_LOGS_INITIALIZE,
  RESET,
  LOADER,
} from "../actionTypes";
import AsyncStorage from "@react-native-async-storage/async-storage";
export const acceptCall = (roomName, callerName) => {
  console.log("accept call ");
  return (dispatch, getState) => {
    RootNavigation.navigate("ActiveVideoCall", {
      data: {
        roomName: roomName,
        participant: callerName,
        enableApprovalBlock: true,
      },
    });
  };
};

export const rejectCall = (id) => {
  console.log("rehject call");
  return (dispatch, getState) => {
    let params = { gate_open: "declined", status: "busy" };

    gateOpenClose(id, params)
      .then((data) => {})
      .catch((err) => {
        console.log(err, "reject call");
      });
  };
};
export const entries = (total) => {
  return (dispatch) => {
    dispatch({
      type: ENTRIES,
      payload: {
        data: total,
      },
    });
  };
};
export const reset = () => {
  return (dispatch) => {
    dispatch({
      type:RESET,
      
    });
  };
};
export const callLoader = (val) => {
  return (dispatch) => {
    dispatch({
      type: LOADER,
      payload: {
        data: val,
      },
    });
  };
};
export const callLogs = (total_entries, isLoad, initialize) => {
  return async (dispatch) => {
    const localStorage = await AsyncStorage.getItem("user");
    let id = JSON.parse(localStorage).data.current_unit.id;

    isLoad && isLoad(true);

    if (initialize) {
      console.log("ppopewe3re3fwef");
      // dispatch({
      //   type: LOADER,
      //   payload: {
      //     data: true,
      //   },
      // });
      dispatch({
        type: RESET,
      });
    }
    initialize &&
      dispatch({
        type: LOADER,
        payload: {
          data: true,
        },
      });

    console.log(total_entries, "ytuiopwiueytiuwop[owieuwopqiew", initialize);
    CallLogs(initialize ? 1 : total_entries, id)
      .then(({ data, total_entries }) => {
        console.log(data, "call logs", total_entries, data.length);
        if (initialize) {
          dispatch({
            type: CALL_LOGS_INITIALIZE,
            payload: {
              data: data,
            },
          });
        } else {
          dispatch({
            type: CALL_LOGS,
            payload: {
              data: data,
            },
          });
        }
        dispatch({
          type: LOADER,
          payload: {
            data: false,
          },
        });
        isLoad && isLoad(false);
      })
      .catch((err) => {
        console.log(err, "call logs error");
        ToastMessage(err[0], err[1]?.message);
      });
  };
};
