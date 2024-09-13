import React, { Component, useEffect, useState } from "react";
import { serialize } from "object-to-formdata";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-simple-toast";
import { ToastMessage } from "../../components";
import moment from "moment";
// import moment from 'moment-timezone';

import {
  LOGIN_INPUT_CHANGE,
  VALIDATION_ERROR_MESSAGE,
  SUBMIT_CONTROL,
  DECREMENT,
  INVITEE_VALIDATION,
  INVITE_CHANGE,
  INITIAL_VISITOR_INVITE,
  SET_SUBVISITOR_LIST,
  LIST_MYINVITATIONS_DATA,
  SET_INVITE_LOADER,
  ON_CLICK_INVITE,
  ON_RESET_FILTER,
  INVITE_RESET,
  CLEAR_VAL,
  INVITE_FETCH_DATA_FAILURE,
  INVITE_FETCH_DATA_SUCCESS,
  INVITE_FETCH_DATA_REQUEST,
  INVITE_RESET_DATA,
} from "../actionTypes";
import {
  sendOTP,
  verifyOTP,
  setLoginPASS,
  loginWithPASS,
  ForgotPASS,
  setForgotPASS,
  verifyForgotOTP,
  addFCMToken,
} from "../../api/login";
import { ToastAndroid, Platform, Alert } from "react-native";
import * as RootNavigation from "../../navigation/RootNavigation";
import { setUser, setBle } from "../actions/profile";
import { fcmToken, fcmPermission } from "../../api/firebase";
import { slackAPI } from "../../api";
import {
  fetchSubVisitorData,
  createInvites,
  cancelInvite,
  myInviteList,
  showInvite,
  InviteDetails,
} from "../../api/invite";
import {
  purposeTypeConversion,
  dateCalculate,
  capitalize,
  visitorTypeApi,
  numberOnlyRegex,
  findMinMaxDateFromSelectedFilter,
  ConvertTimeTOSGT,
} from "../../helpers";
import { InviteSuccess, MAFacilityIcon } from "../../../assets/img/svgs";
import { submitControl } from "./login";
import { InteractionManager } from "react-native";

export const inviteChange = ({ name, value }) => {
  console.log(name, value, "invitedata");
  return (dispatch, getState) => {
    dispatch({
      type: INVITE_CHANGE,
      payload: {
        name,
        value,
      },
    });
  };
};

export const onClickInvite = ({ name, value }) => {
  console.log(name, value, "onclickkkkkkkk");
  return (dispatch, getState) => {
    dispatch({
      type: ON_CLICK_INVITE,
      payload: {
        name,
        value,
      },
    });
  };
};

export const inviteeValidation = ({ name, value, error }) => {
  return (dispatch) => {
    dispatch({
      type: INVITEE_VALIDATION,
      payload: {
        name,
        value,
        error,
      },
    });
  };
};

export const initialVisitorInvite = () => {
  return (dispatch) => {
    dispatch({
      type: INITIAL_VISITOR_INVITE,
    });
  };
};
export const clearvalue = () => {
  // alert("ckead")
  return (dispatch) => {
    dispatch({
      type: CLEAR_VAL,
    });
  };
};

export const setSubvisitorList = () => {
  return (dispatch, getState) => {
    const {
      inviteeData: { purpose },
    } = getState()["invite"];
    // console.log(purpose.value,"wwww123",params?params:purpose.value);
    fetchSubVisitorData(purposeTypeConversion(purpose.value))
      .then((data) => {
        console.log(data, "json dataaa");
        dispatch({
          type: SET_SUBVISITOR_LIST,
          payload: {
            data: data.data,
          },
        });
      })
      .catch((err) => {
        console.log(err, "errrrrrrrrrrrrrrr");
        ToastMessage(err[0], err[1]?.message);
      });
  };
};

