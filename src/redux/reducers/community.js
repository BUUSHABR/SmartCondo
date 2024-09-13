import React from "react";
import moment from "moment";
import {
  COMMUNITY_RESET,
  ON_COMMUNITY_CHANGE,
  ON_LIKE_APPLY,
} from "../actionTypes";

const initialState = {
  communityListData: [],
  listLoader: true,
  showLoader: true,
  likeLoader: true,
  communityShowData: {},
  communityListLike: [],
  likeEnable:false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case ON_COMMUNITY_CHANGE:
      const { name, value } = action.payload;
      return {
        ...state,
        [name]: value,
      };
    case ON_LIKE_APPLY: {
      const { id, decide } = action.payload;
      console.log("idkskdjfmekdj", id);
      let temp = !decide ? [...state.communityListData] : {...state.communityShowData};
      console.log("oldtemp", temp);
      if (!decide) {
        let index = temp.findIndex((x) => x.id == id);
        console.log("indexxxxxxxxxxxxx", index, temp[index].liked);
        temp[index].likes_count=!temp[index].liked==true?temp[index].likes_count+1:temp[index].likes_count-1
        temp[index].liked = !temp[index].liked;
        console.log("newtemp", temp);
      } else {
        console.log(temp ,"obj before");
        temp.likes_count=!temp.liked==true?temp.likes_count+1:temp.likes_count-1
        temp.liked = !temp.liked;
        console.log(temp ,"obj afetr");
      }

      return {
        ...state,
        [!decide ? "communityListData" : "communityShowData"]: temp,
      };
    }
    case COMMUNITY_RESET: {
      console.log("reset caeeedededdededeelled33");
      return {
        ...initialState,
      };
    }
    default:
      return state;
  }
}
