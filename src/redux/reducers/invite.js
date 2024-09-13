import React from "react";
import moment from "moment";

import {
  INVITE_CHANGE,
  INITIAL_VISITOR_INVITE,
  INVITEE_VALIDATION,
  SET_SUBVISITOR_LIST,
  LIST_MYINVITATIONS_DATA,
  SET_INVITE_LOADER,
  ON_CLICK_INVITE,
  ON_RESET_FILTER,
  INVITE_RESET,
  CLEAR_VAL,
  INVITE_FETCH_DATA_REQUEST,
  INVITE_FETCH_DATA_SUCCESS,
  INVITE_FETCH_DATA_FAILURE,
  INVITE_RESET_DATA,
} from "../actionTypes";

const empty_object = (nextRef = React.createRef()) => ({
  visiting_time: {
    value: new Date(),
    error: "",
    timeRef: nextRef,
  },
  name: {
    value: "",
    error: "",
    nameRef: React.createRef(),
  },
  country_code: {
    value: "",
    error: "",
   countryCodeRef: React.createRef(),
  },
  phone: {
    value: "",
    error: "",
    phoneRef: React.createRef(),
  },
  remarks: {
    value: "",
    error: "",
    remarksRef: React.createRef(),
  },
  vehicle_number: {
    value: "",
    error: "",
    vehicleRef: React.createRef(),
  },
  company: {
    value: "",
    error: "",
    companyRef: React.createRef(),
  },
  nextRef: React.createRef(),
});

const initialState = {
  loading: false,
  inviteAfterData: [],
  inviteAfterPage: 1,
  inviteAfterLoading: false,
  inviteAfterTotalEntries: 0,
  inviteBeforeData: [],
  inviteBeforePage: 1,
  inviteBeforeLoading: false,
  inviteBeforeTotalEntries: 0,
  covidData: [
    {
      title: "Wear a mask",
      subTitle: "Save lives",
      message:
        "Protect yourself and others around you by knowing the facts and taking appropriate precautions",
    },
    {
      title: "Fight Virus with",
      subTitle: "Vaccines!",
      message:
        "Lets’s stop the pandemic by killing the virus with a vaccine, don’t let yourself and your family get infected",
    },
    {
      title: "Wash Your",
      subTitle: "Hands",
      message:
        "Washing your hands with soap and water or using alcohol-based hand rub kills viruses that may be on your hands",
    },
  ],
  inviteeData: {
    ...empty_object(),
    no_of_visitor: {
      value: "",
      error: "",
      no_of_visitorRef: React.createRef(),
    },
    sub_visitor: { value: "", error: "" },
    purpose: { value: "Visitor", error: "" },
    file: {
      value: "",
    },
  },
  subVisitorTypeArr: [],
  subVisitorOrgArr: [],
  inviteLoader: true,
  allInviteData: [],
  upcomingInviteData: [],
  expiredInviteData: [],
  inviteStatus: "All",
  invitesFilter: ["date", "days", "visitor_type"],
  page: 1,
  per_page: 30,
  from_time: new Date(),
  to_time: new Date(),
  totalEntries: 0,
  phone: "",
  days: 30,
  // date: true,

  date: ["this_month"],
  visitor_type: ["all"],
  showCancelButton: true,
  inviteDetails: {},
};