export const createInvite = (
  smsFlow,
  selfInvite,
  qrloader,
  Share,
  isContractorShare
) => {
  return (dispatch, getState) => {
    dispatch(submitControl({ submitted: true }));

    const { inviteeData } = getState()["invite"];
    const {
      name,
      phone,
      country_code,
      no_of_visitor,
      sub_visitor,
      company,
      purpose,
      remarks,
      visiting_time,
      vehicle_number,
      file,
    } = inviteeData;
    console.log(inviteeData, "invitee data on create ", isContractorShare);
    console.log(
      !moment().isBefore(moment(visiting_time.value))
        ? moment().format()
        : moment(visiting_time["value"])
          .startOf("day")
          .format(),
      "invwidyu++++++++++++++++++++++++++++++++++++++++++=create "
    );
    let params = {
      invites: {
        send_sms: !smsFlow,
        self_invite: selfInvite ? true : false,
        visiting_time: ConvertTimeTOSGT(visiting_time.value),
        // !moment().isBefore(moment(visiting_time.value))
        //   ? moment().format()
        //   : moment(visiting_time["value"])
        //     .startOf("day")
        //     .format(),
        purpose: purposeTypeConversion(purpose["value"]),
        remarks: remarks["value"],
        sub_visitor_type: sub_visitor["value"],
        attachement: file.value
          ? {
            uri: file.value.path,
            type: file.value.mime,
            name: "image.jpg",
          }
          : file["value"],
        invitees: [
          {
            name: name["value"],
            phone: phone["value"],
            country_code: country_code["value"] ? country_code["value"] : "+65 ",
            no_of_visitor: no_of_visitor["value"],
            vehicle_number: vehicle_number["value"].toUpperCase(),
            employer: company["value"],
          },
        ],
      },
    };
    const formData = serialize(params);
    console.log(formData, "new form data serialize", params);
    console.log(file.value ? true : false, "form data is ");

    console.log(formData, "datas of data vritres");
    createInvites(file.value ? formData : params, file.value ? true : false)
      .then((data) => {
        console.log("parms",params)
        !(!selfInvite && smsFlow) && ToastMessage(200, data.message);

        console.log(selfInvite, smsFlow, "093202930293023", qrloader);
        if (!selfInvite && smsFlow) {

          qrloader(true);
          console.log("entered 1");
          global.qrData = "";
          setTimeout(async () => {
            await InviteDetails(data.data.id)
              .then(async (data) => {
                console.log(data.data.content, "entered 3");
                global.qrData = data.data.content;

                if (data.data.content) {
                  qrloader(false);
                  console.log(data.data.content, "Content Available");
                  RootNavigation.navigate("InviteHome");
                  return  InteractionManager.runAfterInteractions(() => {
                    return Share.open({ message: data.data.content })
                      .then((res) => {
                        console.log("Share success:", res);
                        // Handle share success
                      })
                      .catch((err) => {
                        console.error("Share error:", err);
                        let errorMessage = err.message || "Unknown error";
                        ToastMessage("Error", errorMessage);
                      });
                  });
                

                  // Chain Promise
                } else {
                  console.log("[Qr Data] not have qr data", global.qrData);
                  qrloader(false);
                  // RootNavigation.navigate('Home');
                  return Promise.reject(new Error("No QR data available"));
                }
              })
              .then((res) => { // Handle share success
                console.log(res);
                RootNavigation.navigate("BottomTab");
                Platform.OS != "ios" && dispatch(initialVisitorInvite());
              })
              .catch((err) => { // Handle errors
                let message = err[1].data ? err[1].data[0] : err[1]?.message;
                ToastMessage(err[0], message);
                qrloader(false);
                console.error(err);
                RootNavigation.navigate("BottomTab");
              });
          }, 3000);
        } else {
          console.log(
            purposeTypeConversion(purpose["value"]),
            "[Purpose Invite]",
            isContractorShare
          );
          RootNavigation.navigate("SuccessPage", {
            title: (purposeTypeConversion(purpose["value"]) == "contractor"
              ? isContractorShare
              : true)
              ? `Your Invite ${smsFlow ? "Saved" : "Sent"} \n Successfully!`
              : " ",
            message: (purposeTypeConversion(purpose["value"]) == "contractor"
              ? isContractorShare
              : true)
              ? smsFlow
                ? "Please share your QR instead of sending"
                : "          "
              : "You have registered successfully. \n Once MA approves your account will be activate. Reach out to MA",
            image: (purposeTypeConversion(purpose["value"]) == "contractor" ? (
              isContractorShare
            ) : (
              true
            )) ? (
              <InviteSuccess />
            ) : (
              <MAFacilityIcon />
            ),
            navigateTo: "BottomTab",
            smsFlow: smsFlow,
          });
          dispatch(initialVisitorInvite());
        }

        dispatch(submitControl({ submitted: false }));
      })
      .catch((err) => {
        console.log(err, "invite err");
        dispatch(submitControl({ submitted: false }));
        let message = err[1].data ? err[1].data[0] : err[1]?.message;
        ToastMessage(err[0], message);
      });
  };
};
export const setInviteLoader = (loader) => {
  console.log(loader, "set invitr loader action");
  return (dispatch) => {
    dispatch({
      type: SET_INVITE_LOADER,
      payload: {
        loader,
      },
    });
  };
};

export const inviteBookingRequest = () => {
  return (dispatch) => {
    dispatch({
      type: INVITE_FETCH_DATA_REQUEST,
    });
  };
};

export const inviteBookingSuccess = (data) => {
  console.log(data, "fetchBookingSuccess");
  return (dispatch) => {
    dispatch({
      type: INVITE_FETCH_DATA_SUCCESS,
      payload: data,
    });
  };
};

