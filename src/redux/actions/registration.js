import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { Component, useEffect, useState } from "react";

import {
  LIST_REGISTRATION,
  FAMILY_REGISTRATION,
  RESIDENT_REGISTRATION,
  ON_REGISTER_CHANGE,
  ON_REGISTER_VALIDATION,
  FAMILY_LIST,
  RESIDENT_LIST,
  SUBMIT_CONTROL,
  STOP_LOADER,
  CLEAR_STATE,
  RESIDENT_DETAILS,
  VEHICLE_LIST,
} from "../actionTypes";
import * as RootNavigation from "../../navigation/RootNavigation";

import {
  familyREGISTER,
  residentREGISTER,
  residentLIST,
  showRegistrationDETAILS,
  vehicleREGISTER,
  vehicleLIST,
} from "../../api/registration";
import { submitControl } from "./login";
import { ToastMessage } from "../../components";
import {
  RegisterSuccess,
  ResidentAddedSuccess,
} from "../../../assets/img/svgs";
import SuccessTick from "../../../assets/img/success_tick.svg";
import moment from "moment";

export const residentList = () => {
  console.log("call lst");
  return (dispatch, getState) => {
    residentLIST()
      .then((data) => {
        console.log(data, "data resss");
        dispatch(stopLoader(false));
        dispatch({
          type: RESIDENT_LIST,
          payload: { data },
        });
      })
      .catch((err) => {
        console.log(err, "residents list errrror");
        dispatch(stopLoader(false));
        ToastMessage(err[0], err[1]?.message);
      });
  };
};

export const vehicleList = () => {
  return (dispatch, getState) => {
    vehicleLIST()
      .then((data) => {
        console.log(data, "Vehicle Data");
        dispatch(stopLoader(false));
        dispatch({
          type: VEHICLE_LIST,
          payload: { data },
        });
      })
      .catch((err) => {
        console.log(err, "residents list errrror");
        dispatch(stopLoader(false));
        ToastMessage(err[0], err[1]?.message);
      });
  };
};
export const familyRegistration = () => {
  return (dispatch, getState) => {
    // RootNavigation.navigate('SuccessPage');

    dispatch(submitControl({ submitted: true }));
    const { name, gender, relation } = getState()["registration"]["add_family"];
    let params = { name, gender, relation };
    familyREGISTER({ params })
      .then((data) => {
        console.log(data, "dattttttaaaa familyb reg");
        ToastMessage(200, data.message || "Saved Successfully!!!");
        setTimeout(() => {
          RootNavigation.navigate("SuccessPage", {
            title: ` Created Successfully`,
            message: `Child/ Elder profile has been created \n successfully.`,
            image: <SuccessTick />,
            navigateTo: "ListResident",
          });
          dispatch(submitControl({ submitted: false }));
        }, 1000);
      })
      .catch((err) => {
        console.log(err, "family register erro");
        dispatch(submitControl({ submitted: false }));

        let message = err[1].data ? err[1].data[0] : err[1]?.message;

        ToastMessage(err[0], message);
      });
  };
};
export const residentsRegistration = () => {
  return (dispatch, getState) => {
    dispatch(submitControl({ submitted: true }));
    console.log(
      moment(exp_time)
        .startOf("day")
        .format(),
      "expirt time"
    );
    const { name, phone, email, resident_type, exp_time } = getState()[
      "registration"
    ]["add_residents"];
    let select =
      phone && email ? { phone, email } : phone ? { phone } : { email };
    let params = {
      ...select,
      name,
      resident_type: resident_type,
      tenant_expiry_time:
        resident_type != "owner"
          ? moment(exp_time)
              .startOf("day")
              .format()
          : "",
    };
    console.log(params, "parammssss", resident_type, exp_time);
    residentREGISTER({ params })
      .then((data) => {
        console.log(data, "resident REGISTER");
        ToastMessage(200, data.message || "Saved Successfully!!!");
        setTimeout(() => {
          data?.data?.class === "registration"
            ? RootNavigation.navigate("SuccessPage", {
                title: `Approval Pending !`,
                message: `Your registration is successfully submitted. \n Please wait till MA approves your request`,
                image: <RegisterSuccess />,
                navigateTo: "ListResident",
              })
            : RootNavigation.navigate("SuccessPage", {
                title: `Resident Added.!`,
                message: `New resident successfully added to your unit`,
                image: <ResidentAddedSuccess />,
                navigateTo: "ListResident",
              });
          dispatch(submitControl({ submitted: false }));
        }, 1000);
      })
      .catch((err) => {
        console.log(err, "resident register erro");
        dispatch(submitControl({ submitted: false }));

        let message = err[1].data ? err[1].data[0] : err[1]?.message;
        err[1].data && err[1].data[0].includes("has more than 4 residents")
          ? dispatch(
              onRegisterInputChange({
                type: "add_residents",
                name: "members_add",
                value: message,
              })
            )
          : ToastMessage(err[0], message);
        setTimeout(() => {
          dispatch(
            onRegisterInputChange({
              type: "add_residents",
              name: "members_add",
              value: "",
            })
          );
        }, 6000);
        // ToastMessage(err[0], message);
      });
  };
};

