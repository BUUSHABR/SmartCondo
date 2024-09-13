import {
  SET_THEME,
  SET_USER,
  SET_BLE,
  PROFILE_INPUT_CHANGE,
  DOCUMENT_FOLDER,
  USER_IMAGE,
  RESET_STATE_PROFILE,
} from "../actionTypes";
import moment from "moment";
import { Appearance } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const initialState = {
  mode:  Appearance.getColorScheme(),
  userData: {},
  list_units: [
    { unit_number: "33 - 3C#49", name: "Casa Merah" },
    { unit_number: "33 - 3C#50", name: "Eco Sanctuary" },
    { unit_number: "33 - 3C#51", name: "Lake Shore" },
  ],
  ble: false,
  location: false,
  faqMsg: "",
  folderList: [],
  documentList: [],
  documentloader: true,
  listLoader: true,
  userimage: "",
  user_image: "",
};

export default function(state = initialState, action) {
 
  switch (action.type) {
    case SET_THEME: {
      const { theme } = action.payload;
      return {
        ...state,
        mode: theme,
      };
    }
    case DOCUMENT_FOLDER: {
      const { name, value } = action.payload;
      console.log(name, value, "ljnekcjenceic");
      return {
        ...state,
        [name]: value,
      };
    }
    case USER_IMAGE: {
      const { name, data } = action.payload;
      console.log(name, data, "ljnekcjencjjdjdeic");
      return {
        ...state,
        [name]: data,
      };
    }
    case SET_USER: {
      const { data } = action.payload;
      return {
        ...state,
        userData: {
          ...data,
          dob:
            data?.dob === null ? moment().format() : moment(data?.dob).format(),
          items: [
            { label: "Male", value: "male" },
            { label: "Female", value: "female" },
            { label: "Others", value: "others" },
          ],
        },
      };
    }
    case SET_BLE: {
      const { bluetooth_state, location_state } = action.payload;
      return {
        ...state,
        ble: bluetooth_state,
        location: location_state,
      };
    }

    case PROFILE_INPUT_CHANGE: {
      const { name, value } = action.payload;
      console.log(name, value, "kjeekbded");
      let a = {
        ...state,
        userData: {
          ...state.userData,
          [name]: value,
        },
      };
      console.log(a, "helidnde d");
      return {
        ...state,
        userData: {
          ...state.userData,
          [name]: value,
        },
      };
    }
    case RESET_STATE_PROFILE: {
      return {
        ...initialState,
      };
    }
    default:
      return state;
  }
}
