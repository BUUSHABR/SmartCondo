import {
  ON_SUBSCRIBE_NOTICE,
  LIST_SUBSCRIPTION,
  LIST_NOTICE,
  UPDATE_NOTIFICATION,
} from '../actionTypes';
import moment from 'moment';

const initialState = {
  notice_subscribe: [],
  list_notice: [],
  last_updated: {},
  notification_loader: true,
  unreadCount: 0,
  call_type:''
};

export default function (state = initialState, action) {
  switch (action.type) {
    case ON_SUBSCRIBE_NOTICE: {
      const {id,value} = action.payload;
      console.log(value,"fcmsms");
      const result = state.notice_subscribe?.map(obj => {
        if (obj['id'] === id) {
          return {...obj, fcm: value == "fcm" ? !obj.fcm: obj.fcm,sms:value == "sms" ? !obj.sms: obj.sms};
        } else {
          return obj;
        }
      });
      console.log(result, 'resssssssssss');

      return {
        ...state,
        notice_subscribe: result,
      };
    }

    case LIST_SUBSCRIPTION: {
      const {data} = action.payload;
      const data1 = data.data;
      return {
        ...state,
        notice_subscribe: data1,
      };
    }
    case LIST_NOTICE: {
      console.log('after st tt data');

      const {data} = action.payload;
      return {
        ...state,
        list_notice: data.data,
        unreadCount: data.data.filter(item => {
          return item.status === 'unread';
        }).length,
      };
    }
    case UPDATE_NOTIFICATION: {
      const {method, id, params} = action.payload;
      console.log(method, id, params, 'parammmmmsss');
      return {
        ...state,
        last_updated: {
          method: method,
          id: id,
          status: params.status,
        },
      };
    }
    default:
      return state;
  }
}
