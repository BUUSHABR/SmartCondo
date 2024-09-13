import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  ScrollView,
  Platform,
  NativeModules,
  Linking,
} from "react-native";

import { detectTheme } from "../helpers";
import { themes, fonts, commonColors } from "../themes";
import { deviceDetails } from "../helpers/deviceSupport";
import { CloseVCBottom } from "../../assets/img/svgs";
import { ms } from "../helpers/scaling";
const VideoCallModal = (props) => {
  const mode = detectTheme();
  const [update, setUpdate] = useState(false);
  // const [modalVisible, setmodalVisible] = useState(false);
  const {
    onRequestClose,
    handleChange,
    onResetFilter,
    modalParams,
    onSubmitFilter,
    filterArr2,
    modalVisible,
  } = props;
  // useEffect(async()=>{
  //   let auto_Start = await AsyncStorage.getItem("auto_start")
  // autoStartParse = JSON.parse(auto_Start)
  // console.log(autoStartParse,"hey");
  // setTimeout(()=>{
  //   autoStartParse === null && setmodalVisible(true)
  // },2000)
  // },[modalVisible])
  // const onRequestClose = () => {
  //   setmodalVisible(false);
  // };

  const redirectAppInfo = async () => {
    console.log("redirect logging");
    const details = await deviceDetails();
    const deviceName = details?.Manufacturer.toLowerCase();

    console.log(deviceName, "redirect info");
    deviceName === "xiaomi"
      ? await NativeModules.OpenSettings.allowBackgroundProcess((data) => {
          console.log(data, "AUTO STARTTT");
        })
      : await Linking.openSettings();
    onRequestClose();
  };
  return (
    <View style={{}}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={onRequestClose}
        style={{}}
        backdropOpacity={0.3}
        statusBarTranslucent={true}
        hardwareAccelerated={true}
      >
        <View
          style={{
            position: "absolute",
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            width: "100%",
            height: "100%",
          }}
        ></View>
        <TouchableWithoutFeedback style={{ height: "60%" }}>
          <View
            style={{
              ...styles.modalContainer,
              backgroundColor: themes[mode]["modalWrap"],
            }}
          >
            <View
              style={{
                paddingTop: 6,
                paddingBottom: 10,
                flexDirection: "row-reverse",
              }}
            >
              <TouchableOpacity
                style={{
                  ...styles.align,
                  width: 50,
                  alignItems: "center",
                }}
                onPress={onRequestClose}
              >
                <Text
                  style={{
                    fontFamily: fonts.medium,
                    fontSize: 14,
                    color: themes[mode]["headingColor"],
                  }}
                >
                  <CloseVCBottom />
                </Text>
              </TouchableOpacity>
              <Text
                style={{
                  alignSelf: "center",
                  marginRight: "15%",
                  color:
                    themes[mode][mode === "light" ? "tagLine" : "lineColor"],
                  fontFamily: fonts.semiBold,
                  fontSize: 17,
                  fontWeight: "700",
                }}
              >
                Call Access
              </Text>
            </View>
            <View style={{ paddingHorizontal: 40 }}>
              <Text
                style={{
                  textAlign: "center",
                  color: themes[mode]["textColor"],
                  fontSize: ms(15),
                  lineHeight: ms(22),
                  fontFamily: fonts.light,
                }}
              >
                To allow Video call access in the Smart Condo app. Click the
                below button.
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                // borderTopWidth: 0.7,
                // borderTopColor: themes[mode]["lightAsh"],
                paddingHorizontal: 20,
                marginBottom: 30,
                marginTop: 30,
              }}
            >
              <TouchableOpacity
                style={{
                  backgroundColor: themes[mode]["primaryColor"],
                  paddingHorizontal: 80,
                  height: 40,
                  borderRadius: 5,
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={redirectAppInfo}
              >
                <Text
                  style={{
                    fontFamily: fonts.semiBold,
                    fontSize: 14,
                    color: "black",
                    // marginRight: 15,
                    letterSpacing: 0.2,
                    alignSelf: "center",
                  }}
                >
                  Go To Setting
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default VideoCallModal;

const styles = StyleSheet.create({
  modalContainer: {
    width: "100%",
    position: "absolute",
    bottom: 0,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    elevation: 30,
    zIndex: 12,
  },
  align: {
    width: 80,
    alignSelf: "flex-end",
    marginHorizontal: 20,
    marginVertical: 15,
  },
  filterWrap: {
    marginVertical: 20,
    marginHorizontal: 25,
  },
  filterText: {
    fontFamily: fonts.bold,
    fontSize: 16,
    letterSpacing: 0.5,
    marginBottom: 15,
  },
  section1: { marginVertical: 10 },
  flexAlign: { flexDirection: "row", alignItems: "center" },
  checkBox: {
    width: 19,
    height: 19,
    borderRadius: 7,
    borderWidth: 1.5,
    justifyContent: "center",
    alignItems: "center",
  },
  checkBoxSmall: {
    width: 15,
    height: 15,
    borderRadius: 6,
    borderWidth: 1.5,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontFamily: fonts.medium,
    fontSize: 14,
    letterSpacing: 0.3,
  },
  dateAlign: {
    marginVertical: 20,
    marginHorizontal: 15,
    flexDirection: "row",
  },
  dateBox: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginLeft: 10,
  },
  dateText: {
    fontFamily: fonts.light,
    fontSize: 12,
    letterSpacing: 0.4,
    marginLeft: 10,
  },
  buttonStyle: {
    borderRadius: 5,
    alignSelf: "flex-end",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 15,
    borderWidth: 1,
  },
  buttonTextStyle: {
    fontFamily: fonts.medium,
    fontSize: 14,
    marginVertical: 5,
    marginBottom: 7,
    marginHorizontal: 20,
  },
});