export const vehicleRegistration = () => {
  return (dispatch, getState) => {
    dispatch(submitControl({ submitted: true }));
    const { vehicle_type, vehicle_number } = getState()["registration"][
      "add_vehicle"
    ];
    const {
      userData: { id },
    } = getState()["profile"];
    let params = {
      vehicle_type,
      number_plate: vehicle_number,
      resident_id: id,
    };
    console.log(params, "paramssss");
    vehicleREGISTER({ params })
      .then((data) => {
        console.log(data, "success data");
        ToastMessage(200, data.message || "Saved Successfully!!!");
        setTimeout(() => {
          data?.auto_vehicle_assign?
          RootNavigation.navigate("SuccessPage", {
            title: ` Created Successfully`,
            message: `Vehicle created \n successfully.`,
            image: <SuccessTick />,
            navigateTo: "ListResident",
          }):
          RootNavigation.navigate("SuccessPage", {
            title: `Approval Pending !`,
            message: `Your registration is successfully submitted. \n Please wait till MA approves your request`,
            image: <RegisterSuccess />,
            navigateTo: "ListResident",
          })
          dispatch(submitControl({ submitted: false }));
        }, 1000);
      })
      .catch((err) => {
        dispatch(submitControl({ submitted: false }));
        let message = err[1].data ? err[1].data[0] : err[1]?.message;
        ToastMessage(err[0], message, err);
      });
  };
};

export const onRegisterInputChange = ({ type, name, value }) => {
  console.log(type, name, value, "nnnnnnnnnn");
  return (dispatch, getState) => {
    dispatch({
      type: ON_REGISTER_CHANGE,
      payload: {
        type,
        name,
        value,
      },
    });
  };
};

export const showRegistrationDetails = (id) => {
  return (dispatch, getState) => {
    console.log(id, "showm residenttttt detaillllsssss");
    showRegistrationDETAILS(id)
      .then((data) => {
        console.log(data, "show register resident detail");
        dispatch({
          type: RESIDENT_DETAILS,
          payload: {
            data,
          },
        });
        dispatch(stopLoader(false));
      })
      .catch((err) => {
        console.log(
          err,
          "show register resident detail eeeeerrrrrrrrrrrrrrrrrrrrr"
        );

        dispatch(stopLoader(false));

        ToastMessage(err[0], err[1]?.message, err);
      });
  };
};

export const onRegisterValidation = ({ type, field, message }) => {
  return (dispatch, getState) => {
    dispatch({
      type: ON_REGISTER_VALIDATION,
      payload: {
        type,
        field,
        message,
      },
    });
  };
};

// export const submitControl = ({submitted}) => {
//   return (dispatch, getState) => {
//     dispatch({
//       type: SUBMIT_CONTROL,
//       payload: {
//         submitted,
//       },
//     });
//   };
// };
export const stopLoader = (loader) => {
  return (dispatch) => {
    dispatch({
      type: STOP_LOADER,
      payload: {
        loader,
      },
    });
  };
};

export const clearState = (type) => {
  return (dispatch) => {
    dispatch({
      type: CLEAR_STATE,
      payload: {
        type,
      },
    });
  };
};
