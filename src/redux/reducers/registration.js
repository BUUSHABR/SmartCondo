import {
  LIST_REGISTRATION,
  FAMILY_REGISTRATION,
  RESIDENT_REGISTRATION,
  ON_REGISTER_VALIDATION,
  ON_REGISTER_CHANGE,
  SUBMIT_CONTROL,
  STOP_LOADER,
  RESIDENT_LIST,
  FAMILY_LIST,
  CLEAR_STATE,
  RESIDENT_DETAILS,
  VEHICLE_LIST,
} from "../actionTypes";
import moment from "moment";

const initialState = {
  loader: true,
  disabled: false,
  residents_list: [],
  vehicles_list: [],
  add_residents: {
    name: "",
    phone: "",
    gender: "",
    email: "",
    resident_type: "owner",
    members_add: "",
    vehicle_number: "",
    resident_type: "",
    exp_time:new Date()
  },
  add_family: {
    name: "",
    dob: new Date(),
    gender: "",
    relation: "",
    members_add: "",
  },
  residentDetails: {},
  add_vehicle: {
    vehicle_type: "",
    vehicle_number: "",
  },
};

export default function(state = initialState, action) {
  switch (action.type) {
    case RESIDENT_LIST: {
      const { data } = action.payload;
      return {
        ...state,
        residents_list: data.data,
      };
    }
    case VEHICLE_LIST: {
      const { data } = action.payload;

      return {
        ...state,
        vehicles_list: data.data,
      };
    }
    case RESIDENT_DETAILS: {
      const { data } = action.payload;
      console.log(data, "resident reducer");
      return {
        ...state,
        residentDetails: data.data,
      };
    }
    case ON_REGISTER_CHANGE: {
      const { type, name, value } = action.payload;
      console.log(type, name, value, "vallllllll");
      const dd = {
        ...state,
        [type]: {
          ...state[type],
          [name]: value,
        },
      };
      console.log(dd, "dddddddd");

      return dd;
    }
    case ON_REGISTER_VALIDATION: {
      const { type, name, value } = action.payload;
      return {
        ...state,
        [type]: {
          [field]: message,
        },
      };
    }
    case SUBMIT_CONTROL: {
      const { submitted } = action.payload;
      return {
        ...state,
        submitted: submitted,
      };
    }
    case STOP_LOADER: {
      const { loader } = action.payload;
      console.log(loader, "loaderrrrr");
      return {
        ...state,
        loader: loader,
      };
    }
    case CLEAR_STATE: {
      const { type } = action.payload;

      return {
        ...state,
        [type]:
          type === "add_family"
            ? { ...initialState.add_family }
            : { ...initialState.type },
      };
    }
    default:
      return state;
  }
}
