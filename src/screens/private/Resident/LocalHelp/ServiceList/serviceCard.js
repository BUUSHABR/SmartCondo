import {
  TouchableOpacity,
  View,
  Text,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";

import React, { memo, useState } from "react";
import { ms, vs } from "../../../../../helpers/scaling";
import { detectTheme, SliceName } from "../../../../../helpers";
import FastImage from "react-native-fast-image";
import { fonts, themes } from "../../../../../themes";
import {
  LocalHelpLocation,
  NoDataLocalHelp,
} from "../../../../../../assets/img/svgs";
import { LocalHelpRating } from "../Components/ratings";
import { LocationInfo } from "../Components/locationInfo";
import { navigate } from "../../../../../navigation/RootNavigation";
import Animated from "react-native-reanimated";
import { customAnimation } from "../../../../../animation/CommonAnimation";
import { useDispatch } from "react-redux";
import { PaginationFooter } from "../Components/paginationFooter";

export const ServiceCard = memo(
  ({
    serviceList,
    isListEndService,
    isMoreLoadingService,
    fetchMoreData,
    id,
  }) => {
    const mode = detectTheme();
    const height = Dimensions.get("window").height;

    console.log("[ServiceProvider] list", serviceList);

    const renderItem = ({ item, index }) => {
      const source = item?.profile_image?.s3_image_path
        ? {
            uri: item?.profile_image?.s3_image_path,
            priority: FastImage.priority.normal,
          }
        : require("../../../../../../assets/img/profile.png");
      return (
        <Animated.View {...customAnimation("ZoomIn", 500, 100, index)}>
          <TouchableOpacity
            style={{
              marginVertical: ms(7),
              height: vs(70),
              width: "100%",
              borderRadius: ms(10),
              backgroundColor:
                themes[mode][mode === "light" ? "bgColor" : "modalWrap"],
              elevation: 5,
              flexDirection: "row",
              alignItems: "center",
            }}
            onPress={() =>
              navigate("ServiceDetail", { id: item?.id, mainId: id })
            }
          >
            <View style={{ flex: 1.2, alignItems: "center" }}>
              <FastImage
                style={{
                  width: 65,
                  height: 65,
                  borderRadius: ms(5),
                  backgroundColor: "grey",
                }}
                source={source}
                resizeMode={FastImage.resizeMode.contain}
              />
            </View>
            <View
              style={{
                flex: 4,
                height: vs(70),
                justifyContent: "space-evenly",
                paddingVertical: ms(7),
              }}
            >
              <Text
                style={{
                  color: themes[mode]["headingColor"],
                  fontFamily: fonts.medium,
                  fontSize: ms(13),
                  fontWeight: "700",
                }}
              >
                {item?.name}
              </Text>
              <LocationInfo
                {...{
                  locationTitle: SliceName(item?.locations?.locality, 30),
                  locationAddress: item?.locations?.location,
                }}
              />
              <View style={{ flexDirection: "row" }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text
                    style={{
                      color: themes[mode]["headingColor"],
                      fontFamily: fonts.medium,
                      fontSize: ms(13),
                      fontWeight: "700",
                    }}
                  >
                    {item?.avg_rating > 0 && item?.avg_rating}
                  </Text>
                  <View style={{ marginLeft: ms(5) }}>
                    <LocalHelpRating
                      {...{
                        ratingSize: 15,
                        readOnly: true,
                        rating: item?.avg_rating || 0,
                      }}
                    />
                  </View>
                </View>
                {item?.rating_count !== 0 && (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginLeft: ms(10),
                    }}
                  >
                    <View
                      style={{
                        height: ms(5),
                        width: ms(5),
                        backgroundColor: themes[mode]["headingColor"],
                        borderRadius: 20,
                      }}
                    />
                    <Text
                      style={{
                        color: themes[mode]["headingColor"],
                        fontFamily: fonts.medium,
                        fontSize: ms(12),
                        fontWeight: "600",
                        marginLeft: ms(5),
                      }}
                    >
                      {item?.rating_count} Reviews
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        </Animated.View>
      );
    };

    const keyExtractor = (item) => item.id;
    const ListFooterComponent = () => {
      return (
        <PaginationFooter
          {...{
            isMoreLoading: isMoreLoadingService,
            isListEnd: isListEndService
              ? serviceList?.length > 10
                ? isListEndService
                : false
              : false,
          }}
        />
      );
    };

    return (
      <View
        style={{
          marginVertical: ms(5),
        }}
      >
        {serviceList?.length > 0 ? (
          <View
            style={{
              height: height,
              // flex: 1,
            }}
          >
            <FlatList
              data={serviceList}
              renderItem={renderItem}
              keyExtractor={keyExtractor}
              onEndReachedThreshold={0.01}
              initialNumToRender={10}
              maxToRenderPerBatch={10}
              windowSize={7}
              updateCellsBatchingPeriod={10}
              scrollEventThrottle={1}
              onEndReached={fetchMoreData}
              ListFooterComponent={ListFooterComponent}
              contentContainerStyle={{
                width: "100%",
                paddingHorizontal: ms(20),
                paddingBottom: vs(200),
              }}
            />
          </View>
        ) : (
          <View style={{ alignItems: "center", alignSelf: "center" }}>
            <NoDataLocalHelp />
            <Text
              style={{
                color: themes[mode]["headingColor"],
                fontFamily: fonts.bold,
                fontSize: ms(18),
                marginVertical: ms(20),
              }}
            >
              No Data
            </Text>
          </View>
        )}
      </View>
    );
  }
);
