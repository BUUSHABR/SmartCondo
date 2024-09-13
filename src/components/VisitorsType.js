import React from "react";
import { StyleSheet, Text } from "react-native";
import { TouchableOpacity, ScrollView } from "react-native-gesture-handler";
import { fonts, themes } from "../themes";
import { detectTheme } from "../helpers";
import Animated from "react-native-reanimated";
import { customAnimation } from "../animation/CommonAnimation";
import { ms } from "../helpers/scaling";

const VisitorTypes = (props) => {
  const {
    visitorType,
    onChange,
    tabArr,
    tabBarStyle,
    tabItemStyle,
    tabFontStyle,
    name,
  } = props;
  const mode = detectTheme();
  const handleChange = (val) => {
    props.onChange(name, val);
  };
  return (
    <ScrollView
      contentContainerStyle={[
        {
          flexGrow: 1,
        },
        tabBarStyle,
      ]}
      horizontal
      showsHorizontalScrollIndicator={false}
    >
      {tabArr?.map((item, index) => {
        const { label } = item;
        return (
          <Animated.View {...customAnimation("FadeIn", 700, 200, index)}>
            <TouchableOpacity
              style={[
                {
                  ...styles.tabItem,
                  backgroundColor:
                    themes[mode][
                      label === visitorType ? "primaryColor" : "lightWhite"
                    ],
                },
                tabItemStyle,
              ]}
              onPress={() => handleChange(label)}
            >
              <Text
                style={[
                  tabFontStyle,
                  {
                    fontFamily: fonts.regular,
                    fontSize: ms(14),
                    color: themes[mode]["headingColor"],
                  },
                ]}
              >
                {label === "Visitor" ? "Guest" : label}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        );
      })}
    </ScrollView>
  );
};

export default VisitorTypes;

const styles = StyleSheet.create({
  tabItem: {
    paddingHorizontal: 30,
    paddingVertical: 7,
    marginRight: 12,
    borderRadius: 30,
  },
});
