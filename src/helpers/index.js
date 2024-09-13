import React from "react";
import Store from "../redux/store";
import {
  BackHandler,
  Dimensions,
  StatusBar,
  TouchableOpacity,
  Text,
  Platform,
  Linking,
} from "react-native";
import moment from "moment";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ReactNativeBleAdvertiser from "@teamdotworld/rn-ble-advertiser";
import { SvgXml } from "react-native-svg";
import 'moment-timezone';

import ComplaintIcon from "../../assets/img/complaint.svg";
import InviteIcon from "../../assets/img/handshake.svg";
import FormRegisterIcon from "../../assets/img/registration.svg";
import VisitorIcon from "../../assets/img/visitor.svg";
import SOSPolice from "../../assets/img/home/police.svg";
import SOSSecurity from "../../assets/img/home/security.svg";
import SOSAmbulance from "../../assets/img/home/ambulance.svg";
import SOSConcierge from "../../assets/img/home/concierge.svg";
import SOSCallSupport from "../../assets/img/home/CallSupport.svg"

import SOSFire from "../../assets/img/home/fire.svg";
import InviteFeatureIcon from "../../assets/img/home/invite_feature";
import ComplaintFeatureIcon from "../../assets/img/home/complaint_feature";

import * as RootNavigation from "../navigation/RootNavigation";
import { showMessage, hideMessage } from "react-native-flash-message";
import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
  requestMultiple,
} from "react-native-permissions";

import {
  VisitsGuestIcon,
  VisitsContractorIcon,
  VisitsDeliveryIcon,
  VisitsPickupIcon,
  DataCorrectionIcon,
  MaintenanceIcon,
  ElectricalIcon,
  PlumbingIcon,
  SuggestionIcon,
  OtherIcon,
  GeneralIcon,
  NameIcon1,
  PhoneIcon1,
  MessengerIcon,
  CountIcon,
  CalendarIcon,
  EntryModeIcon,
  NumberPlateIcon,
  StatusIcon,
  VehicleTypeIcon,
  VehicleNumberIcon,
  GenderIconSmall,
  MessageBox,
  MessageIconAdd,
  TypeIconSmall,
  MessageBoxSmall,
  Note,
  NoteIconSmall,
  InviteContractorIcon,
  InviteGuestIcon,
  InviteDeliveryIcon,
  InvitePickupIcon,
  ClockIcon,
  BookingHallIcon,
  BookingGymIcon,
  BookingTennisIcon,
  BookingIcon,
  BookingsIcon,
  CompanyIconDT,
  DocumentFeatureIcon,
  RightSwitchArrow,
} from "../../assets/img/svgs";
import TennisIcon from "../../assets/img/facility/tennis.svg";
import FunctionHallIcon from "../../assets/img/facility/hall.svg";
import BasketBallIcon from "../../assets/img/facility/basketball.svg";
import GymRoomIcon from "../../assets/img/facility/gym.svg";
import GolfIcon from "../../assets/img/facility/golf.svg";

import { themes, commonColors } from "../themes";
import FacilityFeatureIcon from "../../assets/img/home/facility_feature.svg";
import { fetchUser } from "../navigation/localStorage";
import dings from "../../assets/tones/ringtone.mp3";
import commonStyles from "../styles/commonStyles";
import VersionInfo from "react-native-version-info";
import { deviceDetails } from "./deviceSupport";
import FastImage from "react-native-fast-image";
import { ms } from "./scaling";
import { Share } from "react-native";
export const FastImg = FastImage;
export const requestCameraPermission = async () => {
  try {
    const cameraPermission =
      Platform.OS === "android"
        ? PERMISSIONS.ANDROID.CAMERA
        : PERMISSIONS.IOS.CAMERA;

    const result = await request(cameraPermission);
    if (result === RESULTS.GRANTED) {
      console.log("Camera permission granted");
    } else {
      console.log("Camera permission denied");
    }
  } catch (error) {
    console.error("Error requesting camera permission:", error);
  }
};

export const requestMultiplePermissions = async () => {
  try {
    const cameraResult = await requestMultiple([
      PERMISSIONS.IOS.CAMERA,
      PERMISSIONS.ANDROID.CAMERA,
    ]);

    const microphoneResult = await requestMultiple([
      PERMISSIONS.IOS.MICROPHONE,
      PERMISSIONS.ANDROID.RECORD_AUDIO,
    ]);

    if (
      cameraResult[PERMISSIONS.IOS.CAMERA] === RESULTS.GRANTED ||
      cameraResult[PERMISSIONS.ANDROID.CAMERA] === RESULTS.GRANTED
    ) {
      console.log("Camera permission granted");
    } else {
      console.log("Camera permission denied");
    }

    if (
      microphoneResult[PERMISSIONS.IOS.MICROPHONE] === RESULTS.GRANTED ||
      microphoneResult[PERMISSIONS.ANDROID.RECORD_AUDIO] === RESULTS.GRANTED
    ) {
      console.log("Microphone permission granted");
    } else {
      console.log("Microphone permission denied");
    }
  } catch (error) {
    console.error("Error requesting permissions:", error);
  }
};

export const requestMicrophonePermission = async () => {
  try {
    const microphonePermission =
      Platform.OS === "android"
        ? PERMISSIONS.ANDROID.RECORD_AUDIO
        : PERMISSIONS.IOS.MICROPHONE;
    const result = await request(microphonePermission);
    if (result === RESULTS.GRANTED) {
      console.log("Microphone permission granted");
    } else {
      console.log("Microphone permission denied");
    }
  } catch (error) {
    console.error("Error requesting microphone permission:", error);
  }
};
export const checkBothPermissions = async () => {
  const cameraPermission =
    Platform.OS === "android"
      ? PERMISSIONS.ANDROID.CAMERA
      : PERMISSIONS.IOS.CAMERA;

  const microphonePermission =
    Platform.OS === "android"
      ? PERMISSIONS.ANDROID.RECORD_AUDIO
      : PERMISSIONS.IOS.MICROPHONE;

  const cameraStatus = await check(cameraPermission);
  const microphoneStatus = await check(microphonePermission);

  return (
    cameraStatus === RESULTS.GRANTED && microphoneStatus === RESULTS.GRANTED
  );
};
export const permissioncheck = async () => {
  console.log("permissionCheck helper");
  const areBothPermissionsGranted = await checkBothPermissions();
  global.isHavepermission = areBothPermissionsGranted;
};

