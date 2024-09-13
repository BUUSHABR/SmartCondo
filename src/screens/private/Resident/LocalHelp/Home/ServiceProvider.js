import {
  StatusBar,
  TouchableOpacity,
  View,
  Text,
  FlatList,
  ImageBackground,
  StyleSheet,
  Image,
} from "react-native";
import Animated from "react-native-reanimated";

import React, { memo } from "react";
import { fonts, themes } from "../../../../../themes";
import { ms, vs } from "../../../../../helpers/scaling";
import * as RootNavigation from "../../../../../navigation/RootNavigation";
import { detectTheme } from "../../../../../helpers";
import styles from "../../../../../styles/home";
import { LocalArrow } from "../../../../../../assets/img/svgs";
import { customAnimation } from "../../../../../animation/CommonAnimation";
import { memoize } from "../../../../../helpers/memoize";
import { SET_BLE } from "../../../../../redux/actionTypes";
import { NoDataLocalHelp } from "../Components/noData";

export const ServiceProvider = ({ serviceProvided, header, isShowAll }) => {
  const mode = detectTheme();
  console.log("[ServiceProvider] list", serviceProvided);

  const renderItem = ({ item, index }) => {
    return (
      <Animated.View {...customAnimation("FadeInDown", 700, 50, index)}>
        <TouchableOpacity
          style={{
            marginHorizontal: ms(5),
            marginVertical: header ? ms(7) : ms(10),
          }}
          onPress={() =>
            !global.isLocationBlocked
              ? RootNavigation.navigate("ServiceList", { data: item })
              : RootNavigation.navigate("LocationSearch")
          }
        >
          <ImageBackground
            style={{
              height: vs(87),
              width: ms(100),
              borderRadius: 50,
              justifyContent: "flex-end",
              alignItems: "center",
            }}
            imageStyle={{ borderRadius: ms(10) }}
            source={{
              uri: item?.uri,
            }}
          >
            <View
              style={{
                ...StyleSheet.absoluteFillObject,
                backgroundColor: "rgba(0,0,0,0.3)",
                borderRadius: 10,
              }}
            ></View>
            <Text
              style={{
                color: "white",
                fontFamily: fonts.medium,
                fontSize: ms(11),
                fontWeight: "700",
                letterSpacing: 0.7,
                marginBottom: 10,
                textAlign: "center",
                paddingHorizontal: ms(5),
              }}
            >
              {item?.name}
            </Text>
          </ImageBackground>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const keyExtractor = (item) => item.id;

  return (
    <View
      style={{
        paddingHorizontal: header ? ms(20) : 0,
        marginVertical: ms(15),
      }}
    >
      {header && (
        <Animated.View {...customAnimation("FadeInUp", 1000, 1000)}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: ms(13),
            }}
          >
            <Text
              style={{
                ...styles.blockHead,
                color: themes[mode]["headingColor"],
                fontSize: ms(16),
                marginBottom: 0,
                marginTop: 0,
                marginLeft: 0,
              }}
            >
              Services provided
            </Text>
            {isShowAll && (
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginRight: ms(5),
                }}
                onPress={() => {
                  RootNavigation.navigate("ServicesHome", { serviceProvided });
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
                  Show All
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
          <Text
            style={{
              color: themes[mode]["lightAsh"],
              fontSize: ms(12),
              letterSpacing: 0.3,
              marginVertical: ms(3),
            }}
          >
            Check out services provided near your locality
          </Text>
        </Animated.View>
      )}
      <View
        style={{
          marginTop: header ? ms(10) : ms(0),
        }}
      >
        {serviceProvided?.length > 0 ? (
          <FlatList
            data={serviceProvided}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            numColumns={3}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              width: "100%",
              justifyContent: "center",
              // alignItems: "center",
            }}
          />
        ) : (
          <Animated.View {...customAnimation("ZoomIn", 1000, 100)}>
            <NoDataLocalHelp height={100} />
          </Animated.View>
        )}
      </View>
    </View>
  );
};
