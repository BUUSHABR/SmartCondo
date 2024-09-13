import React from "react";
import { View, StatusBar, Dimensions } from "react-native";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { detectTheme } from "../../../../../helpers";
import { ms, vs } from "../../../../../helpers/scaling";
import { themes } from "../../../../../themes";

export const SkeletonList = () => {
  const mode = detectTheme();
  const windowWidth = Dimensions.get("window").width;

  return (
    <View>
      <SkeletonPlaceholder
        speed={1500}
        backgroundColor={themes[mode]["bottom"]}
        highlightColor={
          themes[mode][mode === "light" ? "lightAsh" : "otpColor"]
        }
      >
        <View
          style={{
            width: ms(30),
            height: vs(20),
            backgroundColor: themes[mode]["lightAsh1"],
            marginTop: ms(55),
            borderRadius: 5,
            marginHorizontal: ms(20),
          }}
        />

        <View
          style={{
            width: ms(230),
            height: vs(12),
            backgroundColor: themes[mode]["lightAsh1"],
            marginTop: ms(25),
            borderRadius: 5,
            marginHorizontal: ms(20),
          }}
        />

        <View
          style={{
            width: ms(130),
            height: vs(12),
            backgroundColor: themes[mode]["lightAsh1"],
            marginTop: ms(15),
            borderRadius: 5,
            marginHorizontal: ms(20),
          }}
        />
        <View style={{ marginTop: ms(20) }}>
          {[1, 2, 3, 4, 5, 6, 7, 8]?.map(() => {
            return (
              <View
                style={{
                  width: windowWidth - ms(40),
                  height: vs(70),
                  backgroundColor: themes[mode]["lightAsh1"],
                  marginTop: ms(15),
                  borderRadius: 5,
                  alignSelf: "center",
                }}
              />
            );
          })}
        </View>
      </SkeletonPlaceholder>
    </View>
  );
};
