import React, { Component, useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  BackHandler,
  StyleSheet,
  NativeModules,
  Alert,
  Animated,
  Platform,
  Easing,
  Linking,
  Pressable,
  Modal,
} from "react-native";
import Lottie from "lottie-react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  OTPScreen,
  LoginScreen,
  ForgotPassword,
  SetPassword,
} from "../../public";
import Private from "../../../navigation/privateNavigator";

import {
  createStackNavigator,
  TransitionPresets,
  CardStyleInterpolators,
} from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { fonts, themes } from "../../../themes";
import { BottomLoader } from "../../../../assets/img/loader";
import { handleBackButton } from "../../../helpers";
import InviteScreen from "../Resident/InviteScreen";
import ProfileScreen from "../Resident/ProfileScreen";
import SettingScreen from "../Resident/SettingScreen";
import NotificationList from "../Resident/Notification/NotificationList";
import NotificationSubscription from "../Resident/Notification/NotificationSubscription";
import NotificationDetails from "../Resident/Notification/NotificationDetails";
import ListResident from "../Resident/Registration/ListResident";
import AddResident from "../Resident/Registration/AddResident";
import MyVisitorDetails from "../Resident/MyVisitors/MyVisitorDetails";
import MyVisitorsList from "../Resident/MyVisitors/MyVisitorsList";
import InviteHome from "../Resident/Invite/InviteHome";
import Communitys from "../Resident/Invite/Communitys";
import VisitorForm from "../Resident/Invite/VisitorForm";
import SubVisitorType from "../Resident/Invite/SubVisitorType";
import HomeScreen from "../Resident/Home/HomeScreen";
import CommunityList from "../Resident/community/CommunityList";

import SOSScreen from "../Resident/Home/SOSScreen";
import ComplaintScreen from "../Resident/ComplaintScreen";
import QRScreen from "../Resident/QRScreen";
import SwitchUnit from "../Resident/SwitchUnit";
import ComplaintList from "../Resident/Complaints/ComplaintList";
import AddComplaint from "../Resident/Complaints/AddComplaint";
import ReplyComplaint from "../Resident/Complaints/ReplyComplaint";