export const openAppSettings = () => {
  if (Platform.OS === "ios") {
    console.log("[openAppSettings] IOS");
    Linking.openURL("app-settings:");
  } else {
    console.log("[openAppSettings] Android");
    Linking.openSettings();
  }
};
var Sound = require("react-native-sound");
export const titleize = (str) => {
  if (!str) {
    return str;
  }
  return str
    .split(" ")
    ?.map(function (string) {
      return string?.charAt(0).toUpperCase() + string.slice(1);
    })
    .join(" ")
    .split("_")
    ?.map(function (string) {
      return string?.charAt(0).toUpperCase() + string.slice(1);
    })
    .join(" ");
};
export const featureShowcase = [
  // {
  //   order:3,
  //   name:"invite",
  //   content:"invite guest ,contractor , delivery hjbxjkbxkxkxe"

  // },
  // {
  //   order:5,
  //   name:"complaints",
  //   content:"raise your complanits kjjhbkebxkelxelxc"

  // },
  {
    order: 3,
    name: "facility_booking",
    content: "book your facilitylknldncldwcnldwc",
  },
];
export const detectTheme = () => {
  return Store.getState().profile.mode;
};

export const windowSize = Dimensions.get("window");
export const screenSize = Dimensions.get("screen");

export const phoneREGEX = /^[0-9]{8,10}$/;
export const nameREGEX = /^[a-zA-Z ]{2,30}$/;
export const dateREGEX = /^((0?[1-9]|1[012])[- /.](0?[1-9]|[12][0-9]|3[01])[- /.](19|20)?[0-9]{2})*$/;
export const usernameREGEX = /^[0-9]{8,10}$/ || /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const numberOnlyRegex = (string) =>
  [...string].every((c) => "0123456789".includes(c));

export const mailOnlyREGEX = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
// export const mailOnlyREGEX = '/^w+([.-]?w+)*@w+([.-]?w+)*(.w{2,3})+$/';
export const numberOnlyRegex1 = /\D/;
export const passwordValidation = (string) => {
  let message = "";
  if (string.length < 3) {
    message = "Password should be requires atleast 3 char";
  }
  return message;
};

export const passConfirmValidation = (str1, str2) => {
  let message = "";
  if (str1.length === 0) {
    message = "This is mandatory";
    return message;
  } else if (str2 && str2.length === 0) {
    message = "This is mandatory";
    return message;
  } else if (str1 && str2) {
    message = str1 === str2 && str2.length > 3 ? "" : false;
    return message;
  } else {
    message = "Password doesn't match";
    return message;
  }
};

export const usernameValidation = (string, type) => {
  let message = "";

  if (!string) {
    message = "This field is mandatory";
  } else if (numberOnlyRegex(string)) {
    if (string.length < 8) {
      message = "Mobile number should be min of 8 char";
      return message;
    }
    if (string.length > 10) {
      message = "Mobile number should be max of 10 char";
      return message;
    }
  } else if (!string.match(mailOnlyREGEX)) {
    message = "Please enter a valid mail";
  }

  return message;
};

export const handleBackButton = () => {
  BackHandler.exitApp();
  return true;
};
// Device-Brand
// Device-Os
export const headers = async () => {
  let token = await AsyncStorage.getItem("auth_token");
  let deviceInfo = await deviceDetails();
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: JSON.parse(token),
    "Request-Source": Platform.OS,
    "X-App-Version": deviceInfo.appVersion,
    "Device-Brand": deviceInfo.Model,
    "Device-Os": deviceInfo["Android Version"],
    "ngrok-skip-browser-warning": "true"
  };
};

export const jsonHeaders = async () => {
  let deviceInfo = await deviceDetails();

  return {
    Accept: "application/json",
    "Content-type": "application/json",
    "Request-Source": Platform.OS,
    "X-App-Version": deviceInfo.appVersion,
  };
};

// export const timeAgo = time => {
//   console.log(time, 'tiiiiiiiiiiii');
//   moment.updateLocale('en', {
//     relativeTime: {
//       past: '%s',
//       s: number => number + 's',
//       ss: '%ds',
//       m: '1m',
//       mm: '%dm',
//       h: '1h',
//       hh: '%dh',
//       d: '1d ',
//       dd: '%dd',
//       M: '1 mon',
//       MM: '%d mon',
//       y: 'a y',
//       yy: '%d y',
//     },
//   });

//   let secondsElapsed = moment().diff(time, 'seconds');
//   let dayStart = moment(time)
//     .startOf('day')
//     .seconds(secondsElapsed);
//   let date;

//   if (secondsElapsed > 300) {
//     console.log('>3000000');
//     date = moment(time).fromNow(true);
//   } else if (secondsElapsed < 60) {
//     date = dayStart.format('s') + 's';
//     console.log('<6000000');
//   } else {
//     date = dayStart.format('m') + 'min';
//     console.log(date, secondsElapsed, dayStart.format('m'), 'minnnnnnnnnn');
//   }
//   console.log(date, 'datttteee');
//   return date;
// };

export const slotEnableChecker = (open_time, from, to, close_time) => {
  // console.log(start_date.value, "value data");
  console.log(open_time, from, "timimg");
  var time1 = open_time;
  var time2 = from;
  console.log(typeof open_time, open_time);
  console.log(typeof from, from);

  const date1 = new Date("2022-01-01T11:00:00Z");
  const date2 = new Date("2022-01-01T" + time2 + "Z");

  console.log(date1, "data 1111");
  console.log(date2, "data 2");
  if (date1.getTime() === date2.getTime()) {
    console.log("Both times are equal");
    return true;
  } else if (date1.getTime() > date2.getTime()) {
    console.log(time1 + " is more recent than " + time2);
    return true;
  } else {
    console.log(time1 + " is less recent than " + time2);
    return false;
  }
};

