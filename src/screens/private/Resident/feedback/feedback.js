import { View, Text, SafeAreaView } from "react-native";
import React from "react";
import { detectTheme } from "../../../../helpers";
import { themes } from "../../../../themes";
import commonStyles from "../../../../styles/commonStyles";
import { CustomButton, WithBgHeader } from "../../../../components";
import { FacilitySuccess } from "../../../../../assets/img/svgs";
import { ms } from "../../../../helpers/scaling";
import { navigate } from "../../../../navigation/RootNavigation";


const Feedback = () => {
  const mode = detectTheme();
  return (
    <SafeAreaView
      style={{
        flex: 1,
        height: "100%",
        backgroundColor: themes[mode]["bgColor"],
      }}
      forceInset={{ top: "never" }}
    >
      <WithBgHeader
        leftIcon
        headerTitle="FeedBack"
        headerTitleStyle={{
          marginLeft: 40,

        }}
        rightText="History"
        onPressRightIcon={() => {
          navigate("FeedBackList");
        }}
        containerStyle={{
          ...commonStyles.headerSpacing,
        }}
      >
        <View style={{
            paddingHorizontal:ms(10),
            flex:1,
            justifyContent:"space-evenly"
        }}>
          <View style={{
            justifyContent:"center",
            alignItems:"center",
            paddingVertical:ms(20),
            
          }}>
            <FacilitySuccess />
            <Text style={{marginTop:ms(80),textAlign:"center",paddingHorizontal:ms(20)}}>
              If there is something that requires our attention or if you have
              an awesome suggestion , we would like to hear from you !
            </Text>
          </View>
          <View style={{paddingHorizontal:ms(10)}}>
            <CustomButton
              title={"Create Feedback"}
              handleSubmit={() => {
             navigate("FeedBackForm")
              }}
              buttonStyle={{
            
                backgroundColor: themes[mode]["primaryColor"],
              }}
            />
          </View>
        </View>
      </WithBgHeader>
    </SafeAreaView>
  );
};

export default Feedback;