import AddFamilyMembers from "../Resident/Registration/AddFamilyMembers";
import ComplaintCategory from "../Resident/Complaints/ComplaintCategory";
import OpenSuccessReject from "../Resident/VideoCallFeature/OpenSuccessReject";
import { connect } from "react-redux";
import {
  HomeIcon,
  AddIcon,
  InviteIcon,
  ProfileIcon,
  SettingIcon,
  FilterIcon,
  BottomNav,
  SwitchIcon,
  BottomNavDot,
  BottomComplaintIcon,
  BottomScanIcon,
  BottomCommentIcon,
  BottomInviteIcon,
  VideoCallIcon,
  CommunityBottomIcon,
} from "../../../../assets/img/svgs";
import CommentIcon from "../../../../assets/img/home/comment.svg";
import { cloudMessagingAPI } from "../../../api/firebase";
import {
  SuccessComp,
  NoDataComp,
  AddButton,
  FilterList,
} from "../../../components";
import ComplaintDetails from "./Complaints/ComplaintDetails";
import BlePermitScreen from "../Resident/BleScreen";
import AnnouncementDetail from "./Home/AnnouncementDetail";
import Public from "../../../navigation/PublicNavigator";
import UpdateProfile from "./UpdateProfile";
import FacilitiesHome from "./Facilities/FacilitiesHome";
import FacilitiesForm from "./Facilities/FacilitiesForm";
import FaqScreen from "./FaqScreen";
import ActiveVideoCall from "./VideoCallFeature/ActiveVideoCall";
import FacilitiesDescription from "../Resident/Facilities/FacilitiesDescription";
import AddVehicles from "./Registration/AddVehicles";
import ViewRegistration from "./Registration/ViewRegistration";
import MyInvitationsList from "./Invite/MyInvitationsList";
import MyInvitationsDetails from "./Invite/MyInvitationsDetails";
import MyBookingsList from "./Facilities/MyBookingsList";
import MyBookingsDetails from "./Facilities/MyBookingsDetails";
import MyAnnouncementList from "./Invite/MyAnnouncementList";
// import FilterList from '../../../components/FilterList';
import DeviceInfoScreen from "./DeviceInfo/DeviceInfoScreen";
import DevicePermitSteps from "./DeviceInfo/DevicePermitSteps";
import DeviceInfoHome from "./DeviceInfo/DeviceInfoHome";
import FacilityTimeSlot from "./Facilities/facilityTimeSlot";
import facilityPayment from "./Facilities/facilityPayment";
import FacilityMaApproval from "../../../components/facilityMaAprroval";
import ViewDocuments from "./ViewDocuments";
// import { copilot, walkthroughable, CopilotStep } from "react-native-copilot";
import {
  TourGuideProvider, // Main provider
  TourGuideZone, // Main wrapper of highlight component
  TourGuideZoneByPosition, // Component to use mask on overlay (ie, position absolute)
  useTourGuideController, // hook to start, etc.
} from "rn-tourguide";
import VideoCallModal from "../../../components/videoCallModal";
import Eform from "../../../components/Eform";
import { onProfileInputChange } from "../../../redux/actions/profile";
import { bleTriggerAction } from "../../../redux/actions/login";
import { homePageLoader } from "../../../redux/actions/home";
import ComplaintTerms from "./Complaints/ComplaintTerms";
import Documents from "./Documents";
import CallSetting from "./Notification/CallSetting";
import CondoInfo from "./CondoInfo";
import PdfViewer from "./PdfViewer";
import ImageViewer from "./ImageViewer";
import LottieAnimation from "./Lottie";
import CommunityShow from "./community/CommunityShow";
import CommunityForm from "./community/CommunityForm";
import ConfirmOtp from "../../public/ConfirmOtp";
import CommunityLikeList from "./community/CommunityLikeList";
import ProfileSettings from "./Notification/ProfileSettings";
import CallLoading from "./VideoCallFeature/CallLoading";
import checkVersion from "react-native-store-version";
import AppUpdate from "./Home/AppUpdate";
import { navigate } from "../../../navigation/RootNavigation";
import CallHistory from "./VideoCallFeature/CallHistory";
import CallDetails from "./VideoCallFeature/CallDetails";
import LocalHelpHome from "./LocalHelp/Home/LocalHelpHome";
import FacilityStripeWebView from "./Facilities/facilityStripeWebView";
import servicesHome from "./LocalHelp/AllServices/servicesHome";
import serviceList from "./LocalHelp/ServiceList/serviceList";
import serviceDetails from "./LocalHelp/ServiceDetails/serviceDetails";
import servicesCommentList from "./LocalHelp/ServiceDetails/servicesCommentList";
import locationSearch from "./LocalHelp/LocationSearch/locationSearch";
import { ms } from "../../../helpers/scaling";
import Feedback from "./feedback/feedback";
import FeedbackForm from "./feedback/feedbackForm";
import FeedbackList from "./feedback/feedbackList";
import feedbackDetail from "./feedback/feedbackDetail";
import feedbackRply from "./feedback/feedbackRply";
import { PermissionCard } from "../../../components/PermissionCard";
import { check, request, PERMISSIONS, RESULTS } from "react-native-permissions";
import TestingComp from "./TestingComp";
import { Path, Svg } from "react-native-svg";
// import { Easing } from "react-native-reanimated";
global.dispatch;
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
// const CopilotText = walkthroughable(Text);
let ignoreShowCase;
const BottomTab = (props) => {
  const { userData } = props;
  console.log(userData, "userData smart condo");
  const [loading, setLoader] = useState(true);
  const [isUpdate, setIsUpdate] = useState(false);
  const [UpdateStatus, SetUpdateStatus] = useState("Update");
  const [isHavePermisson, setIsHavePerimission] = useState(true);

  const translate = useRef(new Animated.Value(0)).current;
  const dispatch = useDispatch();
  global.dispatch = dispatch;

  const userState = useSelector((state) => {
    return state.profile;
  });
  const netInfo = useSelector((state) => {
    return state.home.netInfo;
  });
  const mode = userState.mode;
  // console.log(netInfo, "&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");
  let Features = props.features;
  const {
    canStart, // a boolean indicate if you can start tour guide
    start, // a function to start the tourguide
    stop, // a function  to stopping it
    eventEmitter, // an object for listening some events
  } = useTourGuideController();

  useEffect(() => {
    setInterval(() => {
      permissioncheck();
    }, 2000);
  }, []);
  const checkBothPermissions = async () => {
    const cameraPermission =
      Platform.OS === "android"
        ? PERMISSIONS.ANDROID.CAMERA
        : PERMISSIONS.IOS.CAMERA;

    const microphonePermission =
      Platform.OS === "android"
        ? PERMISSIONS.ANDROID.RECORD_AUDIO
        : PERMISSIONS.IOS.MICROPHONE;

    const cameraStatus = await check(cameraPermission);
    const microphoneStatus = await check(microphonePermission);

    return (
      cameraStatus === RESULTS.GRANTED && microphoneStatus === RESULTS.GRANTED
    );
  };
  const permissioncheck = async () => {
    const areBothPermissionsGranted = await checkBothPermissions();
    setIsHavePerimission(areBothPermissionsGranted);
  };
  useEffect(() => {
    // console.log("0000000info000000", netInfo);
    netInfo && props.bleIsActive
      ? dispatch(bleTriggerAction(true))
      : dispatch(bleTriggerAction(false));
    if (Platform.OS === "android") {
      netInfo == true &&
        setTimeout(
          () =>
            Animated.timing(translate, {
              toValue: 90,
              duration: 2000,
              useNativeDriver: true,
            }).start(),
          2000
        );
      netInfo == false &&
        Animated.timing(translate, {
          toValue: -90,
          duration: 2000,
          useNativeDriver: true,
        }).start();
    } else {
      netInfo == true &&
        setTimeout(
          () =>
            Animated.timing(translate, {
              toValue: -100,
              duration: 2000,
              useNativeDriver: true,
            }).start(),
          2000
        );
      netInfo == false &&
        Animated.timing(translate, {
          toValue: 70,
          duration: 2000,
          useNativeDriver: true,
        }).start();
    }
  }, [netInfo]);
  useEffect(() => {
    netInfos();
  }, [netInfo]);

  const netInfos = async () => {
    // console.log("logging internery 1111", netInfo);
    if (netInfo) {
      await AsyncStorage.setItem("qr_expiry_extend", "false");
    }
    if (netInfo == false) {
      let user = await AsyncStorage.getItem("user");
      let datas = JSON.parse(user);
      let id = datas["data"]["identity_id"];
      let units = datas["data"]["units"];
      let name = units[0].resident.name;
      // console.log(id, "qrscreen dat", units, name);
      dispatch(onProfileInputChange({ name: "name", value: name }));
      var extend = await AsyncStorage.getItem("qr_expiry_extend");
      // console.log(extend, "extend");
      if (extend == "false") {
        var currentDate = new Date();
        var expiryDate = new Date(
          currentDate.setDate(currentDate.getDate() + 1)
        );
        // console.log("expiry date setted qr", expiryDate);
        let DateSet = {
          Date: expiryDate,
        };
        // console.log(DateSet, "date fixx qr");
        await AsyncStorage.setItem("qr_expiry", JSON.stringify(DateSet));

        await AsyncStorage.setItem("qr_expiry_extend", "true");
      }

      var d = await AsyncStorage.getItem("qr_expiry");
      // console.log(d, "stoage toast");
      // get
      let qr_Start = await AsyncStorage.getItem("qr_expiry");
      // console.log(qr_Start, "auto qr");
      let qrParse = JSON.parse(qr_Start);
      // compare

      // console.log(new Date(), "new date qr");
      // console.log(new Date(qrParse.Date), "expirt date did mount qr");

      if (new Date() > new Date(qrParse.Date)) {
        // console.log("epxired data qr");
        // await AsyncStorage.removeItem("qr_expiry");
        dispatch(onProfileInputChange({ name: "identity_id", value: "" }));
        dispatch(onProfileInputChange({ name: "units", value: [] }));
      } else {
        dispatch(onProfileInputChange({ name: "identity_id", value: id }));
        dispatch(onProfileInputChange({ name: "units", value: units }));
        var time = new Date(qrParse.Date).getTime() - new Date().getTime();
        var days = time / (1000 * 3600 * 24);
        // console.log(" days have qr", Math.round(days));
      }
    }
  };
  useEffect(() => {
    setLoader(false);
    cloudMessaging();
    // await cloudMessagingAPI();
    // setTimeout(async () => {
    //   Alert.alert(
    //     '',
    //     'Enable the permissions for proper working of bluetooth and video call',
    //     [
    //       {
    //         text: 'Cancel',
    //         onPress: () => console.log('Cancel Pressed'),
    //         style: 'cancel',
    //       },
    //       {
    //         text: 'OK',
    //         onPress: async () => {
    //           console.log("")
    //           await NativeModules.OpenSettings.allowBackgroundProcess(data => {
    //             console.log(data, 'ALOOW BACKGEOUND');
    //           });
    //         },
    //       },
    //     ],
    //   );
    // }, 3000);

    // console.log(allowData, 'allowssss');

    // if (device === 'xiaomi' || device === 'POCO') {
    //   Alert.alert(
    //     '',
    //     'For receiving video call you need to enable other permissions',
    //     [
    //       {
    //         text: 'Cancel',
    //         onPress: () => console.log('Cancel Pressed'),
    //         style: 'cancel',
    //       },
    //       {
    //         text: 'OK',
    //         onPress: () => {
    //           NativeModules.OpenSettings.allowBackgroundProcess(() => {});
    //         },
    //       },
    //     ],
    //   );
    // }
    // console.log("open from BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB");
    return () => {
      // await cloudMessagingAPI();
      cloudMessaging(dispatch);
      // console.log("clean up function in bonttom tab ");
    };
  }, []);
  const cloudMessaging = async () => {
    await cloudMessagingAPI(dispatch);
  };
  useEffect(() => {
    // console.log("12345 logging");
    ignoreCase();
  }, [ignoreShowCase]);

  const ignoreCase = async () => {
    ignoreShowCase = await AsyncStorage.getItem("ignoreShowCase");
    // console.log("12345", ignoreShowCase);
    if (canStart) {
      // 👈 test if you can start otherwise nothing will happen
      ignoreShowCase !== "true" && start();
      // console.log("123456789", ignoreShowCase);
    }
  };
  const handleOnStart = () => console.log("start");
  const handleOnStop = () => console.log("stop");
  const handleOnStepChange = () => console.log(`stepChange`);
  useEffect(() => {
    eventEmitter.on("start", handleOnStart);
    eventEmitter.on("stop", handleOnStop);
    eventEmitter.on("stepChange", handleOnStepChange);

    return () => {
      eventEmitter.off("start", handleOnStart);
      eventEmitter.off("stop", handleOnStop);
      eventEmitter.off("stepChange", handleOnStepChange);
    };
  }, []);



  return (
    <>
      {false && (
        <Modal
          animationType="fade"
          transparent
          visible
          onRequestClose={() => { }}
        >
          <Pressable
            style={[
              Platform.OS == "ios"
                ? {
                  backgroundColor: "#000000",
                  opacity: 0.3,
                }
                : {
                  backgroundColor: "#232f34",
                  opacity: 0.4,
                },
              {
                position: "absolute",
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
              },
            ]}
            onPress={() => { }}
          />
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              marginTop: 22,
            }}
          >
            <View
              style={{
                backgroundColor: "white",
                width: "90%",
                paddingVertical: ms(30),
                borderRadius: ms(30),
              }}
            >
              <View style={{ alignItems: "center" }}>
                <Text
                  style={{
                    color: themes[mode]["headingColor"],
                    fontFamily: fonts.bold,
                    fontSize: ms(16),
                  }}
                >
                  Visitor Arrived
                </Text>
                <Text
                  style={{
                    color: themes[mode]["lightAsh"],
                    fontFamily: fonts.bold,
                    fontSize: ms(13),
                    marginTop: ms(5),
                  }}
                >
                  Vistor waiting at the gate
                </Text>
              </View>
              <View style={{ alignItems: "center", marginVertical: ms(15) }}>
                <Lottie
                  source={require("../../../../assets/gif/notify.json")}
                  autoPlay
                  loop
                  style={{
                    width: "40%",
                  }}
                />
              </View>
              <View
                style={{ flexDirection: "row", justifyContent: "space-evenly" }}
              >
                <TouchableOpacity
                  style={{
                    backgroundColor: "red",
                    paddingHorizontal: ms(25),
                    paddingVertical: ms(7),
                    borderRadius: ms(5),
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontFamily: fonts.bold,
                      fontSize: ms(13),
                    }}
                  >
                    Decline
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    backgroundColor: "green",
                    paddingHorizontal: ms(25),
                    paddingVertical: ms(7),
                    borderRadius: ms(5),
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontFamily: fonts.bold,
                      fontSize: ms(13),
                    }}
                  >
                    Accept
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
      {userData?.current_unit?.video_call && !isHavePermisson && (
        <PermissionCard />
      )}
      <Animated.View
        style={
          Platform.OS === "ios"
            ? {
              height: 90,
              backgroundColor: netInfo ? "#32CD32" : "#FF0000",
              position: "absolute",
              zIndex: 12,
              width: "100%",
              top: -90,
              borderBottomLeftRadius: 15,
              borderBottomRightRadius: 15,
              opacity: 0.8,
              alignItems: "center",
              transform: [
                {
                  translateY: translate,
                },
              ],
            }
            : {
              height: 40,
              backgroundColor: netInfo ? "#32CD32" : "#FF0000",
              position: "absolute",
              zIndex: 12,
              width: "100%",
              bottom: -40,
              borderTopLeftRadius: 15,
              borderTopRightRadius: 15,
              opacity: 0.8,
              alignItems: "center",
              transform: [
                {
                  translateY: translate,
                },
              ],
            }
        }
      >
        <Text
          style={{
            color: "#FFFFFF",
            marginTop: Platform.OS === "android" ? "2%" : "16%",
            fontFamily: fonts.regular,
            fontWeight: "600",
          }}
        >
          {netInfo ? "Back Online" : "Check your internet connection"}
        </Text>
      </Animated.View>


      <Tab.Navigator
        screenOptions={{
          animationEnabled: false,
          tabBarShowLabel: false,
          headerShown: false,

          tabBarStyle: {
            paddingTop: 18,
            // paddingBottom: 15,
            height: Platform.OS === "ios" ? "10%" : ms(55),
            backgroundColor: mode === "light" ? "#fff" : "#000",
          },
        }}
        initialRouteName="Home"
        activeColor="#fff"
        backBehavior="history"
        lazy={false}
        tabBarOptions={{
          activeTintColor: "#FFC727",
          inactiveTintColor: "#C1C1C1",
          keyboardHidesTabBar: true,
          tabStyle: {
            // paddingTop: 10,
            // paddingBottom: 20,
          },

          style: {
            backgroundColor: mode === "light" ? "#fff" : "#000",
            elevation: 2,
            // height: Platform.OS === 'ios' ? '10%' : 150,
            // justifyContent: 'center',
            // alignItems: 'center',
            // elevation: 4,
          },

          labelStyle: {
            fontSize: 12,
            fontFamily: fonts.regular,
            // marginBottom: allowInvite ? 7 : 0,
          },
        }}
        shifting="true"
      >
        <Tab.Screen
          name="Home"
          options={{
            // tabBarLabel: '',

            tabBarIcon: ({ color, focused }) => {
              return (
                <View>
                  {loading ? (
                    <View>
                      <BottomLoader />
                    </View>
                  ) : (
                    <View style={styles.align}>
                      {/* <CopilotStep
                      text="Notification recieves for invitation ,complaints and qr entry"
                      order={8}
                      name="notifijhlkjjcekjcecation"
                    >
                      <CopilotText style={{ padding: 5 }}> */}
                      <HomeIcon color={color} />
                      {/* </CopilotText>
                    </CopilotStep> */}
                      <View style={{ marginTop: 15, height: 10 }}>
                        {focused && <BottomNavDot />}
                      </View>
                    </View>
                  )}
                </View>
              );
            },
            tabBarIconStyle: {
              width: ms(100),
              height: ms(60),

              // marginBottom: 12,
            },
          }}
          listeners={{
            focus: () =>
              BackHandler.addEventListener(
                "hardwareBackPress",
                handleBackButton
              ),
            blur: () =>
              BackHandler.removeEventListener(
                "hardwareBackPress",
                handleBackButton
              ),
          }}
          component={HomeScreen}
        />
        {/* {console.log(userData, "woifdhuwffe feiofuefef")} */}
        {/* {resident_type == "owner" && true && ( */}
        <Tab.Screen
          name="InviteHome"
          options={{
            tabBarLabel: "",
            tabBarIcon: ({ color, focused }) => {
              // console.log(focused, "dfff");
              return (
                <View>
                  {loading ? (
                    <View>
                      <BottomLoader />
                    </View>
                  ) : (
                    <View style={styles.align}>
                      {/* <CopilotStep
                      text="Notification recieves for invitation ,complaints and qr entry"
                      order={9}
                      name="notifijjcekjcecation"
                    >
                      <CopilotText style={{ padding: 5 }}> */}
                      {/* <TourGuideZone
                      zone={11}
                      text={"A1 jkdfkjfejfekjfejfekjf"}
                      borderRadius={16}
                      shape={"circle"}
                      style={{ padding: 10 }}

                    > */}
                      <BottomInviteIcon color={color} />
                      {/* </TourGuideZone> */}
                      {/* </CopilotText>
                    </CopilotStep> */}
                      <View style={{ marginTop: 15, height: 10 }}>
                        {focused && <BottomNavDot />}
                      </View>
                    </View>
                  )}
                </View>
              );
            },
            tabBarIconStyle: {
              width: ms(100),
              height: ms(60),
              // marginBottom: 12,
            },
          }}
          // tabBarIcon: ({color}) => (
          //   <View>
          //     {loading ? <BottomLoader /> : <FilterIcon color={color} />}
          //   </View>
          // ),
          component={InviteHome}
        />
        {/* // )} */}
        {/* <Tab.Screen
          name="Add"
          component={addComp}
          options={{
            tabBarLabel: '',
            tabBarIcon: () => {
              return (
                <View
                  style={{
                    width: 60,
                    height: 0,
                    position: 'absolute',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <AddButton />
                </View>
              );
            },
          }}
        /> */}

        <Tab.Screen
          name="QRScreen"
          options={{
            tabBarLabel: "",
            tabBarIcon: ({ color, focused }) => {
              return (
                <View style={{ height: 70, }}>
                  {loading ? (
                    <View>
                      <BottomLoader />
                    </View>
                  ) : (
                    <View style={{ ...styles.align, height: "100%", bottom: 6 }}>
                      {/* <Svg width="150" height="60" viewBox="0 0 109 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <Path d="M19 0H89V25C89 44.33 73.33 60 54 60V60C34.67 60 19 44.33 19 25V0Z" fill="#DADADA" />
                        {/* <Path fill-rule="evenodd" clip-rule="evenodd" d="M20 20V0H0C11.0457 0 20 8.95428 20 20Z" fill="#DADADA" /> */}
                        {/* <Path fill-rule="evenodd" clip-rule="evenodd" d="M89 20V0H109C97.9543 0 89 8.95431 89 20Z" fill="#DADADA" /> */}
                      {/* </Svg>  */}
                      <Svg width="93" height="58" viewBox="0 0 73 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <Path d="M0 0H73V1.5C73 21.6584 56.6584 38 36.5 38V38C16.3416 38 0 21.6584 0 1.5V0Z" fill="#DADADA" />
                      </Svg>
                      {/* <CopilotStep 
                      text="Notification recieves for invitation ,complaints and qr entry"
                      order={10}
                      name="nolkjjcekjcecation"
                    >
                      <CopilotText style={{ padding: 5 }}> */}
                      {/* <TourGuideZone
                      zone={16}
                      text={"A react-native-copilot remastered! 🎉"}
                      borderRadius={16}
                      shape={"circle"}
                      style={{ padding: 10 }}

                    > */}
                      <View style={{ bottom: ms(40) }}>
                        <BottomScanIcon color={"red"} />
                      </View>
                      {/* </TourGuideZone> */}
                      {/* </CopilotText>
                    </CopilotStep> */}
                      <View style={{ marginTop: 15, height: 10 }}>
                        {focused && <BottomNavDot />}
                      </View>
                    </View>
                  )}
                </View>
              );
            },
            tabBarIconStyle: {
              width: ms(100),
              height: ms(60),
              // marginBottom: 12,
            },

            // tabBarIcon: ({color}) => (
            //   <View>
            //     {loading ? <BottomLoader /> : <SettingIcon color={color} />}
            //   </View>
            // ),
          }}
          component={QRScreen}
        />

        {Features.some((data) => data == "complaints") && (
          <Tab.Screen
            name="ComplaintCategory"
            options={{
              tabBarLabel: "",
              tabBarIcon: ({ color, focused }) => {
                return (
                  <View>
                    {loading ? (
                      <View>
                        <BottomLoader />
                      </View>
                    ) : (
                      <View style={styles.align}>
                        {/* <CopilotStep
                      text="Notification recieves for invitation ,complaints and qr entry"
                      order={11}
                      name="notifijhlkjjcekon"
                    >
                      <CopilotText style={{ padding: 5 }}> */}
                        {/* <TourGuideZone
                      zone={17}
                      text={"A react-native-copilot remastered! 🎉"}
                      borderRadius={16}
                      shape={"circle"}
                      style={{ padding: 10 }}
                    > */}
                        <BottomComplaintIcon color={color} />
                        {/* </TourGuideZone> */}
                        {/* </CopilotText>
                    </CopilotStep> */}
                        <View style={{ marginTop: 15, height: 10 }}>
                          {focused && <BottomNavDot />}
                        </View>
                      </View>
                    )}
                  </View>
                );
              },
              tabBarIconStyle: {
                width: ms(100),
                height: ms(60),
                // marginBottom: 12,
              },

              // tabBarIcon: ({color}) => (
              //   <View>
              //     {loading ? <BottomLoader /> : <SettingIcon color={color} />}
              //   </View>
              // ),
            }}
            component={ComplaintCategory}
          />
        )}
        {/* (!Features.some((data) => data == "complaints") ||
          !(resident_type == "owner" && false)) */}
        {!Features.some((data) => data == "complaints") &&
          Features.some((data) => data == "community") && (
            <Tab.Screen
              name="CommunityList"
              options={{
                tabBarLabel: "",
                tabBarIcon: ({ color, focused }) => {
                  // console.log(focused, "dfff");
                  return (
                    <View>
                      {loading ? (
                        <View>
                          <BottomLoader />
                        </View>
                      ) : (
                        <View style={styles.align}>
                          {/* <CopilotStep
                      text="Notification recieves for invitation ,complaints and qr entry"
                      order={9}
                      name="notifijjcekjcecation"
                    >
                      <CopilotText style={{ padding: 5 }}> */}
                          {/* <TourGuideZone
                      zone={11}
                      text={"A1 jkdfkjfejfekjfejfekjf"}
                      borderRadius={16}
                      shape={"circle"}
                      style={{ padding: 10 }}

                    > */}
                          <CommunityBottomIcon color={color} />
                          {/* </TourGuideZone> */}
                          {/* </CopilotText>
                    </CopilotStep> */}
                          <View style={{ marginTop: 15, height: 10 }}>
                            {focused && <BottomNavDot />}
                          </View>
                        </View>
                      )}
                    </View>
                  );
                },
                tabBarIconStyle: {
                  width: 100,
                  height: 60,
                  // marginBottom: 12,
                },
              }}
              // tabBarIcon: ({color}) => (
              //   <View>
              //     {loading ? <BottomLoader /> : <FilterIcon color={color} />}
              //   </View>
              // ),
              component={CommunityList}
            />
          )}
        <Tab.Screen
          name="ProfileScreen"
          options={{
            tabBarLabel: "",
            tabBarIcon: ({ color, focused }) => (
              <View>
                {loading ? (
                  <BottomLoader />
                ) : (
                  <View style={styles.align}>
                    {/* <CopilotStep
                      text="Notification recieves for invitation ,complaints and qr entry"
                      order={12}
                      name="notifijhlkjjc"
                    >
                      <CopilotText style={{ padding: 5 }}> */}
                    <ProfileIcon color={color} />
                    {/* </CopilotText>
                    </CopilotStep> */}
                    <View style={{ marginTop: 15, height: 10 }}>
                      {focused && <BottomNavDot />}
                    </View>
                  </View>
                )}
              </View>
            ),
            tabBarIconStyle: {
              width: 100,
              // marginBottom: 12,

              height: 60,
            },
          }}
          component={ProfileScreen}
        />
      </Tab.Navigator>
    </>
  );
};

