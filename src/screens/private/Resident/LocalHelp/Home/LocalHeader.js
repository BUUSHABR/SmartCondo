import { StatusBar, TouchableOpacity, View, Image, Text } from "react-native";
import React, { memo } from "react";
import { detectTheme } from "../../../../../helpers";
import * as RootNavigation from "../../../../../navigation/RootNavigation";
import { BackIcon } from "../../../../../../assets/img/svgs";
import { fonts, themes } from "../../../../../themes";
import { ms, vs } from "../../../../../helpers/scaling";
import { LocationIcon } from "../../../../../../assets/img/svgs";
import Animated from "react-native-reanimated";
import { customAnimation } from "../../../../../animation/CommonAnimation";

export const LocalHelpHeader = memo(({ locationAddress, condoName }) => {
  const mode = detectTheme();

  return (
    <Animated.View
      {...customAnimation("FadeInUp", 1000, 1000)}
      style={{
        height: vs(130),
        backgroundColor: "#FFC727",
        elevation: 5,
        paddingTop: StatusBar.currentHeight,
        paddingHorizontal: ms(10),
      }}
    >
      <StatusBar
        translucent={true}
        barStyle={mode === "light" ? "dark-content" : "dark-content"}
        backgroundColor="transparent"
      />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: ms(10),
          paddingVertical: ms(20),
        }}
      >
        <View>
          <TouchableOpacity
            onPress={() => {
              RootNavigation.goBack();
            }}
          >
            <BackIcon color={themes["light"]["headingColor"]} />
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: ms(10),
            }}
            onPress={() => RootNavigation.navigate("LocationSearch")}
          >
            <View>
              <LocationIcon />
            </View>
            <View>
              <Text
                style={{
                  fontFamily: fonts.bold,
                  fontSize: ms(16),
                  marginLeft: ms(10),
                }}
              >
                {locationAddress ? locationAddress : "Update Location"}
              </Text>
            </View>
          </TouchableOpacity>
          <View style={{ paddingHorizontal: ms(10), alignItems: "flex-end" }}>
            <Text style={{ fontFamily: fonts.medium, fontSize: ms(14),letterSpacing:0.5 }}>
              {condoName}
            </Text>
          </View>
        </View>
      </View>

      <View
        style={{
          position: "absolute",
          right: 0,
          zIndex: -1,
        }}
      >
        <Image
          source={require("../../../../../../assets/img/localRight.png")}
          style={{
            height: vs(130),
            width: vs(130),
          }}
        />
      </View>
      <View
        style={{
          position: "absolute",
          left: 0,
          zIndex: -1,
        }}
      >
        <Image
          source={require("../../../../../../assets/img/localLeft.png")}
          style={{
            height: vs(130),
            width: vs(100),
          }}
        />
      </View>
    </Animated.View>
  );
});
