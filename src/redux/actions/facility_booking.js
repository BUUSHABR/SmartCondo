import React, { Component, useEffect, useState } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-simple-toast";
import { ToastMessage } from "../../components";
import * as RootNavigation from "../../navigation/RootNavigation";
import { serialize } from "object-to-formdata";

import {
  FACILITY_VALIDATION,
  ON_FACILITY_DATA_CHANGE,
  FACILITY_CHANGE,
  ON_CLICK_FACILITIES,
  FACILITY_RESET,
  ON_FACILITY_QUESTION_CHANGE,
  FACILITY_FETCH_DATA_REQUEST,
  FACILITY_FETCH_DATA_SUCCESS,
  FACILITY_FETCH_DATA_FAILURE,
  FACILITY_RESET_DATA,
} from "../actionTypes";
import { submitControl } from "./login";
import {
  FacilitySuccess,
  InviteSuccess,
  MAFacilityIcon,
} from "../../../assets/img/svgs";
import {
  facilitiesList,
  aboutFacility,
  listFacilityTypes,
  facilityBooking,
  bookingsList,
  cancelBookedFacility,
  BookingDetails,
  BookingsFilter,
  facilitySlotBookingsDetails,
} from "../../api/facility_booking";
import moment from "moment";
import {
  convertToLocalDateFormat,
  convertToLocalTimeFormat,
  dateCalculate,
  findMinMaxDateFromSelectedFilter,
} from "../../helpers";

export const listFacilityTypesAction = () => {
  return (dispatch, getState) => {
    // dispatch(facilityChange({name: 'facilitiesLoader', value: true}));
    listFacilityTypes()
      .then((data) => {
        console.log(data, "list facility typee");
        dispatch(
          facilityChange({ name: "facilitiesTypesList", value: data.data })
        );
        dispatch(facilityChange({ name: "facilitiesLoader", value: false }));
        dispatch(facilityResetData());
      })
      .catch((err) => {
        ToastMessage(err[0], err[1]?.message, err);
        dispatch(facilityChange({ name: "facilitiesLoader", value: false }));
      });
  };
};

export const fetchBookingsListCopy = (decide) => {
  return (dispatch, getState) => {
    const {
      page,
      per_page,
      days,
      date,
      facilities_type,
      facilityStatus,
      facilitiesFilterArr,
    } = getState()["facility"];
    console.log(days, "facility booking daysss");
    const params = {
      page,
      per_page,
      facilities_type,
      facilitiesFilterArr,
      facilityStatus,
      from_time: dateCalculate(findMinMaxDateFromSelectedFilter(date).from_date)
        .from_time,
      to_time: dateCalculate(findMinMaxDateFromSelectedFilter(date).to_date)
        .to_time,
    };
    console.log(facilitiesFilterArr, "paramssssssAnd And", facilities_type);
    BookingsFilter({ from_time: params.from_time, to_time: params.to_time })
      .then(({ data }) => {
        let assignAggs = [];
        let aggs = data["facility.name"]["facility.name"].buckets;
        aggs.forEach((data) => {
          assignAggs.push({
            label: data.key,
            value: data.key.toLowerCase(),
            action: "",
          });
        });
        console.log(
          data["facility.name"]["facility.name"].buckets,
          "aggreegartion",
          assignAggs
        );
        dispatch({
          type: FACILITY_CHANGE,
          payload: {
            name: "facilitiesFilterArr",
            value: assignAggs,
          },
        });
      })
      .catch((err) => {
        ToastMessage(err[0], err[1]?.message, err);
      });
    bookingsList({ params })
      .then((data) => {
        console.log(data, "respnse data tttttt");
        dispatch({
          type: FACILITY_CHANGE,
          payload: {
            name:
              (facilityStatus === "All" && "allFacilityList") ||
              (facilityStatus === "Upcoming" && "upcomingFacilityList") ||
              (facilityStatus === "Completed" && "completedFacilityList") ||
              (facilityStatus === "Closed" && "closedFacilityList"),
            value: data.data,
          },
        });
        dispatch(facilityChange({ name: "facilitiesLoader", value: false }));
      })
      .catch((err) => {
        console.log(err, "errrrr");
        ToastMessage(err[0], err[1]?.message, err);
        dispatch(facilityChange({ name: "facilitiesLoader", value: false }));
      });
  };
};

