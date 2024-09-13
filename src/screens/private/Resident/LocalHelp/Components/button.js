import { TouchableOpacity, Text } from "react-native";
import React from "react";
export const LocalButton = ({
  onPress,
  name,
  textStyle,
  buttonStyle,
  disabled,
}) => {
  return (
    <TouchableOpacity disabled={disabled} onPress={onPress} style={buttonStyle}>
      <Text style={textStyle}>{name}</Text>
    </TouchableOpacity>
  );
};
