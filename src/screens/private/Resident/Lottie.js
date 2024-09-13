import React from "react";
import Lottie from "lottie-react-native";
import { StyleSheet, Dimensions, View, Text } from "react-native";
import { fonts, themes } from "../../../themes";
import { detectTheme } from "../../../helpers";
import { ms } from "../../../helpers/scaling";

export default function LottieAnimation() {
  const mode = detectTheme();
  return (
    <View style={{ flex: 1, backgroundColor: themes[mode]["bgColor"] }}>
      <Lottie
        source={require("../../../../assets/gif/swicth_unit.json")}
        autoPlay
        loop
      />
      <View
        style={{
          width: "100%",
          position: "absolute",
          top: "65%",
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: ms (30),
        }}
      >
        <Text
          style={{
            fontFamily: fonts.bold,
            marginVertical:ms(10),
            fontSize: ms(20),
            color: themes[mode]["headingColor"],
          }}
        >
          Switching...
        </Text>
        {/* <Text
          style={{
            textAlign: "center",
            marginTop: 15,
            fontFamily: fonts.regular,
            color: themes[mode]["lightAsh"],
          }}
        >
          Please wait a moment as we are forwarding your call to the next condo.
        </Text> */}
      </View>
    </View>
  );
}
