import React from "react";
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  View,
  SafeAreaView,
} from "react-native";
import Animated, {
  Layout,
  ZoomIn,
  FadeInLeft,
  BounceInUp,
  FadeInUp,
  SlideInLeft,
  SlideInUp,
  ZoomInLeft,
  ZoomInUp,
  LightSpeedInRight,
} from "react-native-reanimated";
import * as RootNavigation from "../navigation/RootNavigation";
import { FocusAwareStatusBar } from "../navigation/RootNavigation";
import { detectTheme } from "../helpers";

import { BackIcon } from "../../assets/img/svgs";
import { themes, fonts, commonColors } from "../themes";
import { ms } from "../helpers/scaling";

const WithBgHeader = (props) => {
  const mode = detectTheme();
  const {
    children,
    leftIcon,
    leftText,
    leftTextStyle,
    onPressLeftIcon,
    rightIcon,
    rightText,
    rightTextStyle,
    onPressRightIcon,
    disabledLeftIcon,
    disabledRightIcon,
    headerTitle,
    headerTitleStyle,
    includeFont,
    containerStyle,
    headerStyle,
    titleCase,
    marginRight,
    marginLeft,
  } = props;
  let animate;
  if (props.animation) {
    console.log("logging false anikationn");
    animate = {};
  } else {
    animate = {
      entering: FadeInUp.duration(700).delay(400),
    };
  }

  return (
    <SafeAreaView
      style={{
        width: "100%",

        // backgroundColor: 'green',
      }}
      forceInset={{ top: "never" }}
    >
      <View style={[headerStyle]}>
        <ImageBackground
          source={
            mode === "light"
              ? require("../../assets/img/bg_light.png")
              : require("../../assets/img/bg_dark.png")
          }
          style={styles.img}
        >
          <FocusAwareStatusBar />
          <Animated.View
            {...animate}
            style={[
              containerStyle,
              {
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              },
            ]}
          >
            <TouchableOpacity
              style={[
                {
                  paddingHorizontal: 10,
                  paddingLeft: 5,
                  paddingVertical: 10,
                },
              ]}
              onPress={() =>
                onPressLeftIcon
                  ? onPressLeftIcon()
                  : leftIcon
                  ? RootNavigation.goBack()
                  : null
              }
              disabled={disabledLeftIcon}
            >
              {leftIcon ? (
                <View style={{}}>
                  <BackIcon
                    color={
                      themes[mode][
                        mode === "light" ? "headingColor" : "primaryColor"
                      ]
                    }
                    
                  />
                </View>
              ) : (
                <Text
                  style={[
                    {
                      ...styles.textLeft,

                      color: themes[mode]["headingColor"],
                    },
                    leftTextStyle,
                  ]}
                >
                  {leftText}
                </Text>
              )}
            </TouchableOpacity>
            <Text
              style={[
                {
                  ...styles.title,
                  fontSize: includeFont ?ms (24) :ms(20),
                  textTransform: titleCase ? titleCase : "capitalize",
                  color: themes[mode]["headingColor"],
                  marginRight: marginRight,
                  marginLeft: marginLeft,
                },
                headerTitleStyle,
              ]}
            >
              {headerTitle}
            </Text>
            <TouchableOpacity
              onPress={onPressRightIcon}
              style={{ marginRight: 5 }}
              disabled={disabledRightIcon}
            >
              {rightIcon ? (
                <View>{rightIcon}</View>
              ) : (
                <Text
                  style={[
                    {
                      ...styles.rightText,
                    },
                    rightTextStyle,
                  ]}
                >
                  {rightText}
                </Text>
              )}
            </TouchableOpacity>
          </Animated.View>

          {children}
        </ImageBackground>
      </View>
    </SafeAreaView>
  );
};

export default WithBgHeader;

const styles = StyleSheet.create({
  img: {
    width: "100%",
    height: "100%",
    zIndex: 1001,
    opacity:1
  },
  headerAlign: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  spacing: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  leftText: {
    fontFamily: fonts.semiBold,
    fontSize: ms(22),
  },
  rightText: {
    fontFamily: fonts.bold,
    fontSize: ms(14),
    color: commonColors.yellowColor,
  },
  title: {
    fontFamily: fonts.semiBold,
    textTransform: "capitalize",
    textAlign: "center",
  },
});
