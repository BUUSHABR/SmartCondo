// import shorthash from "shorthash";
// var RNFS = require("react-native-fs");

// export const memoize = async (url) => {
//   console.log(`[MEMOIZE] URL :  ${url}`);
//   var source = null; //variable we will send it back to our component
//   const name = shorthash.unique(url); //creating a unique id
//   console.log(`[MEMOIZE] SHORTHASH URL :  ${name}`);

//   const extension = Platform.OS === "android" ? "file://" : ""; //extension for the file path
//   console.log(`[MEMOIZE] EXTENTION :  ${extension}`);
//   const path = `${extension}${RNFS.CachesDirectoryPath}/${name}`; //the path we are going to save data
//   //for videos, you might need .mp4 extension after name
//   console.log(`[MEMOIZE] PATH :  ${path}`);
//   try {
//     console.log(`[MEMOIZE] TRY BLOCK RUNNING`);
//     return await RNFS.exists(path).then(async (exists) => {
//       //check if the data is already downloaded
//       console.log(`[MEMOIZE] RNFC ISEXIST : ${exists} `);
//       if (exists) {
//         console.log(`[MEMOIZE] RNFC ISEXIST TRUE BLOCK  : ${exists} `);
//         console.log(`[MEMOIZE] RNFC DIRECTORY PATH : ${path} `);

//         return path; //if it is then set the source
//       } else {
//         console.log(`[MEMOIZE] RNFC ISEXIST FALSE BLOCK  : ${exists} `);
//         console.log(`[MEMOIZE] DOWNLOAD STARTED `);
//         return await RNFS.downloadFile({
//           fromUrl: url,
//           toFile: path, //download the data if it is not already downloaded
//         })
//           .promise.then((res) => {
//             console.log(`[MEMOIZE] DOWNLOAD COMPLETED  : ${path} `);
//             return path; //set the source after downloading is completed
//           })
//           .catch((err) => {
//             console.log(`[MEMOIZE] DOWNLOAD FAILED  : ${err} `);
//             console.log("err downloadFile", err);
//           });
//       }
//     });
//   } catch (err) {
//     console.log(`[MEMOIZE] CATCH BLOCK RUNNING ERROR: ${err}`);
//   }
// };
