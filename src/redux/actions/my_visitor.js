import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-simple-toast";
import { ToastMessage } from "../../components";

import {
  ON_SUBSCRIBE_NOTICE,
  LIST_SUBSCRIPTION,
  LIST_NOTICE,
  UPDATE_NOTIFICATION,
  STOP_LOADER,
  ON_VISITOR_CHANGE,
  SET_THEME,
  SET_VISITOR_LOADER,
  LIST_MYVISITORS_DATA,
  SET_PHONE_AGGR,
} from "../actionTypes";

import {
  myVisitorList,
  myVisitorsAggs,
  showVisitorDetails,
} from "../../api/my_visitor";
import { stopLoader } from "./registration";
import {
  visitorTypeApi,
  dateCalculate,
  findMinMaxDateFromSelectedFilter,
} from "../../helpers";

export const listMyVisitorsData = (isClicked) => {
  return async (dispatch, getState) => {
    const {
      page,
      per_page,
      visitor_type,

      totalEntries,
      days,
      phone,
      date,
    } = getState()["myVisitor"];
    dispatch(setVisitorLoader(true));

    let params = {
      page,
      per_page,
      purpose: visitorTypeApi(visitor_type),
      from_time: dateCalculate(findMinMaxDateFromSelectedFilter(date).from_date)
        .from_time,
      to_time: dateCalculate(findMinMaxDateFromSelectedFilter(date).to_date)
        .to_time,
      phone: phone,
    };

    myVisitorList({ params })
      .then((data) => {
        const { total_entries } = data;
        // const parseData = JSON.parse(data.data);
        console.log(data.data, "visitors");
        dispatch({
          type: LIST_MYVISITORS_DATA,
          payload: {
            name:
              params["purpose"].length == 4
                ? "myVisitorData"
                : (params["purpose"][0] === "guest" && "GuestArr") ||
                  (params["purpose"][0] === "contractor" && "ContractorArr") ||
                  (params["purpose"][0] === "delivery" && "DeliveryArr") ||
                  (params["purpose"][0] === "pickup/drop" && "PickupDropArr"),
            data: data.data,
            page: page,
            per_page: 30,
            totalEntries: data.total_entries,
            // page: per_page < total_entries ? page + 1 : page,
            // per_page: per_page < total_entries ? per_page : per_page,
            // totalEntries: total_entries,
          },
        });
        dispatch(setVisitorLoader(false));
      })
      .catch((err) => {
        dispatch(setVisitorLoader(false));
        console.log(err, "list myvisitor data");
        // ToastMessage(err[0], err[1]?.message);
      });
  };
};

export const onVisitorChange = ({ name, value }) => {
  console.log(name, value, "visitor change action");
  return (dispatch) => {
    dispatch({
      type: ON_VISITOR_CHANGE,
      payload: {
        name,
        value,
      },
    });
    // dispatch(listMyVisitorsData());
  };
};

export const setVisitorLoader = (loader) => {
  console.log(loader, "set visitor loader action");
  return (dispatch) => {
    dispatch({
      type: SET_VISITOR_LOADER,
      payload: {
        loader,
      },
    });
  };
};

export const setPhoneAggr = () => {
  return (dispatch, getState) => {
    const {
      visitor_type,

      totalEntries,
      days,
      date,
    } = getState()["myVisitor"];

    const params = {
      purpose: visitorTypeApi(visitor_type),
      from_time: dateCalculate(findMinMaxDateFromSelectedFilter(date).from_date)
        .from_time,
      to_time: dateCalculate(findMinMaxDateFromSelectedFilter(date).to_date)
        .to_time,
    };
    myVisitorsAggs({ params })
      .then((data) => {
        console.log(data.data.phone.phone.buckets, "data phone aggr");
        let phoneArr = [];
        data?.data?.phone?.phone.buckets?.map((ele) => {
          phoneArr.push(ele.key);
        });
        console.log(phoneArr, "phone arr");
        dispatch({
          type: SET_PHONE_AGGR,
          payload: {
            phoneArr: phoneArr,
          },
        });
      })
      .catch((err) => {
        ToastMessage(err[0], err[1]?.message);
      });
  };
};

export const showVisitor = (id) => {
  console.log(id, "actionnn");
  return (dispatch, getState) => {
    showVisitorDetails(id)
      .then((data) => {
        console.log(data, data.data.visitors, "show data visitorrr");
        dispatch({
          type: ON_VISITOR_CHANGE,
          payload: {
            name: "visitorDetails",
            value: data.data,
          },
        });
      })
      .catch((err) => {
        ToastMessage(err[0], err[1]?.message, err);
      });
  };
};