export function customTimeFunction(startTime, endTime = new Date()) {
  if (!startTime || !endTime) return "-";
  if (moment(endTime).diff(moment(startTime), "days") <= 7)
    if (
      moment.duration(moment(endTime).diff(moment(startTime))).humanize() ==
      "8 days"
    ) {
      return moment(startTime).format("MMM DD YYYY");
    } else {
      return (
        moment.duration(moment(endTime).diff(moment(startTime))).humanize() +
        " ago"
      );
    }
  else return moment(startTime).format("MMM DD YYYY");
}
export const customTimeFunction1 = (date) => {
  if (typeof date !== "object") {
    date = new Date(date);
  }

  var seconds = Math.floor((new Date() - date) / 1000);
  var intervalType;

  var interval = Math.floor(seconds / 31536000);
  if (interval >= 1) {
    intervalType = moment(date).format("ll");
  } else {
    interval = Math.floor(seconds / 2592000);
    if (interval == 1) {
      intervalType = "a month ago";
    } else if (interval >= 2) {
      intervalType = moment(date).format("MMM DD");
    } else {
      interval = Math.floor(seconds / 604800);
      if (interval == 1) {
        intervalType = "a week ago";
      } else if (interval >= 2) {
        intervalType = moment(date).format("MMM DD");
      } else {
        interval = Math.floor(seconds / 86400);
        if (interval >= 1) {
          intervalType = "a day ago";
        } else if (interval > 7) {
          // intervalType = moment(date).format('MMM DD');
          intervalType = "a week ago";
        } else {
          interval = Math.floor(seconds / 3600);
          if (interval < 2) {
            intervalType = "an hour ago";
          } else if (interval > 1 && interval < 11) {
            intervalType = "hour";
          } else {
            interval = Math.floor(seconds / 60);
            if (interval > 5) {
              intervalType = "min";
            } else {
              interval = seconds;
              intervalType = "Just now";
            }
          }
        }
      }
    }
  }

  if (interval > 1 || interval === 0) {
    if (interval === "seconds") {
      intervalType += "s ago";
      return interval + " " + intervalType;
    }
    if (intervalType === "hour") {
      intervalType += "s ago";
      return interval + " " + intervalType;
    }
    if (intervalType === "min") {
      intervalType += "s ago";
      return interval + " " + intervalType;
    } else {
      return intervalType;
    }
  }
  return intervalType;
};

export function timeAgo(date) {
  if (typeof date !== "object") {
    date = new Date(date);
  }

  var seconds = Math.floor((new Date() - date) / 1000);
  var intervalType;
  console.log(seconds, "seconds");

  var interval = Math.floor(seconds / 31536000);
  if (interval >= 1) {
    intervalType = moment(date).format("ll");
  } else {
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) {
      intervalType = moment(date).format("MMM MM");
    } else {
      interval = Math.floor(seconds / 86400);
      if (interval >= 1) {
        intervalType = moment(date).format("ddd");
      } else {
        interval = Math.floor(seconds / 3600);
        if (interval >= 1) {
          console.log(interval, "intervallllll");
          intervalType = "hour";
        } else {
          interval = Math.floor(seconds / 60);
          if (interval >= 1) {
            intervalType = "min";
          } else {
            interval = seconds;
            intervalType = "Just now";
          }
        }
      }
    }
  }

  if (interval > 1 || interval === 0) {
    if (interval === "seconds") {
      intervalType += "s";
      return interval + " " + intervalType;
    }
    if (intervalType === "hour") {
      intervalType += "s";
      return interval + " " + intervalType;
    }
    if (intervalType === "min") {
      intervalType += "s";
      return interval + " " + intervalType;
    } else {
      return intervalType;
    }
  }
  return intervalType;
}

export const timeDiff = (t1, t2, format) => {
  let time1 = moment(t1).format();
  let time2 = moment(t2).format();
  let duration = moment(time2).diff(time1, format);
  console.log(duration, "tiiit22");
  if (duration < 2) {
    return `${duration}  ${format.substring(0, format.length - 1)}`;
  } else {
    console.log("elsee  uration");
    return `${duration}  ${format}`;
  }
};

export const joinDateTime = (date, time) => {
  console.log(date, time, "dtate join");
  return moment(date + " " + time, "DD/MM/YYYY hh:mm a").format();
};

export const NotificationIcon = (type) => {
  return (
    (type === "Visit" && <VisitorIcon />) ||
    (type === "HelpDesk" && <ComplaintIcon />) ||
    (type === "Announcement" && <InviteIcon />) ||
    (type === "Registration" && <FormRegisterIcon />) ||
    (type === "Booking" && <BookingsIcon />) ||
    (type === "Invite" && <InviteIcon />) ||
    (type === "others" && <OtherIcon />)
    // (type==="Bookings"&&)
  );
};

export const capitalizeTwoLetter = (string) => {
  let names = string.split(" ");

  let initials = names[0].substring(0, 1).toUpperCase();

  if (names.length > 1) {
    initials += names[names.length - 1].substring(0, 1).toUpperCase();
  }
  return initials;
};

export const tailedString = (str, num, smiley) => {
  let tail = "";
  // console.log(str,"str333333333333333333333333333333333333333333333333333333333333333333");
  if (str?.length > 0) {
    tail = str && str.length > num ? str.substring(0, num) + "..." : str;
  } else {
    tail = "-";
  }
  return tail;
};

export const tailedName = () => { };

export const handleBackPage = (type) => {
  console.log("handleBackkk");
  let route = "NotificationList";
  switch (type) {
    case "Visitor":
      route = "MyVisitorsList";
      break;
    case "Complaint":
      route = "ComplaintsList";
      break;
    case "Invite":
      route = "MyInvitationsList";
      break;
    case "Registration":
      route = "ViewRegistration";
      break;
    case "Announcement":
      route = "Home";
      break;
    case "Booking":
      route = "MyBookingsList";
    default:
      route = "NotificationList";
  }
  return route;
};

export const NotificationRouting = (type, data) => {
  console.log(type, data, "routingg navigation");
  let nav = "kkkkkkkkkkkk";
  let route = "";
  switch (type) {
    case "Visit":
      route = "MyVisitorDetails";
      break;
    case "HelpDesk":
      route = "ComplaintDetails";
      break;
    case "Announcement":
      route = "AnnouncementDetail";
      break;
    case "Invite":
      route = "MyInvitationsDetails";
      break;
    case "Registration":
      route = "ViewRegistration";
      break;
    case "Booking":
      route = "MyBookingsDetails";
      break;
    default:
      route = "NotificationList";
      break;
  }
  return route;
};

