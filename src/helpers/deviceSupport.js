import DeviceInfo from "react-native-device-info";
import AsyncStorage from "@react-native-async-storage/async-storage";
import OverlayPermissionModule from "rn-android-overlay-permission";
import AutoStart from "react-native-autostart";

export const deviceDetails = async () => {
  // DeviceInfo.getSystemVersion();
  let obj = {
    appVersion: DeviceInfo.getVersion(),
    // appBuildNumber: DeviceInfo.getBuildNumber(),
    Manufacturer: await DeviceInfo.getManufacturer(),
    Model: DeviceInfo.getModel(),
    API: await DeviceInfo.getApiLevel(),
    "Android Version": DeviceInfo.getSystemVersion(),
  };
  return obj;
};

export const renderServicesWebView = async () => {
  let manufacturer = await DeviceInfo.getManufacturer();
  const host = await AsyncStorage.getItem("host");

  let user = await AsyncStorage.getItem("user");
  let condo_name = JSON.parse(
    user
  )?.data?.current_unit?.condo_alias_name.toLowerCase();

  let servicesURL = "";

  console.log(host, "tyrertwubebebfefefef");
  if (host.includes("ci")) {
    servicesURL = `https://services-${condo_name}.smartcondo.xyz/documentation/${manufacturer.toLowerCase()}`;
  } else if (host.includes("stage") || host.includes("app-qa")) {
    servicesURL = `https://services-${condo_name}.smartcondo.xyz/documentation/${manufacturer.toLowerCase()}`;
  } else {
    servicesURL = `https://services-${condo_name}.smartbuildings.app/documentation/${manufacturer.toLowerCase()}`;
  }
  return servicesURL;
};

export const autoStartPermit = () => {
  return AutoStart.startAutostartSettings();

  // let autoStart = AutoStart.isCustomAndroid();
  // return autoStart
  //   ? Alert.alert('Auto Start for touchless entry & video call access', ' ', [
  //       {
  //         text: 'Cancel',
  //         onPress: () => console.log('Cancel Pressed'),
  //         style: 'cancel',
  //       },
  //       {
  //         text: 'OK',
  //         onPress: () => {
  //           AlertAutoStart.startAutostartSettings();
  //         },
  //       },
  //     ])
  //   : null;
};

export const overlayPermit = () => {
  return OverlayPermissionModule.requestOverlayPermission();

  // return Alert.alert(
  //   'Allow background access for touchless entry & video call access',
  //   ' ',
  //   [
  //     {
  //       text: 'Cancel',
  //       onPress: () => console.log('Cancel Pressed'),
  //       style: 'cancel',
  //     },
  //     {
  //       text: 'OK',
  //       onPress: () => {
  //         OverlayPermissionModule.requestOverlayPermission();
  //       },
  //     },
  //   ],
  // );
};

export const checkCustomizedOS = () => {
  return AutoStart.isCustomAndroid();
};
