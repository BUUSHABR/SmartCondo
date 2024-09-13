import {
  LIST_MYVISITORS_DATA,
  ON_VISITOR_CHANGE,
  SET_VISITOR_LOADER,
  SET_PHONE_AGGR,
} from '../actionTypes';
import moment from 'moment';
import {removeEle} from '../../helpers';

const initialState = {
  myVisitorData: [],
  GuestArr: [],
  ContractorArr: [],
  DeliveryArr: [],
  PickupDropArr: [],
  filteredData: [],
  phoneArr: [],
  visitor_type: 'All',
  visitorsFilter: ['date', 'phone'],
  visitorLoader: true,
  page: 1,
  per_page: 30,
  from_time: new Date(),
  to_time: new Date(),
  totalEntries: 0,
  phone: '',
  date: ['last_30'],
  days: 30,
  visitorDetails: {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    case LIST_MYVISITORS_DATA: {
      const {name, data, page, per_page, totalEntries} = action.payload;
      console.log(name, 'name in visitor reducer');
      let arr1;
      if (totalEntries == 0 || state[name].length < totalEntries) {
        arr1 = data.length > 0 && [...new Set([...state[name], ...data])];
      } else if (state.totalEntries != totalEntries) {
        arr1 = data;
      } else {
        console.log('elseee');
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

    case ON_VISITOR_CHANGE: {
      const {name, value} = action.payload;
      console.log(name, value, 'on chnage reducer',state.phoneArr);

      // let val = state[name];
      let filteredArr = [];

      // let bb =
      //   key && value
      //     ? val.includes(name)
      //       ? val
      //       : val.concat(name)
      //     : removeEle(val, name);

      if (name === 'phone' && value?.length > 0) {
        filteredArr = state.phoneArr.filter(ele => {
          return ele.indexOf(value) > -1;
        });
      }
      // else if (name === 'visitorDetails' || name === 'visitor_type') {
      //   details = value || {};
      // }
      else {
        filteredArr = state.phoneArr;
      }
console.log(filteredArr,"eofinuefejfkeqfugfkk");
      let a = {
        ...state,
        [name]: name === 'date' ? [value] : value,
        // visitorDetails: details || {},
        filteredData: filteredArr,
      };
      return a;
    }
    case SET_VISITOR_LOADER: {
      const {loader} = action.payload;
      return {
        ...state,
        visitorLoader: loader,
      };
    }
    case SET_PHONE_AGGR: {
      const {phoneArr} = action.payload;
      console.log(phoneArr,"kjsjjsjsjjsjsj");
      return {
        ...state,
        phoneArr: phoneArr,
      };
    }
    default:
      return state;
  }
}
