import { View, Text, ActivityIndicator } from "react-native";
import React from "react";
import { fonts } from "../../../../themes";

const CallLoading = () => {
  console.log("loading screen renderghjhjhjhjhjhjhhhjhjhjhjhjhjhjhjhjhjhj");
  return (
    <View
      style={{
        flex: 1,
        height: "100%",
        width: "100%",
        backgroundColor: "black",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ActivityIndicator size="large" color="#fff" />
      <Text
        style={{
          fontFamily: fonts.regular,
          fontSize: 14,
          color: "#fff",
          marginVertical: "5%",
        }}
      >
        Connecting
      </Text>
    </View>
  );
};

export default CallLoading;
