import React from "react";
import { View, StatusBar, Dimensions } from "react-native";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { detectTheme } from "../../../../../helpers";
import { ms, vs } from "../../../../../helpers/scaling";
import { themes } from "../../../../../themes";

export const SkeletonRating = () => {
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
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
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
          <View style={{ width: "65%" }}>
            <View
              style={{
                width: ms(70),
                height: vs(13),
                backgroundColor: themes[mode]["lightAsh1"],
                marginTop: ms(60),
                borderRadius: 5,
                marginHorizontal: ms(20),
              }}
            />
          </View>
        </View>

        <View
          style={{
            width: "100%",
            paddingHorizontal: ms(40),
            marginTop: ms(30),
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: ms(110),
              height: vs(10),
              backgroundColor: themes[mode]["lightAsh1"],
              borderRadius: ms(5),
              marginTop: ms(5),
            }}
          />
          <View
            style={{
              width: ms(140),
              height: vs(6),
              backgroundColor: themes[mode]["lightAsh1"],
              borderRadius: ms(5),
              marginTop: ms(15),
            }}
          />
          <View
            style={{
              width: ms(160),
              height: vs(6),
              backgroundColor: themes[mode]["lightAsh1"],
              borderRadius: ms(5),
              marginTop: ms(15),
            }}
          />
        </View>
        <View
          style={{
            paddingHorizontal: ms(20),
            marginTop: ms(10),
          }}
        >
          <View
            style={{
              width: "100%",
              height: vs(8),
              backgroundColor: themes[mode]["lightAsh1"],
              borderRadius: ms(5),
              marginTop: ms(15),
            }}
          />
          <View
            style={{
              width: "100%",
              height: vs(8),
              backgroundColor: themes[mode]["lightAsh1"],
              borderRadius: ms(5),
              marginTop: ms(15),
            }}
          />
          <View
            style={{
              width: "100%",
              height: vs(8),
              backgroundColor: themes[mode]["lightAsh1"],
              borderRadius: ms(5),
              marginTop: ms(15),
            }}
          />
          <View
            style={{
              width: "100%",
              height: vs(8),
              backgroundColor: themes[mode]["lightAsh1"],
              borderRadius: ms(5),
              marginTop: ms(15),
            }}
          />
        </View>
        <View style={{ marginTop: ms(20) }}>
          {[1, 2, 3, 4]?.map(() => {
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
