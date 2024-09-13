import {
  SET_LOGIN_TYPE,
  LOGIN_INPUT_CHANGE,
  DECREMENT,
  RESEND_OTP_SUCCESS,
  RESEND_OTP_STARTED,
  RESEND_OTP_FAILURE,
  VALIDATION_ERROR_MESSAGE,
  SUBMIT_CONTROL,
  RESET_STATE_LOGIN,
  BLE_TRIGGER,
  VALIDATION_ERROR_RESET,
} from "../actionTypes";
import moment from "moment";

const initialState = {
  login_type: "password",
  username: "",
  apiUsername: "",
  apiNewpass: "",
  apiConfirmpass: "",
  apiOtpToken: "",
  new_pass: "",
  confirm_pass: "",
  otp_token: "",
  seconds: 30,
  enableResend: false,
  submitted: false,
  faqMsg: "",
  errors: {},
  bleIsActive: false,
  token:""
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_LOGIN_TYPE: {
      const { type } = action.payload;
      return {
        ...state,
        loginType: type,
      };
    }
    case LOGIN_INPUT_CHANGE: {
      const { name, value } = action.payload;
      return {
        ...state,
        [name]: value,
      };
    }

    case VALIDATION_ERROR_MESSAGE: {
      const { field, message } = action.payload;
      console.log(field, message, "mmmmmmmmmmmmm");
      return {
        ...state,
        errors: {
          ...state.errors,
          [field]: message,
        },
      };
    }
    case VALIDATION_ERROR_RESET: {
      console.log("reseted kwdndj");
      return {
        ...state,
        errors: {},
      };
    }

    case SUBMIT_CONTROL: {
      const { submitted } = action.payload;
      return {
        ...state,
        submitted: submitted,
      };
    }

    case DECREMENT: {
      let { seconds } = state;
      return {
        ...state,
        seconds: seconds - 1,
      };
    }
    case RESEND_OTP_STARTED: {
      return {
        ...state,
        enableResend: false,
      };
    }

    case RESEND_OTP_SUCCESS: {
      return {
        ...state,
        enableResend: false,
      };
    }

    case RESEND_OTP_FAILURE: {
      const { error } = action.payload;
      return {
        ...state,
        enableResend: false,
        error,
      };
    }
    case BLE_TRIGGER: {
      const { value } = action;
      console.log(value, "ble reducer switch");
      return {
        ...state,
        bleIsActive: value,
      };
    }
    case RESET_STATE_LOGIN: {
      return {
        ...initialState,
      };
    }
    default:
      return state;
  }
}
