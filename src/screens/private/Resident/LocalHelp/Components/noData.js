import React from "react";
import { Platform, View, Text } from "react-native";
import { NoData } from "../../../../../../assets/img/svgs";
import { detectTheme } from "../../../../../helpers";
import { ms, vs } from "../../../../../helpers/scaling";
import { fonts, themes } from "../../../../../themes";

export const NoDataLocalHelp = ({ height = 190 }) => {
  const mode = detectTheme();
  return (
    <View
      style={{
        height: vs(height),
        alignItems: "center",
        borderRadius: ms(20),
        elevation: 5,
        backgroundColor: themes[mode]["boxShadow"],
      }}
    >
      <View
        style={{
          // width: 110,
          height: vs(height),

          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <NoData />
        <Text
          style={{
            fontFamily: fonts.regular,
            fontSize: 16,
            marginVertical: 10,
            color: themes[mode]["lightAsh3"],
          }}
        >
          No Data
        </Text>
      </View>
    </View>
  );
};
