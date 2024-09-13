import {Headless} from '../api';
import makeRequest from '../api';

export function sendOTP({username}) {
  // console.log(username,"username");
  return Headless({
    uri: '/mobile/v1/residents/send_otp',
    method: 'PUT',
    authorization: username,
  });
}
export function resetPasswordOtp() {
  return makeRequest({
    uri: '/mobile/v1/residents/reset_password_otp',
    method: 'PUT',
  });
}

export function verifyOTP({username, params}) {
  return Headless({
    uri: '/mobile/v1/residents/login_with_otp',
    method: 'PUT',
    authorization: username,
    body: JSON.stringify(params),
  });
}
export function verifyReset({username, params}) {
  return makeRequest({
    uri: '/mobile/v1/residents/verify_reset_otp',
    method: 'PUT',
    // authorization: username,
    body: JSON.stringify(params),
  });
}
export function setLoginPASS({username, params}) {
  return makeRequest({
    uri: '/mobile/v1/residents/set_password',
    method: 'PUT',
    body: JSON.stringify(params),
  });
}

export function loginWithPASS({username, params}) {
  // console.log(username,params,"loginwithpass");
  return Headless({
    uri: '/mobile/v1/residents/login',
    method: 'POST',
    authorization: username,
    body: JSON.stringify(params),
  });
}

export function ForgotPASS({username}) {
  return Headless({
    uri: '/mobile/v1/residents/forgot_password',
    method: 'PUT',
    authorization: username,
  });
}

export const setForgotPASS = ({username, params}) => {
  return Headless({
    uri: '/mobile/v1/residents/set_new_password',
    method: 'PUT',
    authorization: username,
    body: JSON.stringify(params),
  });
};

export const verifyForgotOTP = ({username, params}) => {
  return Headless({
    uri: '/mobile/v1/residents/verify_app_otp',
    method: 'PUT',
    authorization: username,
    body: JSON.stringify(params),
  });
};

export const addFCMToken = ({params}) => {
  // console.log(params,"log jhbfjdhewf");
  return makeRequest({
    uri: '/mobile/v1/residents/add_fcm_token',
    method: 'POST',
    body: JSON.stringify(params),
  });
};

export const logOUT = () => {
  return makeRequest({
    uri: '/mobile/v1/residents/logout',
    method: 'PUT',
  });
};
