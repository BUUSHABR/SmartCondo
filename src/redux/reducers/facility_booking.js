import React from "react";
import moment from "moment";

import {
  ON_FACILITY_DATA_CHANGE,
  FACILITY_VALIDATION,
  FACILITY_CHANGE,
  ON_CLICK_FACILITIES,
  FACILITY_RESET,
  ON_FACILITY_QUESTION_CHANGE,
  FACILITY_FETCH_DATA_REQUEST,
  FACILITY_FETCH_DATA_SUCCESS,
  FACILITY_FETCH_DATA_FAILURE,
  FACILITY_RESET_DATA,
} from "../actionTypes";

const empty_object = (nextRef = React.createRef()) => ({
  start_date: {
    value: new Date(),
    error: "",
    startDateRef: nextRef,
    stateChange: false,
  },
  start_time: {
    value: "",
    error: "",
    startTimeRef: nextRef,
    stateChange: false,
  },
  end_time: {
    value: "",
    error: "",
    endTimeRef: nextRef,
    stateChange: false,
  },
  court: {
    value: "Court1",
    error: "",
    courtRef: nextRef,
  },
  id: "",
  comment: {
    value: "",
    error: "",
    nameRef: React.createRef(),
  },
  remarks: {
    value: "",
  },
  payment_type: {
    value: "",
  },
  accompanied: {
    value: "",
    error: "",
    nameRef: React.createRef(),
  },
  file: {
    value: "",
    nameRef: React.createRef(),
    stateChange: false,
  },
  amount: {
    value: 0,
  },
  SlotStore: {
    value: [],
  },
  rule_ids: {
    value: [],
  },
  amount_type: {
    value: "",
  },
  fixed_amount: {
    value: 0,
  },
  deposit_amount: {
    value: 0,
  },
  payment_method: {
    value: "",
  },
  questions: { value: [] },

  nextRef: React.createRef(),
});

const initialState = {
  loading:false,
  bookingAfterData: [],
  bookingAfterPage: 1,
  bookingAfterLoading: false,
  bookingAfterTotalEntries: 0,
  bookingBeforeData: [],
  bookingBeforePage: 1,
  bookingBeforeLoading: false,
  bookingBeforeTotalEntries: 0,
  facilitiesTypesList: [],
  facilitiesLoader: false,
  facilityId: "",
  facilitiesBookingData: {
    ...empty_object(),
    facility_type: "",
  },
  slotDetails: {},
  loader: false,
  slots: [],
  facilitiesDetails: {
    id: "d82e7c14-3197-4a1c-977c-f0a31415f915",
    name: "GYM",
    alias_name: "gym",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus volutpat arcu mauris.Curabitur mi ex, ullamcorper at feugiat pulvinar, pha retra eget eros. Phasellus consectetur nibh ac leo aliquet,sit ametpo suere tellus semper",
    status: "active",
    about: ["first_aid_kid", "balls", "drining_water"],
    image_url: [
      "https://docs-assets.katomaran.tech/images/smartcondo/facility_booking/2022/01/hockey.svg",
      "https://docs-assets.katomaran.tech/images/smartcondo/facility_booking/2022/01/function_hall.svg",
      "https://docs-assets.katomaran.tech/images/smartcondo/facility_booking/2022/01/bbq.svg",
      "https://docs-assets.katomaran.tech/images/smartcondo/facility_booking/2022/01/function_hall.svg",
      "https://docs-assets.katomaran.tech/images/smartcondo/facility_booking/2022/01/function_hall.svg",
    ],
    open_time: "09:00",
    close_time: "21:00",
    title_image_id: null,
    created_at: "2022-01-07T06:46:48.606+08:00",
    updated_at: "2022-01-07T06:46:48.606+08:00",
  },
  facilitiesbookedDetails: {},
  facilitiesList: [],
  allFacilityList: [],
  upcomingFacilityList: [],
  completedFacilityList: [],
  facilitiesFilter: ["date", "facilities_type"],
  date: ["this_month"],
  facilities_type: ["all"],
  facilityStatus: "All",
  facilitiesFilterArr: [],
  days: 30,
  page: 1,
  per_page: 30,
  totalEntries: 0,
  showCancelButton: true,
  bookingDetails: {},
  facilitiesFilterArr2: [],
};