const ResidentStack = (props) => {
  // console.log(
  //   props.features,
  //   ")))))))))))))))))))))))))))))))))))))))))))0000000000000000000000000000000000"
  // );
  let features = props.features;
  let userData = props.userData;
  const config = {
    animation: "spring",
    config: {
      stiffness: 1000,
      damping: 500,
      mass: 3,
      overshootClamping: true,
      restDisplacementThresold: 0.01,
      restSpeedThresold: 0.01,
    },
  };
  const closeConfig = {
    animation: "timing",
    config: {
      duration: 100,
      easing: Easing.linear,
    },
  };
  const [stripKey, setStripeKey] = useState("");
  useEffect(() => {
    handleStripekey();
  }, []);
  const handleStripekey = async () => {
    setStripeKey(await AsyncStorage.getItem("stripKey"));
  };
  return (
    <Stack.Navigator
      screenOptions={({ navigation }) => {
        return {
          detachPreviousScreen: !navigation.isFocused(),
          animationEnabled: true,
          headerShown: false,
          // gestureEnabled: true,
          // gestureDirection:"vertical",
          // // ...TransitionPresets.FadeFromBottomAndroid,
          // transitionSpec:{
          //   open:config,
          //   close:closeConfig
          // }
        };
      }}
    // headerMode="float"
    // animation="fade"
    >
      <Stack.Screen
        options={({ route, navigation }) => ({
          animationEnabled: true,
          gestureEnabled: true,
          // gestureDirection:"horizontal",
          ...TransitionPresets.DefaultTransition,
          transitionSpec: {
            open: config,
            close: closeConfig,
          },
        })}
        name="BottomTab"
      >
        {(props) => (
          <BottomTab
            {...props}
            bleIsActive={props.bleIsActive}
            features={features}
            userData={userData}
          />
        )}
      </Stack.Screen>
      <Stack.Screen
        options={({ route, navigation }) => ({
          animationEnabled: true,
          gestureEnabled: true,
          // gestureDirection:"horizontal",
          ...TransitionPresets.SlideFromRightIOS,
          transitionSpec: {
            open: config,
            close: closeConfig,
          },
        })}
        name="AnnouncementDetail"
        component={AnnouncementDetail}
      />
      {/* <Stack.Screen name="InviteHome" component={InviteHome} /> */}
      <Stack.Screen name="VisitorForm" component={VisitorForm} />
      <Stack.Screen
        options={({ route, navigation }) => ({
          animationEnabled: true,
          gestureEnabled: true,
          // gestureDirection:"horizontal",
          ...TransitionPresets.ModalSlideFromBottomIOS,
          transitionSpec: {
            open: config,
            close: closeConfig,
          },
        })}
        name="MyInvitationsList"
        component={MyInvitationsList}
      />
      <Stack.Screen
        options={({ route, navigation }) => ({
          animationEnabled: true,
          gestureEnabled: true,
          // gestureDirection:"horizontal",
          ...TransitionPresets.ModalSlideFromBottomIOS,
          transitionSpec: {
            open: config,
            close: closeConfig,
          },
        })}
        name="MyAnnouncementList"
        component={MyAnnouncementList}
      />
      <Stack.Screen
        name="MyInvitationsDetails"
        component={MyInvitationsDetails}
        options={({ route, navigation }) => ({
          animationEnabled: true,
          gestureEnabled: true,
          // gestureDirection:"horizontal",
          ...TransitionPresets.SlideFromRightIOS,
          transitionSpec: {
            open: config,
            close: closeConfig,
          },
        })}
      />
      <Stack.Screen name="SubVisitorType" component={SubVisitorType} />
      {/* <Stack.Screen name="ComplaintList" component={ComplaintList} /> */}
      <Stack.Screen name="SOSScreen" component={SOSScreen} />
      <Stack.Screen name="ComplaintScreen" component={ComplaintScreen} />
      {/* <Stack.Screen name="QRScreen" component={QRScreen} /> */}
      <Stack.Screen name="SwitchUnit" component={SwitchUnit} />
      <Stack.Screen
        options={({ route, navigation }) => ({
          animationEnabled: true,
          gestureEnabled: true,
          // gestureDirection:"horizontal",
          ...TransitionPresets.ModalSlideFromBottomIOS,
          transitionSpec: {
            open: config,
            close: closeConfig,
          },
        })}
        name="MyVisitorsList"
        component={MyVisitorsList}
      />
      <Stack.Screen name="FilterList" component={FilterList} />
      <Stack.Screen
        options={({ route, navigation }) => ({
          animationEnabled: true,
          gestureEnabled: true,
          // gestureDirection:"horizontal",
          ...TransitionPresets.SlideFromRightIOS,
          transitionSpec: {
            open: config,
            close: closeConfig,
          },
        })}
        name="MyVisitorDetails"
        component={MyVisitorDetails}
      />
      <Stack.Screen
        options={({ route, navigation }) => ({
          animationEnabled: true,
          gestureEnabled: true,
          // gestureDirection:"horizontal",
          ...TransitionPresets.ModalSlideFromBottomIOS,
          transitionSpec: {
            open: config,
            close: closeConfig,
          },
        })}
        name="NotificationList"
        component={NotificationList}
      />
      <Stack.Screen name="CallSetting" component={CallSetting} />
      <Stack.Screen
        name="NotificationSubscription"
        component={NotificationSubscription}
      />
      <Stack.Screen
        options={({ route, navigation }) => ({
          animationEnabled: true,
          gestureEnabled: true,
          // gestureDirection:"horizontal",
          ...TransitionPresets.SlideFromRightIOS,
          transitionSpec: {
            open: config,
            close: closeConfig,
          },
        })}
        name="ComplaintDetails"
        component={ComplaintDetails}
      />
      <Stack.Screen name="AddComplaint" component={AddComplaint} />
      <Stack.Screen name="ComplaintTerms" component={ComplaintTerms} />
      <Stack.Screen
        options={({ route, navigation }) => ({
          animationEnabled: true,
          gestureEnabled: true,
          // gestureDirection:"horizontal",
          ...TransitionPresets.ModalSlideFromBottomIOS,
          transitionSpec: {
            open: config,
            close: closeConfig,
          },
        })}
        name="ComplaintList"
        component={ComplaintList}
      />
      <Stack.Screen name="ReplyComplaint" component={ReplyComplaint} />
      {/* <Stack.Screen name="ComplaintCategory" component={ComplaintCategory} /> */}
      <Stack.Screen name="ListResident" component={ListResident} />
      <Stack.Screen name="AddResident" component={AddResident} />
      <Stack.Screen name="AddFamilyMembers" component={AddFamilyMembers} />
      <Stack.Screen name="AddVehicles" component={AddVehicles} />
      <Stack.Screen name="ViewRegistration" component={ViewRegistration} />
      <Stack.Screen
        options={({ route, navigation }) => ({
          animationEnabled: true,
          gestureEnabled: true,
          // gestureDirection:"horizontal",
          ...TransitionPresets.ModalSlideFromBottomIOS,
          transitionSpec: {
            open: config,
            close: closeConfig,
          },
        })}
        name="UpdateProfile"
        component={UpdateProfile}
      />
      <Stack.Screen name="BlePermitScreen" component={BlePermitScreen} />
      <Stack.Screen name="DeviceInfoHome" component={DeviceInfoHome} />
      <Stack.Screen name="DeviceInfoScreen" component={DeviceInfoScreen} />
      <Stack.Screen name="DevicePermitSteps" component={DevicePermitSteps} />
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="FacilitiesHome" component={FacilitiesHome} />
      <Stack.Screen
        name="FacilitiesDescription"
        component={FacilitiesDescription}
      />
      <Stack.Screen name="FacilitiesForm" component={FacilitiesForm} />
      <Stack.Screen
        options={({ route, navigation }) => ({
          animationEnabled: true,
          gestureEnabled: true,
          // gestureDirection:"horizontal",
          ...TransitionPresets.ModalSlideFromBottomIOS,
          transitionSpec: {
            open: config,
            close: closeConfig,
          },
        })}
        name="MyBookingsList"
        component={MyBookingsList}
      />
      <Stack.Screen
        options={({ route, navigation }) => ({
          animationEnabled: true,
          gestureEnabled: true,
          // gestureDirection:"horizontal",
          ...TransitionPresets.SlideFromRightIOS,
          transitionSpec: {
            open: config,
            close: closeConfig,
          },
        })}
        name="MyBookingsDetails"
        component={MyBookingsDetails}
      />
      <Stack.Screen name="FeedBack" component={Feedback} />
      <Stack.Screen name="FeedBackForm" component={FeedbackForm} />
      <Stack.Screen name="FeedBackList" component={FeedbackList} />
      <Stack.Screen name="FeedbackDetail" component={feedbackDetail} />
      <Stack.Screen name="FeedbackRply" component={feedbackRply} />

      <Stack.Screen name="FaqScreen" component={FaqScreen} />
      <Stack.Screen name="Documents" component={Documents} />
      <Stack.Screen name="PdfView" component={PdfViewer} />
      <Stack.Screen name="ImageViewer" component={ImageViewer} />
      <Stack.Screen name="DocumentView" component={ViewDocuments} />
      <Stack.Screen
        options={({ route, navigation }) => ({
          animationEnabled: true,
          gestureEnabled: true,
          // gestureDirection:"horizontal",
          ...TransitionPresets.DefaultTransition,
          transitionSpec: {
            open: config,
            close: closeConfig,
          },
        })}
        name="CondoInfo"
        component={CondoInfo}
      />
      <Stack.Screen name="Lottie" component={LottieAnimation} />
      <Stack.Screen name="ChangePassword" component={OTPScreen} />
      <Stack.Screen name="ConfirmOtp" component={ConfirmOtp} />
      <Stack.Screen name="SuccessPage" component={SuccessComp} />
      <Stack.Screen name="FacilityMaApproval" component={FacilityMaApproval} />
      <Stack.Screen name="ProfileSettings" component={ProfileSettings} />
      <Stack.Screen name="FacilityTimeSlot" component={FacilityTimeSlot} />
      <Stack.Screen name="FacilityPayment" component={facilityPayment} />
      <Stack.Screen
        name="FacilityStripeWebView"
        component={FacilityStripeWebView}
      />
      <Stack.Screen name="CommunityList" component={CommunityList} />
      <Stack.Screen
        options={({ route, navigation }) => ({
          animationEnabled: true,
          gestureEnabled: true,
          // gestureDirection:"horizontal",
          ...TransitionPresets.SlideFromRightIOS,
          transitionSpec: {
            open: config,
            close: closeConfig,
          },
        })}
        name="CommunityShow"
        component={CommunityShow}
      />
      <Stack.Screen name="CommunityForm" component={CommunityForm} />
      <Stack.Screen
        options={({ route, navigation }) => ({
          animationEnabled: true,
          gestureEnabled: true,
          // gestureDirection:"horizontal",
          ...TransitionPresets.ModalSlideFromBottomIOS,
          transitionSpec: {
            open: config,
            close: closeConfig,
          },
        })}
        name="CommunityLikeList"
        component={CommunityLikeList}
      />
      <Stack.Screen name="ActiveVideoCall" component={ActiveVideoCall} />
      <Stack.Screen name="CallHistory" component={CallHistory} />
      <Stack.Screen name="CallDetails" component={CallDetails} />
      <Stack.Screen name="CallLoading" component={CallLoading} />
      <Stack.Screen name="OpenSuccessReject" component={OpenSuccessReject} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="OTPScreen" component={OTPScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="SetPassword" component={SetPassword} />
      <Stack.Screen
        name="LocalHelpHome"
        options={({ route, navigation }) => ({
          animationEnabled: true,
          gestureEnabled: true,
          // gestureDirection:"horizontal",
          ...TransitionPresets.ModalSlideFromBottomIOS,
          transitionSpec: {
            open: config,
            close: closeConfig,
          },
        })}
        component={LocalHelpHome}
      />
      <Stack.Screen
        name="ServicesHome"
        options={({ route, navigation }) => ({
          animationEnabled: true,
          gestureEnabled: true,
          // gestureDirection:"horizontal",
          ...TransitionPresets.ModalFadeTransition,
          transitionSpec: {
            open: config,
            close: closeConfig,
          },
        })}
        component={servicesHome}
      />
      <Stack.Screen
        name="ServiceList"
        options={({ route, navigation }) => ({
          animationEnabled: true,
          gestureEnabled: true,
          // gestureDirection:"horizontal",
          ...TransitionPresets.SlideFromRightIOS,
          transitionSpec: {
            open: config,
            close: closeConfig,
          },
        })}
        component={serviceList}
      />
      <Stack.Screen
        name="ServiceDetail"
        options={({ route, navigation }) => ({
          animationEnabled: true,
          gestureEnabled: true,
          // gestureDirection:"horizontal",
          ...TransitionPresets.ModalTransition,
          transitionSpec: {
            open: config,
            close: closeConfig,
          },
        })}
        component={serviceDetails}
      />
      <Stack.Screen
        name="ServiceCommentList"
        options={({ route, navigation }) => ({
          animationEnabled: true,
          gestureEnabled: true,
          // gestureDirection:"horizontal",
          ...TransitionPresets.SlideFromRightIOS,
          transitionSpec: {
            open: config,
            close: closeConfig,
          },
        })}
        component={servicesCommentList}
      />
      <Stack.Screen
        name="LocationSearch"
        options={({ route, navigation }) => ({
          animationEnabled: true,
          gestureEnabled: true,
          // gestureDirection:"horizontal",
          ...TransitionPresets.SlideFromRightIOS,
          transitionSpec: {
            open: config,
            close: closeConfig,
          },
        })}
        component={locationSearch}
      />
      <Stack.Screen
        name="Testing"
        options={({ route, navigation }) => ({
          animationEnabled: true,
          gestureEnabled: true,
          // gestureDirection:"horizontal",
          ...TransitionPresets.SlideFromRightIOS,
          transitionSpec: {
            open: config,
            close: closeConfig,
          },
        })}
        component={TestingComp}
      />
      <Stack.Screen name="Private" component={Private} />
      <Stack.Screen name="Public" component={Public} />
    </Stack.Navigator>
  );
};
const mapStateToProps = ({
  home: { features },
  login: { bleIsActive },
  profile: { userData },
}) => {
  return {
    features,
    bleIsActive,
    userData,
  };
};
export default connect(mapStateToProps)(ResidentStack);
const styles = StyleSheet.create({
  align: {
    justifyContent: "space-between",
    alignItems: "center",
  },
});
