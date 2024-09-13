import { View, SafeAreaView, ScrollView, StatusBar, Text } from "react-native";
import React, { useEffect, memo } from "react";
import { fonts, themes } from "../../../../../themes";
import { detectTheme, FastImg, SliceName } from "../../../../../helpers";
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
import { customAnimation } from "../../../../../animation/CommonAnimation";
import Animated from "react-native-reanimated";
import { SkeletonDetails } from "../Skeleton/SkeletonDetails";
import { useDispatch, useSelector } from "react-redux";
import {
  CreateRating,
  UpdateRating,
  CreateEnquiry,
  FetchRating,
  OverAllRating,
  ServicesDetailsApi,
} from "../../../../../redux/actions/localhelp";

const ServiceDetail = ({ navigation, route }) => {
  const { params } = route;
  const [editComment, setComment] = useState("");
  const [showEdit, setShowEdit] = useState({
    isShow: false,
  });
  const [enquiry, setEnquiry] = useState("");
  const [ratingCount, setRating] = useState(0);
  const mode = detectTheme();
  const dispatch = useDispatch();

  useEffect(() => {
    navigation.addListener("focus", () =>
      dispatch(ServicesDetailsApi(params?.id))
    );
  }, []);
  const {
    serviceDetails: {
      phone,
      banner_images,
      profile_image,
      title,
      avg_rating,
      locations,
      preferred_timing,
      country_code,
      rated_by_you,
      id,
      ratings,
      rating_count,
      name,
    },
    isShowAll,
    isLoading,
  } = useSelector((state) => state.localhelp);
  console.log(ratings, "service details rating", isShowAll, avg_rating, phone);
  const serviceHeader = {
    phone: `+${country_code}${phone}`,
    profile_image: profile_image?.s3_image_path,
    title,
    avg_rating,
    locationTitle: SliceName(locations?.locality, 30),
    locationAddress: locations?.location,
    preferred_timing_evening: preferred_timing?.evening,
    preferred_timing_morning: preferred_timing?.morning,
    CreateEnquiry,
    id,
    setEnquiry,
    enquiry,
    dispatch,
    name,
  };
  const ratingView = {
    rating: ratingCount,
    setRating,
    setComment,
    editComment,
    dispatch,
    CreateRating,
    id,
    helperListID: params?.mainId,
  };
  const serviceComment = {
    userComments: ratings?.slice(0, 2),
    setShowEdit,
    header: true,
    isShowAll,
    setComment,
    setRating,
    id,
    isNotScroll: true,
    mainId: params?.mainId
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
    helperListID: params?.mainId,
  };
  const ratingInfo = {
    rating: avg_rating,
    rating_count,
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: themes[mode]["bgColor"],
      }}
      forceInset={{ top: "never" }}
    >
      {phone || !isLoading ? (
        <WithBgHeader
          leftIcon
          containerStyle={{ ...commonStyles.headerSpacing }}
        >
          <StatusBar
            translucent={true}
            barStyle={mode === "light" ? "dark-content" : "dark-content"}
            backgroundColor="transparent"
          />
          <View style={{ ...localStyles.flexFull }}>
            <ScrollView
              style={{ flex: 1 }}
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled
            >
              <ServiceHeader {...serviceHeader} />
              <ServiceImage {...{ banner_images }} />
              <Animated.View
                {...customAnimation("FadeInDown", 1000, 100)}
                style={{ marginBottom: 100 }}
              >
                {!rated_by_you && <RatingsView {...ratingView} />}
                {avg_rating != 0 && <RatingInfo {...ratingInfo} />}
                <ServiceComments {...serviceComment} />
              </Animated.View>
            </ScrollView>
          </View>
        </WithBgHeader>
      ) : (
        <SkeletonDetails />
      )}
      {showEdit?.isShow && (
        <ModalContainer onClose={setShowEdit}>
          <RatingsView {...modalRatingView} />
        </ModalContainer>
      )}
    </SafeAreaView>
  );
};

export default memo(ServiceDetail);
