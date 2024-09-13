import { ToastAndroid, Platform, Alert, Linking } from "react-native";
import Toast from "react-native-simple-toast";
import * as RootNavigation from "../navigation/RootNavigation";
import { removeAccess, handleBackButton } from "../helpers";

export const ToastMessage = (status, message, err) => {
  const platform = Platform.OS === "android";
  switch (status) {
    case 200:

    case 201:
      platform ? ToastAndroid.show(message, 10) : Toast.show(message, 3);
      break;
    case 400:
      platform
        ? ToastAndroid.show(message || "Bad Request.!!!", 10)
        : Toast.show(message || "Bad Request.!!!", 3);
      break;

    case 401:
      global.unAuthorizedCount++;
      console.log(
        global.unAuthorizedCount,
        "[UnAuthorized] Count : " + global.unAuthorizedCount
      );
      if (global.unAuthorizedCount <= 1) {
        console.log(
          global.unAuthorizedCount,
          "[UnAuthorized] Condition Passed Count : " + global.unAuthorizedCount
        );
        platform
          ? ToastAndroid.show(message || "Access Denied.!!!", 10)
          : Toast.show(message || "Access Denied.!!!", 3);
        RootNavigation.navigate("LoginScreen");
        removeAccess();
      }
      break;

    case 403:
    case 404:
      platform
        ? ToastAndroid.show(
            message || "Could not update data from remote.!!!",
            10
          )
        : Toast.show(message || "Could not update data from remote.!!!", 3);
      break;
    case 406:
      Alert.alert(
        "",
        "Your App Version seems to be outdated. Download the latest version.",
        [
          {
            text: "Cancel",
            onPress: () => {
              handleBackButton();
            },
          },
          {
            text: "Update",
            onPress: () => {
              if (Platform.OS === "android") {
                Linking.openURL(
                  "https://play.google.com/store/apps/details?id=app.smartbuildings"
                );
              } else if (Platform.OS === "ios") {
                Linking.openURL(
                  "https://apps.apple.com/us/app/smart-condo-sg/id1596565327"
                );
              }
            },
          },
        ]
      );
      break;

    case 413:
      platform
        ? ToastAndroid.show(message || "Uploaded Imgae size is too large", 10)
        : Toast.show(message || "Uploaded Imgae size is too large", 3);
      break;
    case 422:
      platform
        ? ToastAndroid.show(message || "Unprocessable Entity", 10)
        : Toast.show(message || "Unprocessable Entity", 3);
      break;

    case 429:
      platform
        ? ToastAndroid.show(message || "Too Many Request.!!!", 10)
        : Toast.show(message || "Too Many Request.!!!", 3);
      break;
    case 1000:
      platform
        ? ToastAndroid.show("you reached your time limit", 10000)
        : Toast.show("you reached your time limit", 3);
      break;
    case 1001:
      platform ? ToastAndroid.show(message, 10000) : Toast.show(message, 3);
      break;

    case 500:
      platform
        ? ToastAndroid.show(
            "Could not fetch data from remote.!!!" || message,
            10
          )
        : Toast.show("Could not fetch data from remote.!!!" || message, 3);
      break;
    case 502:
      platform
        ? ToastAndroid.show(
            "Could not fetch data from remote.!!!" || message,
            10
          )
        : Toast.show("Could not fetch data from remote.!!!" || message, 3);
      break;
    case "image_size":
      platform
        ? ToastAndroid.show("Image size should less than 500kb" || message, 10)
        : Toast.show("image size should less than 500kb" || message, 3);
      break;

    default:
      console.log("redder",status);
      platform
        ? ToastAndroid.show(message || `Something is not right.!!!`, 10)
        : Toast.show(message || `Something is not right.!!!`, 3);
  }
};