export const redirectingFunc = async (type, data, UnitMatch) => {
  let user = JSON.parse(await AsyncStorage.getItem("user"));

  console.log(type, "d;kfjlf");
  switch (type) {
    case "Visit":
      RootNavigation.navigate("MyVisitorDetails", { data });
      break;
    case "HelpDesk":
      RootNavigation.navigate("ComplaintDetails", { data });
      break;
    case "Announcement":
        RootNavigation.navigate("AnnouncementDetail", { data });
      break;
    case "Invite":
      RootNavigation.navigate("MyInvitationsDetails", { data });
      break;
    case "Registration":
      RootNavigation.navigate("ViewRegistration", { data });
      break;
    case "Booking":
      RootNavigation.navigate("MyBookingsDetails", { data });
      break;
    default:
      RootNavigation.navigate("NotificationList", { data });
      break;
  }
};
export const SliceName = (str, size) => {
  if (!str) {
    return "Empty";
  }
  if (str.length > size) {
    return str.slice(0, size) + "....";
  }
  return str;
};
export const showFloatingFcm = (remoteMessage, floating) => {
  // let body = remoteMessage.notification.JSON.parse(body);
  const {
    title,
    body,
    type,
    type_id,
    sentTime,
    callerName,
    id,
    unit_id,
  } = remoteMessage?.data;
  const mode = detectTheme();
  console.log(body, floating,unit_id, "boeore bodyy");
  // let bodyData = body.split('fcm_body');
  // console.log(remoteMessage, 'afetr bodyy');

  // const extractFcmBodyData = bodyData => {
  //   console.log(bodyData[1], '00000000000000');
  //   let message = bodyData[0],
  //     type = bodyData[1] ? bodyData[1].trim('') : '',
  //     type_id = bodyData[2] ? bodyData[2].trim('') : '';
  //   console.log(bodyData[0], bodyData[1], bodyData[2], '22222222222222');
  //   return {message, type, type_id};
  // };

  // const {message, type, type_id} = bodyData && extractFcmBodyData(bodyData);
  let data = {
    title: title ? title : "",
    type: type,
    type_id: type_id,
    message: body,
  };

  if (type === "IncomingVideoCall") {
    const callerData = { callerName: callerName, roomName: id };

    console.log("IncomingVideoCall", callerData);
    RootNavigation.navigate("IncomingVideoCall", { callerData });
    !!id && !!id.trim() && !!callerName && !!callerName.trim()
      ? RootNavigation.navigate("IncomingVideoCall", { callerData })
      : RootNavigation.navigate("BottomTab");
  } else if (floating) {
    showMessage({
      message: `${title ? title : ""}`,
      description: `${tailedString(body, 100)}`,
      onPress: () => {
        console.log(
          type === "Complaint" ? "comp" : "deafiut",
          "onpRESSSS",
          type
        );
        console.log("loiuyugytdtesres", type);
        redirectingFunc(type, data);
      },
      type: "success",
      backgroundColor: Platform.OS === "android" ? "#eee" : "#eee",
      color: "#262626",
      floating: true,
      style: {
        borderWidth: Platform.OS === "ios" ? 0 : 0.5,
        borderColor: themes[mode]["lightAsh"],
        elevation: 2,
        top: "5%",
      },

      duration: 50000,
    });
  } else {
    redirectingFunc(type, data, unit_id);
  }
  console.log(
    "A new FCM message arrived!",
    remoteMessage.notification,
    remoteMessage.notification
  );
};

export const MyVisitorArrData1 = [
  <VisitsGuestIcon />,
  <VisitsContractorIcon />,
  <VisitsDeliveryIcon />,
];

export const myVisitorArray = [
  {
    label: "All",
  },
  {
    label: "Visitor",
  },
  {
    label: "Contractor",
  },
  {
    label: "Delivery",
  },
  {
    label: "Pickup / Drop",
  },
];

export const visitorTypeApi = (param) => {
  console.log(param, "paramsssssspppp");
  let type = "all";
  if (param === "All") {
    type = ["guest", "contractor", "delivery", "pickup/drop"];
  } else if (param === "Visitor" || param === "Guest") {
    type = ["guest"];
  } else if (param === "Contractor") {
    type = ["contractor"];
  } else if (param === "Delivery") {
    type = ["delivery"];
  } else type = ["pickup/drop"];
  return type;
};

export const removeEle = (arr, val) => {
  return arr.filter((ele) => ele !== val);
};

export const dateCalculate = (days) => {
  let from_time = "";
  let to_time = "";
  let todayDate = moment().format();
  if (days == 45 || days === "last_45") {
    from_time = moment()
      .subtract(45, "days")
      .format();
    to_time = todayDate;
  } else if (days == 60 || days === "last_60") {
    from_time = moment()
      .subtract(60, "days")
      .format();
    to_time = todayDate;
  } else if (days === "last_30") {
    from_time = moment()
      .subtract(30, "days")
      .format();
    console.log(from_time, "last 30 chek");
    to_time = todayDate;
  } else if (days === "next_30") {
    from_time = todayDate;
    to_time = moment()
      .add(30, "days")
      .format();
  } else if (days === "next_45") {
    from_time = todayDate;
    to_time = moment()
      .add(45, "days")
      .format();
  } else if (days === "next_60") {
    from_time = todayDate;
    to_time = moment()
      .add(60, "days")
      .format();
  } else if (days === "this_month") {
    from_time = moment()
      .startOf("month")
      .format();
    to_time = moment()
      .endOf("month")
      .format();
  } else {
    from_time = moment()
      .startOf("month")
      .format();
    to_time = moment()
      .endOf("month")
      .format();
  }
  return { from_time, to_time };
};

export const nameValidation = (str) => {
  let message = false;
  if (!str.length) {
    message = "This field is required";
  } else if (str === " ") {
    message = "Empty";
  } else if (str.length < 3) {
    message = "Name should be min of 3 char";
  } else if (!/^[A-Za-z\s]*$/.test(str)) {
    message = "Name should be alphabets and space only";
  }
  return message;
};

export const isValidDate = (date) => {
  // Check if the provided date is a valid Date object and not NaN
  return date instanceof Date && !isNaN(date);
};

export const companyNameValidation = (str) => {
  let message = false;
  if (!str.length) {
    message = "This field is required";
  } else if (str === " ") {
    message = "Empty";
  } else if (str.length < 3) {
    message = "Company name should be min of 3 char";
  } else if (str.length > 75) {
    message = "Company name within 75 char";
  }
  return message;
};

export const textOnlyValidation = (str) => {
  let message = false;
  if (!/^[A-Za-z\s]*$/.test(str)) {
    message = "This field allows alphabets and spaces only";
  }
  return message;
};

