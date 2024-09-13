import { View, SafeAreaView, ScrollView, StatusBar, Text } from "react-native";
import React, { useEffect, memo } from "react";
import { fonts, themes } from "../../../../../themes";
import { detectTheme, FastImg } from "../../../../../helpers";
import { localStyles } from "../styles";

import commonStyles from "../../../../../styles/commonStyles";
import { WithBgHeader } from "../../../../../components";
import { ms } from "../../../../../helpers/scaling";
import { ServiceHeader } from "./serviceHeader";
import { ServiceImage } from "./serviceImage";
import { RatingsView } from "./ratingReviewAdd";
import { RatingInfo } from "./ratingInfo";
import { ServiceComments } from "./serviceComments";
import { ModalContainer } from "../Components/ModalContainer";
import { useState } from "react";
import { ServiceCommentHeader } from "./serviceCommentHeader";
import Animated from "react-native-reanimated";
import { customAnimation } from "../../../../../animation/CommonAnimation";
import { useDispatch, useSelector } from "react-redux";
import {
  FetchRating,
  LocalHelpOnchnage,
  OverAllRating,
  UpdateRating,
} from "../../../../../redux/actions/localhelp";
import { SkeletonRating } from "../Skeleton/SkeletonRatings";

const ServiceCommentList = ({ route, navigation }) => {
  const { id, mainId } = route?.params;
  const [editComment, setComment] = useState("");
  const [showEdit, setShowEdit] = useState({
    isShow: false,
  });
  const [ratingCount, setRating] = useState(0);
  const mode = detectTheme();
  const dispatch = useDispatch();
  const {
    userComments,
    overAllRating,
    isLoading,
    pageComments,
    isListEndComments,
    isMoreLoadingComments,
  } = useSelector((state) => state.localhelp);
  const { avg_rating, rating_count } = overAllRating;
  useEffect(() => {
    dispatch(OverAllRating(id));
    navigation.addListener("blur", () => {
      dispatch(LocalHelpOnchnage({ name: "pageComments", data: 1 }));
      dispatch(LocalHelpOnchnage({ name: "userComments", data: [] }));
    });
  }, []);
  useEffect(() => {
    console.log(
      userComments?.length,
      "pagination service comments",
      overAllRating,
      pageComments
    );
    dispatch(FetchRating(id, pageComments));
  }, [pageComments]);

  const fetchMoreData = () => {
    console.log(
      "fetching more data...Comments",
      pageComments,
      isListEndComments,
      isMoreLoadingComments
    );
    if (!isListEndComments && !isMoreLoadingComments) {
      dispatch(
        LocalHelpOnchnage({ name: "pageComments", data: pageComments + 1 })
      );
    }
  };
  const serviceComment = {
    userComments,
    setShowEdit,
    setComment,
    setRating,
    id,
    dispatch,
    pageComments,
    isListEndComments,
    isMoreLoadingComments,
    fetchMoreData,
  };
  const modalRatingView = {
    backgroundColor: { backgroundColor: "white" },
    rating: ratingCount,
    setRating,
    setComment,
    editComment,
    dispatch,
    CreateRating: UpdateRating,
    id: showEdit?.id,
    mainId: id,
    setShowEdit,
    isList: true,
    helperListID: mainId,
  };
  const serviceCommentHeader = {
    rating_count,
    avg_rating,
    overAllRating,
  };
  console.log(avg_rating, isLoading, "Service comments list");
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: themes[mode]["bgColor"],
      }}
      forceInset={{ top: "never" }}
    >
      {!avg_rating || !isLoading ? (
        <WithBgHeader
          leftIcon
          headerTitle={"User Review"}
          containerStyle={{ ...commonStyles.headerSpacing }}
        >
          <StatusBar
            translucent={true}
            barStyle={mode === "light" ? "dark-content" : "dark-content"}
            backgroundColor="transparent"
          />
          <Animated.View
            {...customAnimation("LightSpeedInRight", 1000, 100)}
            style={{ ...localStyles.flexFull }}
          >
            <ScrollView
              style={{ flex: 1 }}
              showsVerticalScrollIndicator={false}
            >
              <View style={{ marginBottom: 100 }}>
                <ServiceCommentHeader {...serviceCommentHeader} />
                <ServiceComments {...serviceComment} />
              </View>
            </ScrollView>
          </Animated.View>
        </WithBgHeader>
      ) : (
        <SkeletonRating />
      )}

      {showEdit?.isShow && (
        <ModalContainer onClose={setComment}>
          <RatingsView {...modalRatingView} />
        </ModalContainer>
      )}
    </SafeAreaView>
  );
};

export default memo(ServiceCommentList);
