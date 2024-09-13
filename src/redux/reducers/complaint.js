import React from "react";
import moment from "moment";

import {
  LIST_COMPLAINTS,
  ON_COMPLAINTS_CHANGE,
  COMPLAINT_VALIDATION,
  COMPLAINTS_CHANGE,
  SET_COMPLAINT_DATA_LIST,
} from "../actionTypes";

const initialState = {
  banner_url: "",
  helpDeskQuestions: {},
  complaints: [],
  complaintsLoader: false,
  complaintSearch: "",
  complaintTypeSearch: "",
  showComplaintDetail: {
    value: "",
  },
  reply: {
    value: "",
    error: "",
  },
  subject: {
    value: "",
    error: "",
  },
  description: {
    value: "",
    error: "",
    descriptionRef: React.createRef(),
  },
  complaint_type: {
    value: "",
    error: "",
  },
  file: {
    value: "",
  },
  complaintTypeArr: [],
  complaintOrgArr: [],
  sub_visitor: [],
  onSheetOpen: false,
  questionsList: [],
};

export default function(state = initialState, action) {
  switch (action.type) {
    case LIST_COMPLAINTS: {
      const { name, data } = action.payload;
      return {
        ...state,
        [name]: data,
      };
    }
    case ON_COMPLAINTS_CHANGE: {
      const { name, value } = action.payload;
      console.log(name, value, "bbbbb");
      return {
        ...state,
        [name]: value,
      };
    }
    case COMPLAINT_VALIDATION: {
      const { name, value, error } = action.payload;
      return {
        ...state,
        [name]: {
          ...state[name],
          error: error,
          value: value,
        },
      };
    }

    case COMPLAINTS_CHANGE: {
      const { name, value } = action.payload;
      console.log(name, value, "wdwwkjdwdkjwdwgdkdw");
      let filteredArr=state.complaintTypeArr
      if (name === "complaintSearch" && value?.length > 0) {
        filteredArr = state.complaintTypeArr.filter((ele) => {
          return ele.title.toLowerCase().indexOf(value.toLowerCase()) > -1;
        });
        console.log(filteredArr,"dededededed");
      }
      if (name === "complaintSearch") {
        return {
          ...state,
          sub_visitor: filteredArr,
        };
      } else {
        return {
          ...state,
          [name]: {
            ...state[`${name}`],
            value: value,
            error: "",
          },
        };
      }
    }
    case SET_COMPLAINT_DATA_LIST: {
      const { data } = action.payload;
      return {
        ...state,
        complaintTypeArr: data,
        complaintOrgArr: data,
        sub_visitor: data,
      };
    }
    default:
      return state;
  }
}
