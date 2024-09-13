import { ToastAndroid, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-simple-toast";

import { ToastMessage } from "../../components";
import * as RootNavigation from "../../navigation/RootNavigation";
import { getProfile } from "../actions/profile";
import { fcmToken } from "../../api/firebase";
import {
  sendOTP,
  verifyOTP,
  setLoginPASS,
  loginWithPASS,
  ForgotPASS,
  setForgotPASS,
  verifyForgotOTP,
  addFCMToken,
  verifyReset,
  resetPasswordOtp,
} from "../../api/login";
import {
  LOGIN_INPUT_CHANGE,
  VALIDATION_ERROR_MESSAGE,
  SUBMIT_CONTROL,
  DECREMENT,
  RESET_STATE_LOGIN,
  BLE_TRIGGER,
  VALIDATION_ERROR_RESET,
} from "../actionTypes";

export const onLoginInputChange = ({ name, value }) => {
  return (dispatch) => {
    dispatch({
      type: LOGIN_INPUT_CHANGE,
      payload: {
        name,
        value,
      },
    });
  };
};

export const formValidation = ({ field, message }) => {
  return (dispatch) => {
    dispatch({
      type: VALIDATION_ERROR_MESSAGE,
      payload: {
        field: field,
        message: message,
      },
    });
  };
};
export const formValidationReset = () => {
  return (dispatch) => {
    dispatch({
      type: VALIDATION_ERROR_RESET,
    });
  };
};

export const sendOtp = () => {
  return (dispatch, getState) => {
    const { username } = getState()["login"];

    dispatch(submitControl({ submitted: true }));
    sendOTP({ username })
      .then((data) => {
        console.log(data, "otpdata");
        ToastMessage(200, data.message);
        setTimeout(() => {
          RootNavigation.navigate("OTPScreen", { flow: "loginFlow" });
          dispatch(submitControl({ submitted: false }));
        }, 1000);
      })
      .catch((err) => {
        console.log(err, "eroor from login otp");
        dispatch(submitControl({ submitted: false }));
        const message = err[1]?.message;
        Platform.OS === "android"
          ? ToastAndroid.show(message, 10)
          : Toast.show(message, 3);
      });
  };
};
export const sendOtpReset = () => {
  return (dispatch, getState) => {
    dispatch(submitControl({ submitted: true }));
    console.log();
    resetPasswordOtp()
      .then((data) => {
        dispatch(submitControl({ submitted: false }));
        dispatch(onLoginInputChange({ name: "token", value: data.token }));

        console.log(
          data.token,
          "status++++++++++++++++++++++++++++++++++++++++++"
        );
        ToastMessage(200, data.message);
      })
      .catch((err) => {
        console.log(err, "eroor from login otp");
        dispatch(submitControl({ submitted: false }));
        const message = err[1]?.message;
        Platform.OS === "android"
          ? ToastAndroid.show(message, 10)
          : Toast.show(message, 3);
      });
  };
};

export const submitControl = ({ submitted }) => {
  console.log(submitted, "subbb");
  return (dispatch) => {
    dispatch({
      type: SUBMIT_CONTROL,
      payload: {
        submitted,
      },
    });
  };
};

export const userLogin = () => {
  return async (dispatch, getState) => {
    const { confirm_pass, username } = getState()["login"];
    let params = { password: confirm_pass };
    console.log(
      "user login called ",
      params
    );
    dispatch(submitControl({ submitted: true }));
    loginWithPASS({ username, params })
      .then(async (data) => {
        console.log(username, params, "user login");
        data.status
          ? (await AsyncStorage.setItem(
              "auth_token",
              JSON.stringify(data.data.auth_token)
            ),
            await AsyncStorage.setItem(
              "password_exists",
              JSON.stringify(data.data.password_exists)
            ),
            await AsyncStorage.getItem("auth_token"),
            ToastMessage(200, data.message || "Login successfully!!!"),
            dispatch(getProfile()),
            dispatch(addFcmToken()),
            setTimeout(() => {
              RootNavigation.navigate("Private");
              dispatch(onLoginInputChange({ name: "otp_token", value: "" })),
                dispatch(onLoginInputChange({ name: "username", value: "" })),
                dispatch(
                  onLoginInputChange({ name: "confirm_pass", value: "" })
                ),
                dispatch(
                  onLoginInputChange({ name: "login_type", value: "otp" })
                ),
                dispatch(submitControl({ submitted: false }));
            }, 500))
          : (dispatch(submitControl({ submitted: false })),
            ToastMessage(200, data.message));
      })
      .catch((err) => {
        dispatch(submitControl({ submitted: false }));
        console.log(err[0],err, "mesaage throe error h", err);
        const message = err[1]?.message;
        ToastMessage(err[0], message);
      });
  };
};

export const setPassword = () => {
  return (dispatch, getState) => {
    const { apiUsername, confirm_pass } = getState()["login"];
    let username = apiUsername;
    let params = { password: confirm_pass };

    dispatch(submitControl({ submitted: true }));
    setLoginPASS({ username, params })
      .then((data) => {
        data.status
          ? (ToastMessage(200, data.message || "Set Password successfully!!!"),
            dispatch(onLoginInputChange({ name: "confirm_pass", value: "" })),
            dispatch(onLoginInputChange({ name: "username", value: "" })),
            dispatch(onLoginInputChange({ name: "new_pass", value: "" })),
            dispatch(addFcmToken()),
            setTimeout(() => {
              RootNavigation.navigate("Private");
              dispatch(submitControl({ submitted: false }));
            }, 500))
          : (dispatch(submitControl({ submitted: false })),
            ToastMessage(200, data.message));
      })
      .catch((err) => {
        dispatch(submitControl({ submitted: false }));
        const message = err[1]?.message;
        Platform.OS === "android"
          ? ToastAndroid.show(message, 10)
          : Toast.show(message, 3);
      });
  };
};

export const setNewPassword = () => {
  return (dispatch, getState) => {
    const { confirm_pass, apiUsername, apiOtpToken } = getState()["login"];
    let username = apiUsername;
    let params = { password: confirm_pass, otp_token: apiOtpToken };

    dispatch(submitControl({ submitted: true }));
    setForgotPASS({ username, params })
      .then((data) => {
        console.log(data, "set new pass");
        data.status
          ? (ToastMessage(200, data.message || "Set Password successfully!!!"),
            AsyncStorage.setItem(
              "password_exists",
              JSON.stringify(data.data.password_exists)
            ),
            AsyncStorage.setItem(
              "auth_token",
              JSON.stringify(data.data.auth_token)
            ),
            dispatch(addFcmToken()),
            setTimeout(() => {
              RootNavigation.navigate("Private");
              dispatch(onLoginInputChange({ name: "confirm_pass", value: "" })),
                dispatch(onLoginInputChange({ name: "new_pass", value: "" })),
                dispatch(onLoginInputChange({ name: "username", value: "" })),
                dispatch(submitControl({ submitted: false }));
            }, 500))
          : (dispatch(submitControl({ submitted: false })),
            ToastMessage(200, data.message));
      })
      .catch((err) => {
        console.log(err, "set new pass");

        dispatch(submitControl({ submitted: false }));
        const message = err[1].data ? err[1].data[0] : err[1]?.message;
        Platform.OS === "android"
          ? ToastAndroid.show(message, 10)
          : Toast.show(message, 3);
      });
  };
};

export const decrement = () => ({
  type: DECREMENT,
});

export const validateOtp = () => {
  return (dispatch, getState) => {
    const { otp_token, apiUsername } = getState()["login"];
    let username = apiUsername;
    let params = { otp_token };

    dispatch(submitControl({ submitted: true }));
    verifyOTP({ username, params })
      .then((data) => {
        console.log(data, "data verify");
        data.status
          ? (AsyncStorage.setItem(
              "auth_token",
              JSON.stringify(data.data.auth_token)
            ),
            AsyncStorage.setItem(
              "password_exists",
              JSON.stringify(data.data.password_exists)
            ),
            ToastMessage(200, data.message),
            dispatch(getProfile()),
            dispatch(addFcmToken()),
            setTimeout(() => {
              RootNavigation.navigate(
                data.data.password_exists ? "Private" : "SetPassword",
                { flow: data.data.password_exists ? "" : "loginFlow" }
              );
              dispatch(onLoginInputChange({ name: "otp_token", value: "" })),
                dispatch(
                  onLoginInputChange({ name: "login_type", value: "otp" })
                ),
                dispatch(submitControl({ submitted: false }));
            }, 1000))
          : (ToastMessage(200, data.message),
            dispatch(submitControl({ submitted: false })));
      })
      .catch((err) => {
        console.log(err, "err in login validate otp");
        dispatch(submitControl({ submitted: false }));
        const message = err[1].data ? err[1].data[0] : err[1]?.message;
        Platform.OS === "android"
          ? ToastAndroid.show(message, 10)
          : Toast.show(message, 3);
      });
  };
};

export const VerifyResetOtp = (token) => {
  return (dispatch, getState) => {
    const { otp_token, apiUsername } = getState()["login"];
    let username = apiUsername;
    let params = { otp_token, token: token };
    console.log(username, params, "akilankialna");
    dispatch(submitControl({ submitted: true }));
    verifyReset({ username, params })
      .then((data) => {
        console.log(data, "data verify");
        data.status
          ? (ToastMessage(200, data.message),
            setTimeout(() => {
              RootNavigation.navigate("SetPassword", { flow: "loginFlow" });
              dispatch(onLoginInputChange({ name: "otp_token", value: "" })),
                // dispatch(
                //   onLoginInputChange({ name: "login_type", value: "otp" })
                // ),
                dispatch(submitControl({ submitted: false }));
            }, 1000))
          : (ToastMessage(200, data.message),
            dispatch(submitControl({ submitted: false })));
      })
      .catch((err) => {
        console.log(err, "err in login validate otp");
        dispatch(submitControl({ submitted: false }));
        const message = err[1].data ? err[1].data[0] : err[1]?.message;
        Platform.OS === "android"
          ? ToastAndroid.show(message, 10)
          : Toast.show(message, 3);
      });
  };
};

export const resendOtp = () => {
  return (dispatch, getState) => {
    const { apiUsername } = getState()["login"];
    let username = apiUsername;

    sendOTP({ username })
      .then((data) => {
        console.log(data, "resenddd");
        ToastMessage(200, data.message || "Resent OTP successfully !!!...");
      })
      .catch((err) => {
        Platform.OS === "android"
          ? ToastAndroid.show(err[1]?.message, 10)
          : Toast.show(err[1]?.message, 3);
      });
  };
};

export const forgotOtp = () => {
  return (dispatch, getState) => {
    RootNavigation.navigate("SetPassword");
  };
};

export const forgotPassword = () => {
  return (dispatch, getState) => {
    RootNavigation.navigate("ForgotPassword");
    dispatch(onLoginInputChange({ name: "login_type", value: "otp" }));
  };
};

export const forgotPassSendOtp = () => {
  return (dispatch, getState) => {
    const { username } = getState()["login"];

    dispatch(submitControl({ submitted: true }));
    ForgotPASS({ username })
      .then((data) => {
        ToastMessage(
          200,
          data.message || "Forgot OTP sent successfully !!!..."
        );
        RootNavigation.navigate("OTPScreen", { flow: "forgotFlow" });
        dispatch(submitControl({ submitted: false }));
      })
      .catch((err) => {
        Platform.OS === "android"
          ? ToastAndroid.show(err[1]?.message, 10)
          : Toast.show(err[1]?.message, 3);
        dispatch(submitControl({ submitted: false }));
      });
  };
};

export const verifyForgotPassOtp = () => {
  return (dispatch, getState) => {
    const { apiUsername, otp_token } = getState()["login"];
    let username = apiUsername;
    let params = { otp_token };

    dispatch(submitControl({ submitted: true }));
    verifyForgotOTP({ username, params })
      .then((data) => {
        console.log(data, "verifyForgotPassOtp");
        data.status
          ? (ToastMessage(200, data.message || " OTP sent successfully !!!..."),
            RootNavigation.navigate("SetPassword", { flow: "forgotFlow" }),
            dispatch(submitControl({ submitted: false })))
          : (ToastMessage(200, data.message),
            dispatch(submitControl({ submitted: false })));
      })
      .catch((err) => {
        console.log(err, "verifyForgotPassOtp");
        dispatch(submitControl({ submitted: false }));
        Platform.OS === "android"
          ? ToastAndroid.show(err[1]?.message, 10)
          : Toast.show(err[1]?.message, 3);
      });
  };
};

export const addFcmToken = (vToken) => {
  return async (dispatch, getState) => {
    const token = await fcmToken();
    const voiptoken = await AsyncStorage.getItem("voip_token");
    console.log(token, "fcm token jdkldlkdjjld", voiptoken);
    const params = {
      token: token,
      apns_token: vToken ? vToken : voiptoken,
    };

    addFCMToken({ params })
      .then((data) => {
        console.log(data, "fcm response");
      })
      .catch((err) => {
        console.log(err, "fcm error");
        Platform.OS === "android"
          ? ToastAndroid.show(err[1]?.message, 10)
          : Toast.show(err[1]?.message, 3);
      });
  };
};

export const bleTriggerAction = (value) => {
  console.log(value, "action ble");
  return (dispatch, getState) => {
    dispatch({
      type: BLE_TRIGGER,
      value: value,
    });
  };
};

export const resetStateLogin = () => {
  return (dispatch, getState) => {
    dispatch({
      type: RESET_STATE_LOGIN,
    });
  };
};
