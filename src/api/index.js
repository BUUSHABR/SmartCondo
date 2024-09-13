import { headers, jsonHeaders } from "../helpers";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default async function({
  uri,
  method,
  body,
  formData,
  authorization,
  Payment_Key,
  Payment_Api_Key,
}) {
  const host = await AsyncStorage.getItem("host");
  // console.log(host, "dnjdnjdnjdnjdd////////////////////////////");
  // console.log(
  //   uri,
  //   "paginateuri",
  //   body,
  //   "dwjdkwjd837e81",
  //   Payment_Key,
  //   Payment_Api_Key
  // );
  let header = await headers();
  console.log("Wku",host+uri,body);
  return fetch(host + uri, {
    method,
    body,
    headers: {
      ...header,
      "Content-Type": formData ? "multipart/form-data" : "application/json",
      // "X-API-Key": Payment_Key ? Payment_Api_Key : "",
    },
  }).then(async (response) => {
     console.log(response, "response");
    if (response.ok) {
      try {
        return response.json();
      } catch (err) {
        return true;
      }
    }
    const errorMessage = [response.status, await response.json()];
    console.log(uri.endsWith("/result")?`BalooBasi ${errorMessage} ggg`:"falsee");
    throw errorMessage;
  });
}

export const Headless = async ({
  uri,
  method,
  authorization,
  body,
  Payment_Key,
  Payment_Api_Key,
}) => {
  const host = await AsyncStorage.getItem("host");
  // console.log("https://a091-49-37-202-53.in.ngrok.io", "dnjdnjdnjdnjdd");
  let jsonHeader = await jsonHeaders();
  // console.log(uri, jsonHeader, "header", authorization);
  console.log("Wku",host+uri,body );
  return fetch(host + uri, {
    method,
    body,
    headers: {
      ...jsonHeader,
      Authorization: authorization,
      "X-API-Key": Payment_Key ? Payment_Api_Key : "",
    },
  }).then(async (response) => {
    // console.log(response, "responsefromapi");
    if (response.ok) {
      try {
        return response.json();
      } catch (err) {
        // console.log(err, "error server ");
        return true;
      }
    }
    const errorMessage = [response.status, await response.json()];
    throw errorMessage;
  }).catch(err=>{
    console.log(err,"erbu")
  });
};
