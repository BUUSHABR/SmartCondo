import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BluetoothStatus } from "react-native-bluetooth-status";

import {
  SET_THEME,
  SET_USER,
  SET_BLE,
  PROFILE_INPUT_CHANGE,
  DOCUMENT_FOLDER,
  USER_IMAGE,
  RESET_STATE_PROFILE,
} from "../actionTypes";
import {
  fetchProfile,
  folderList,
  updateProfile,
  documentList,
} from "../../api/profile";
import * as RootNavigation from "../../navigation/RootNavigation";
import { bleTriggerAction, resetStateLogin, submitControl } from "./login";

import { logOUT } from "../../api/login";
import { bugReport, deviceInfo } from "../../api/profile";
import { removeAccess } from "../../helpers";
import { ToastMessage } from "../../components";
import { fetchUser } from "../../navigation/localStorage";
import { resetState } from "../actions/home";
import { FeedbackSuccess } from "../../../assets/img/svgs";
import { deviceDetails } from "../../helpers/deviceSupport";
import { facilityReset } from "./facility_booking";
import { inviteReset } from "./invite";
import { serialize } from "object-to-formdata";
import { listUnits } from "./switch_unit";
import { communityReset } from "./community";
import LocationSwitch from "react-native-location-switch";

export const setTheme = (theme) => {
  return (dispatch) => {
    dispatch({
      type: SET_THEME,
      payload: {
        theme,
      },
    });
  };
};
// export const loader = (name,value) => {
//   return (dispatch) => {
//     dispatch({
//       type: DOCUMENT_FOLDER,
//       payload: {
//         name,
//         value
//       },
//     });
//   };
// };

export const setUser = (data) => {
  console.log(data, "user actions");
  return async (dispatch) => {
    dispatch({
      type: SET_USER,
      payload: {
        data,
      },
    });
    // await AsyncStorage.setItem("user", JSON.stringify(data));
  };
};

export const getProfile = (decide) => {
  console.log("get profileee");
  return async (dispatch) => {
    fetchProfile()
      .then(async (data) => {
        console.log(" Testing ProfileFetched",data);
        dispatch({
          type: SET_USER,
          payload: {
            data: data.data,
          },
        });
        dispatch(bleTriggerAction(data.data.current_unit.ble));
        if (data.data.profile_image) {
          let data1 = data.data.profile_image;

          dispatch({
            type: USER_IMAGE,
            payload: {
              name: "user_image",
              data: data1,
            },
          });
          decide && dispatch(decide());
          // console.log(data1, "akilanananilan");
        }

      
        await AsyncStorage.setItem("user", JSON.stringify(data));

        const user = await AsyncStorage.getItem("user");
        console.log("after set data", user);
      })
      .catch((err) => {
        console.log(err, "errrr profile");
        console.log("popl",err);
        ToastMessage(err[0], err[1]?.message, err);
      });
  };
};

export const profileSubmit = (decide, resetmodal, getProfile) => {
  return (dispatch, getState) => {
    const {
      name,
      phone,
      dob,
      email,
      current_unit,
      gender,
      identity_id,
      fin_number,
      units,
      profile_image,
    } = getState()["profile"]["userData"];
    console.log(profile_image, "oijcwoijcowcjwijcwjiwjv");
    console.log(getState()["profile"]["userData"], "kijdwijiwjfijfijfiejf");
    let formData;
    if (profile_image?.path) {
      console.log("dlkdnwffrwfwf");
      let params = {
        residents: {
          name,
          phone,
          gender: gender,
          image: {
            uri: profile_image.path,
            type: profile_image.mime,
            name: "image.jpg",
          },
        },
      };
      formData = serialize(params);
    } else {
      let params = {
        residents: {
          name,
          phone,
          gender: gender,
        },
      };
      formData = params;
    }

    dispatch(submitControl({ submitted: true }));
    console.log(formData, "dataatattatda");
    updateProfile(formData, profile_image?.path ? true : false)
      .then(async (data) => {
        console.log(data.data.profile_image, "dddleieewcbnej");
        !decide && dispatch(setUser());
        await AsyncStorage.setItem("user", JSON.stringify(data));
        console.log(data.data.profile_image, "dddbnej");

        ToastMessage(200, data.message);
        let data1 = data.data.profile_image;
        let indexes;
        if (data1) {
          // indexes = data1.length != 0 ? data1.length - 1 : 0;
          console.log(data1, "akilanananefefefdakilan");
          dispatch({
            type: USER_IMAGE,
            payload: {
              name: "user_image",
              data: data1,
            },
          });
        }
        // decide && getProfile();
        setTimeout(() => {
          // decide && resetmodal();
          // decide && getProfile();
          // decide && dispatch(listUnits());
          !decide && RootNavigation.goBack();
          dispatch(submitControl({ submitted: false }));
        }, 0);
      })
      .catch((err) => {
        dispatch(submitControl({ submitted: false }));
        const message = err[1].data ? err[1].data[0] : err[1]?.message;
        ToastMessage(err[0], message, err);
      });
  };
};