export const fetchBookingRequest = () => {
  return (dispatch) => {
    dispatch({
      type: FACILITY_FETCH_DATA_REQUEST,
    });
  };
};

export const fetchBookingSuccess = (data) => {
  console.log(data, "fetchBookingSuccess");
  return (dispatch) => {
    dispatch({
      type: FACILITY_FETCH_DATA_SUCCESS,
      payload: data,
    });
  };
};

export const fetchBookingFailure = () => {
  return (dispatch) => {
    dispatch({
      type: FACILITY_FETCH_DATA_FAILURE,
    });
  };
};

export const fetchBookingsList = (paginationParams) => {
  return (dispatch, getState) => {
    const {} = getState()["facility"];
    paginationParams.isFirstFetch && dispatch(fetchBookingRequest());
    const currentDate = moment();
    let from_time = currentDate.format();
    let to_time = currentDate.format();
    if (paginationParams.name == "bookingBeforeData") {
      from_time = currentDate.subtract(6, "months").format();
      to_time = moment()
        .subtract(1, "day")
        .endOf("day")
        .format();
    } else {
      from_time = moment()
        .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
        .format();
      to_time = currentDate.add(6, "months").format();
    }

    const params = {
      from_time: from_time,
      to_time: to_time,
      page: paginationParams.page,
    };
    bookingsList({ params })
      .then((data) => {
        console.log(
          data.total_entries,
          "respnse data tttttt",
          paginationParams.name == "bookingBeforeData"
            ? "bookingBeforeTotalEntries"
            : "bookingAfterTotalEntries"
        );
        dispatch(
          fetchBookingSuccess({
            ...paginationParams,
            value: data.data,
            totalEntryName:
              paginationParams.name == "bookingBeforeData"
                ? "bookingBeforeTotalEntries"
                : "bookingAfterTotalEntries",
            totalEntries: data.total_entries,
          })
        );
      })
      .catch((err) => {
        ToastMessage(err[0], err[1]?.message, err);
        dispatch(fetchBookingFailure());
      });
  };
};

export const facilityDetailsAction = (id) => {
  return (dispatch, getState) => {
    dispatch(onFacilityDataChange({ name: "facilitiesLoader", value: true }));
    facilityDetails(id)
      .then((data) => {
        console.log(
          "data++++++++++++++++++++++++++++++++++++++++++++============",
          data.data
        );
        dispatch(
          onFacilityDataChange({
            name: "facilitiesDetails",
            value: data.data,
          })
        );
        dispatch(
          onFacilityDataChange({ name: "facilitiesLoader", value: false })
        );
      })
      .catch((err) => {
        ToastMessage(err[0], err[1]?.message, err);
        onFacilityDataChange({ name: "facilitiesLoader", value: false });
      });
  };
};

