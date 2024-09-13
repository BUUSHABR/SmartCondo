import React, { Component } from "react";
import {
  View,
  ScrollView,
  Keyboard,
  Text,
  Image,
  Modal,
  TouchableOpacity,
  Alert,
  Platform
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SafeAreaView from "react-native-safe-area-view";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { connect } from "react-redux";
import ImagePicker from "react-native-image-crop-picker";

import * as RootNavigation from "../../../navigation/RootNavigation";
import { capitalizeTwoLetter, nameValidation } from "../../../helpers";
import {
  CustomTextField,
  SubmitButton,
  CustomSelect,
  WithBgHeader,
  ToastMessage,
} from "../../../components";
import { formValidation } from "../../../redux/actions/login";
import {
  onProfileInputChange,
  profileSubmit,
  genderChange,
  unChangeUser,
} from "../../../redux/actions/profile";
import { fetchUser } from "../../../navigation/localStorage";

import { commonColors, fonts, themes } from "../../../themes";
import {
  LockIcon,
  NameIcon,
  PhoneIcon,
  CountIconBig,
  UploadCamIcon,
  BackIcon,
} from "../../../../assets/img/svgs";
import commonStyles from "../../../styles/commonStyles";
import styles from "../../../styles/profileUpdate";
import { customAnimation } from "../../../animation/CommonAnimation";
import Animated from "react-native-reanimated";
import { KeyboardAvoidingView } from "react-native";
class UpdateProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nameErr: "",
      localStorageData: {},
      modal: false,
    };
  }
  logout = async () => {
    await AsyncStorage.removeItem("auth_token");
    RootNavigation.navigate("LoginForm");
  };
  resetmodal = () => {
    this.setState({ modal: false });
  };

  EditProfile = () => {
    const { resetmodal, didFetch } = this;
    const { onProfileInputChange, profileSubmit, getProfile } = this.props;

    Alert.alert("", "You can select pictures from here", [
      {
        text: "Cancel",
        onPress: () => { },
        style: "cancel",
      },
      {
        text: "Gallery",
        onPress: () => {
          ImagePicker.openPicker({
            cropping: true,
            height: 1000,
            width: 1000,
            freeStyleCropEnabled: false,
            cropperCircleOverlay: true,
            // mediaType: "photo",
          }).then(async (image) => {
            console.log(image, "select gal img", image.size);
            let name = "profile_image";
            let value = image;
            if (image.size < 500000) {
              console.log(image.size, "size image 73878738773");
              await onProfileInputChange({ name, value });
              await profileSubmit(false);
            } else {
              ToastMessage("image_size", "Image size is too big");
            }

            this.setState({ modal: false });
            // setTimeout(() => {
            //   console.log("called");
            //   didFetch()
            // }, 10000);
          });
        },
      },
      {
        text: "Camera",
        onPress: () => {
          ImagePicker.openCamera({
            width: 300,
            height: 400,
            cropping: false,
            mediaType: "photo",
            freeStyleCropEnabled: false,
          }).then(async (image) => {
            console.log(image, "cma img");
            let name = "profile_image";
            let value = image;
            // await onProfileInputChange({ name, value });
            // await profileSubmit(true, didFetch,getProfile);
            if (image.size < 500000) {
              console.log(image.size, "size image 73878738773");
              await onProfileInputChange({ name, value });
              await profileSubmit(false);
            } else {
              ToastMessage("image_size", "Image size is too big");
            }
            this.setState({ modal: false });

            // setTimeout(() => {
            //   console.log("called");
            //   didFetch()
            // }, 10000);
          });
        },
      },
    ]);
  };

  handleInputChange = (name, value) => {
    this.props.onProfileInputChange({
      name,
      value,
    });
    name === "name" && this.setState({ nameErr: "" });
  };

  handleSubmit = () => {
    const {
      userData: { name },
      profileSubmit,
    } = this.props;
    Keyboard.dismiss();
    let err = false;
    err = nameValidation(name)
      ? this.setState({ nameErr: nameValidation(name) })
      : profileSubmit(false);
  };

  focusNextField = (refs) => {
    this[refs].current.textInput.focus();
  };
  componentDidMount = async () => {
    const { navigation } = this.props;

    this._unsubscribe = navigation.addListener("focus", async () => {
      this.props.unChangeUser();
      let localStorageData = await fetchUser();

      this.setState({ localStorageData });
    });
    this._unsubscribe = navigation.addListener("blur", async () => {
      this.props.unChangeUser();
    });
  };

  render() {
    const {
      userData: { name, phone, current_unit, gender },
      mode,
      submitted,
      route: { params },
      user_image,
    } = this.props;
    const { nameErr } = this.state;

    const { handleInputChange, handleSubmit, focusNextField } = this;
    return (
      <KeyboardAwareScrollView
        contentContainerStyle={{
          ...styles.containerStyle,
          backgroundColor: themes[mode]["bgColor"],
        }}
        style={{
          ...styles.scrollStyle,
          backgroundColor: themes[mode]["bgColor"],
        }}
        scrollEnabled={false}

      >
        <SafeAreaView
          style={{
            ...styles.safeArea,
          }}
          forceInset={{ top: "never" }}
        >
          <KeyboardAvoidingView>
            {/* </ScrollView> */}
            {/* <ScrollView
            contentContainerStyle={{
              ...styles.containerStyle1,
              backgroundColor: themes[mode]["bgColor"],
            }}
            style={{
              ...styles.scrollStyle1,
            }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          > */}
            <Animated.View
              {...customAnimation("FadeInDown", 700, 50, 3)}
              style={{
                ...commonStyles.headerSpacing,
                // marginTop: 50,
              }}
            >
              <WithBgHeader leftIcon>
                <View>
                  {/* <View
                    style={{
                      ...styles.avatar,
                    }}>
                    <Text
                      style={{
                        ...commonStyles.semiBold_22,
                        color: themes[mode]['headingColor'],
                      }}>
                      {params?.name ? capitalizeTwoLetter(params.name) : ''}
                    </Text>
                  </View> */}
                  {/* <View style={{ width: 60, height: 60, borderRadius: 30 }}> */}
                  <View
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      alignSelf: "center",
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({ modal: true });
                      }}
                      style={{
                        position: "absolute",
                        zIndex: 4,
                        bottom: 0,
                        right: -3,
                      }}
                    >
                      <UploadCamIcon />
                    </TouchableOpacity>
                    {!user_image ? (
                      <View
                        style={{
                          width: 60,
                          height: 60,
                          borderRadius: 30,
                          backgroundColor: commonColors.yellowColor,
                          justifyContent: "center",
                          alignItems: "center",
                          alignSelf: "center",
                        }}
                      >
                        <Text
                          style={{
                            ...commonStyles.semiBold_22,
                            color: themes[mode]["headingColor"],
                          }}
                        >
                          {params?.name ? capitalizeTwoLetter(params.name) : ""}
                        </Text>
                      </View>
                    ) : (
                      <View>
                        <Image
                          style={{
                            width: 60,
                            height: 60,
                            borderRadius: 30,
                            justifyContent: "center",
                            alignItems: "center",
                            alignSelf: "center",
                            backgroundColor: "black",
                          }}
                          source={{
                            uri: user_image,
                          }}
                        />
                      </View>
                    )}
                  </View>
                  {/* </View> */}
                  <View style={{ marginTop: 30 }}>
                    <CustomTextField
                      name="name"
                      label={"Name"}
                      value={name}
                      onChange={handleInputChange}
                      onSubmitEditing={() => {
                        Keyboard.dismiss();
                      }}
                      keyboardType="default"
                      icon={<NameIcon />}
                      error={nameErr ? nameErr : ""}
                    />
                  </View>
                  <View>
                    <CustomTextField
                      name="phone"
                      label={"Mobile Number"}
                      value={phone}
                      maxLength={10}
                      icon={<PhoneIcon />}
                      editable={false}
                      showDisable
                      showRightIcon={<LockIcon />}
                      rightIcon
                    />
                  </View>
                  <View style={{ marginVertical: 0 }}>
                    <CustomSelect
                      placeholder={{
                        label: "Select Gender",
                        value: "",
                      }}
                      name="gender"
                      value={gender}
                      label={"Gender"}
                      items={[
                        { label: "Male", value: "male", key: 1 },
                        { label: "Female", value: "female", key: 2 },
                        { label: "Others", value: "not_said", key: 3 },
                      ]}
                      onValueChange={handleInputChange}
                    />
                  </View>
                  <View style={{}}>
                    <CustomTextField
                      name="unit"
                      label={"Unit No"}
                      value={current_unit && current_unit.unit_number}
                      icon={<CountIconBig />}
                      editable={false}
                      showDisable
                      showRightIcon={<LockIcon />}
                      rightIcon
                    />
                  </View>
                  <Text
                    style={{
                      ...styles.info,
                      color: themes[mode]["textColor"],
                    }}
                  >
                    Kindly raise a request to MA in case of any issue with your
                    unit number or mobile number
                  </Text>
                </View>
              </WithBgHeader>
            </Animated.View>
          </KeyboardAvoidingView>
          {/* </ScrollView> */}
        </SafeAreaView>
        <View style={{ position: "absolute", bottom: 0, width: "100%" }}>
          <SubmitButton
            buttonText="Update"
            handleSubmit={handleSubmit}
            disableBtn={submitted}
          />
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modal}
          onRequestClose={() => {
            // Alert.alert("Modal has been closed.");
            this.setState({ modal: false });
          }}
          style={{ backgroundColor: "red", flex: 1 }}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "black",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                position: "absolute",
                top: Platform.OS == "ios" ? 60 : 30,
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  this.setState({ modal: false });
                }}
              >
                <View style={{ marginLeft: 20 }}>
                  <BackIcon color={"white"} />
                </View>
              </TouchableOpacity>
              <View style={{ marginRight: 20 }}>
                <TouchableOpacity onPress={this.EditProfile}>
                  <Text style={{ color: "white", fontFamily: fonts.semiBold }}>
                    Edit
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View
              style={{ height: "41%", width: "100%", backgroundColor: "white" }}
            >
              {console.log(user_image, "useriebcidvc")}
              {!user_image ? (
                <View
                  style={{
                    height: "100%",
                    width: "100%",
                    backgroundColor: "#FFC727",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      ...styles.name,
                      color: themes[mode]["headingColor"],
                      fontSize: 90,
                    }}
                  >
                    {name && capitalizeTwoLetter(name)}
                  </Text>
                </View>
              ) : (
                // <SvgUri width="100%" height="100%" uri={userImage} />
                <Image
                  style={{ height: "100%", width: "100%" }}
                  source={{
                    uri: user_image,
                  }}
                />
              )}
            </View>
          </View>
        </Modal>
      </KeyboardAwareScrollView>
    );
  }
}

const mapStateToProps = ({
  profile: { userData, mode, user_image },
  login: { submitted },
}) => {
  return {
    userData,
    mode,
    submitted,
    user_image,
  };
};

const mapDispatchToProps = {
  formValidation,
  onProfileInputChange,
  profileSubmit,
  genderChange,
  unChangeUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(UpdateProfile);