export const inviteBookingFailure = () => {
  return (dispatch) => {
    dispatch({
      type: INVITE_FETCH_DATA_FAILURE,
    });
  };
};

export const fetchInviteList = (paginationParams) => {
  return (dispatch, getState) => {
    paginationParams.isFirstFetch && dispatch(inviteBookingRequest());
    const currentDate = moment();
    let from_time = currentDate.format();
    let to_time = currentDate.format();
    if (paginationParams.name == "inviteBeforeData") {
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

    myInviteList({ params })
      .then((data) => {
        console.log(
          data.total_entries,
          "respnse data tttttt",
          paginationParams.name == "inviteBeforeData"
            ? "inviteBeforeTotalEntries"
            : "inviteAfterTotalEntries"
        );
        dispatch(
          inviteBookingSuccess({
            ...paginationParams,
            value: data.data,
            totalEntryName:
              paginationParams.name == "inviteBeforeData"
                ? "inviteBeforeTotalEntries"
                : "inviteAfterTotalEntries",
            totalEntries: data.total_entries,
          })
        );
      })
      .catch((err) => {
        ToastMessage(err[0], err[1]?.message, err);
        dispatch(inviteBookingFailure());
      });
  };
};
export const listMyInvitationsDataCopy = () => {
  return (dispatch, getState) => {
    const { page, per_page, date, inviteStatus, visitor_type } = getState()[
      "invite"
    ];
    console.log(
      page,
      per_page,
      date,
      inviteStatus,
      visitor_type,
      "inviteStatusbhdd"
    );
    // let filteredVisitor = visitor_type?.map(item => {
    //   return visitorTypeApi(capitalize(item));
    // });
    dispatch(setInviteLoader(true));

    const params = {
      page,
      per_page,
      purpose: visitor_type?.map((item) => {
        console.log(item, "visitoritem");
        return capitalize(item);
      }),
      state: inviteStatus,
      from_time: dateCalculate(findMinMaxDateFromSelectedFilter(date).from_date)
        .from_time,
      to_time: dateCalculate(findMinMaxDateFromSelectedFilter(date).to_date)
        .to_time,
    };
    // alert(JSON.stringify(params));
    console.log(params, "invitepparam");
    myInviteList({ params })
      .then((data) => {
        // alert(JSON.stringify(data));

        dispatch(setInviteLoader(false));
        const { total_entries } = data;
        dispatch({
          type: LIST_MYINVITATIONS_DATA,
          payload: {
            name:
              (inviteStatus === "All" && "allInviteData") ||
              (inviteStatus === "Upcoming" && "upcomingInviteData") ||
              (inviteStatus === "Completed" && "expiredInviteData"),
            data: data.data,
            page: page,
            per_page: 30,
            totalEntries: data.total_entries,
            // page: per_page < total_entries ? page + 1 : page,
            // per_page: per_page < total_entries ? per_page : per_page,
            // totalEntries: total_entries,
          },
        });
        // dispatch(setInviteLoader(false));
      })
      .catch((err) => {
        dispatch(setInviteLoader(true));
        console.log(err, "list myvisitor data");
        ToastMessage(err[0], err[1]?.message);
      });
  };
};

export const cancelMyInvite = (id) => {
  console.log(id, "cancel incitee");
  return (dispatch, getState) => {
    console.log("camncell invoite before ai");
    cancelInvite(id)
      .then((data) => {
        console.log(data, "cancel succes");
        dispatch(onClickInvite({ name: "showCancelButton", value: false }));
        RootNavigation.navigate("InviteHome")
        ToastMessage(200, data.message);

      })
      .catch((err) => {
        ToastMessage(err[0], err[1]?.message, err);
      });
  };
};

export const onResetFilter = ({ name, value }) => {
  return (dispatch, getState) => {
    dispatch({
      type: ON_RESET_FILTER,
      payload: {
        name,
        value,
      },
    });
  };
};

export const showInviteDetails = (id) => {
  return (dispatch) => {
    showInvite(id)
      .then((data) => {
        console.log(data, "show invite dataaaa");
        dispatch({
          type: ON_CLICK_INVITE,
          payload: {
            name: "inviteDetails",
            value: data.data,
          },
        });
      })
      .catch((err) => {
        ToastMessage(err[0], err[1]?.message, err);
      });
  };
};

export const inviteReset = () => {
  return (dispatch, getState) => {
    dispatch({
      type: INVITE_RESET,
    });
  };
};
export const inviteResetData = () => {
  return (dispatch, getState) => {
    dispatch({
      type: INVITE_RESET_DATA,
    });
  };
};
