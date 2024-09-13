import React from "react";
import { View, StatusBar, Dimensions } from "react-native";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { detectTheme } from "../../../../../helpers";
import { ms, vs } from "../../../../../helpers/scaling";
import { themes } from "../../../../../themes";

export const SkeletonHome = () => {
  const mode = detectTheme();
  const windowWidth = Dimensions.get("window").width;

  return (
    <View>
      <StatusBar
        translucent={true}
        barStyle={mode === "light" ? "dark-content" : "dark-content"}
        backgroundColor="transparent"
      />
      <SkeletonPlaceholder
        speed={1500}
        backgroundColor={themes[mode]["bottom"]}
        highlightColor={
          themes[mode][mode === "light" ? "lightAsh" : "otpColor"]
        }
      >
        <View
          style={{
            width: windowWidth,
            height: vs(160),
            backgroundColor: themes[mode]["lightAsh1"],
            alignSelf: "center",
          }}
        />
        <View
          style={{
            width: 200,
            height: vs(9),
            backgroundColor: themes[mode]["lightAsh1"],
            marginVertical: ms(20),
            borderRadius: 10,
            marginHorizontal: ms(20),
          }}
        />
        <View style={{ flexDirection: "row", marginHorizontal: ms(10) }}>
          {[1, 2, 3]?.map(() => {
            return (
              <SkeletonPlaceholder
                speed={1500}
                backgroundColor={themes[mode]["bottom"]}
                highlightColor={
                  themes[mode][mode === "light" ? "lightAsh" : "otpColor"]
                }
              >
                <View
                  style={{
                    flexDirection: "row",
                    marginHorizontal: ms(2),
                    marginVertical: ms(5),
                  }}
                >
                  <View
                    style={{
                      width: vs(90),
                      height: ms(85),
                      backgroundColor: themes[mode]["lightAsh1"],
                      marginHorizontal: ms(5),
                      borderRadius: ms(5),
                    }}
                  />
                </View>
              </SkeletonPlaceholder>
            );
          })}
        </View>
        <View
          style={{
            width: 200,
            height: vs(9),
            backgroundColor: themes[mode]["lightAsh1"],
            marginVertical: ms(20),
            borderRadius: 10,
            marginHorizontal: ms(20),
          }}
        />
        <View style={{ flexDirection: "row" ,marginHorizontal: ms(10)}}>
          {[1, 2, 3, 4]?.map(() => {
            return (
              <SkeletonPlaceholder
                speed={1500}
                backgroundColor={themes[mode]["bottom"]}
                highlightColor={
                  themes[mode][mode === "light" ? "lightAsh" : "otpColor"]
                }
              >
                <View
                  style={{
                    flexDirection: "row",
                    marginHorizontal: ms(2),
                    marginVertical: ms(5),
                  }}
                >
                  <View
                    style={{
                      width: vs(65),
                      height: ms(60),
                      backgroundColor: themes[mode]["lightAsh1"],
                      marginHorizontal: ms(5),
                      borderRadius: ms(5),
                    }}
                  />
                </View>
              </SkeletonPlaceholder>
            );
          })}
        </View>

        <View
          style={{
            width: 200,
            height: vs(9),
            backgroundColor: themes[mode]["lightAsh1"],
            marginVertical: ms(20),
            borderRadius: 10,
            marginHorizontal: ms(20),
          }}
        />
        <View style={{ flexDirection: "row" ,marginHorizontal: ms(10)}}>
          {[1, 2, 3]?.map(() => {
            return (
              <SkeletonPlaceholder
                speed={1500}
                backgroundColor={themes[mode]["bottom"]}
                highlightColor={
                  themes[mode][mode === "light" ? "lightAsh" : "otpColor"]
                }
              >
                <View
                  style={{
                    flexDirection: "row",
                    marginHorizontal: ms(2),
                    marginVertical: ms(5),
                  }}
                >
                  <View
                    style={{
                      width: vs(90),
                      height: ms(100),
                      backgroundColor: themes[mode]["lightAsh1"],
                      marginHorizontal: ms(5),
                      borderRadius: ms(5),
                    }}
                  />
                </View>
              </SkeletonPlaceholder>
            );
          })}
        </View>

        <View style={{ flexDirection: "row",marginHorizontal: ms(10),marginVertical:ms(10) }}>
          {[1, 2, 3]?.map(() => {
            return (
              <SkeletonPlaceholder
                speed={1500}
                backgroundColor={themes[mode]["bottom"]}
                highlightColor={
                  themes[mode][mode === "light" ? "lightAsh" : "otpColor"]
                }
              >
                <View
                  style={{
                    flexDirection: "row",
                    marginHorizontal: ms(2),
                    marginVertical: ms(5),
                  }}
                >
                  <View
                    style={{
                      width: vs(90),
                      height: ms(100),
                      backgroundColor: themes[mode]["lightAsh1"],
                      marginHorizontal: ms(5),
                      borderRadius: ms(5),
                    }}
                  />
                </View>
              </SkeletonPlaceholder>
            );
          })}
        </View>

        <View
          style={{
            width: windowWidth-ms(20),
            height: vs(40),
            backgroundColor: themes[mode]["lightAsh1"],
            marginVertical: ms(15),
            borderRadius: 5,
            alignSelf:"center"
          }}
        />
      </SkeletonPlaceholder>
    </View>
  );
};
