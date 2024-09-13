import { View, Text } from "react-native";
import React from "react";
import { themes } from "../../../../../themes";
import { detectTheme } from "../../../../../helpers";
import { ms } from "../../../../../helpers/scaling";
import { customAnimation } from "../../../../../animation/CommonAnimation";
import Animated from "react-native-reanimated";

export const Header = ({ name, content }) => {
  const mode = detectTheme();
  return (
    <Animated.View {...customAnimation("FadeInUp", 1000, 100)}>
      <Text
        style={{
          color: themes[mode]["headingColor"],
          fontSize: ms(24),
          fontWeight: "700",
          letterSpacing: 0.5,
        }}
      >
        {name}
      </Text>
      <Text
        style={{
          color: themes[mode]["lightAsh"],
          fontSize: ms(14),
          letterSpacing: 0.3,
          marginVertical: ms(3),
          textAlign: "justify",
          paddingLeft: ms(8),
        }}
      >
        {content}
      </Text>
    </Animated.View>
  );
};
