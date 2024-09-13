import { View, Text, Linking, Platform } from "react-native";
import React, { useState } from "react";
import { fonts, themes } from "../../../../../themes";
import { detectTheme } from "../../../../../helpers";
import { ms, vs } from "../../../../../helpers/scaling";
import FastImage from "react-native-fast-image";
import { BlackStar, LocalhelpTime } from "../../../../../../assets/img/svgs";
import { LocationInfo } from "../Components/locationInfo";
import { CustomButton } from "../../../../../components";
import { LocalButton } from "../Components/button";
import Animated from "react-native-reanimated";
import { customAnimation } from "../../../../../animation/CommonAnimation";
import { ModalContainer } from "../Components/ModalContainer";
import { Enquiry } from "./enquiry";

export const ServiceHeader = ({
  phone,
  profile_image,
  title,
  avg_rating,
  locationTitle,
  locationAddress,
  preferred_timing_morning,
  preferred_timing_evening,
  enquiry,
  setEnquiry,
  id,
  CreateEnquiry,
  dispatch,
  name,
}) => {
  const [isModal, setIsModal] = useState(false);
  const mode = detectTheme();
  console.log(
    avg_rating,
    "Service Header avg _rating",
    preferred_timing_morning,
    preferred_timing_evening
  );
  const openDialPad = (number) => {
    dispatch(
      CreateEnquiry(
        id,
        {
          enquiry: {
            comment: "contacted  to local helper",
            enquiry_type: "call",
          },
        },
        "",
        "",
        true
      )
    );
    let num = "";
    if (Platform.OS === "android") {
      num = `tel:${number}`;
    } else {
      num = `telprompt:${number}`;
    }
    Linking.openURL(num);
  };
  const enquiryProp = {
    enquiry,
    setEnquiry,
    id,
    CreateEnquiry,
    dispatch,
    title,
    setIsModal,
  };
  const source = profile_image
    ? {
        uri: profile_image,
        priority: FastImage.priority.normal,
      }
    : require("../../../../../../assets/img/profile.png");
  return (
    <Animated.View {...customAnimation("FadeInDown", 1000, 100)}>
      <View
        style={{
          flexDirection: "row",
          height: ms(95),
        }}
      >
        <View
          style={{
            flex: 1.3,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <FastImage
            style={{
              width: 90,
              height: 90,
              borderRadius: ms(100),
              backgroundColor: "grey",
            }}
            source={source}
            resizeMode={FastImage.resizeMode.contain}
          />
        </View>
        <View style={{ flex: 2, justifyContent: "space-evenly" }}>
          <Text
            style={{
              color: themes[mode]["headingColor"],
              fontFamily: fonts.bold,
              fontSize: ms(16),
              fontWeight: "600",
              letterSpacing: 0.7,
            }}
          >
            {name}
          </Text>
          <View style={{ flexDirection: "row" }}>
            <Text
              style={{
                color: themes[mode]["lightAsh"],
                fontFamily: fonts.medium,
                fontSize: ms(12),
                fontWeight: "600",
              }}
            >
              {title || ""}
            </Text>
            {avg_rating != 0 && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginLeft: ms(5),
                }}
              >
                <BlackStar />
                <Text
                  style={{
                    color: themes[mode]["lightAsh"],
                    fontFamily: fonts.medium,
                    fontSize: ms(11),
                    fontWeight: "500",
                    letterSpacing: 0.7,
                    marginLeft: ms(5),
                  }}
                >
                  {avg_rating}
                </Text>
              </View>
            )}
          </View>
          <LocationInfo {...{ locationTitle, locationAddress }} />
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <LocalhelpTime />
            <View style={{ marginLeft: ms(3) }}>
              {preferred_timing_morning && (
                <Text
                  style={{
                    color: themes[mode]["lightAsh"],
                    fontFamily: fonts.medium,
                    fontSize: ms(10),
                    fontWeight: "600",
                    marginLeft: ms(5),
                  }}
                >
                  {preferred_timing_morning}
                </Text>
              )}
              {preferred_timing_morning && (
                <Text
                  style={{
                    color: themes[mode]["lightAsh"],
                    fontFamily: fonts.medium,
                    fontSize: ms(10),
                    fontWeight: "600",
                    marginLeft: ms(5),
                  }}
                >
                  {preferred_timing_evening}
                </Text>
              )}
            </View>
          </View>
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-evenly",
          marginVertical: ms(20),
        }}
      >
        <LocalButton
          name="Call"
          onPress={() => openDialPad(phone)}
          buttonStyle={{
            width: ms(140),
            height: ms(35),
            backgroundColor: "#3FBF62",
            borderRadius: ms(5),
            justifyContent: "center",
            alignItems: "center",
          }}
          textStyle={{
            color: "white",
            fontFamily: fonts.medium,
            fontSize: ms(15),
          }}
        />
        <LocalButton
          name="Enquiry"
          onPress={() => {
            setIsModal(true);
          }}
          buttonStyle={{
            width: ms(140),
            height: ms(35),
            backgroundColor: "#FFC727",
            borderRadius: ms(5),
            justifyContent: "center",
            alignItems: "center",
          }}
          textStyle={{
            color: "white",
            fontFamily: fonts.medium,
            fontSize: ms(15),
          }}
        />
      </View>
      {isModal && (
        <ModalContainer onClose={setIsModal}>
          <Enquiry {...enquiryProp} />
        </ModalContainer>
      )}
    </Animated.View>
  );
};
