import React, { Component, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-simple-toast";
import { ToastMessage } from "../../components";
import {
  HOME_PAGE_LOADER,
  HOME_PAGE_DATA,
  RESET_STATE,
  SHOW_CASE_TRIGGER,
  SET_HOME_LOADER,
} from "../actionTypes";
import {
  fetchAnnouncement,
  fetchCondoInfo,
  fetchModules,
  fetchRecentVisitors,
  fetchSosNumbers,
  showAnnouncementDetails,
} from "../../api/home";
import { defaultAnnounce } from "../../helpers";
import { complaint } from ".";
import facility_booking from "../reducers/facility_booking";

export const homePageLoader = (name, value) => {
  console.log(name, value, "knlqnlnlnlnlnnc");
  return (dispatch, getState) => {
    dispatch({
      type: HOME_PAGE_LOADER,
      payload: {
        name,
        value,
      },
    });
  };
};

export const homePageData = ({ name, data }) => {
  console.log(name, data, "sos entered actions");
  return (dispatch, getState) => {
    dispatch({
      type: HOME_PAGE_DATA,
      payload: {
        name,
        data,
      },
    });
  };
};
export const showCaseTrigger = (name, value) => {
  console.log(name, value, "showcase actions");
  return (dispatch, getState) => {
    dispatch({
      type: SHOW_CASE_TRIGGER,
      payload: {
        name,
        value,
      },
    });
  };
};

export const listHomeFunction = () => {
  return (dispatch, getState) => {
    // dispatch(setHomeLoader("announcementLoader", true));
    // dispatch(homePageLoader("upcomingLoader", true));
    // dispatch(homePageLoader("announcementLoader", true));
    const { upcomingInvites, announcements } = getState()["home"];
    console.log("data hanfloe++++++++++++++++++++++++++++++++++++++++++++++++");
    fetchCondoInfo()
      .then((data) => {
        console.log(data, "kumaraswamy");
        const datas = [];
        data.data.condo_images?.map((data, index) => {
          datas.push({ id: index, s3_image_path: data.s3_image_path });
        });
        console.log(datas, "kjnwkjwkiiiixiisijjjs");

        dispatch(homePageData({ name: "condoinfo", data: data.data }));
        dispatch(homePageLoader("infoloader", false));
        dispatch(homePageData({ name: "condoimages", data: datas }));
      })
      .catch((err) => {
        console.log(err, "upcoming err");
        dispatch(homePageLoader("infoloader", true));
        ToastMessage(err[0], err[1]?.message, err);
      });

    fetchModules()
      .then(async ({ data }) => {
        console.log(data, "hello boy");

        let feature = await data.filter((data) => data != "");
        feature.push("selfinvite");
        console.log(feature, ")))))))))))0000000000000000");
        dispatch(homePageData({ name: "features", data: feature }));
      })
      .catch((err) => {
        console.log(err, "upcoming err");
        ToastMessage(err[0], err[1]?.message, err);
      });
    // dispatch(setHomeLoader("announcementLoader", true));
    fetchAnnouncement("delivered")
      .then((data) => {
        dispatch(homePageLoader("announcementLoader", false));
        dispatch(setHomeLoader("announcementLoader", false));
        // dispatch(setHomeLoader("announcementLoader", true));
        console.log(
          data,
          "##############################$$$$$$$$$$$$$$$$$$$$$$$$$$$$^^^^^^^^^^^^^^^^^^^^^^^^^"
        );
        dispatch(
          homePageData({
            name: "announcements",
            data: data.data.length > 0 ? data.data : defaultAnnounce,
          })
        );
        dispatch(homePageLoader("announcementLoader", false));
      })
      .catch((err) => {
        dispatch(homePageLoader("announcementLoader", false));
        dispatch(
          homePageData({
            name: "announcements",
            data: defaultAnnounce,
          })
        );
        ToastMessage(err[0], err[1]?.message, err);
      });
    // upcomingInvites.length < 1 &&
    // dispatch(homePageLoader("announcementLoader", true));

   
  };
};
export const recentVisitor=()=>{
  return(dispatch)=>{
    fetchRecentVisitors()
    .then((data) => {
      dispatch(homePageLoader("upcomingLoader", false));

      dispatch(homePageData({ name: "upcomingInvites", data: data?.data }));
    })
    .catch((err) => {
      console.log(err, "upcoming err");
      dispatch(homePageLoader("upcomingLoader", true));
      ToastMessage(err[0], err[1]?.message, err);
    });
  }
}

export const getSosNumbers = () => {
  return (dispatch, getState) => {
    dispatch(homePageLoader("sosLoader", true));
    fetchSosNumbers()
      .then((data) => {
        console.log(data, "sos response data");
        dispatch(homePageData({ name: "sosData", data: data.data }));
        dispatch(homePageLoader("sosLoader", false));
      })
      .catch((err) => {
        dispatch(homePageLoader("sosLoader", false));
        ToastMessage(err[0], err[1]?.message, err);
      });
  };
};
export const setHomeLoader = (loader) => {
  console.log(loader, "set visitor loader action");
  return (dispatch) => {
    dispatch({
      type: SET_HOME_LOADER,
      payload: {
        loader,
      },
    });
  };
};
export const showAnnouncement = (id) => {
  console.log(id, "actionnn");
  return (dispatch, getState) => {
    // dispatch(homePageLoader("announcementLoader", true));
    showAnnouncementDetails(id)
      .then((data) => {
        console.log(data, "show data");
        let announcement_pdf = [];
        let announcement_banners = [];
        data?.data?.announcement_documents?.map((data, index) => {
          if (data.url != null) {
          var ext = data.url.substr(data.url.lastIndexOf(".") + 1);
            if (ext == "pdf") {
              var splitSlash = data.url.split("/");
              var splitLast = splitSlash[splitSlash.length - 1];
              var splitName = splitLast.split(".pdf");
              announcement_pdf.push({
                uri: data.url,
                cache: true,
                name: splitName[0],
              });
            } else {
              announcement_banners.push({ id: index, s3_image_path: data.url });
            }
          }
        });
        console.log(announcement_pdf, announcement_banners, "eiygeufcnbehckcj");
        dispatch(
          homePageData({
            name: "announcementDetails",
            data:
              [data.data].length > 0
                ? {
                    ...data.data,
                    announcement_pdf: announcement_pdf,
                    announcement_banners: announcement_banners,
                  }
                : defaultAnnounce[0],
          })
        );
        dispatch(homePageLoader("announcementLoader", false));
      })
      .catch((err) => {
        dispatch(homePageLoader("announcementLoader", false));
        ToastMessage(err[0], err[1]?.message, err);
      });
  };
};

export const resetState = () => {
  return (dispatch, getState) => {
    dispatch({
      type: RESET_STATE,
    });
  };
};
