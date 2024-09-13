import React, { Component, useEffect, useState } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-simple-toast";
import { ToastMessage } from "../../components";
import * as RootNavigation from "../../navigation/RootNavigation";
import {
  COMMUNITY_RESET,
  ON_COMMUNITY_CHANGE,
  ON_LIKE_APPLY,
} from "../actionTypes";
import {
  communityForm,
  communityLike,
  communityLikeList,
  communityList,
  communityReport,
  communityShow,
} from "../../api/community";
import { serialize } from "object-to-formdata";
import { FacilitySuccess, MAFacilityIcon } from "../../../assets/img/svgs";
import { submitControl } from "./login";
// import * as RootNavigation from "../../navigation/RootNavigation";

export const communityChange = ({ name, value }) => {
  return (dispatch, getState) => {
    dispatch({
      type: ON_COMMUNITY_CHANGE,
      payload: {
        name,
        value,
      },
    });
  };
};

export const communitylist = (total_entries, isLoad) => {
  return (dispatch, getState) => {
    console.log("heyheyheyheyhey", total_entries);
    isLoad && isLoad(true);
    communityList(total_entries)
      .then((data) => {
        console.log(data, "commuity");
        dispatch({
          type: ON_COMMUNITY_CHANGE,
          payload: {
            name: "communityListData",
            value: data.data,
          },
        });
        dispatch({
          type: ON_COMMUNITY_CHANGE,
          payload: {
            name: "listLoader",
            value: false,
          },
        });
        isLoad && isLoad(false);
      })
      .catch((err) => {
        console.log(err, "errrrrrrrrrrrrrrr");
        ToastMessage(err[0], err[1]?.message);
        dispatch({
          type: ON_COMMUNITY_CHANGE,
          payload: {
            name: "listLoader",
            value: false,
          },
        });
        isLoad && isLoad(false);
      });
  };
};
export const resetLikeList = () => {
  return (dispatch) => {
    dispatch({
      type: ON_COMMUNITY_CHANGE,
      payload: {
        name: "communityListLike",
        value: [],
      },
    });
    dispatch({
      type: ON_COMMUNITY_CHANGE,
      payload: {
        name: "likeLoader",
        value: true,
      },
    });
  };
};
export const communityshow = (id) => {
  return (dispatch, getState) => {
    console.log("heyheyheyhekdkyhey", id);
    communityShow(id)
      .then((data) => {
        console.log(data, "commuityshow");
        dispatch({
          type: ON_COMMUNITY_CHANGE,
          payload: {
            name: "communityShowData",
            value: data.data,
          },
        });
        dispatch({
          type: ON_COMMUNITY_CHANGE,
          payload: {
            name: "showLoader",
            value: false,
          },
        });
        RootNavigation.navigate("CommunityShow");
      })
      .catch((err) => {
        console.log(err, "errrrrrrrrrr2222rrrrrrrrr");
        ToastMessage(err[0], err[1]?.message);
        dispatch({
          type: ON_COMMUNITY_CHANGE,
          payload: {
            name: "showLoader",
            value: false,
          },
        });
      });
  };
};

export const communitylike = (params, id, decide, communityfetch,set_likeEnable) => {
  return (dispatch, getState) => {
    console.log("heyheyheyhekdkddyhey", id);
    dispatch({
      type: ON_COMMUNITY_CHANGE,
      payload: {
        name: "likeEnable",
        value: true,
      },
    });
    communityfetch && set_likeEnable(true)

    communityLike(params, id)
      .then((data) => {
        // !decide ? dispatch(communitylist()) : dispatch(communityshow(id));
        dispatch({
          type: ON_LIKE_APPLY,
          payload: {
            id,
            decide,
          },
        });
        dispatch({
          type: ON_COMMUNITY_CHANGE,
          payload: {
            name: "likeEnable",
            value: false,
          },
        });

        communityfetch && communityfetch();
        communityfetch && set_likeEnable(false);
        
      })
      .catch((err) => {
        console.log(err, "errrrrrrr121rrrrrrrr");
        ToastMessage(err[0], err[1]?.message);
        dispatch({
          type: ON_COMMUNITY_CHANGE,
          payload: {
            name: "likeEnable",
            value: false,
          },
        });
      });
  };
};
export const communitylikelist = (id) => {
  return (dispatch, getState) => {
    console.log("heyheyheopo2op2p2yhekdkyhey", id);
    communityLikeList(id)
      .then((data) => {
        console.log(data, "oije2o kdhiwodu owdouwdowdhowd");
        //  dispatch(communitylist())
        dispatch({
          type: ON_COMMUNITY_CHANGE,
          payload: {
            name: "communityListLike",
            value: data.data,
          },
        });
        dispatch({
          type: ON_COMMUNITY_CHANGE,
          payload: {
            name: "likeLoader",
            value: false,
          },
        });
      })
      .catch((err) => {
        console.log(err, "errrrrrrrrrrrrrrr");
        ToastMessage(err[0], err[1]?.message);
      });
  };
};
export const communityreport = (params, id) => {
  return (dispatch, getState) => {
    console.log("heyheyheopo2op2p2dddyhekdkyhey", id);
    communityReport(params, id)
      .then((data) => {
        console.log(data, "oije2o kdhdddiwodu owdouwdowdhowd");
        ToastMessage(10001, data.message);
      })
      .catch((err) => {
        console.log(err, "errrrrrrrrrrrrrrr");
        ToastMessage(err[0], err[1]?.message);
      });
  };
};
export const communityform = (params, decide) => {
  return (dispatch, getState) => {
    let formdata = serialize(params);
    console.log(formdata, "wdjodujwdkwdgkdw,d3dg3kdn3md3d");
    dispatch(submitControl({ submitted: true }));

    communityForm(formdata, true)
      .then((data) => {
        console.log(data.data.status, "commdjwdwuity");
        dispatch(submitControl({ submitted: false }));

        ToastMessage(200, data.message);

        data.data.status == "published"
          ? RootNavigation.navigate("SuccessPage", {
              title: `Your post was shared successfully`,
              message: `  `,
              image: <FacilitySuccess />,
              navigateTo: !decide ? "BottomTab" : "CommunityList",
            })
          : RootNavigation.navigate("FacilityMaApproval", {
              title: ` `,
              message: `  Your post is pending. Please wait for MA approval`,
              image: <MAFacilityIcon />,
              navigateTo: !decide ? "BottomTab" : "CommunityList",
            });
      })
      .catch((err) => {
        console.log(err, "errrrrrrrrrrrrrrr");
        dispatch(submitControl({ submitted: false }));
        ToastMessage(err[0], err[1]?.message);
      });
  };
};
export const communityReset = () => {
  return (dispatch, getState) => {
    dispatch({
      type: COMMUNITY_RESET,
    });
  };
};