export default function(state = initialState, action) {
  console.log(action, "facility booking actions");
  switch (action.type) {
    case FACILITY_RESET_DATA: {
      return {
        ...state,
        bookingAfterData: [],
        bookingAfterPage: 1,
        bookingAfterLoading: false,
        bookingAfterTotalEntries: 0,
        bookingBeforeData: [],
        bookingBeforePage: 1,
        bookingBeforeLoading: false,
        bookingBeforeTotalEntries: 0,
      };
    }
    case FACILITY_FETCH_DATA_REQUEST: {
      return { ...state, loading: true };
    }
    case FACILITY_FETCH_DATA_SUCCESS: {
      const {
        name,
        value,
        pageName,
        loaderName,
        totalEntryName,
        totalEntries,
        isFirstFetch
      } = action.payload;
      console.log( "Facility pagination reducer set state",isFirstFetch);
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
        [loaderName]: false,
        [totalEntryName]: totalEntries,
        loading:false
      };
    }
    case FACILITY_FETCH_DATA_FAILURE: {
      return { ...state, loading: false };
    }
    case ON_FACILITY_DATA_CHANGE: {
      console.log("fc change reducerr");

      const { name, value, stateChange } = action.payload;
      console.log(name, value, stateChange, "fc change reducerr");
      // let cc = {
      //   ...state.facilitiesBookingData,
      //   [name]: {
      //     ...state.facilitiesBookingData[`${name}`],
      //     value: value,
      //     error: '',
      //     stateChange: stateChange,
      //   },
      // };
      // console.log(cc, 'cccc');
      return {
        ...state,
        facilitiesBookingData: {
          ...state.facilitiesBookingData,
          [name]: {
            ...state.facilitiesBookingData[`${name}`],
            value: value,
            error: "",
            stateChange: stateChange,
          },
        },
      };
    }

    case ON_FACILITY_QUESTION_CHANGE: {
      const { value, index, type, prev } = action.payload;
      console.log(
        value,
        index,
        type,
        prev,
        "ON_FACILITY_QUESTION_CHANGE reducer"
      );
      const { questions } = state.facilitiesBookingData;
      const indexOf = questions.value?.findIndex(
        (obj) => obj.facility_question_id === index
      );
      let tempQues = questions.value;
      if (type == "text") {
        tempQues[indexOf].answer = value;
      } else if (type == "yes") {
        tempQues[indexOf].answer.yes = value;
        tempQues[indexOf].answer.no = !value;
      } else if (type == "no") {
        tempQues[indexOf].answer.yes = !value;
        tempQues[indexOf].answer.no = value;
      }
      return {
        ...state,
        facilitiesBookingData: {
          ...state.facilitiesBookingData,
          questions: {
            value: [...tempQues],
          },
        },
      };
    }
    case FACILITY_CHANGE: {
      const { name, value } = action.payload;
      console.log(name, value, "FACILITY Change data ");
      return {
        ...state,
        [name]: value,
      };
    }
    case FACILITY_VALIDATION: {
      const { name, value, error, stateChange } = action.payload;
      console.log(
        name,
        value,
        error,
        stateChange,
        "qwerty hjjhjjhhj ̰ ̰ ̰ ̰ ̰ ̰ ̰ ̰ ̰ ̰ˇˇ"
      );
      return {
        ...state,
        facilitiesBookingData: {
          ...state.facilitiesBookingData,
          [name]: {
            ...state.facilitiesBookingData[`${name}`],
            error: error,
            value: value,
            stateChange: stateChange,
          },
        },
      };
    }

    case ON_CLICK_FACILITIES: {
      const { name, value, reset } = action.payload;
      let updatedData = "";
      console.log(state[name], value, [value], reset, "check existtttt", name);

      if (reset) {
        updatedData = {
          ...state,
          [name]: [value],
        };
      } else if (name === "date" || name === "facilities_type") {
        updatedData = {
          ...state,
          [name]: state[name].includes(value.toString())
            ? state[name].length < 2
              ? state[name]?.map((item) => item)
              : state[name].filter((item) => item !== value)
            : [...state[name], value],
        };
      } else if (name === "facilities_type") {
        updatedData = {
          ...state,
          [name]: [value],
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

    case FACILITY_RESET: {
      console.log("reset called33");
      return {
        ...initialState,
      };
    }
    default:
      return state;
  }
}
