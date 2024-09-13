import React, { useRef, useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { themes, fonts } from "../themes";
import { detectTheme } from "../helpers";
import { ErrorIcon } from "../../assets/img/svgs";
import { ms } from "../helpers/scaling";

const AnimatedText = Animated.createAnimatedComponent(Text);

const CustomTextArea = (props) => {
  const inputRef = useRef();
  const [isFocusedState, setIsFocused] = useState(false);
  const [leftAnimated, setLeftAnimated] = useState(9);
  const [topAnimated, setTopAnimated] = useState(2);
  const isFocused = false;

  useEffect(() => {
    if (isFocused === undefined) {
      if (value !== "" || isFocusedState) {
        setIsFocused(true);
      } else if (value === "" || value === null) {
        setIsFocused(false);
      }
    }
  }, [value]);

  useEffect(() => {
    if (isFocusedState) {
      setFontSize(ms(11));
      setLeftAnimated(-6);
      setTopAnimated(0);
    } else {
      setFontSize(ms(16));
      setLeftAnimated(9);
      setTopAnimated(2);
    }
  }, [isFocusedState]);

  function handleFocus() {
    setIsFocused(true);
  }

  function handleBlur() {
    if (value === "") {
      setIsFocused(false);
    }
  }
  // onSubmitEditing() {
  //   this.props.onSubmitEditing();
  // }
  const setFocus = () => {
    inputRef.current?.focus();
  };
  const [fontSize, setFontSize] = useState(16);

  const positionAnimations = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withTiming(leftAnimated, {
            duration: 300,
            easing: Easing.in(Easing.ease),
          }),
        },
        {
          translateY: withTiming(topAnimated, {
            duration: 300,
            easing: Easing.in(Easing.ease),
          }),
        },
      ],
      fontSize: withTiming(fontSize, {
        duration: 300,
        easing: Easing.in(Easing.ease),
      }),
    };
  });

  const {
    handleChange,
    value,
    placeholder,
    error,
    id,
    type,
    label,
    name,
    theme,
    Color
  } = props;
  // const { onSubmitEditing } = this;
  const mode = detectTheme();
  const showErr = error.length > 5;
  var themeDecide =
    theme == "bottomBorder" ?  { borderBottomWidth: 1 }:{ borderWidth: 1 };
  return (
    <View>
      <View
        style={{
          ...themeDecide,
          borderRadius: 7,
          // borderBottomWidth: 1,
          borderColor: themes[mode][showErr ? "error" : "lightAsh"],
          paddingHorizontal: 10,
          paddingVertical: 5,
          minHeight: 75,
        }}
      >
        {label && (
          <AnimatedText
            onPress={setFocus}
            style={[
              {
                fontFamily: fonts.regular,
                color: themes[mode]["lightAsh"],
                fontSize:ms(16)
              },
              positionAnimations,
            ]}
          >
            {label}
          </AnimatedText>
        )}
        <TextInput
          onFocus={handleFocus}
          onBlur={handleBlur}
          // ref={(input) => (this.textInput = input)}
          ref={inputRef}
          allowFontScaling={false}
          multiline
          onChangeText={(text) => handleChange(name, text, id, type)}
          value={value}
          placeholder={placeholder}
          placeholderTextColor={themes[mode]["lightAsh"]}
          // onSubmitEditing={onSubmitEditing}
          style={{
            fontFamily: fonts.semiBold,
            fontSize: ms(16),
            letterSpacing: ms(0.7),
            fontWeight: "600",
            lineHeight: ms(22),
            color:Color?"black":themes[mode]["headingColor"],
            minHeight: ms(160),
            maxHeight:ms(160),
            textAlignVertical: "top",
          }}
        />
      </View>
      {showErr && (
        <View style={{ flexDirection: "row", marginVertical: 5 }}>
          <ErrorIcon />
          <Text
            style={{
              ...styles.error,
              color: themes[mode]["error"],
            }}
          >
            {error}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  error: {
    fontFamily: fonts.regular,
    fontSize: 12,
    alignSelf: "flex-start",
    marginLeft: 7,
  },
});

export default CustomTextArea;
