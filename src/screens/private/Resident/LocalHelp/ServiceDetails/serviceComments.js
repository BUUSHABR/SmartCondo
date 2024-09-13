import { Text, View, TouchableOpacity, Dimensions } from "react-native";
import { FlatList } from "react-native-gesture-handler";

import { CommentEdit, LocalArrow } from "../../../../../../assets/img/svgs";
import { detectTheme } from "../../../../../helpers";
import { ms, vs } from "../../../../../helpers/scaling";
import { fonts, themes } from "../../../../../themes";
import React from "react";
import FastImage from "react-native-fast-image";
import { LocalHelpRating } from "../Components/ratings";
import moment from "moment";
import { navigate } from "../../../../../navigation/RootNavigation";
import { PaginationFooter } from "../Components/paginationFooter";

export const ServiceComments = ({
  userComments,
  setShowEdit,
  header,
  isShowAll,
  setComment,
  setRating,
  id,
  pageComments,
  isListEndComments,
  isMoreLoadingComments,
  fetchMoreData,
  isNotScroll,
  mainId,
}) => {
  console.log(userComments, "ServiceComments");
  const mode = detectTheme();
  const height = Dimensions.get("window").height;

  const renderItem = ({ item }) => {
    return (
      <View
        style={{
          width: "100%",
          marginVertical: ms(10),
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <View style={{ flex: 0.5 }}>
            <FastImage
              style={{ width: 50, height: 50, borderRadius: 50 }}
              source={{
                uri: item?.resident_data?.profile_image,
                priority: FastImage.priority.normal,
              }}
              resizeMode={FastImage.resizeMode.contain}
            />
          </View>
          <View style={{ flex: 2, justifyContent: "space-evenly" }}>
            <Text
              style={{
                color: themes[mode]["headingColor"],
                fontFamily: fonts.medium,
                fontSize: ms(14),
                fontWeight: "700",
                letterSpacing: 0.7,
              }}
            >
              {item?.resident_data?.name}
            </Text>
            <View style={{ alignItems: "flex-start", marginTop: ms(4) }}>
              <LocalHelpRating
                {...{
                  ratingSize: 12,
                  readOnly: true,
                  rating: item?.rating,
                }}
              />
            </View>
          </View>
          <View style={{ flex: 0.3 }}>
            {item?.rated_by_you && (
              <TouchableOpacity
                style={{
                  height: ms(30),
                  width: ms(40),
                  alignItems: "center",
                  marginTop: ms(5),
                }}
                onPress={() => {
                  setShowEdit({ isShow: true, ...item });
                  setComment(item?.comment);
                  setRating(item?.rating);
                }}
              >
                <CommentEdit />
              </TouchableOpacity>
            )}
          </View>
        </View>
        <View style={{ marginTop: ms(5), marginLeft: ms(2) }}>
          <Text
            style={{
              color: themes[mode]["lightAsh"],
              fontFamily: fonts.medium,
              fontSize: ms(11),
              fontWeight: "600",
            }}
          >
            {moment(item?.created_at).format("DD MMM, YYYY")}
          </Text>
          {item?.comment && (
            <Text
              style={{
                color: themes[mode]["headingColor"],
                fontFamily: fonts.medium,
                fontSize: ms(12),
                fontWeight: "600",
                marginTop: ms(5),
                lineHeight: ms(17),
                textAlign: "justify",
                paddingRight: ms(7),
              }}
            >
              {item?.comment}
            </Text>
          )}
        </View>
      </View>
    );
  };

  const keyExtractor = (item) => item.id;
  const ListFooterComponent = () => {
    return (
      <PaginationFooter
        {...{
          isMoreLoading: isMoreLoadingComments,
          isListEnd: isListEndComments
            ? userComments?.length > 10
              ? isListEndComments
              : false
            : false,
        }}
      />
    );
  };
  return (
    <View style={{ paddingHorizontal: ms(20) }}>
      {header && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: ms(7),
          }}
        >
          <Text
            style={{
              color: themes[mode]["headingColor"],
              fontSize: ms(15),
              fontWeight: "700",
              marginVertical: ms(10),
              letterSpacing: 0.4,
            }}
          >
            {userComments?.length > 0 ? "User Comments" : ""}
          </Text>
          {isShowAll && (
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginRight: ms(5),
              }}
              onPress={() => {
                navigate("ServiceCommentList", {
                  id,
                  mainId,
                });
              }}
            >
              <Text
                style={{
                  color: "#FFC727",
                  fontFamily: fonts.medium,
                  fontSize: ms(12),
                  fontWeight: "700",
                  letterSpacing: 0.7,
                  textAlign: "center",
                }}
              >
                View more
              </Text>
              <View
                style={{
                  marginLeft: ms(5),
                }}
              >
                <LocalArrow />
              </View>
            </TouchableOpacity>
          )}
        </View>
      )}
      <View
        style={{
          height: isNotScroll ? "auto" : height,
          // flex: 1,
        }}
      >
        <FlatList
          data={userComments}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={{
            width: "100%",
            justifyContent: "center",
            // paddingBottom: vs(200),
          }}
          onEndReachedThreshold={0.01}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={7}
          updateCellsBatchingPeriod={10}
          scrollEventThrottle={1}
          onEndReached={fetchMoreData}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={ListFooterComponent}
        />
      </View>
    </View>
  );
};