export const BookingAggregation = (params) => {
  return (dispatch, getState) => {
    BookingsFilter(params)
      .then(({ data }) => {
        console.log(params, "lomarn");
        let assignAggs = [];
        let aggs = data["facility.name"]["facility.name"].buckets;
        aggs.forEach((data) => {
          assignAggs.push({
            label: data.key,
            value: data.key.toLowerCase(),
            action: "",
          });
        });
        console.log(assignAggs, "lomarnnnn");
        dispatch({
          type: FACILITY_CHANGE,
          payload: {
            name: "facilitiesFilterArr",
            value: assignAggs,
          },
        });
      })

      .catch((err) => {
        ToastMessage(err[0], err[1]?.message, err);
      });
  };
};
export const FacilitySlotBookingsDetails = (id, time) => {
  return (dispatch, getState) => {
    console.log(id, time, "FacilitySlotBookingsDetails before");
    dispatch({
      type: FACILITY_CHANGE,
      payload: {
        name: "loader",
        value: true,
      },
    });
    facilitySlotBookingsDetails(id, time)
      .then(({ data }) => {
        console.log(data, "FacilitySlotBookingsDetails");
        dispatch({
          type: FACILITY_CHANGE,
          payload: {
            name: "slotDetails",
            value: data,
          },
        });
        setTimeout(() => {
          dispatch({
            type: FACILITY_CHANGE,
            payload: {
              name: "loader",
              value: false,
            },
          });
        }, 1000);
      })

      .catch((err) => {
        ToastMessage(err[0], err[1]?.message, err);
        dispatch({
          type: FACILITY_CHANGE,
          payload: {
            name: "loader",
            value: false,
          },
        });
      });
  };
};

export const facilityChange = ({ name, value }) => {
  console.log("facilityChange", name, value);
  return (dispatch, getState) => {
    dispatch({
      type: FACILITY_CHANGE,
      payload: {
        name,
        value,
      },
    });
  };
};

export const onFacilityDataChange = ({ name, value, stateChange }) => {
  console.log(name, value, stateChange, "facility changeeegg logging");
  var data = value;
  if (name == "start_date") {
    var data = moment.utc(value).format();
    console.log(data, "ios modify");
  }
  console.log(name, data, "fac change");
  return (dispatch, getState) => {
    dispatch({
      type: ON_FACILITY_DATA_CHANGE,
      payload: {
        name,
        value: data,
        stateChange,
      },
    });
  };
};

export const onFacilityQuestionChange = ({ value, index, type, prev }) => {
  console.log(
    value,
    index,
    type,
    prev,
    "onFacilityQuestionChange action change"
  );

  return (dispatch, getState) => {
    dispatch({
      type: ON_FACILITY_QUESTION_CHANGE,
      payload: {
        value,
        index,
        type,
        prev,
      },
    });
  };
};

export const facilityValidation = ({ name, value, error, stateChange }) => {
  console.log(name, value, stateChange, "validation logging");
  var data = value;
  if (name == "start_date") {
    var data = moment.utc(value).format();
    console.log(data, "ios modify validation");
  }
  console.log(name, data, "validation change");
  return (dispatch) => {
    dispatch({
      type: FACILITY_VALIDATION,
      payload: {
        name,
        value,
        error,
        stateChange,
      },
    });
  };
};

