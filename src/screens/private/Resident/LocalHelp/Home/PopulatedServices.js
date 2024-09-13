import {
  StatusBar,
  TouchableOpacity,
  View,
  Image,
  Text,
  FlatList,
} from "react-native";
import React, { memo } from "react";
import { fonts, themes } from "../../../../../themes";
import { ms, vs } from "../../../../../helpers/scaling";
import * as RootNavigation from "../../../../../navigation/RootNavigation";
import { detectTheme } from "../../../../../helpers";
import styles from "../../../../../styles/home";
import LinearGradient from "react-native-linear-gradient";
import FastImage from "react-native-fast-image";
import Animated from "react-native-reanimated";
import { customAnimation } from "../../../../../animation/CommonAnimation";
import { NoDataLocalHelp } from "../Components/noData";

export const PopulatedServices = memo(({ populatedServices }) => {
  const mode = detectTheme();

  const color = ["#FFC727", "#473D99", "#455A64"];
  const renderItem = ({ item, index }) => {
    return (
      <Animated.View {...customAnimation("ZoomIn", 1000, 100, index)}>
        <TouchableOpacity
          onPress={() =>
            !global.isLocationBlocked
              ? RootNavigation.navigate("ServiceList", { data: item })
              : RootNavigation.navigate("LocationSearch")
          }
        >
          <LinearGradient
            start={{ x: 0.4, y: -0.9 }}
            locations={[0.8, 100]}
            colors={[color[index], color[index]]}
            style={{
              height: vs(85),
              width: ms(100),
              marginHorizontal: ms(5),
              borderRadius: ms(5),
            }}
          >
            <View
              style={{
                justifyContent: "space-evenly",
                width: "100%",
                alignItems: "center",
                height: "100%",
              }}
            >
              <FastImage
                style={{ width: 60, height: 60 }}
                source={{
                  uri: item?.banner_image?.s3_image_path,
                  priority: FastImage.priority.normal,
                }}
                resizeMode={FastImage.resizeMode.contain}
              />
              <Text
                style={{
                  color: "white",
                  fontFamily: fonts.medium,
                  fontSize: ms(11),
                  fontWeight: "700",
                  letterSpacing: 0.5,
                }}
              >
                {item?.title}
              </Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const keyExtractor = (item) => item.id;

  return (
    <View
      style={{
        paddingHorizontal: ms(15),
        marginVertical: ms(5),
      }}
    >
      <Animated.View {...customAnimation("FadeInUp", 1000, 200)}>
        <Text
          style={{
            ...styles.blockHead,
            color: themes[mode]["headingColor"],
            fontSize: ms(16),
          }}
        >
          Most used services
        </Text>
      </Animated.View>

      {populatedServices?.length > 0 ? (
        <FlatList
          data={populatedServices}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          horizontal
          showsHorizontalScrollIndicator={false}
          scrollEnabled
        />
      ) : (
        <Animated.View {...customAnimation("ZoomIn", 1000, 100)}>
          <NoDataLocalHelp height={100} />
        </Animated.View>
      )}
    </View>
  );
});