export default function(state = initialState, action) {
  //  alert('reducerrrvallll');

  switch (action.type) {
    case INVITE_RESET_DATA: {
      return {
        ...state,
        loading: false,
        inviteAfterData: [],
        inviteAfterPage: 1,
        inviteAfterLoading: false,
        inviteAfterTotalEntries: 0,
        inviteBeforeData: [],
        inviteBeforePage: 1,
        inviteBeforeLoading: false,
        inviteBeforeTotalEntries: 0,
      };
    }
    case INVITE_FETCH_DATA_REQUEST: {
      console.log("INVITE_FETCH_DATA_REQUEST called");
      return { ...state, loading: true };
    }

    case INVITE_FETCH_DATA_SUCCESS: {
      const {
        name,
        value,
        pageName,
        loaderName,
        totalEntryName,
        totalEntries,
      } = action.payload;
      console.log(value, "Facility pagination reducer set state");
      const mergeArraysAndRemoveDuplicates = (arr1, arr2) => {
        const mergedArray = [...arr1, ...arr2];

        // Use a Set to keep track of unique IDs
        const uniqueIds = new Set();

        // Use Array.filter to create a new array with unique items based on the "id" property
        const uniqueArray = mergedArray.filter((item) => {
          if (!uniqueIds.has(item.id)) {
            uniqueIds.add(item.id);
            return true;
          }
          return false;
        });

        return uniqueArray;
      };
      return {
        ...state,
        [name]: mergeArraysAndRemoveDuplicates(state[name], value),
        [pageName]:
          state[pageName] * 10 == state[name].length
            ? state[pageName] + 1
            : state[pageName],

        [totalEntryName]: totalEntries,
        loading:false
      };
    }
    case INVITE_FETCH_DATA_FAILURE: {
      return { ...state, loading: false };
    }
    case INVITE_CHANGE: {
      const { name, value } = action.payload;
      let filteredArr = [];
      if (name === "sub_visitor" && value?.length > 0) {
        filteredArr = state.subVisitorOrgArr.filter((ele) => {
          return ele.name.indexOf(value) > -1;
        });
      } else {
        filteredArr = state.subVisitorOrgArr;
      }
      let cc = {
        ...state.inviteeData,
        [name]: {
          ...state.inviteeData[`${name}`],
          value: value,
          error: "",
        },
      };
      console.log(cc, "ccccccccccccccc");
      return {
        ...state,
        inviteeData: cc,
        subVisitorTypeArr: filteredArr,
      };
    }

    case ON_CLICK_INVITE: {
      const { name, value } = action.payload;
      console.log(name, value, state, "onclick inviteeee");
      let updatedData = "";

      if (name === "date" || name === "visitor_type") {
        console.log(state[name].includes(value.toString()), "check existtttt");
        updatedData = {
          ...state,
          [name]: state[name].includes(value.toString())
            ? state[name].filter((item) => item !== value)
            : [...state[name], value],
        };
      } else {
        console.log("elaseeee");
        updatedData = {
          ...state,
          [name]: value,
        };
      }
      return updatedData;
    }

    case INITIAL_VISITOR_INVITE: {
      return {
        ...state,
        inviteeData: initialState.inviteeData,
      };
    }

    case INVITEE_VALIDATION: {
      const { name, value, error } = action.payload;

      return {
        ...state,
        inviteeData: {
          ...state.inviteeData,
          [name]: {
            ...state.inviteeData[`${name}`],
            error: error,
            value: value,
          },
        },
      };
    }
    case SET_SUBVISITOR_LIST: {
      const { data } = action.payload;
      return {
        ...state,
        // subVisitorTypeArr: [],
        subVisitorTypeArr: data,
        subVisitorOrgArr: data,
      };
    }
    // case CLEAR_VAL: {
    //   return {
    //     ...state,
    //     subVisitorTypeArr: [],
    //     subVisitorOrgArr: [],
    //   };
    // }
    case LIST_MYINVITATIONS_DATA: {
      const { name, data, page, per_page, totalEntries } = action.payload;
      console.log(totalEntries, "ttttttttttttttttt");
      let arr1;
      if (totalEntries < 30) {
        arr1 = data;
      } else if (totalEntries == 0 || state[name].length < totalEntries) {
        arr1 = data.length > 0 && [...new Set([...state[name], ...data])];
      } else if (state.totalEntries != totalEntries) {
        arr1 = data;
      } else {
        console.log("elseee");
        arr1 = state[name];
      }
      return {
        ...state,
        [name]: arr1,
        page,
        per_page,
        totalEntries,
      };
    }

    case SET_INVITE_LOADER: {
      const { loader } = action.payload;
      return {
        ...state,
        inviteLoader: loader,
      };
    }

    case ON_RESET_FILTER: {
      const { name, value } = action.payload;
      return {
        ...state,
        [name]: [value],
      };
    }

    case INVITE_RESET: {
      console.log("reset called33");
      return {
        ...initialState,
      };
    }

    default:
      return state;
  }
}
