import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
  Modal,
  Alert,
  Image,
  Linking,
} from "react-native";
import ImagePicker from "react-native-image-crop-picker";
import DeviceInfo from "react-native-device-info";
import { navigate } from "../../../navigation/RootNavigation";
import { connect } from "react-redux";
import SafeAreaView from "react-native-safe-area-view";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constant from "./Constant";
import { themes, fonts, commonColors } from "../../../themes";
import { myVisitor, profile, switchUnit } from "../../../redux/actions";
import { capitalizeTwoLetter, tailedString } from "../../../helpers";
import { LogoutModal, ToastMessage, WithBgHeader } from "../../../components";
// import ToggleSwitch from "toggle-switch-react-native";

import commonStyles from "../../../styles/commonStyles";
import styles from "../../../styles/profile";
import {
  SwitchUnitIcon,
  FaqIcon,
  LogoutIcon,
  IconNext,
  EditIcon,
  NameIcon,
  UnitIcon1,
  DocumentIcon,
  CallIcon,
  BackIcon,
  Darkmode,
  SettingIcon,
  CalHistoryIcon,
} from "../../../../assets/img/svgs";
import BlurOverlay, {
  closeOverlay,
  openOverlay,
} from "react-native-blur-overlay";
import { SvgUri } from "react-native-svg";
import Animated, { color, log } from "react-native-reanimated";
import { customAnimation } from "../../../animation/CommonAnimation";
import { ms } from "../../../helpers/scaling";
class ProfileScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      localStorageData: {},
      show: false,
      modal: false,
      userImage: "",
      count: 0,
      resident_type: "",
    };
    this.trigger = React.createRef();
    this.menus = [
      {
        name: "My Unit",
        icon: <UnitIcon1 color={themes[this.props.mode]["headingColor"]} />,
        action: "ListResident",
      },
      {
        name: "Switch Unit",
        icon: (
          <SwitchUnitIcon color={themes[this.props.mode]["headingColor"]} />
        ),
        action: "SwitchUnit",
      },
      {
        name: "My Visitors",
        icon: <NameIcon color={themes[this.props.mode]["headingColor"]} />,
        action: "MyVisitorsList",
      },

      {
        name: "Document",
        icon: <DocumentIcon color={themes[this.props.mode]["headingColor"]} />,
        action: "Documents",
      },
      {
        name: "Change Password",
        icon: <CallIcon color={themes[this.props.mode]["headingColor"]} />,
        action: "SetPassword",
      },
      {
        name: "Call History",
        icon: <CalHistoryIcon color={themes[this.props.mode]["headingColor"]} />,
        action: "CallHistory",
      },
      {
        name: "Report a Bug",
        icon: <FaqIcon color={themes[this.props.mode]["headingColor"]} />,
        action: "FaqScreen",
      },
      {
        name: "Logout",
        icon: <LogoutIcon />,
        action: "",
      },
    ];
  }
  didFetch = async () => {
    // console.log(this.props.user_image, "dkkdkkk123kjkjcwkcjkjwcd0k0kkd");
    getProfile();
    listUnits();
    onVisitorChange({ name: "visitor_type", value: "All" });
    const localStorage = await AsyncStorage.getItem("user");
    const user_image = await AsyncStorage.getItem("user_image");

    this.setState({
      localStorageData: {
        ...JSON.parse(localStorage)?.data,
        user_image: this.props.user_image,
      },
      userImage: user_image,
    });
    // console.log(
    //   this.state.localStorageData?.profile_image,
    //   "deouhfdedkcjbwekcwhhdhjhhjdwcbwceejcjenehc"
    // );
  };
  didMountFetch = () => {
    const { navigation, getProfile, listUnits, onVisitorChange } = this.props;
    // console.log("akilajkjbdewicgew bkcwc");
    this._unsubscribe = navigation.addListener("focus", async () => {
      // console.log(this.trigger.current, "dkkskjkjsjdkkk123d0k0kkd");
      getProfile();
      listUnits();
      onVisitorChange({ name: "visitor_type", value: "All" });
      const localStorage = await AsyncStorage.getItem("user");
      // console.log(
      //   JSON.parse(localStorage).data.current_unit.resident_type,
      //   "dkhwhkhwd"
      // );
      const user_image = await AsyncStorage.getItem("user_image");

      this.setState({
        localStorageData: {
          ...JSON.parse(localStorage)?.data,
          user_image: this.props.user_image,
        },
        resident_type: JSON.parse(localStorage).data.current_unit.resident_type,
        userImage: user_image,
      });
      // console.log(
      //   this.state.localStorageData?.user_image,
      //   "deouhfdedeejcjenehc"
      // );
    });
  };
  componentDidMount() {
    const { switchActive } = this.props;
    switchActive();
    this.didMountFetch();
    // console.log("kwjrbkrwbgwwkbgrejbggkrbgrejbgreg");
  }

  logout = async () => {
    this.props.logoutUser();
    setTimeout(() => {
      this.setState({ show: false });
    }, 1000);
  };

  onRequestClose = () => {
    this.setState({ show: false });
  };

  onNext = (action) => {
    // console.log(action, "kidkkd");
    this.props.navigation.navigate(action, { flow: "ChangeloginFlow" });
  };

  renderBlurChilds() {
    // console.log("renderr b;lur view");
    return (
      <View style={{ width: 500, height: 700, backgroundColor: "red" }}>
        <Text>qwertyuiowertyui</Text>
      </View>
    );
  }
  resetmodal = () => {
    this.setState({ modal: false });
  };
  EditProfile = () => {
    const { resetmodal, didFetch } = this;
    const { onProfileInputChange, profileSubmit, getProfile } = this.props;

    Alert.alert("", "You can select pictures from here", [
      {
        text: "Cancel",
        onPress: () => {},
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
            // console.log(image, "select gal img", image.size);
            let name = "profile_image";
            let value = image;
            var file = image;
            var reader = new FileReader();
            var url = reader.readAsDataURL(file);
            // console.log(url, "efojiwugfhkjlkn bwqihyckq 3f");
            if (image.size < 500000) {
              console.log(image.size, "size image 73878738773");
              await onProfileInputChange({ name, value });
              // await profileSubmit(true, didFetch, getProfile);
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
            // console.log(image, "cma img");
            let name = "profile_image";
            let value = image;
            // await onProfileInputChange({ name, value });
            // await profileSubmit(true, didFetch,getProfile);
            if (image.size < 500000) {
              // console.log(image.size, "size image 73878738773");
              await onProfileInputChange({ name, value });
              // await profileSubmit(true, didFetch, getProfile);
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
  onModeChange = async (decide) => {
    const { mode, setTheme } = this.props;
    // console.log(decide, "deicifdefkmefmkef fefefefm");
    if (decide == "clicked") {
      const theme = mode === "light" ? "dark" : "light";
      setTheme(theme);
      await AsyncStorage.setItem("mode", theme);
      // NativeModules.OpenSettings.openDisplaySettings(() => {});
    }
  };
  render() {
    const {
      mode,
      navigation,
      userData: { resident_type, units, current_unit, email },
      count,
      features,
    } = this.props;
    // console.log(this.state.resident_type, "dljhwkdwdhwd");
    const { localStorageData, show, userImage, user_image } = this.state;
    const { menus, EditProfile } = this;
    let selected = menus.slice(1, 2);
    let menuArr = menus.filter((x) => !selected.includes(x));
    let menulist = units?.length > 1 ? menus : menuArr;
    let result = features.some((data) => data == "documents");
    let filterResult =
      this.state.resident_type == "owner" && false
        ? menulist.filter((data) => data.name != "My Visitors")
        : menulist;
    let menuList = !result
      ? filterResult.filter((data) => data.name != "Document")
      : filterResult;
    // let index = localStorageData;
    // let profile = index.length != 0 ? index[index - 1] : index[0];
    // console.log(index, "mac00093993");
    // console.log(profile, "hellohellohello");

    return (
      <SafeAreaView
        style={{
          ...commonStyles.safeAreaAlign,
          backgroundColor: themes[mode]["bgColor"],
          opacity: show ? (Platform.OS === "ios" ? 0.5 : 1) : 1,
        }}
        forceInset={{ top: "never" }}
      >
        <View style={{}}>
          <WithBgHeader
            leftText="My Profile"
            includeFont
            onPressLeftIcon={() => {}}
            rightIcon={<SettingIcon color={themes[mode]["primaryColor"]} />}
            onPressRightIcon={() => {
              navigate("ProfileSettings");
            }}
            leftTextStyle={{
              ...styles.headerLeftText,
              color: themes[mode]["headingColor"],
            }}
            containerStyle={{
              ...commonStyles.headerSpacing,
              opacity: show ? (mode === "light" ? 0.3 : 1) : 1,
            }}
            headerStyle={{
              backgroundColor: show
                ? Platform.OS === "android"
                  ? "#eee"
                  : mode === "light"
                  ? "rgba(0, 0, 0, 0.3)"
                  : themes[mode]["bgColor"]
                : "transparent",
              opacity: show ? (mode === "light" ? 0.3 : 1) : 1,
            }}
          >
            {/* <View
              style={{
                position: "absolute",
                right:25,
                top:71
              }}
            >
              <ToggleSwitch
                isOn={mode === "dark" ? true : false}
                size="small"
                onToggle={()=>this.onModeChange("clicked")}
                onColor={themes[mode]["switchOn"]}
                offColor={themes[mode]["switchOff"]}
                thumbOnStyle={{
                  backgroundColor: themes[mode]["thumbOn"],
                }}
                thumbOffStyle={{
                  backgroundColor: themes[mode]["thumbOff"],
                }}
              />
            </View> */}
            <ScrollView
              contentContainerStyle={{
                ...styles.containerStyle,
                // backgroundColor: show
                //   ? Platform.OS === 'android'
                //     ? '#ccc'
                //     : mode === 'light'
                //     ? 'rgba(0, 0, 0, 0.3)'
                //     : themes[mode]['bgColor']
                //   : 'transparent',
                // opacity: show ? (Platform.os === 'android' ? 0.5 : 0.2) : 1,
              }}
              showsVerticalScrollIndicator={false}
            >
              {/* <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: 10,
                  paddingVertical: 17,
                }}
                // disabled
                onPress={this.onModeChange}
              >
                <View style={{ minWidth: 50 }}>
                  <Darkmode />
                </View>
                <Text
                  style={{
                    fontFamily: fonts.regular,
                    fontSize: 14,
                    color: "#233862",
                    color: themes[mode]["ashColor"],
                  }}
                >
                  Dark Mode
                </Text>
                <View
                  style={{
                    alignSelf: "center",
                    position: "absolute",
                    right: 0,
                  }}
                >
                  <ToggleSwitch
                    isOn={mode === "dark" ? true : false}
                    size="small"
                    onToggle={this.onModeChange}
                    onColor={themes[mode]["switchOn"]}
                    offColor={themes[mode]["switchOff"]}
                    thumbOnStyle={{
                      backgroundColor: themes[mode]["thumbOn"],
                    }}
                    thumbOffStyle={{
                      backgroundColor: themes[mode]["thumbOff"],
                    }}
                  />
                </View>
              </TouchableOpacity> */}
              <View
                style={{
                  ...styles.wrapper,
                  justifyContent: "space-between",
                  flex: 1,
                }}
              >
                <View
                  style={{
                    ...styles.profileTouchBlock,
                  }}
                  // onPress={() => {
                  //   this.setState({ modal: true });
                  // }}
                >
                  {!localStorageData?.user_image ? (
                    <View
                      style={{
                        width: 60,
                        height: 60,
                        borderRadius: 30,
                        backgroundColor: commonColors.yellowColor,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          ...styles.avatarText,
                          color: themes[mode]["headingColor"],
                        }}
                      >
                        {localStorageData?.name &&
                          capitalizeTwoLetter(localStorageData?.name)}
                      </Text>
                    </View>
                  ) : (
                    <Image
                      style={{
                        width: ms(60),
                        height: ms(60),
                        borderRadius: ms(30),
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "black",
                      }}
                      source={{
                        uri: localStorageData?.user_image,
                      }}
                    />
                  )}
                </View>

                <View style={{ marginBottom: 25 }}>
                  <View
                    style={{
                      ...styles.profileTextWrapper,
                    }}
                  >
                    <Text
                      style={{
                        ...styles.name,
                        color: themes[mode]["headingColor"],
                      }}
                    >
                      {localStorageData?.name &&
                        tailedString(localStorageData?.name, 20)}
                    </Text>
                    <View style={{ marginTop: 5 }}>
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate("UpdateProfile", {
                            name: localStorageData?.name,
                          });
                        }}
                      >
                        <EditIcon />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <Text
                    style={{
                      ...styles.phone,
                      color: themes[mode]["headingColor"],
                    }}
                  >
                    {resident_type
                      ? `${localStorageData?.phone}${"  •  "}${resident_type}`
                      : `${
                          localStorageData?.phone ? localStorageData.phone : ""
                        }`}
                  </Text>
                  <Text
                    style={{
                      ...styles.unit,
                      color: themes[mode]["headingColor"],
                    }}
                  >
                    {current_unit
                      ? `${current_unit.condo_name} , ${current_unit.unit_number}`
                      : ""}
                  </Text>
                </View>
                <View
                  style={{
                    ...styles.bottomMenuWrapper,
                    borderColor: mode === "light" ? "#f1f1f1" : "#444",
                  }}
                >
                  <View
                    style={{
                      ...styles.horizontalLine,
                    }}
                  />
                  <View
                    style={{
                      ...styles.menuWrapSpacing,
                    }}
                  >
                    {menuList?.map((item, index) => {
                      const { icon, name, action } = item;
                      return (
                        <Animated.View
                          ref={this.trigger}
                          {...customAnimation("ZoomIn", 500, 200, index)}
                        >
                          <TouchableOpacity
                            style={{
                              ...styles.menuItem,
                            }}
                            key={index}
                            onPress={() => {
                              openOverlay();
                              // RootNavigation.navigate('ListResident');
                              name === "Logout"
                                ? this.setState({ show: true })
                                : this.onNext(action);
                            }}
                          >
                            <View style={styles.menuItem1}>
                              <View style={styles.iconWrap}>{icon}</View>
                              <Text
                                style={{
                                  fontFamily: fonts.regular,
                                  fontSize: ms(16),
                                  color:
                                    name === "Logout"
                                      ? themes[mode]["error"]
                                      : themes[mode]["headingColor"],
                                }}
                              >
                                {name}
                              </Text>
                            </View>
                            {name === "Logout" ? null : <IconNext />}
                          </TouchableOpacity>
                        </Animated.View>
                      );
                    })}
                    <View style={{ height: "5%" }} />
                  </View>
                </View>
              </View>
              <View
                style={{
                  paddingTop: 0,
                  paddingBottom: 20,
                  justifyContent: "center",
                  alignItems: "center",
                  paddingHorizontal: 10,
                }}
              >
                <View
                  style={{
                    borderBottomColor: themes[mode]["lightAsh"],
                    borderBottomWidth: 0.5,
                    height: 10,
                    // backgroundColor:"red",
                    width: "90%",
                    marginBottom: 20,
                    marginTop: 20,
                  }}
                />
                <View style={{ paddingHorizontal: 5 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-evenly",
                    }}
                  >
                    <TouchableOpacity
                      style={{ paddingHorizontal: 20, marginHorizontal: 10 }}
                      onPress={() => {
                        Linking.openURL(Constant.TermsAndCondition);
                      }}
                    >
                      <Text
                        style={{
                          letterSpacing: 1,
                          textDecorationLine: "underline",
                          color: themes[mode]["lightAsh"],
                          fontSize: ms(12),
                        }}
                      >
                        Terms
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={{ paddingHorizontal: 20, marginHorizontal: 10 }}
                      onPress={() => {
                        Linking.openURL(Constant.PrivacyPolicy);
                      }}
                    >
                      <Text
                        style={{
                          letterSpacing: 1,
                          textDecorationLine: "underline",
                          color: themes[mode]["lightAsh"],
                          fontSize: ms(12),
                        }}
                      >
                        Privacy Policy
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{width:"100%",marginTop:ms(25)}}>
                  <Text
                    style={{
                      color: themes[mode]["lightAsh"],
                      fontFamily: fonts.medium,
                      fontSize: ms(13),
                      marginRight: ms(5),
                      marginLeft: ms(40),
                      
                    }}
                  >
                    App Version : {DeviceInfo.getVersion()}
                  </Text>
                  </View>
                </View>
              </View>

              <View>
                <LogoutModal
                  show={show}
                  onRequestClose={this.onRequestClose}
                  logout={this.logout}
                />
              </View>
            </ScrollView>
          </WithBgHeader>
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
                top: 60,
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
                <TouchableOpacity onPress={EditProfile}>
                  <Text style={{ color: "white", fontFamily: fonts.semiBold }}>
                    Edit
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View
              style={{ height: "41%", width: "100%", backgroundColor: "white" }}
            >
              {/* {console.log(userImage, "useriebcidvc")} */}
              {!localStorageData?.user_image ? (
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
                    {localStorageData?.name &&
                      capitalizeTwoLetter(localStorageData?.name)}
                  </Text>
                </View>
              ) : (
                // <SvgUri width="100%" height="100%" uri={userImage} />
                <Image
                  style={{ height: "100%", width: "100%" }}
                  source={{
                    uri: localStorageData?.user_image,
                  }}
                />
              )}
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = ({
  profile: { mode, userData, userimage, user_image },
  home: { count, features },
}) => {
  return {
    mode,
    userData,
    userimage,
    count,
    user_image,
    features,
  };
};
const {
  setTheme,
  getProfile,
  logoutUser,
  onProfileInputChange,
  profileSubmit,
} = profile;
const { listUnits, switchActive } = switchUnit;

const { onVisitorChange } = myVisitor;
const mapDispatchToProps = {
  setTheme,
  getProfile,
  listUnits,
  logoutUser,
  onVisitorChange,
  onProfileInputChange,
  profileSubmit,
  switchActive,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen);