export const facilitySubmit = (id, approval, paid, slot, deposit, reset) => {
  return (dispatch, getState) => {
    console.log("came here")
    dispatch(submitControl({ submitted: true }));
    const { facilitiesBookingData } = getState()["facility"];
    const {
      start_date,
      start_time,
      end_time,
      court,
      comment,
      accompanied,
      rule_ids,
      payment_method,
      amount_type,
      fixed_amount,
      deposit_amount,
      amount,
      questions,
      remarks,
      payment_type,
    } = facilitiesBookingData;
    console.log(payment_method, "payment_method from submit");
    console.log(`[Facilities Submit] booking data ${facilitiesBookingData}`);
    const joinDateTime = (date, time) => {
      console.log(date, time, "dtate join");
      return moment(date + " " + time, "DD/MM/YYYY hh:mm a").format();
    };
    console.log(
      moment(start_date.value).endOf("day"),
      moment(end_time.value).endOf("day"),
      "wdkjwd"
    );
    let endDay = moment(start_date.value)
      .endOf("day")
      .format("hh:mm a");
    let param = {
      bookings: {
        from_time: joinDateTime(
          convertToLocalDateFormat(start_date.value),
          start_time.value
        ),
        to_time: joinDateTime(
          convertToLocalDateFormat(start_date.value),
          slot == "disable" ? endDay : end_time.value
        ),
        facility_id: id,
        comment: comment["value"],
        remarks: remarks["value"],
        no_of_occupants: accompanied["value"],
        payment_image: paid?.uri ? paid : null,
        deposit_image: deposit?.uri ? deposit : null,
        through_gateway: false,
        amount:
          payment_method?.value != "unpaid"
            ? amount?.value + (deposit_amount?.value || 0)
            : 0,
        rule_ids: rule_ids?.value,
        offline_payment:
          payment_type?.value == "attachment_with_bill" ? false : true,
        payment_type:
          payment_type?.value != "attachment_with_bill"
            ? payment_type?.value
            : "",
        answers: questions.value?.map((data) => ({
          facility_question_id: data.facility_question_id,
          answer:
            typeof data?.answer == "string"
              ? data?.answer
              : (data?.answer?.yes && true) || (data?.answer?.no && false),
        })),
      },
    };
    let params = serialize(param);
    console.log(params, "aramsss", JSON.stringify(param));

    facilityBooking({ params })
      .then((data) => {
        console.log(data, "scucss data");
        reset && reset();
        {
          approval == "auto"
            ? RootNavigation.navigate("SuccessPage", {
                title: `Your slot is booked successfully`,
                message: `  `,
                image: <FacilitySuccess />,
                navigateTo: "FacilitiesHome",
              })
            : RootNavigation.navigate("FacilityMaApproval", {
                title: ` `,
                message: `  Your request is pending. Please wait for MA approval or contact the MA office.`,
                image: <MAFacilityIcon />,
                navigateTo: "FacilitiesHome",
              });
        }

        dispatch(submitControl({ submitted: false }));
      })
      .catch((err) => {
        console.log(err, "rrrrr");
        let message = err[1].data ? err[1].data[0] : err[1]?.message;
        // if (err[1]?.data[0] == "Max bookings reached for today") {
        //   RootNavigation.navigate("FacilitiesHome");
        // }
        ToastMessage(err[0], message, err);
        dispatch(submitControl({ submitted: false }));
      });

    // ToastMessage(200, 'Registration Successful!!!');
  };
};

export const cancelBooking = (id) => {
  console.log(id, "cancell bookinggg idd");
  return (dispatch, getState) => {
    cancelBookedFacility(id)
      .then((data) => {
        console.log(data, "camncel");
        dispatch(onClickFacilities({ name: "showCancelButton", value: false }));

        ToastMessage(200, data.message);
        RootNavigation.navigate("FacilitiesHome");
      })
      .catch((err) => {
        console.log(err, "cancel err");
        ToastMessage(
          err[0],
          err[0] == 422 ? err[1]?.data[0] : err[1]?.message,
          err
        );
      });
  };
};

export const onClickFacilities = ({ name, value, reset }) => {
  console.log(name, value, "onclickkk");
  return (dispatch, getState) => {
    dispatch({
      type: ON_CLICK_FACILITIES,
      payload: {
        name,
        value,
        reset,
      },
    });
  };
};

export const showBookingDetails = (id) => {
  console.log("show bookinng details");
  return (dispatch, getState) => {
    BookingDetails(id)
      .then(({ data }) => {
        console.log(
          data,
          "booking details api============================================================================================"
        );
        dispatch({
          type: FACILITY_CHANGE,
          payload: {
            name: "bookingDetails",
            value: data,
          },
        });
      })
      .catch((err) => {
        ToastMessage(err[0], err[1]?.message, err);
      });
  };
};

export const facilityReset = () => {
  return (dispatch, getState) => {
    dispatch({
      type: FACILITY_RESET,
    });
  };
};
export const facilityResetData = () => {
  return (dispatch, getState) => {
    dispatch({
      type: FACILITY_RESET_DATA,
    });
  };
};
