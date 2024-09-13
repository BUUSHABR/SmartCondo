import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";

import { themes, fonts } from "../themes";
import { detectTheme } from "../helpers";
import commonStyles from "../styles/commonStyles";
import Animated from "react-native-reanimated";
import { customAnimation } from "../animation/CommonAnimation";

const CustomButton = (props) => {
  const mode = detectTheme();
  const { handleSubmit, title, disableBtn, buttonStyle, textStyle } = props;
  return (
    <Animated.View {...customAnimation("FadeInDown", 900, 50, 1)}>
      <TouchableOpacity
        onPress={handleSubmit}
        disabled={disableBtn}
        style={[
          buttonStyle,
          {
            ...commonStyles.whiteBtnStyle,
            opacity: disableBtn ? 0.5 : 1,
            marginVertical: 15,
            
          },
        ]}
      >
        <View>
          <Text
            style={[
              textStyle,
              {
                ...commonStyles.whiteBtnTxtStyle,
                marginHorizontal: 20,
                color: textStyle
                  ? textStyle.color
                  : themes[mode]["headingColor"],
              },
            ]}
          >
            {title}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  button: {
    width: "100%",
    height: 40,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: themes["light"]["primaryColor"],
  },

  text: {
    fontFamily: fonts.medium,
    fontSize: 16,
    textAlign: "center",
  },
});
