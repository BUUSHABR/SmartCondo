import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Linking,
  Platform,
} from "react-native";
import { detectTheme } from "../helpers";
import { themes } from "../themes";

export const PermissionCard = ({ navigation }) => {
  const mode = detectTheme();
  return (
    <View
      style={{
        position: "absolute",
        bottom: Platform.OS == "android" ? 70 : 100,
        right: 15,
        left: 15,
        zIndex: 100,
      }}
    >
      <View
        style={{
          width: "100%",
          backgroundColor: "#FFFAEC",
          borderRadius: 10,
          paddingVertical: 10,
          paddingHorizontal: 10,
          flexDirection: "row",
          borderColor: themes[mode]["lightAsh"],
          borderWidth: 0.5,
        }}
      >
        <View
          style={{
            flex: 0.5,

            justifyContent: "center",
          }}
        >
          <View style={{}}>
            <View>
              <Image
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 50,
                  borderColor: "white",
                  borderWidth: 1.5,
                }}
                source={require("../../assets/img/video.png")}
              />
            </View>
          </View>
        </View>
        <View style={{ flex: 2 }}>
          <Text
            style={{
              fontSize: 12,
              fontWeight: "500",
              color: "black",
            }}
          >
            Video call is enabled
          </Text>
          <Text style={{ color: "#828282", fontSize: 10 }}>
            It appears that the necessary permissions {`\n`} have not been granted
          </Text>
        </View>
        <View
          style={{
            flex: 0.7,
            justifyContent: "center",
          }}
        >
          <TouchableOpacity
            style={{
              height: 25,
              width: 70,
              backgroundColor: themes[mode]["primaryColor"],
              borderRadius: 10,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => {
              Linking.openSettings()
                .then(() => {
                  console.log("Opened Android settings");
                })
                .catch((err) => {
                  console.error("Error opening Android settings", err);
                });
            }}
          >
            <Text
              style={{
                color: themes[mode]["headingColor"],
                fontSize: 10,
              }}
            >
              Settings
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
