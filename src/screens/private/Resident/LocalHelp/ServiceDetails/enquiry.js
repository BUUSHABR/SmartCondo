import { View, Text } from "react-native";
import React from "react";
import { ms } from "../../../../../helpers/scaling";
import { fonts, themes } from "../../../../../themes";
import { detectTheme } from "../../../../../helpers";
import { LocalInput } from "../Components/localInput";
import { LocalButton } from "../Components/button";
export const Enquiry = ({
  enquiry,
  setEnquiry,
  id,
  CreateEnquiry,
  dispatch,
  title,
  setIsModal
}) => {
  const mode = detectTheme();
  return (
    <View
      style={{
        elevation: 2,
        borderRadius: ms(10),
        marginBottom: ms(10),
        paddingVertical: ms(20),
        width: "90%",
        alignSelf: "center",
        backgroundColor: "white",
      }}
    >
      <Text
        style={{
          color: themes[mode]["headingColor"],
          fontSize: ms(16),
          fontFamily: fonts.bold,
          alignSelf: "center",
        }}
      >
        Enquire your {title.toLowerCase()}
      </Text>
      <Text
        style={{
          color: themes[mode]["lightAsh"],
          fontSize: ms(11),
          fontFamily: fonts.medium,
          alignSelf: "center",
          marginVertical: ms(5),
          marginHorizontal: ms(30),
          textAlign: "center",
        }}
      >
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate
        libero et velit interdum.
      </Text>
      <View
        style={{
          alignItems: "center",
          marginVertical: ms(5),
          marginTop: ms(20),
        }}
      >
        <View style={{ width: "100%" }}>
          <View style={{ paddingHorizontal: ms(20), marginTop: ms(0) }}>
            <LocalInput
              {...{
                placeholder: "Add your feedback",
                editComment: enquiry,
                setComment: setEnquiry,
              }}
            />
            <LocalButton
              name="Submit"
              onPress={() =>
                dispatch(
                  CreateEnquiry(id, {
                    enquiry: {
                      comment: enquiry,
                      enquiry_type: "sms",
                    },
                  },setIsModal,setEnquiry)
                )
              }
              buttonStyle={{
                height: ms(40),
                backgroundColor:
                  enquiry.length > 0 ? "#FFC727" : themes[mode]["lightAsh"],
                borderRadius: ms(5),
                justifyContent: "center",
                alignItems: "center",
                marginTop: ms(20),
              }}
              disabled={!enquiry.length}
              textStyle={{
                color: "white",
                fontFamily: fonts.medium,
                fontSize: ms(15),
              }}
            />
          </View>
        </View>
      </View>
    </View>
  );
};
