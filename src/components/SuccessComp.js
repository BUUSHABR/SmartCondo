import React, { useEffect } from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Lottie from "lottie-react-native";
import { themes, fonts } from "../themes";
import { RegisterSuccess } from "../../assets/img/svgs";
import { detectTheme } from "../helpers";
import * as RootNavigation from "../navigation/RootNavigation";
import { ScrollView } from "react-native-gesture-handler";
import { CustomButton } from ".";
import { ms } from "../helpers/scaling";

const SuccessComp = (props) => {
  const { title, message, image, navigateTo } = props?.route?.params;
  const mode = detectTheme();
console.log(navigateTo,"wohdwdjkwdwdwd");
  useEffect(() => {

    setTimeout(()=>{
      RootNavigation.navigate(navigateTo?navigateTo:"BottomTab");
    },3000)
  }, []);
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: themes[mode]["bgColor"],
      }}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          backgroundColor: themes[mode]["bgColor"],
        }}
        style={{ flex: 1 }}
      >
        <View
          style={{
            paddingVertical: "15%",
            paddingHorizontal: 20,
            flex: 1,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View
            style={{
              marginVertical: "6%",
            }}
          >
            {image || <RegisterSuccess />}
          </View>
          <View>
            <Text
              style={{
                fontFamily: fonts.bold,
                fontSize: ms(22),
                lineHeight: ms(27),
                color: themes[mode]["headingColor"],
                textAlign: "center",
              }}
            >
              {title || "Welcome to SmartFacility"}
            </Text>
            <Text
              style={{
                fontFamily: fonts.light,
                fontSize: ms(16),
                lineHeight: ms(25),
                color: themes[mode]["textColor"],
                marginVertical: "5%",
                textAlign: "center",
                marginHorizontal: "5%",
              }}
            >
              {message ||
                `You have registered successfully. \n Once MA approves your account will be activate. Reach out to MA`}
            </Text>
          </View>
          <View style={{ width: "100%", marginTop: "20%" }}>
            {/* <CustomButton
              title={"Go Back"}
              handleSubmit={() => {
                RootNavigation.navigate(navigateTo?navigateTo:"BottomTab");
              }}
            /> */}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SuccessComp;
