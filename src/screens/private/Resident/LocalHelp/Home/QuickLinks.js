import { TouchableOpacity, View, Text, FlatList } from "react-native";
import React, { memo } from "react";
import { fonts, themes } from "../../../../../themes";
import { ms, vs } from "../../../../../helpers/scaling";
import * as RootNavigation from "../../../../../navigation/RootNavigation";
import { detectTheme } from "../../../../../helpers";
import styles from "../../../../../styles/home";
import FastImage from "react-native-fast-image";
import Animated from "react-native-reanimated";
import { customAnimation } from "../../../../../animation/CommonAnimation";
import { NoDataLocalHelp } from "../Components/noData";

export const QuickLinks = memo(({ quickLinks }) => {
  const mode = detectTheme();

  const renderItem = ({ item, index }) => {
    console.log(item, "QuickLinks List");
    return (
      <Animated.View {...customAnimation("ZoomIn", 700, 100, index)}>
        <TouchableOpacity
          style={{
            height: vs(60),
            width: ms(70),
            marginHorizontal: ms(5),
            borderRadius: ms(10),
            borderWidth: 0.7,
            borderColor: "#BDBDBD",
          }}
          onPress={() =>
            !global.isLocationBlocked
              ? RootNavigation.navigate("ServiceList", { data: item })
              : RootNavigation.navigate("LocationSearch")
          }
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
              style={{ width: 35, height: 35 }}
              source={{
                uri: item?.uri,
                priority: FastImage.priority.normal,
              }}
              resizeMode={FastImage.resizeMode.contain}
            />
          </View>
        </TouchableOpacity>
        <Text
          style={{
            color: themes[mode]["headingColor"],
            fontFamily: fonts.medium,
            fontSize: ms(11),
            alignSelf: "center",
            marginTop: ms(5),
            fontWeight: "600",
          }}
        >
          {item?.name}
        </Text>
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
      <Animated.View {...customAnimation("FadeInUp", 1000, 1000)}>
        <Text
          style={{
            ...styles.blockHead,
            color: themes[mode]["headingColor"],
            fontSize: ms(16),
          }}
        >
          Quick Links
        </Text>
      </Animated.View>
      {quickLinks?.length > 0 ? (
        <FlatList
          data={quickLinks}
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
