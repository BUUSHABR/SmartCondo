import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { fonts, themes } from "../themes";
import { detectTheme } from "../helpers";
import { ButtonIcon } from "../../assets/img/svgs";
import Animated from "react-native-reanimated";
import { customAnimation } from "../animation/CommonAnimation";
import { ms } from "../helpers/scaling";
import { Share } from "react-native";

const SubmitButton = (props) => {
  const mode = detectTheme();

  const { handleSubmit, buttonText, disableBtn, share, Invite } = props;
  console.log(share,"lkl")
  return (
    <>
      <Animated.View {...customAnimation("FadeInDown", 700, 50, 0)}>
        {share == "send + share" && (
          <TouchableOpacity
            onPress={() => handleSubmit(true)}
            disabled={disableBtn}
            style={{
              // ...styles.align,
              opacity: disableBtn ? 0.5 : 1,
              backgroundColor: themes[mode]["primaryColor"],
              // paddingHorizontal: 30,
              height: ms(45),
              justifyContent: "center",
              alignItems: "center",
              width: ms(145),
              position: "absolute",
              zIndex: 10000,
              top: ms(-25),
              borderRadius: ms(5),
              left: ms(15),
            }}
          >
            <Text
              style={{
                fontFamily: fonts.medium,
                fontSize: ms(14),
                color: "#fff",
                // marginRight: 15,
                letterSpacing: 0.2,
              }}
            >
              Share
            </Text>
          </TouchableOpacity>
        )}
        {(Invite
          ? share == "share" || share == "send" || share == "send + share"
          : true) && (
          <TouchableOpacity
            onPress={() => handleSubmit(share == "share" ? true : false)}
            disabled={disableBtn}
            style={{
              ...styles.align,
              opacity: disableBtn ? 0.5 : 1,
              flexDirection: "row",
              backgroundColor: themes[mode]["primaryColor"],
              paddingHorizontal: ms(30),
            }}
          >
            <Text
              style={{
                fontFamily: fonts.medium,
                fontSize: ms(14),
                color: "#fff",
                marginRight: ms(10),
                letterSpacing: 0.2,
             
              }}
            >
              {share == "share" ? "Share" : buttonText}
            </Text>
            <ButtonIcon />
          </TouchableOpacity>
        )}
        <View
          style={{
            position: "absolute",
            zIndex: ms(110000),
            bottom: ms(10),
            width: "100%",
            alignItems: "center",
          }}
        >
          {(share == "share" || share == "send + share") && (
            <Text
              style={{
                // ...styles.align,
                // opacity: disableBtn ? 0.5 : 1,
                // backgroundColor: themes[mode]["primaryColor"],
                // paddingHorizontal: 30,
                letterSpacing: 0.2,
                fontFamily: fonts.medium,
                fontSize: ms(13),

                borderRadius: 5,
                opacity: 0.9,
                color: themes[mode][mode === "light" ? "tagLine" : "lineColor"],
                width: ms(250),
                textAlign: "center",
              }}
            >
              To prevent sending SMS that might not be received, share the QR.
            </Text>
          )}
        </View>
        <View
          style={{ ...styles.button, backgroundColor: themes[mode]["bottom"] }}
        ></View>
      </Animated.View>
    </>
  );
};

export default SubmitButton;

const styles = StyleSheet.create({
  button: {
    width: "100%",
    height: ms(75),
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  align: {
    zIndex: 8,
    position: "absolute",
    // width: 70,
    height: ms(45),
    borderRadius: 5,
    bottom: ms(55),
    justifyContent: "center",
    alignItems: "center",
    marginRight: ms(22),
    alignSelf: "flex-end",
    right: ms(10),
  },
});
