import React from "react";
import { View, StatusBar, Dimensions } from "react-native";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { detectTheme } from "../../../../../helpers";
import { ms, vs } from "../../../../../helpers/scaling";
import { themes } from "../../../../../themes";

export const SkeletonDetails = () => {
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
            flexDirection: "row",
            paddingHorizontal: ms(40),
            marginTop: ms(30),
          }}
        >
          <View
            style={{
              width: ms(90),
              height: vs(80),
              backgroundColor: themes[mode]["lightAsh1"],
              borderRadius: ms(100),
            }}
          />
          <View>
            <View
              style={{
                width: ms(110),
                height: vs(10),
                backgroundColor: themes[mode]["lightAsh1"],
                borderRadius: ms(5),
                marginLeft: ms(30),
                marginTop: ms(5),
              }}
            />
            <View
              style={{
                width: ms(140),
                height: vs(6),
                backgroundColor: themes[mode]["lightAsh1"],
                borderRadius: ms(5),
                marginLeft: ms(30),
                marginTop: ms(15),
              }}
            />
            <View
              style={{
                width: ms(160),
                height: vs(6),
                backgroundColor: themes[mode]["lightAsh1"],
                borderRadius: ms(5),
                marginLeft: ms(30),
                marginTop: ms(15),
              }}
            />
            <View
              style={{
                width: ms(100),
                height: vs(6),
                backgroundColor: themes[mode]["lightAsh1"],
                borderRadius: ms(5),
                marginLeft: ms(30),
                marginTop: ms(15),
              }}
            />
          </View>
        </View>
        <View style={{ flexDirection: "row", marginVertical: ms(20) }}>
          <View
            style={{
              width: ms(130),
              height: vs(28),
              backgroundColor: themes[mode]["lightAsh1"],
              borderRadius: ms(5),
              marginLeft: ms(30),
              marginTop: ms(15),
            }}
          />
          <View
            style={{
              width: ms(130),
              height: vs(28),
              backgroundColor: themes[mode]["lightAsh1"],
              borderRadius: ms(5),
              marginLeft: ms(30),
              marginTop: ms(15),
            }}
          />
        </View>
        <View>
          <View
            style={{
              width: ms(100),
              height: vs(10),
              backgroundColor: themes[mode]["lightAsh1"],
              borderRadius: ms(5),
              marginLeft: ms(30),
            }}
          />
          <View
            style={{
              flexDirection: "row",
              marginHorizontal: ms(23),
              marginTop: ms(20),
            }}
          >
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
                        width: vs(60),
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
              width: windowWidth-ms(40),
              height: ms(300),
              backgroundColor: themes[mode]["lightAsh1"],
              marginHorizontal: ms(5),
              borderRadius: ms(5),
              alignSelf:"center",
              marginTop:ms(20)
            }}
          />
           <View
            style={{
              width: ms(100),
              height: vs(10),
              backgroundColor: themes[mode]["lightAsh1"],
              borderRadius: ms(5),
              marginLeft: ms(30),
              marginTop:ms(20)
            }}
          />
           <View
            style={{
              width: windowWidth-ms(40),
              height: vs(40),
              backgroundColor: themes[mode]["lightAsh1"],
              borderRadius: ms(5),
              marginTop:ms(20),
              alignSelf:"center",
            }}
          />
        </View>
      </SkeletonPlaceholder>
    </View>
  );
};
