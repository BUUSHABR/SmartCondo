import * as RootNavigation from "../../navigation/RootNavigation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { ToastMessage } from "../../components";
import { Platform, ToastAndroid } from "react-native";
import Toast from "react-native-simple-toast";

import { SWITCH_UNIT, LIST_UNITS, RESET } from "../actionTypes";
import { switchUNIT, listUNIT } from "../../api/switch_unit";
import { getProfile } from "../actions/profile";
import { useEffect } from "react";
import { listHomeFunction } from "./home";


export const listUnits = () => {

  console.log("list tent actions");
  return (dispatch) => {
    listUNIT()
      .then((data) => {
        console.log(data, "listbuniytjdhsdhdbkbenef");
        dispatch({
          type: LIST_UNITS,
          payload: {
            data: data?.data,
          },
        });
        dispatch({
          type: SWITCH_UNIT,
          payload: {
            name: "SwitchShow",
            value: true,
          },
        });
      })
      .catch((err) => {
        console.log(err, "klckckc");
        ToastMessage(err[0], err[1]?.message);
      });
  };
};
export const switchActive = () => {

  console.log("list tent actiondkkdkkds");
  return (dispatch) => {
    dispatch({
      type: SWITCH_UNIT,
      payload: {
        name: "SwitchShow",
        value: false,
      },
    });
  };
};
export const switchUnit = (name, value, id, trigger, notification,navigation) => {

  console.log(name, value, id, notification, "nnnnnsssiissssddd");

  return (dispatch) => {
    dispatch({
      type: SWITCH_UNIT,
      payload: {
        name,
        value,
      },
    });
    let params = { unit_id: id };
    name === "switch_id" &&
      switchUNIT(params)
        .then(async (data) => {
          console.log("dataljwndwdkwdnjwwd", data);
          dispatch({
            type: RESET
          })
          await AsyncStorage.removeItem("auth_token");
          let res = data.data.auth_token;
          await AsyncStorage.setItem("auth_token", JSON.stringify(res));
          setTimeout(() => {
            dispatch({
              type: SWITCH_UNIT,
              payload: {
                name: "switchLoader",
                value: false,
              },
            });
            if(trigger && notification){
              if(notification?.type=="Announcement"){
            
                navigation && navigation.replace("AnnouncementDetail", { data:notification })
              }else{
                RootNavigation.navigate("Home",{triggerSwitch:false})}
            } 
            if(trigger && !notification){
                trigger && RootNavigation.goBack();
            }
       
          }, 4000);
          dispatch(getProfile(listUnits));
          // dispatch(listUnits());
        })
        .catch((err) => {
          console.log(err, "switch uunit");
          setTimeout(() => {
            dispatch({
              type: SWITCH_UNIT,
              payload: {
                name: "switchLoader",
                value: false,
              },
            });
            trigger && RootNavigation.goBack();
          }, 4000);
          const message = err[1]?.message;
          Platform.OS === "android"
            ? ToastAndroid.show(message, 10)
            : Toast.show(message, 3);
        });
  };
};