export const phoneValidation = (str) => {
  console.log("phone validATION");
  let message = false;
  if (!str.length) {
    message = "This field is required";
  } else if (numberOnlyRegex(str)) {
    if (str.length < 8) {
      message = "Mobile number should be min of 8 char";
    } else if (str.length > 10) {
      message = "Mobile number should be max of 10 char";
    }
    return message;
  } else if (!str.match(phoneREGEX)) {
    message = "Invalid Mobile number";
  }
  return message;
};

export const numberPlateValidation = (str) => {
  let message = false;
  // if (str?.length > 8) {
  //   message = 'Vehicle number max of 8 char';
  // }
  var regex = /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/;
  var regexLength = /^.{4,8}$/;
  if (!str.length) {
    message = "This field is required";
  } else {
    if (!regexLength.test(str)) {
      return (message = "vehicle plate must contain between 4 to 8 characters");
    } else if (!regex.test(str)) {
      message = "vehicle number should contain both alphabets and numbers ";
      console.log("number plate error");
    }
  }
  return message;
};

export const purposeTypeConversion = (str) => {
  let val = "";
  if (str === "Visitor") {
    val = "guest";
  } else if (str === "Contractor") {
    val = "contractor";
  } else if (str === "Delivery") {
    val = "delivery";
  } else {
    val = "pickup/drop";
  }
  return val;
};

export const BottomNavIcon = () => {
  return {
    qr_scan: { icon: "", screen: "" },
    invite: { icon: "", screen: "" },
    complaints: { icon: "", screen: "" },
  };
};

export const AddIcon = () => {
  return {
    sos: { icon: "", screen: "" },
    bluetooth: { icon: "", screen: "" },
    invite: { icon: "", screen: "" },
    my_visitors: { icon: "", screen: "" },
    complaints: { icon: "", screen: "" },
  };
};

export const sosComp = (str) => {
  let obj = {
    police: { label: "Police", icon: <SOSPolice /> },
    ambulance: { label: "Ambulance", icon: <SOSAmbulance /> },
    fire_service: { label: "Fire Service", icon: <SOSFire /> },
    security: { label: "Security", icon: <SOSSecurity /> },
    concierge: { label: "Concierge", icon: <SOSConcierge /> },
    customer_support: { label: "Call Support", icon: <SOSCallSupport /> },


  };
  return obj[str];
};

export const renderHomeFeatures = (str, r_type, t_type) => {
  const mode = detectTheme();
  let obj = {
    invite: {
      label: "Invite",
      icon:
        r_type == "owner" && t_type == false
          ? require("../../assets/img/invitation1.png")
          : require("../../assets/img/invitation1.png"),
      bgColor: themes["light"]["lightYellow"],
      screen: "InviteHome",
      disable: r_type == "owner" && t_type == false ? true : false,
    },
    feedback: {
      label: "Feedback",
      icon: require("../../assets/img/feedback.png"),
      bgColor: themes["light"]["lightPink"],
      screen: "FeedBack",
      disable: false,
    },
    facility_booking: {
      label: "Facility Booking",
      icon:
        r_type == "owner" && t_type == true
          ? require("../../assets/img/schedule2.png")
          : require("../../assets/img/schedule1.png"),
      bgColor: themes[mode]["lightViolet"],
      screen: "FacilitiesHome",
      disable: r_type == "owner" && t_type == true ? true : false,
    },
    complaints: {
      label: "Help Desk",
      icon: require("../../assets/img/complaints1.png"),
      bgColor: themes["light"]["lightPink"],
      screen: "ComplaintCategory",
      disable: false,
    },
    documents: {
      label: "Documents",
      icon: require("../../assets/img/gallery1.png"),
      bgColor: themes["light"]["lightPink"],
      screen: "Documents",
      disable: false,
    },
    selfinvite: {
      label: "Self Invite",
      icon:
        r_type == "owner" && t_type == false
          ? require("../../assets/img/invitation2.png")
          : require("../../assets/img/invitation1.png"),
      bgColor: themes["light"]["lightYellow"],
      screen: "InviteHome",
      disable: r_type == "owner" && t_type == false ? true : false,
    },
    community: {
      label: "Community",
      icon: require("../../assets/img/community1.png"),
      bgColor: themes["light"]["lightPink"],
      screen: "CommunityList",
      disable: false,
    },
    localhelp: {
      label: "LocalHelp",
      icon: require("../../assets/img/localhelp.png"),
      bgColor: themes["light"]["lightPink"],
      screen: "LocalHelpHome",
    },
  };
  return obj[str];
};

export const renderFacilityList = (str) => {
  let obj = {
    tennis_court: {
      label: "Tennis Court",
      icon: <TennisIcon />,
      bgColor1: themes["light"]["lightViolet"],
      bgColor2: themes["light"]["darkViolet"],
    },
    function_hall: {
      label: "Function Hall",
      icon: <FunctionHallIcon />,
      bgColor1: themes["light"]["lightBlue"],
      bgColor2: themes["light"]["darkBlue"],
    },
    gym_room: {
      label: "Gym Room",
      icon: <GymRoomIcon />,
      bgColor1: themes["light"]["lightRed"],
      bgColor2: themes["light"]["darkRed"],
    },
    basketball_court: {
      label: "Basketball Court",
      icon: <BasketBallIcon />,
      bgColor1: themes["light"]["lightGreen"],
      bgColor2: themes["light"]["darkGreen"],
    },
    golf_court: {
      label: "Golf Court",
      icon: <GolfIcon />,
      bgColor1: themes["light"]["lightCream"],
      bgColor2: themes["light"]["darkCream"],
    },
  };
  return obj[str];
};

export const capitalize = (str) => {
  let val;
  if (str === "pickup/drop") {
    val = "Pickup/Drop";
    return val;
  } else {
    val = str.charAt(0).toUpperCase() + str.substring(1);
    return val;
  }
};
export const checkMatchString = (str) => {
  let splitStr = str.split(" ");
  let iconArr = [
    { key: ["hall", "function", "party"], icon: <BookingHallIcon /> },
    { key: ["basket"], icon: <BasketBallIcon /> },
    {
      key: [
        "ball",
        "court",
        "cricket",
        "area",
        "play",
        "ground",
        "kids",
        "tennis",
        "games",
        "bat",
      ],
      icon: <BookingTennisIcon />,
    },
    {
      key: ["gym", "workout", "room", "training", "fitness"],
      icon: <BookingGymIcon />,
    },
    { key: ["pool", "swim"], icon: <OtherIcon /> },
    { key: ["bbq", "pit"], icon: <OtherIcon /> },
  ];

  let icon = [];
  splitStr?.map((ele) => {
    icon = iconArr.filter((obj1) => {
      return obj1.key.includes(ele) ? obj1 : null;
    });
    return icon;
  });

  return icon.length > 0 ? icon[0]?.icon : <OtherIcon />;
};