export const setBle = () => {
  return async (dispatch) => {
    let location_state;
    const bluetooth_state = await BluetoothStatus.state();
    LocationSwitch.isLocationEnabled(
      () => {
        location_state = true;
      },
      () => {
        location_state = false;
      }
    );

    dispatch({
      type: SET_BLE,
      payload: {
        bluetooth_state,
        location_state,
      },
    });
  };
};

export const logoutUser = () => {
  return (dispatch) => {
    console.log("logout userrr");

    logOUT()
      .then(async (data) => {
        console.log(data, "logout succ data");
        removeAccess();
        await dispatch(setUser({}));
        await dispatch(resetState());
        await dispatch(facilityReset());
        await dispatch(inviteReset());
        await dispatch(resetStateProfile());
        await dispatch(communityReset());
        await dispatch(resetStateLogin());

        RootNavigation.navigate("LoginScreen");
        // await ReactNativeBleAdvertiser.stopBroadcast();
      })
      .catch((err) => {
        console.log(err, "logout");
        removeAccess();
        dispatch(setUser({}));
        dispatch(resetState());
        dispatch(facilityReset());
        dispatch(inviteReset());
        dispatch(resetStateProfile());
        dispatch(communityReset());
        dispatch(resetStateLogin());
        RootNavigation.navigate("LoginScreen");
      });
  };
};

export const onProfileInputChange = ({ name, value }) => {
  console.log(name, value, "asyn qr");
  return (dispatch) => {
    dispatch({
      type: PROFILE_INPUT_CHANGE,
      payload: {
        name,
        value,
      },
    });
  };
};

export const unChangeUser = () => {
  return async (dispatch) => {
    const data = await fetchUser();
    dispatch({
      type: SET_USER,
      payload: {
        data,
      },
    });
  };
};
export const userImage = (data) => {
  return async (dispatch) => {
    dispatch({
      type: DOCUMENT_FOLDER,
      payload: {
        name: "userimage",
        value: data,
      },
    });
  };
};
export const user_Image = (data) => {
  return async (dispatch) => {
    dispatch({
      type: USER_IMAGE,
      payload: {
        name: "userimage",
        value: data,
      },
    });
  };
};
export const faqSubmit = () => {
  return (dispatch, getState) => {
    const { faqMsg } = getState()["login"];
    dispatch(submitControl({ submitted: true }));
    let params = { message: faqMsg };
    bugReport(params)
      .then(() => {
        RootNavigation.navigate("SuccessPage", {
          title: `Thanks for reaching out`,
          message: `We will take the necessary actions as soon as possible`,
          image: <FeedbackSuccess />,
          navigateTo: "ProfileScreen",
        });
        dispatch(submitControl({ submitted: false }));
      })
      .catch((err) => {
        dispatch(submitControl({ submitted: false }));
        const message = err[1].data ? err[1].data[0] : err[1]?.message;
        ToastMessage(200, message, err);
      });
  };
};

export const submitDeviceInfo = () => {
  return async (dispatch) => {
    let info = await deviceDetails();
    console.log(info, "info++++++++++++++++");
    let params = {
      device_detail: {
        app_version: info.appVersion,
        brand: info.Manufacturer,
        model: info.Model,
        sdk_version: info["Android Version"],
      },
    };
    dispatch(submitControl({ submitted: true }));
    console.log(params, "indoooo");

    deviceInfo(params)
      .then((data) => {
        console.log("data", data);
        RootNavigation.navigate("SuccessPage", {
          title: `Thankyou for sending your \n device info`,
          message: `         `,
          image: <FeedbackSuccess />,
          navigateTo: "BlePermitScreen",
        });
        dispatch(submitControl({ submitted: false }));
      })
      .catch((err) => {
        dispatch(submitControl({ submitted: false }));
        const message = err[1].data ? err[1].data[0] : err[1]?.message;
        ToastMessage(err[0], message, err);
      });
  };
};

export const FolderList = () => {
  return (dispatch, getState) => {
    folderList()
      .then(({ data }) => {
        dispatch({
          type: DOCUMENT_FOLDER,
          payload: {
            name: "folderList",
            value: data,
          },
        });
        dispatch({
          type: DOCUMENT_FOLDER,
          payload: {
            name: "documentloader",
            value: false,
          },
        });
      })
      .catch((err) => {
        const message = err[1].data ? err[1].data[0] : err[1]?.message;
        ToastMessage(200, message, err);
      });
  };
};

export const DocumentList = (id) => {
  return (dispatch, getState) => {
    documentList(id)
      .then(({ data }) => {
        console.log(data, "duydwdnwhfsuyhj");
        dispatch({
          type: DOCUMENT_FOLDER,
          payload: {
            name: "documentList",
            value: data.document,
          },
        });
        dispatch({
          type: DOCUMENT_FOLDER,
          payload: {
            name: "listLoader",
            value: false,
          },
        });
        RootNavigation.navigate("DocumentView");
      })
      .catch((err) => {
        const message = err[1].data ? err[1].data[0] : err[1]?.message;
        ToastMessage(200, message, err);
      });
  };
};

export const resetStateProfile = () => {
  return (dispatch, getState) => {
    dispatch({
      type: RESET_STATE_PROFILE,
    });
  };
};
