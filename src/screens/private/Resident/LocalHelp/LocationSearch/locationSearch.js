import {
  View,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  FlatList,
  TouchableWithoutFeedback
} from "react-native";
import React, { useEffect, memo } from "react";
import { themes, fonts } from "../../../../../themes";
import { detectTheme, FastImg, openAppSettings } from "../../../../../helpers";
import { localStyles } from "../styles";

import commonStyles from "../../../../../styles/commonStyles";
import { CustomSearch, WithBgHeader } from "../../../../../components";
import { ms, vs } from "../../../../../helpers/scaling";
import { LocationList } from "./locationList";
import {
  ArrowDown,
  ArrowRight,
  LocationIconYellow,
  RightCorner,
  RightSwitchArrow,
} from "../../../../../../assets/img/svgs";
import Animated from "react-native-reanimated";
import { customAnimation } from "../../../../../animation/CommonAnimation";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FetchPlace,
  FetchRecentLocation,
  SearchLocation,
  LocalHelpOnchnage,
} from "../../../../../redux/actions/localhelp";

const LocationSearch = ({ navigation }) => {
  const mode = detectTheme();
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();
  const {
    locationList,
    locationHistory,
    pageSearch,
    isListEndSearch,
    isMoreLoadingSearch,
    prevPageSearch,
  } = useSelector((state) => state.localhelp);
  useEffect(() => {
    dispatch(SearchLocation(search));
  }, [search]);
  useEffect(() => {
    console.log(
      locationHistory?.length,
      "pagination search location",
      locationHistory,
      prevPageSearch,
      pageSearch
    );

    dispatch(FetchRecentLocation(pageSearch));

    return () => {
      console.log("unmount called locatio search");
    };
  }, [pageSearch]);
  useEffect(() => {
    navigation.addListener("blur", () => {
      dispatch(LocalHelpOnchnage({ name: "pageSearch", data: 1 }));
      dispatch(LocalHelpOnchnage({ name: "locationHistory", data: [] }));
    });
  }, []);
  console.log(
    "[Geo Location] from Location Service Screen",
    isMoreLoadingSearch,
    isListEndSearch,
    pageSearch
  );

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          dispatch(FetchPlace({ address: item?.description }));
          setSearch("");
        }}
        style={{ paddingHorizontal: ms(20), paddingVertical: vs(6) }}
      >
        <Text
          style={{
            color: themes[mode]["lightAshDark"],
            letterSpacing: 0.5,
            fontFamily: fonts.medium,
          }}
        >
          {item?.description}
        </Text>
      </TouchableOpacity>
    );
  };
  const keyExtractor = (item) => item.id;
  const fetchMoreData = () => {
    console.log(
      "fetching more data...",
      pageSearch,
      isListEndSearch,
      isMoreLoadingSearch
    );
    if (!isListEndSearch && !isMoreLoadingSearch) {
      dispatch(LocalHelpOnchnage({ name: "pageSearch", data: pageSearch + 1 }));
    }
  };
  const locationListProp = {
    locationList: locationHistory,
    pageSearch,
    dispatch,
    LocalHelpOnchnage,
    isListEndSearch,
    isMoreLoadingSearch,
    fetchMoreData,
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: themes[mode]["bgColor"],
      }}
      forceInset={{ top: "never" }}
    >
      <WithBgHeader leftIcon containerStyle={{ ...commonStyles.headerSpacing }}>
        <Animated.View
          {...customAnimation("FadeInDown", 1000, 100)}
          style={{ ...localStyles.flexFull }}
        >
          <View
            style={{
              paddingHorizontal: ms(30),
              // height: vs(100),
              position: "relative",
            }}
          >
            <CustomSearch
              name="location"
              placeholder="Search for a location"
              value={search}
              handleSearchChange={({ value }) => {
                setSearch(value);
              }}
            />

            {search.length > 0 && (
              <View
                style={{
                  minHeight: vs(50),
                  maxHeight: vs(250),
                  zIndex: 999,
                  width: "100%",
                  backgroundColor: "red",
                  position: "absolute",
                  alignSelf: "center",
                  marginTop: vs(40),
                  borderRadius: ms(10),
                  elevation: 5,
                  backgroundColor: "white",
                }}
              >
                <FlatList
                  data={locationList}
                  renderItem={renderItem}
                  keyExtractor={keyExtractor}
                  contentContainerStyle={{
                    width: "100%",
                    justifyContent: "center",
                    paddingVertical: ms(10),
                  }}
                  showsVerticalScrollIndicator={false}
                />
              </View>
            )}
          </View>
          {global.isLocationBlocked && (
            <TouchableOpacity
              style={{
                marginHorizontal: ms(20),
                zIndex: 2,
              }}
              onPress={openAppSettings}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: ms(20),
                }}
              >
                <View style={{ flex: 0.5 }}>
                  <LocationIconYellow />
                </View>
                <View style={{ flex: 4 }}>
                  <Text
                    style={{
                      color: themes[mode]["headingColor"],
                      fontSize: ms(14),
                      fontWeight: "700",
                    }}
                  >
                    Device location not enabled
                  </Text>
                </View>
                <View style={{ flex: 0.5 }}>
                  <ArrowDown />
                </View>
              </View>
              <Text
                style={{
                  color: themes[mode]["lightAsh"],
                  fontSize: ms(12),
                  lineHeight: ms(20),
                  fontWeight: "600",
                  marginHorizontal: ms(32),
                  letterSpacing: 0.3,
                }}
              >
                Tap here to enable your device location for a better experience
              </Text>
            </TouchableOpacity>
          )}
          <ScrollView
            style={{ flex: 1, zIndex: 2 }}
            showsVerticalScrollIndicator={false}
          >
            <LocationList {...locationListProp} />
          </ScrollView>
        </Animated.View>
      </WithBgHeader>
    </SafeAreaView>
  );
};

export default memo(LocationSearch);
