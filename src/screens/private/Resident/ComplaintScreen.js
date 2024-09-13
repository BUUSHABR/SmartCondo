import React, { useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as RootNavigation from "../../../navigation/RootNavigation";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from "react-native-reanimated";
import { useIsFocused } from "@react-navigation/native";
const ComplaintScreen = ({ navigation }) => {
  let animateOpacity = useSharedValue(0);
  let animateScale = useSharedValue(0);
  let animateRotate = useSharedValue(0);
  let animateRadius = useSharedValue(300);
  useEffect(() => {
    navigation.addListener("focus", () => {
      console.log("calling Animation Test");
      setTimeout(() => {
        animateOpacity.value = withSpring(1);
        animateScale.value = withSpring(1);
        animateRotate.value = withSpring(360);
        animateRadius.value = withSpring(10);
      }, 1000);
    });
  }, [useIsFocused]);

  const animatedBoxStyle = useAnimatedStyle(() => {
    return {
      opacity: animateOpacity.value,
      transform: [
        { scale: animateScale.value },
        { rotate: `${animateRotate.value}deg` },
      ],
      borderRadius: animateRadius.value,
    };
  }, []);
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Animated.View
        style={[
          {
            height: 140,
            width: 140,
            backgroundColor: "blue",
          },
          animatedBoxStyle,
        ]}
      ></Animated.View>
    </View>
  );
};

export default ComplaintScreen;
