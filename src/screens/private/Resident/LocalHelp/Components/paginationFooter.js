import React from "react";
import { View, ActivityIndicator, Text } from "react-native";
import { detectTheme } from "../../../../../helpers";
import { ms, vs } from "../../../../../helpers/scaling";
import { fonts, themes } from "../../../../../themes";
export const PaginationFooter = ({ isMoreLoading, isListEnd }) => {
  const mode = detectTheme();
  return (
    <View style={{ paddingVertical: vs(10) }}>
      {isMoreLoading && <ActivityIndicator color={"#FFC727"} />}
      {isListEnd && (
        <Text
          style={{
            color: themes[mode]["lightAshDark"],
            alignSelf: "center",
            fontFamily: fonts.medium,
            fontSize: ms(11),
          }}
        >
          No more record at the moment
        </Text>
      )}
    </View>
  );
};
