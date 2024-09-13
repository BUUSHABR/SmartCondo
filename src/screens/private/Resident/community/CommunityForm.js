import React, { Component, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  Platform,
  Image,
  ScrollView,
} from "react-native";
import Animated from "react-native-reanimated";
import SafeAreaView from "react-native-safe-area-view";
import { themes, fonts, commonColors } from "../../../../themes";
import { detectTheme } from "../../../../helpers";
import {
  CustomButton,
  CustomImagePicker,
  CustomTextArea,
  WithBgHeader,
} from "../../../../components";
import commonStyles from "../../../../styles/commonStyles";
import { HeartIcon, ReportCommuIcon } from "../../../../../assets/img/svgs";
import { connect } from "react-redux";
import { community } from "../../../../redux/actions";
import { customAnimation } from "../../../../animation/CommonAnimation";

const CommunityForm = (props) => {
  const [formData, setData] = useState({
    content: "",
    attachments: false,
    error: "",
  });
  const mode = detectTheme();
  const handleChange = (name, value) => {
    console.log(name, value, "khdvejd");
    if (name == "delete-image") {
      setData({
        ...formData,
        ["attachments"]: false,
      });
    } else {
      setData({
        ...formData,
        [name == "image-picker" ? "attachments" : name]:
          name == "image-picker"
            ? [{ uri: value.path, type: value.mime, name: "image.jpg" }]
            : value,
        error: "",
      });
    }

    console.log(formData, "dwoidhw");
  };
  const submitForm = () => {
    console.log(formData, "lkmdnwdl");
    let decide =
      !props.features.some((data) => data == "complaints") &&
      props.features.some((data) => data == "community")
        ? false
        : true;

    if (formData.content.length > 0) {
      setData({ ...formData, error: "" });
      if (!formData.attachments) {
        let params = {
          content: formData.content,
          attachments: [],
        };
        props.communityform(params,decide);
        setData({ ...formData, content: "", attachments: false });
      } else {
        let params = {
          content: formData.content,
          attachments: formData.attachments,
        };
        props.communityform(params,decide);
        setData({ ...formData, content: "", attachments: false });
      }
    } else {
      setData({ ...formData, error: "This field is required" });
    }
  };
  const formField = {
    id: 14,
    type: "image-picker",
    name: "Image Picker",
    label: "Image Picker",
    value: formData.attachments,
    keyboardType: "numeric",
    multiselect: false,
    required: false,
    error: "",
  };
  console.log("wdlwjhwdklwdwdwdw");
  return (
    <SafeAreaView
      style={{
        width: "100%",
        backgroundColor: themes[mode]["bgColor"],
      }}
      forceInset={{ top: "never" }}
    >
      <WithBgHeader
        leftIcon={true}
        headerTitle={"Community"}
        containerStyle={{
          ...commonStyles.headerSpacing,
        }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            minHeight: "100%",
          }}
        >
          <Animated.View
          {...customAnimation("FadeInRight", 700, 50, 3)}
            style={{
              marginHorizontal: 20,
            }}
          >
            <View style={{ marginTop: 15 }}>
              <Text
                style={{
                  marginBottom: 9,
                  color: themes[mode]["headingColor"],
                  fontFamily: fonts.semiBold,
                  fontSize: 14,
                }}
              >
                Content
              </Text>
              <CustomTextArea
                value={formData.content}
                handleChange={(name, text) => handleChange("content", text)}
                placeholder="Add your content here"
                error={formData.error}
              />
            </View>
            <View style={{ marginTop: "5%" }}>
              <CustomImagePicker
                key={0}
                {...formField}
                onChange={handleChange}
              />
            </View>
          </Animated.View>
        </ScrollView>
        <View
          style={{
            position: "absolute",
            width: "100%",
            paddingHorizontal: 40,
            bottom: 0,
            marginBottom: 20,
          }}
        >
          <CustomButton
            title={"Submit"}
            buttonStyle={{
              borderColor: commonColors.yellowColor,
              backgroundColor: commonColors.yellowColor,
            }}
            textStyle={{
              color: "#fff",
            }}
            handleSubmit={submitForm}
            disableBtn={props.submitted}
          />
        </View>
      </WithBgHeader>
    </SafeAreaView>
  );
};

const mapStateToProps = ({ login: { submitted }, home: { features } }) => {
  return { submitted, features };
};
const { communityform } = community;
const mapDispatchToProps = {
  communityform,
};
export default connect(mapStateToProps, mapDispatchToProps)(CommunityForm);