export const imageExtractor = (type) => {
  console.log(type, "typc check");
  switch (type) {
    case "maintanence":
      return <MaintenanceIcon />;
    case "plumbing":
      return <PlumbingIcon />;
    case "electrical":
      return <ElectricalIcon />;
    case "data_correction":
      return <DataCorrectionIcon />;
    case "suggestion":
      return <SuggestionIcon />;
    case "general":
      return <GeneralIcon />;
    case "others":
      return <OtherIcon />;
    case "Guest":
      return <InviteGuestIcon />;
    case "Contractor":
      return <InviteContractorIcon />;
    case "Delivery":
      return <InviteDeliveryIcon />;
    case "Pickup/Drop":
      return <InvitePickupIcon />;
    case type:
      return <InvitePickupIcon />;

    default:
      return <OtherIcon />;
  }
};

export const complaintStatusExtractor = (status) => {
  console.log(status, "lolpokouitwdiw");
  const mode = detectTheme();
  let obj = {};
  let openState =
    status === "Refunded" ||
    status === "open" ||
    status === "pending" ||
    status === "Expired" ||
    status === "Cancelled" ||
    status === "cancelled" ||
    status === "Blocked" ||
    status === "Rejected" ||
    status === "busy" ||
    status === "declined";
  status === "out" ||
    status === "expired_and_out" ||
    status === "partially_out";
  let futureState = "upcoming";
  let progressState = status === "inprogress";
  let closedState =
    status === "closed" ||
    status === "in" ||
    status === "resolved" ||
    status === "Visited" ||
    status === "approved" ||
    status === "active" ||
    status === "Confirmed" ||
    status === "Completed" ||
    status === "Answered" ||
    status === "rejected" ||
    status === "completed";
  let holdState =
    status === "created" ||
    status === "reopened" ||
    status === "pending" ||
    status === "in_progress" ||
    status === "Upcoming" ||
    status === "Pending" ||
    status === "Forwarded" ||
    status === "Reserved" ||
    status === "Payment Initiated";
  if (openState) {
    obj = {
      bgColor: "#FFECED",
      color: themes[mode]["error"],
    };
  } else if (progressState) {
    obj = {
      bgColor: "#FFF7E0",
      color: themes[mode]["primaryColor"],
    };
  } else if (closedState) {
    obj = {
      bgColor: "#E2F2E4",
      color: "#58B266",
    };
  } else if (holdState) {
    obj = { bgColor: "#d3ebfb", color: "#87cefa" };
  } else {
    obj = {
      bgColor: "#EEF6EF",
      color: themes[mode]["error"],
    };
  }
  return obj;
};

export const vehicleDetailsActionProps = (type) => {
  const Actions = {
    first: ["Second", "Third", "Unassign First"],
    second: ["First", "Third", "Unassign Second"],
    third: ["First", "Second", "Unassign Third"],
    other: ["First", "Second", "Third"],

  }
  switch (type) {
    case "first":
      return Actions.first;
    case "second":
      return Actions.second;
    case "third":
      return Actions.third;
    case "other":
      return Actions.other
    default:
      return [];
  }

}
// switch (status) {
//   case openState:
//     return {

//     };
//   case 'inprogress':
//     return {

//     };
//   case 'closed' || 'in' || 'expired' || 'resolved': {
//     return {

//     };
//   }
//   case 'pending': {
//     return {

//     };
//   }
//   case 'resolved': {
//     return {
//       bgColor: '#EEF6EF',
//       color: '#58B266',
//     };
//   }
//   default: {
//     return {
//       bgColor: 'green',
//       color: themes[mode]['error'],
//     };
//   }
// }
// };

export const visitorStatus = (status, i) => {
  console.log(status, "Visitor status: ", i);
  let mode = detectTheme();
  let statusVal = {
    text: "",
    color: "",
  };
  if (
    status === "out" ||
    status === "expired_and_out" ||
    status === "partially_out" ||
    status === "neglected"
  ) {
    statusVal = {
      color: themes[mode]["error"],
      text: "out",
    };
  } else if (status === "in" || status === "expired") {
    statusVal = {
      color: "#58B266",
      text: "in",
    };
  } else statusVal;
  return statusVal;
};

export const UnitNumExtraction = (arr) => {
  let unitArr = [];
  arr?.map((item) => {
    // let splChar = item.includes('#') || item.includes('-');
    // let var1 = splChar && item.split('#');
    // let var2 = splChar && var1[1].split('-');

    // let unit = splChar ? `${var1[0]}${var2[0]}${var2[1]}` : item;
    unitArr.push(item);
  });
  return unitArr;
};

export const removeSpace = (str) => {
  return str.toLowerCase().replace(" ", "_");
};

export const removeAccess = async () => {
  global.navigate = false;
  await AsyncStorage.removeItem("auth_token");
  await AsyncStorage.removeItem("user");
  await ReactNativeBleAdvertiser.setData("undefined");
  await ReactNativeBleAdvertiser.stopBroadcast();
  await AsyncStorage.removeItem("fcm_token");
  await AsyncStorage.removeItem("password_exists");
  await AsyncStorage.removeItem("isLogin");
};

export const defaultAnnounce = [
  {
    title: "Smart Condo Application",
    message: `Smart Condo application is helping residential complex to streamline activities and reduce overhead by providing well-defined paperless workflows for routine tasks with a dedicated application. 
The cloud-based application reduces the efforts for both condo members and the managing committee as the data is centrally available and accessible from anywhere.`,
    expire_at: "",
  },
];

export const statusColor = (status) => {
  const mode = detectTheme();
  console.log(status, "statusss");
  let color = "";
  if (status === "expired") {
    color = themes[mode]["error"];
  } else if (status === "inprogress") {
    color = "#C1D9F1";
  } else color = "#4297A5";
  return color;
};

export const highlightText = (str, txtStyle) => {
  let space = "";
  str.split(" ")?.map((word, i) => (
    <Text key={i}>
      <Text>{word} </Text>
      {space}
    </Text>
  ));
};

export const showDate = (date) => { };

