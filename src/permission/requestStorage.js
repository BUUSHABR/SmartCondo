// import { PermissionsAndroid } from "react-native";

// export const requestStoragePermission = async () => {
//     console.error("[Memoize] Permissions: entered");
//   try {
//     const granted = await PermissionsAndroid.requestMultiple([
//       PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
//       PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
//     ]);

//     if (
//       granted[PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE] ===
//         PermissionsAndroid.RESULTS.GRANTED &&
//       granted[PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE] ===
//         PermissionsAndroid.RESULTS.GRANTED
//     ) {
//       console.log(`[Memoize] Permissions: granded`);
//       // Permission granted, perform image read and write operations
//     } else {
//       console.log(`[Memoize] Permissions: denied`);
//       // Permission denied, handle accordingly
//     }
//   } catch (error) {
//     console.error("[Memoize] Permissions: error", error);
//   }
// };
