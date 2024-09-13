import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  ScrollView,
  Platform,
} from "react-native";

import { detectTheme } from "../helpers";
import { themes, fonts, commonColors } from "../themes";
import Animated from "react-native-reanimated";
import { customAnimation } from "../animation/CommonAnimation";
const CustomModal = (props) => {
  const mode = detectTheme();
  const [update, setUpdate] = useState(false);
  const {
    modalVisible,
    onRequestClose,
    handleChange,
    onResetFilter,
    modalParams,
    onSubmitFilter,
    filterArr2,
  } = props;

  const filterBtns = [
    {
      label: "Reset",
      action: onResetFilter,
      btnStyle: {
        backgroundColor: themes[mode]["bgColor"],
        borderColor: themes[mode]["primaryColor"],
        color: themes[mode]["headingColor"],
      },
      btnTextStyle: {},
    },
    {
      label: "Apply",
      action: onSubmitFilter,
      btnStyle: {
        backgroundColor: themes[mode]["primaryColor"],
        borderColor: "transparent",
        color: "#fff",
      },
    },
  ];

  return (
    <View style={{}}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={onRequestClose}
        style={{}}
      >
        {/* <TouchableWithoutFeedback style={{height: '600%'}}> */}
        <Animated.View
                          {...customAnimation("FadeInDown", 700, 500, 0)}

          style={{
            ...styles.modalContainer,
            backgroundColor: themes[mode]["modalWrap"],
          }}
        >
          <View
            style={{
              borderBottomWidth: 0.5,
              borderBottomColor: commonColors.lineColor,
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
                Close
              </Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            contentContainerStyle={{
              margin: 20,
              paddingBottom: 50,
            }}
          >
            {/* <TouchableOpacity> */}
            <Text
              style={{
                ...styles.filterText,
                color: themes[mode]["headingColor"],
              }}
            >
              Filter
            </Text>
            {filterArr2?.map((item) => {
              const {
                label,
                action,
                subMenu: { value },
                subMenu,
                name,
              } = item;
              return (
                <View style={{ marginVertical: 5 }}>
                  <TouchableOpacity
                    style={{ paddingVertical: 5 }}
                    disabled={name !== "phone"}
                    onPress={() => handleChange(name, "")}
                  >
                    <Text
                      style={{
                        ...styles.text,
                        color: themes[mode]["headingColor"],
                      }}
                    >
                      {label}
                    </Text>
                  </TouchableOpacity>

                  <View
                    style={{
                      marginLeft: 15,
                      marginVertical: 10,
                      flexDirection: "row",
                      flexWrap: "wrap",
                    }}
                  >
                    {subMenu.length == 0 && name!="phone" && (
                      <View
                        style={{
                          justifyContent: "center",
                          alignItems: "center",
                          width: "100%",
                          height: "90%",
                        }}
                      >
                        <Text
                          style={{ fontSize: 14, fontFamily: fonts.regular }}
                        >
                          No Data
                        </Text>
                      </View>
                    )}
                    {subMenu.length != 0 &&
                      subMenu?.map((item) => {
                        const { label, value, action } = item;

                        return (
                          <TouchableOpacity
                            style={{
                              paddingHorizontal: 10,
                              marginRight: 10,
                              marginVertical: 8,
                              paddingVertical: 4,
                              backgroundColor:
                                themes[mode][
                                  modalParams[name].includes(value.toString())
                                    ? "primaryColor"
                                    : mode === "light"
                                    ? "lightWhite"
                                    : "boxShadow"
                                ],
                              borderRadius: 5,
                              maxWidth: 120,
                            }}
                            onPress={() => {
                              console.log(name, "namename", value);
                              handleChange(name, value);
                            }}
                          >
                            <Text
                              style={{
                                fontFamily: fonts.regular,
                                fontSize: 12,
                                color: themes[mode]["headingColor"],
                                textTransform: "capitalize",
                              }}
                            >
                              {label}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                  </View>
                </View>
              );
            })}
            {/* </TouchableOpacity> */}
          </ScrollView>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              borderTopWidth: 0.7,
              borderTopColor: themes[mode]["lightAsh"],
              paddingHorizontal: 20,
              marginBottom: Platform.OS === "ios" ? 20 : 0,
            }}
          >
            {filterBtns?.map((item) => {
              const { label, action, btnStyle } = item;
              return (
                <TouchableOpacity
                  style={[{ ...styles.buttonStyle }, btnStyle]}
                  onPress={action}
                >
                  <Text
                    style={[
                      {
                        ...styles.buttonTextStyle,
                        color: btnStyle.color,
                      },
                    ]}
                  >
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Animated.View>
        {/* </TouchableWithoutFeedback> */}
      </Modal>
    </View>
  );
};

export default CustomModal;

const styles = StyleSheet.create({
  modalContainer: {
    width: "100%",
    position: "absolute",
    bottom: 0,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    elevation: 20,
    height: "60%",
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