export const capsConverter = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// export const ding = new Sound(dings, error => {
//   if (error) {
//     console.log('failed to load the sound', error);
//     return;
//   }
// });

export const viewDetailsIcon = (key, val) => {
  const { label, value } = val;
  console.log(key, value, "vwdi");
  let obj = {};
  switch (key) {
    case "name":
      obj = {
        label: "Name",
        icon: <NameIcon1 color={themes["light"]["primaryColor"]} />,
        val: tailedString(value),
      };
      return obj;
    case "bookedby":
      console.log("vwdiq", value)
      obj = {
        label: "Booked By",
        icon: <NameIcon1 color={themes["light"]["primaryColor"]} />,
        val: tailedString(value),
      };
      return obj;
    case "device_name":
      obj = {
        label: "Device Name",
        icon: <CompanyIconDT color={themes["light"]["primaryColor"]} />,
        val: tailedString(value),
      };
      return obj;
    case "resident_name":
      obj = {
        label: "Resident Name",
        icon: <GenderIconSmall color={themes["light"]["primaryColor"]} />,
        val: tailedString(value),
      };
      return obj;
    case "call_status":
      obj = {
        label: "Call Status",
        icon: <StatusIcon color={themes["light"]["primaryColor"]} />,
        val: tailedString(value),
      };
      return obj;
    case "status_type":
      obj = {
        label: "Status",
        icon: <StatusIcon color={themes["light"]["primaryColor"]} />,
        val: tailedString(value),
      };
      return obj;

    case "gate_open":
      obj = {
        label: "Access",
        icon: <EntryModeIcon color={themes["light"]["primaryColor"]} />,
        val: tailedString(value),
      };
      return obj;
    case "call_type":
      obj = {
        label: "Call Type",
        icon: <NoteIconSmall color={themes["light"]["primaryColor"]} />,
        val: tailedString(value),
      };
      return obj;
    case "resident_variant":
      obj = {
        label: "Resident Type",
        icon: <TypeIconSmall color={themes["light"]["primaryColor"]} />,
        val: tailedString(value),
      };
      return obj;
    case "phone":
      obj = {
        label: "Mobile Number",
        icon: <PhoneIcon1 color={themes["light"]["primaryColor"]} />,
        val: tailedString(value),
      };
      return obj;
    case "email":
      obj = {
        label: "Email",
        icon: <MessageBoxSmall color={themes["light"]["primaryColor"]} />,
        val: tailedString(value),
      };
      return obj;
    case "res_position":
      obj = {
        label: "Resident Position",
        icon: <MessageBoxSmall color={themes["light"]["primaryColor"]} />,
        val: tailedString(value),
      };
      return obj;
    case "vehicle_position":
      obj = {
        label: "Vehicle Position",
        icon: <MessageBoxSmall color={themes["light"]["primaryColor"]} />,
        val: tailedString(value),
      };
      return obj;
    case "visitor_type_name":
      obj = {
        label: "Type of Visit",
        icon: <MessengerIcon color={themes["light"]["primaryColor"]} />,
        val: tailedString(value),
      };
      return obj;
    case "resident_type":
      obj = {
        label: "Resident Type",
        icon: <TypeIconSmall color={themes["light"]["primaryColor"]} />,
        val: tailedString(value),
      };
      return obj;
    case "type":
      obj = {
        label: label || "Type",
        icon: <TypeIconSmall color={themes["light"]["primaryColor"]} />,
        val: tailedString(value),
      };
      return obj;
    case "count":
      obj = {
        label: "Add-on Visitors",
        icon: <CountIcon />,
        val: value?.length,
      };
      return obj;

    case "in_time":
      obj = {
        label: "Entry Time",
        icon: <CalendarIcon color={themes["light"]["primaryColor"]} />,
        val: moment(value).format("DD MMM, hh:mm A"),
      };
      return obj;

    case "out_time":
      obj = {
        label: "Duration",
        val: value ? timeAgo(value) : null,
        icon: <CalendarIcon color={themes["light"]["primaryColor"]} />,
      };
      return obj;

    case "mode_of_entry":
      obj = {
        label: "Mode Of Entry",
        val: mode_of_entry,
        icon: <EntryModeIcon />,
      };
      return obj;

    case "number_plate":
      obj = {
        label: "Number Plate",
        val: number_plate,
        icon: <NumberPlateIcon />,
      };
      return obj;
    case "status":
      obj = {
        label: "Status",
        val: visitorStatus(status).text,
        icon: <StatusIcon />,
      };

    case "date":
      obj = {
        label: "Date",
        icon: <CalendarIcon color={themes["light"]["primaryColor"]} />,
        val: moment(value).format("DD MMM YYYY"),
      };
      return obj;
    case "time":
      obj = {
        label: "Time",
        icon: <ClockIcon color={themes["light"]["primaryColor"]} />,
        val: moment(value).format("hh:mm A"),
      };
      return obj;
    case "start_time":
      obj = {
        label: "Start Time",
        icon: <ClockIcon color={themes["light"]["primaryColor"]} />,
        val: moment(value).format("hh:mm A"),
      };
      return obj;
    case "end_time":
      obj = {
        label: "End Time",
        icon: <ClockIcon color={themes["light"]["primaryColor"]} />,
        val: moment(value).format("hh:mm A"),
      };
      return obj;
    case "costing":
      obj = {
        label: "Booking Costing",
        icon: <MessengerIcon color={themes["light"]["primaryColor"]} />,
        val: `${value ? value : "-"} `,
      };
      return obj;
    case "total_costing":
      obj = {
        label: "Total Costing",
        icon: <MessengerIcon color={themes["light"]["primaryColor"]} />,
        val: `${value ? value : "-"} `,
      };
      return obj;
    case "deposite":
      obj = {
        label: "Deposit Costing",
        icon: <MessengerIcon color={themes["light"]["primaryColor"]} />,
        val: `${value ? value : "-"} `,
      };
      return obj;
      deposite;
    case "accompanied":
      obj = {
        label: "accompanied",
        icon: <CountIcon />,
        val: value,
      };
      return obj;
    case "vehicle_type":
      obj = {
        label: "Vehicle Type",
        icon: (
          <SvgXml
            xml={VehicleTypeIcon(commonColors.yellowColor)}
            width={ms(13)}
            height={ms(12)}
          />
        ),
        val: tailedString(value),
      };
      return obj;
    case "company":
      obj = {
        label: "Company Name",
        icon: <CompanyIconDT />,
        val: tailedString(value),
      };
      return obj;
    case "reason":
      obj = {
        label: "Remarks",
        icon: <StatusIcon />,
        val: tailedString(value),
      };
      return obj;
    case "vehicle_number":
      obj = {
        label: "Vehicle Number",
        icon: <CountIcon />,
        val: tailedString(value),
      };
      return obj;

    case "relation":
      obj = {
        label: "Relation",
        icon: <CountIcon />,
        val: tailedString(value),
      };
      return obj;
    case "gender":
      obj = {
        label: "Gender",
        icon: <GenderIconSmall />,
        val: tailedString(value),
      };
      return obj;
    case "booking_name":
      obj = {
        label: "Facility Booking",
        icon: <BookingIcon />,
        val: tailedString(value),
      };
      return obj;
    case "notes":
      obj = {
        label: "Notes",
        icon: <NoteIconSmall />,
        val: tailedString(value),
      };
      return obj;
    case "remarks":
      obj = {
        label: "Remarks",
        icon: <NoteIconSmall />,
        val: tailedString(value),
      };
      return obj;

    default: {
      return obj;
    }
  }
};

