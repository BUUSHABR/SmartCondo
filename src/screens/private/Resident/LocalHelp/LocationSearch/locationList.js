import {
  TouchableOpacity,
  View,
  Text,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import React, { memo, useEffect } from "react";
import { ms, vs } from "../../../../../helpers/scaling";
import { detectTheme } from "../../../../../helpers";
import { fonts, themes } from "../../../../../themes";
import {
  LocationSearchIcon,
  NoSearchData,
} from "../../../../../../assets/img/svgs";
import { LocationInfo } from "../Components/locationInfo";
import { FlatList } from "react-native-gesture-handler";
import { UpdateLocation } from "../../../../../redux/actions/localhelp";
import { PaginationFooter } from "../Components/paginationFooter";
import { CustomSearch } from "../../../../../components";

export const LocationList = memo(
  ({
    locationList,
    dispatch,
    fetchMoreData,
    isMoreLoadingSearch,
    isListEndSearch,
  }) => {
    const mode = detectTheme();
    const height = Dimensions.get("window").height;
    const updateLocation = (location) => {
      dispatch(UpdateLocation(location, true));
    };
    const renderItem = ({ item }) => {
      console.log(item, "LocationList History");
      return (
        <View>
          <TouchableOpacity
            style={{
              paddingVertical: vs(10),
              width: "100%",
              flexDirection: "row",
              alignItems: "center",
            }}
            onPress={() =>
              updateLocation({
                latitude: item?.latitude,
                longitude: item?.longitude,
              })
            }
          >
            <View style={{ flex: 0.7 }}>
              <LocationSearchIcon />
            </View>
            <View
              style={{
                flex: 4,
                justifyContent: "space-evenly",
                paddingVertical: ms(7),
              }}
            >
              <Text
                style={{
                  color: themes[mode]["lightAshDark"],
                  fontFamily: fonts.medium,
                  fontSize: ms(12),
                  fontWeight: "600",
                  lineHeight: ms(20),
                }}
              >
                {item?.description}
              </Text>
            </View>
          </TouchableOpacity>
          <View
            style={{
              borderWidth: 0.4,
              borderColor: "#C6CEDD",
              // marginLeft: ms(20),
              marginHorizontal: ms(0),
            }}
          />
        </View>
      );
    };

    const keyExtractor = (item) => item.id;
    const ListFooterComponent = () => {
      return (
        <PaginationFooter
          {...{
            isMoreLoading: isMoreLoadingSearch,
            isListEnd: isListEndSearch
              ? locationList?.length > 10
                ? isListEndSearch
                : false
              : false,
          }}
        />
      );
    };
    return (
      <View
        style={{
          marginVertical: ms(20),
        }}
      >
        <Text
          style={{
            color: themes[mode]["headingColor"],
            fontSize: ms(16),
            fontWeight: "700",
            marginHorizontal: ms(20),
          }}
        >
          Recents
        </Text>
        {locationList?.length > 0 ? (
          <View
            style={{
              height: height,
              flex: 1,
            }}
          >
            <FlatList
              data={locationList}
              renderItem={renderItem}
              keyExtractor={keyExtractor}
              contentContainerStyle={{
                width: "100%",
                paddingHorizontal: ms(20),
                paddingBottom: vs(200),
              }}
              onEndReachedThreshold={0.01}
              initialNumToRender={10}
              maxToRenderPerBatch={10}
              windowSize={7}
              updateCellsBatchingPeriod={10}
              scrollEventThrottle={1}
              onEndReached={fetchMoreData}
              ListFooterComponent={ListFooterComponent}
            />
          </View>
        ) : (
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              height: height - ms(200),
            }}
          >
            <NoSearchData />
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
