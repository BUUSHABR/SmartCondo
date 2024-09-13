import React, { Component, useEffect, useState } from "react";
import { serialize } from "object-to-formdata";

import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-simple-toast";
import { ToastMessage } from "../../components";
import * as RootNavigation from "../../navigation/RootNavigation";

import {
  ON_COMPLAINTS_CHANGE,
  LIST_COMPLAINTS,
  COMPLAINT_VALIDATION,
  COMPLAINTS_CHANGE,
  SET_COMPLAINT_DATA_LIST,
} from "../actionTypes";
import {
  fetchComplaintList,
  showComplaints,
  createConversation,
  createComplaints,
  fetchComplaintsData,
  help_deskCategories,
  helpDesk_Submit,
} from "../../api/complaint";
import { ComplaintSuccess } from "../../../assets/img/svgs";
import { removeSpace } from "../../helpers";
import { submitControl } from "../actions/login";

export const listComplaints = () => {
  return (dispatch, getState) => {
    const { complaints, complaintSearch } = getState()["complaint"];
    console.log(complaintSearch, "list complaintttss");
    fetchComplaintList(complaintSearch)
      .then((data) => {
        dispatch({
          type: LIST_COMPLAINTS,
          payload: {
            name: "complaints",
            data: data.data,
          },
        });
        dispatch(onComplaintsChange("complaintsLoader", false));
      })
      .catch((err) => {
        console.log(err, "list compleints err");
        dispatch(onComplaintsChange("complaintsLoader", false));
        ToastMessage(err[0], err[1]?.message);
      });
  };
};

export const onComplaintsChange = (name, value) => {
  console.log(name, value, "compleeinnt action changee");
  return (dispatch, getState) => {
    dispatch({
      type: ON_COMPLAINTS_CHANGE,
      payload: {
        name,
        value,
      },
    });
  };
};

export const showComplaint = (id) => {
  console.log(id, "showcomplaint id actin");
  return (dispatch, getState) => {
    showComplaints(id)
      .then((data) => {
        console.log(data, "show  complainttt");
        dispatch({
          type: COMPLAINTS_CHANGE,
          payload: {
            name: "showComplaintDetail",
            value: data.data,
          },
        });
      })
      .catch((err) => {
        ToastMessage(err[0], err[1]?.message);
      });
  };
};

export const complaintReply = () => {
  console.log("complaint replyy action");
  return (dispatch, getState) => {
    const {
      reply,
      showComplaintDetail: {
        value: { id },
      },
    } = getState()["complaint"];
    dispatch(submitControl({ submitted: true }));

    console.log(
      reply,
      id,
      getState()["complaint"]["showComplaintDetail"],
      "reply submittt"
    );
    let params = { content: reply["value"] };
    createConversation(id, params)
      .then((data) => {
        console.log(data, "converasation");
        showComplaint(id);
        RootNavigation.navigate("ComplaintDetails");
        dispatch(submitControl({ submitted: false }));
      })
      .catch((err) => {
        console.log(err, "rrrr");
        dispatch(submitControl({ submitted: false }));

        ToastMessage(err[0], err[1]?.message);
      });
  };
};

export const complaintValidation = ({ name, value, error }) => {
  return (dispatch, getState) => {
    dispatch({
      type: COMPLAINT_VALIDATION,
      payload: {
        name,
        value,
        error,
      },
    });
  };
};

export const complaintsChange = ({ name, value }) => {
  return (dispatch, getState) => {
    dispatch({
      type: COMPLAINTS_CHANGE,
      payload: {
        name,
        value,
      },
    });
  };
};