export const registrationNameConversion = (str) => {
  switch (str) {
    case "Residents":
      return "Resident";
    case "Children / Elder":
      return "Children / Elder";
    case "My Vehicles":
      return "Vehicle";
  }
};

export const filterDuration = (arr) => {
  let duration = [
    {
      label: "Last 30 days",
      value: "last_30",
      action: "",
    },
    {
      label: "Last 45 days",
      value: "last_45",
      action: "",
    },
    {
      label: "Last 60 days",
      value: "last_60",
      action: "",
    },
    {
      label: "Next 30 days",
      value: "next_30",
      action: "",
    },
    {
      label: "Next 45 days",
      value: "next_45",
      action: "",
    },
    {
      label: "Next 60 days",
      value: "next_60",
      action: "",
    },
    {
      label: "This month",
      value: "this_month",
      action: "",
    },
  ];

  let showDates = [];
  duration.filter((ele) => {
    arr?.map((val) => {
      ele.value === val ? showDates.push(ele) : null;
    });
  });
  return showDates;
};

export const filterMenus = (timePeriods) => {
  return {
    phone: {
      name: "phone",
      label: "Mobile Number",
      action: "",
      subMenu: filterDuration([]),
    },
    date: {
      name: "date",
      label: "Select Date",
      action: "",
      subMenu: filterDuration(timePeriods),
    },
    visitor_type: {
      name: "visitor_type",
      label: "Type of Visit",
      action: "",
      subMenu: [
        {
          label: "All",
          value: "all",
          action: "",
        },
        {
          label: "Guest",
          value: "guest",
          action: "",
        },
        {
          label: "Contractor",
          value: "contractor",
          action: "",
        },
        {
          label: "Delivery",
          value: "delivery",
          action: "",
        },
        // {
        //   label: "Pickup / Drop",
        //   value: "pickup/drop",
        //   action: "",
        // },
      ],
    },
  };
};

export const ShowMore = ({ onPress }) => {
  const mode = detectTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        top: 4,
      }}
    >
      <Text
        style={{
          ...commonStyles.regular_14,
          color: themes[mode]["headingColor"],
        }}
      >
        more
      </Text>
    </TouchableOpacity>
  );
};

export const convertToTimeFormat = (time, format) => {
  return moment(time, "HH:mm a").format();
};

export const convertToLocalTimeFormat = (time) => {
  return moment(time).format();
};

export const convertToLocalDateFormat = (date) => {
  return moment(date).format("DD/MM/YYYY");
};

export const ConvertTimeTOSGT = (visiting_time) => {
  // Get the current time zone of the device
  const localTimeZone = moment.tz.guess(); // e.g., 'Asia/Singapore'

  // Convert visiting_time to Singapore Time
  const visitingTimeSGT = moment.tz(visiting_time, 'Asia/Singapore');
  const nowSGT = moment.tz('Asia/Singapore');

  if (localTimeZone === 'Asia/Singapore') {
    // If the local time zone is Singapore Time, use local time
    return !nowSGT.isBefore(visitingTimeSGT)
      ? nowSGT.format() // Return the current time if it is after visiting time
      : visitingTimeSGT.startOf("day").format(); // Otherwise, return the start of the day in Singapore time
  } else {
    // If the local time zone is not Singapore Time, convert the time to Singapore Time
    const visitingTimeLocal = moment.tz(visiting_time, localTimeZone);
    
    return !nowSGT.isBefore(visitingTimeSGT)
      ? nowSGT.format() // Return the current time if it is after visiting time
      : visitingTimeSGT.startOf("day").format(); // Otherwise, return the start of the day in Singapore time
  }
};

export const generateSubsequentDates = (days,from) => {
  const dates = [];
  const today = new Date(from);
  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const day = date.toLocaleDateString('default', { day: '2-digit' });
    const month = date.toLocaleDateString('default', { month: 'short' });
    const weekday = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date);
    const value = date.getTime();
    const title = `${day}-${month}`;

    dates.push({ title, value, weekday, day, month });
  }
  return dates;
};

export const findMinMaxDateFromSelectedFilter = (dateArr) => {
  let selectedDate;
  let minDate = [];
  let maxDate = [];
  let from_date = "";
  let to_date = "";

  const arrFunc = (date, arr) => {
    date.split("_")?.map((ele) => {
      numberOnlyRegex(ele) ? arr.push(ele) : null;
    });
    return arr;
  };

  dateArr?.map((item) => {
    if (item.includes("last")) {
      console.log(
        arrFunc(item, minDate),
        Math.min.apply(Math, arrFunc(item, minDate)),
        "minnnn last"
      );
      from_date = `last_${Math.max.apply(Math, arrFunc(item, minDate))}`;
    } else if (item === "this_month") {
      from_date = "this_month";
      to_date = "this_month";
    }
    if (item.includes("next")) {
      console.log(Math.max.apply(Math, arrFunc(item, maxDate)), "maxxxxx last");
      to_date = `next_${Math.max.apply(Math, arrFunc(item, maxDate))}`;
    }
  });
  console.log(from_date, to_date, "dattteeee minmax datee");

  return { from_date, to_date };
};

export const ShareContent=async(data)=>{
  console.log("kel",data)
return  await Share.share({
  message:
    'React Native | A framework for building native apps using React',
});
}

