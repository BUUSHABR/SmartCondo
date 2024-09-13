import { TextInput } from "react-native";
import { detectTheme } from "../../../../../helpers";
import { fonts, themes } from "../../../../../themes";
import React from "react";
import { ms } from "../../../../../helpers/scaling";
export const LocalInput = ({ placeholder, editComment, setComment }) => {
  const mode = detectTheme();
  return (
    <TextInput
      allowFontScaling={false}
      multiline
      value={editComment}
      placeholder={placeholder}
      placeholderTextColor={themes[mode]["lightAsh"]}
      onChangeText={(val) => setComment(val)}
      style={{
        fontFamily: fonts.semiBold,
        fontSize: ms(11),
        letterSpacing: 0.7,
        fontWeight: "600",
        lineHeight: ms(22),
        color: themes[mode]["headingColor"],
        minHeight: 160,
        maxHeight: 160,
        textAlignVertical: "top",
        borderRadius: 7,
        borderWidth: 1,
        borderColor: themes[mode]["lightAsh"],
        paddingHorizontal: 10,
        paddingVertical: 5,
        minHeight: 75,
      }}
    />
  );
};
