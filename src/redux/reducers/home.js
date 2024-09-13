import React from 'react';
import moment from 'moment';

import {
  INVITE_CHANGE,
  INITIAL_VISITOR_INVITE,
  INVITEE_VALIDATION,
  SET_SUBVISITOR_LIST,
  HOME_PAGE_DATA,
  HOME_PAGE_LOADER,
  RESET_STATE,
  SHOW_CASE_TRIGGER,
  SET_HOME_LOADER

} from '../actionTypes';

const initialState = {
  appFeature:false,
  FeatureData:{},
  upcomingInvites: [],
  announcements: [],
  announcementLoader: true,
  upcomingLoader: true,
  sos: '',
  sosData: [],
  sosLoader: true,
  features: [],
  featureLoader: false,
  announcementDetails: {},
  showcaseTrigger:false,
  netInfo:null,
  qr_expiry:false,
  featureData:{},
  condoinfo:{},
  infoloader:true,
  condoimages:[],
  count:0,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case HOME_PAGE_LOADER: {
      const {name, value} = action.payload;
      console.log(name, value, 'lloaderrr');
      return {
        ...state,
        [name]: value,
      };
    }
    case SHOW_CASE_TRIGGER: {
      const {name, value} = action.payload;
      console.log(name, value, 'showcase1');
      return {
        ...state,
        [name]: value,
      };
    }

    case HOME_PAGE_DATA: {
      const {name, data} = action.payload;
      console.log(name,"name ++++++++++++++++++++++++++++++++++++++++= ",data);
      console.log("payload",action.payload,"payload ");
      let aa =
        name === 'sosData'
          ? data?.filter(item => {
              return Object.values(item)?.[0] !== '' || null;
            })
          : data;
          console.log(aa,"______________________________________  ");
      return {
        ...state,
        [name]: aa,
      };
    }

    case RESET_STATE: {
      return {
        ...initialState,
      };
    }
    case SET_HOME_LOADER: {
      const {loader} = action.payload;
      return {
        ...state,
        announcementLoader: loader,
      };
    }
    default:
      return state;
  }
}