export const createComplaint = () => {
  return (dispatch, getState) => {
    const { file, subject, description, complaint_type } = getState()[
      "complaint"
    ];
    dispatch(submitControl({ submitted: true }));
    console.log(complaint_type, "tttt");
    let params = {
      subject: subject["value"],
      description: description["value"],
      complaint_type:
        complaint_type.value === "Maintanence"
          ? "maintenance"
          : removeSpace(complaint_type["value"]),
      file: file["value"],
    };
    let formData = new FormData();
    formData.append("subject", subject.value);
    formData.append("description", description.value);
    formData.append(
      "complaint_type",
      complaint_type.value === "Maintanence"
        ? "maintenance"
        : removeSpace(complaint_type["value"])
    );
    file.value &&
      formData.append("file", {
        uri: file.value.path,
        type: file.value.mime,
        name: "image.jpg",
      });
    console.log(file.value.path, file.value.mime, params, "mmm");
    console.log(formData, params, file.value ? "fff" : "pp", "complainttttt");
    createComplaints(file.value ? formData : params, file.value ? true : false)
      .then((data) => {
        console.log(data, "scusscess create");
        ToastMessage(200, data.message);
        RootNavigation.navigate("SuccessPage", {
          title: `Your Request is Submitted!`,
          message: `We have noted your request. We'll reply as soon as possible`,
          image: <ComplaintSuccess />,
          navigateTo: "ComplaintList",
        });
        dispatch(submitControl({ submitted: false }));

        ["subject", "description", "complaint_type", "file"]?.map((item) => {
          dispatch(complaintsChange({ name: item, value: "" }));
        });
      })
      .catch((err) => {
        console.log(err, "err");
        dispatch(submitControl({ submitted: false }));

        let message = err[1].data ? err[1].data[0] : err[1]?.message;
        ToastMessage(err[0], message, err);
      });
  };
};
export const helpDeskCategories = (id, decide, terms, value) => {
  return (dispatch, getState) => {
    help_deskCategories(id)
      .then((data) => {
        console.log(data, "complamit json dataaa helpjdjd", value);
        let formsData = [];
        console.log(
          data.data.questions,
          "newkjdgiusacdacmdcdvmdvdmvdvdvdv,dvdk"
        );
        data.data.questions.forEach((data, index) => {
          switch (data.question_type) {
            case "text":
              var data = {
                id: index,
                q_id: data.id,
                type: "text",
                label: data.name,
                value: "",
                required: data.validation.required,
                error: "",
                ref: React.createRef(),
                keyboardType: data.keyboard_type,
              };
              formsData.push(data);
              break;
            case "text_area":
              var data = {
                id: index,
                q_id: data.id,
                type: "text-area",
                label: data.name,
                value: "",
                required: data.validation.required,
                error: "",
                ref: React.createRef(),
                keyboardType: data.keyboard_type,
              };
              formsData.push(data);
              break;
            case "date_picker":
              var data = {
                id: index,
                q_id: data.id,
                type: "date-picker",
                label: data.name,
                value: new Date(),
                required: data.validation.required,
                error: "",
              };
              formsData.push(data);
              break;
            case "date_time_picker":
              var data = {
                id: index,
                q_id: data.id,
                type: "date-time-picker",
                label: data.name,
                value: new Date(),
                required: data.validation.required,
                error: "",
              };
              formsData.push(data);
              break;
            case "single_select":
              console.log(data.options, "igjgjjjjjjj");
              var data = {
                id: index,
                q_id: data.id,
                type: "single-select",
                label: data.name,
                value: "",
                dropDownList: data.options?.map((v) => ({
                  ...v,
                  selected: false,
                })),
                required: data.validation.required,
                error: "",
              };
              formsData.push(data);
              break;
            case "multiple_select":
              var data = {
                id: index,
                q_id: data.id,
                type: "multiple-select",
                label: data.name,
                value: "",
                dropDownList: data.options?.map((v) => ({
                  ...v,
                  selected: false,
                })),
                required: data.validation.required,
                error: "",
              };
              formsData.push(data);
              break;

            case "image_picker":
              var data = {
                id: index,
                q_id: data.id,
                type: "image-picker",
                label: data.name,
                value: "",
                required: data.validation.required,
                error: "",
              };
              formsData.push(data);
              break;
          }
        });
        console.log(formsData, "new swudydfdqrdbygkuljvrehvegvewtvew");

        dispatch({
          type: LIST_COMPLAINTS,
          payload: {
            name: "helpDeskQuestions",
            data: { ...data.data },
          },
        });
        dispatch({
          type: LIST_COMPLAINTS,
          payload: {
            name: "questionsList",
            data: formsData,
          },
        });
        console.log(terms, value, "wdkhdlewkjdeqdeqhfqefkj");
        terms
          ? RootNavigation.navigate("ComplaintTerms", { terms, value })
          : RootNavigation.navigate("AddComplaint", { back: false });
      })
      .catch((err) => {
        console.log(err, "errrrrrrrrrrrrrrr");
        ToastMessage(err[0], err[1]?.message);
      });
  };
};
export const setComplaintList = () => {
  return (dispatch, getState) => {
    const { complaint_type } = getState()["complaint"];
    fetchComplaintsData()
      .then((data) => {
        console.log(data, "complamit json dataaa");
        dispatch({
          type: SET_COMPLAINT_DATA_LIST,
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
export const helpDeskSubmit = (id, answer) => {
  const attachement = answer.filter((data) => {
    console.log(data?.value?.path, "efugb;khvgwbe ");
    if (data?.value?.path != null) {
      return data;
    }
  });
  console.log(attachement, "attavhment");
  const formData = serialize({
    answers: answer,
    attachments: attachement[0]
      ? {
          uri: attachement[0]?.value?.path,
          type: attachement[0]?.value?.mime,
          name: "image.jpg",
        }
      : "",
  });
  console.log(id, answer, "jdjdjd");
  console.log(formData, "jdddjdjd");

  return (dispatch, getState) => {
    const { complaint_type } = getState()["complaint"];
    dispatch(submitControl({ submitted: true }));
    helpDesk_Submit(id, formData, true)
      .then((data) => {
        console.log(data, "complamit json dataaa");
        ToastMessage(200, data.message);
        RootNavigation.navigate("SuccessPage", {
          title: `Your Request is Submitted!`,
          message: `We have noted your request. We'll reply as soon as possible`,
          image: <ComplaintSuccess />,
          navigateTo: "ComplaintList",
        });
        dispatch(submitControl({ submitted: false }));
      })
      .catch((err) => {
        console.log(err, "errrrrrrrrrrrrrrr");
        console.log(err, "err");
        dispatch(submitControl({ submitted: false }));

        let message = err[1].data ? err[1].data[0] : err[1]?.message;
        ToastMessage(err[0], message, err);
      });
  };
};
