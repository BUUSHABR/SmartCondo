import { PermissionsAndroid, Platform } from "react-native";
// import Geolocation from "react-native-geolocation-service";
import {
  PERMISSIONS,
  request,
  RESULTS,
  requestMultiple,
} from "react-native-permissions";

const requestLocationPermission = async () => {
  try {
    if (Platform.OS === "ios") {
      console.log("[Geo Location ] IOS");
      return await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    }
    console.log("[Geo Location ] ANDROID");
    return await requestMultiple([
      PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
      PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    ]);
  } catch (err) {
    console.log("[Geo Location ] ERROR", err);
  }
};

export const getLocation = async (UpdateLocation) => {
  const result = await requestLocationPermission();
  console.log(
    "[Geo Location ] AFTER GET LOCATION PERMISSION",
    result,
    RESULTS.BLOCKED
  );
  const isLocationEnabled =
    Platform.OS == "android"
      ? result["android.permission.ACCESS_FINE_LOCATION"] === RESULTS.GRANTED &&
        result["android.permission.ACCESS_COARSE_LOCATION"] === RESULTS.GRANTED
      : result == RESULTS.GRANTED;
  global.isLocationBlocked =
    Platform.OS == "android"
      ? result["android.permission.ACCESS_FINE_LOCATION"] === RESULTS.BLOCKED &&
        result["android.permission.ACCESS_COARSE_LOCATION"] === RESULTS.BLOCKED
      : result == RESULTS.GRANTED;
  console.log("[Geo Location ] ISBLOCKED", global.isLocationBlocked);
  if (isLocationEnabled) {
    console.log("[Geo Location ]  LOCATION PERMISSION GRANTED", result);
    // Geolocation.getCurrentPosition(
    //   async (position) => {
    //     console.log("[Geo Location ] GEO LOCATION READED init", position);
    //     const latitude = position.coords.latitude;
    //     const longitude = position.coords.longitude;
    //     const latLong = latitude + "," + longitude;
    //     UpdateLocation({ latitude, longitude });
    //     console.log("[Geo Location ] GEO LOCATION READED", latLong);
    //   },
    //   (error) => {
    //     console.log("[Geo Location ] GEO LOCATION PACKAGE ERROR", error);
    //   },
    //   { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    // );
  } else {
    console.log("[Geo Location ] GEO LOCATION NOT GRANTED", result);
  }
};
