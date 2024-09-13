import React, { Component, PureComponent } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Animated, {
  Layout,
  ZoomIn,
  FadeInLeft,
  BounceInUp,
  FadeInUp,
  SlideInLeft,
  SlideInUp,
  ZoomInLeft,
  ZoomInUp,
  LightSpeedInRight,
} from "react-native-reanimated";
import {
  View,
  Text,
  TouchableOpacity,
  DeviceEventEmitter,
  FlatList,
  StatusBar,
  Image,
  NativeModules,
  Alert,
  BackHandler,
  Platform,
  TouchableWithoutFeedback,
  Pressable,
} from "react-native";
import { connect } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import ReactNativeBleAdvertiser from "@teamdotworld/rn-ble-advertiser";
import Carousel, { Pagination } from "react-native-snap-carousel";
import { fetchProfile } from "../../../../api/profile";
import RootNavigation from "../../../../navigation/RootNavigation";
import {
  profile,
  home,
  notification,
  login,
  switchUnit,
  invite,
  localhelp,
  facility,
} from "../../../../redux/actions";
import {
  screenSize,
  tailedString,
  detectTheme,
  windowSize,
  SliceName,
  capitalize,
  customTimeFunction,
  requestCameraPermission,
  requestMicrophonePermission,
  requestMultiplePermissions,
} from "./../../../../helpers";
import { commonColors, fonts, themes } from "../../../../themes";
import {
  Bell,
  SosManIcon,
  SOSIcon,
  HomeBleIcon,
  NoVisitor,
  LeftInfoSvg,
  RightInfoSvg,
  CondoIconSvg,
  RightSwitchArrow,
  MyVisitorUserIcon,
  VisitsContractorIcon,
  VisitsGuestIcon,
  VisitsDeliveryIcon,
  VisitsPickupIcon,
  DarkLeft,
  DarkRight,
} from "../../../../../assets/img/svgs";
// import { renderItem } from "../MyVisitors/MyVisitorsList";
import {
  AnnouncementLoader,
  NotificationLoader,
  FeatureLoader,
  InfoLoader,
  VisitorLoader,
  VideoAccessLoader,
} from "../../../../../assets/img/loader";
import { renderFeatures, renderAnnouncements } from "./SubComponent";
import styles from "../../../../styles/home";
import moment from "moment";
// import RNCallKeep from 'react-native-callkeep';
import { callSettings } from "../../../../api/notification";
import {
  request,
  checkMultiple,
  requestMultiple,
  check,
  PERMISSIONS,
} from "react-native-permissions";
// import { copilot, walkthroughable, CopilotStep } from "react-native-copilot";
// const CopilotText = walkthroughable(Text);
import {
  TourGuideProvider, // Main provider
  TourGuideZone, // Main wrapper of highlight component
  TourGuideZoneByPosition, // Component to use mask on overlay (ie, position absolute)
  useTourGuideController, // hook to start, etc.
} from "rn-tourguide";
import VideoCallModal from "../../../../components/videoCallModal";
import { navigate } from "../../../../navigation/RootNavigation";
import { color } from "react-native-reanimated";
import SwitchunitModal from "../../../../components/switchunitModal";
import switch_unit from "../../../../redux/actions/switch_unit";
import SwitchUnitBottomView from "../../../../components/SwitchUnitBottomView";
import { customAnimation } from "../../../../animation/CommonAnimation";
import { ToastMessage, WithBgHeader } from "../../../../components";
import commonStyles from "../../../../styles/commonStyles";
import { fetchConfigs } from "../../../../api/home";
import { Switch } from "react-native-paper";
import { PermissionsAndroid } from "react-native";
// import * as Sentry from "@sentry/react-native";
 import Geolocation from "react-native-geolocation-service";
import SwitchUnitOnNotification from "../../../../components/SwitchUnitOnNotification";
import { ms } from "../../../../helpers/scaling";

// import { getLocation } from "../../../../permission/requestLocation";
const refer = React.createRef();

export const renderItem = ({ item, navigation, index }) => {
  const {
    id,
    entity_type,
    visitors,
    visitor_type,
    visitor_type_name,
    visit_time,
    sub_visitor_type,
    phone,
    block,
    in_time,
    out_time,
    mode_of_entry
  } = item;
  console.log(mode_of_entry,item, "yutube");
  const type = capitalize(visitor_type ? visitor_type : visitor_type_name);
  const data = {
    type_id: id,
    type: type,
    title: item.subject || "",
    message: item.description || "",
    block: block,
    members: visitors,
    in_time: in_time,
    out_time: out_time,
    visit_time: visit_time,
  };

  const mode = detectTheme();
  const MyVisitorArrData = {
    Guest: {
      icon: require("../../../../../assets/img/manHome.png"),
      bgColor: mode === "light" ? "#FFF" : "#292929",
    },
    Contractor: {
      icon: require("../../../../../assets/img/constructionHome.png"),
      bgColor: mode === "light" ? "#FFF" : "#292929",
    },
    Delivery: {
      icon: require("../../../../../assets/img/foodHome.png"),
      bgColor: mode === "light" ? "#FFF" : "#292929",
    },
    "Pickup/Drop": {
      icon: require("../../../../../assets/img/manHome.png"),
      bgColor: mode === "light" ? "#FFF" : "#292929",
    },
  };

  // console.log(
  //   entity_type,
  //   MyVisitorArrData[entity_type]['bgColor'],
  //   MyVisitorArrData.Visitor,
  //   item,
  //   'iteemmmmmmmmmmmmmmmmm',
  // );
  const bgColor = MyVisitorArrData[type]["bgColor"];
  const icon = MyVisitorArrData[type]["icon"];

  return (
    <View style={{ marginVertical: "3%", margin: 10 }} key={index}>
      <TouchableWithoutFeedback
        onPress={() => navigation.navigate("MyVisitorDetails", { data })}
      >
        <Animated.View
          // {...customAnimation("ZoomIn", 700, 200, index)}
          style={{}}
        >
          <TouchableOpacity
            onPress={() => navigation.navigate("MyVisitorDetails", { data })}
            style={{
              width: ms(40),
              height: ms(40),
              borderRadius: ms(50),
              backgroundColor: bgColor,
              justifyContent: "center",
              alignItems: "center",
              elevation: 0.8,
              marginHorizontal: 15,
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: 0.1,
              shadowRadius: 5,
            }}
          >
            {/* {icon} */}
            <Image style={{ height: ms(20), width: ms(20) }} source={icon} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("MyVisitorDetails", { data })}
            style={{
              marginTop: 3,
              marginHorizontal: 5,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontFamily: "Montserrat-Medium",
                fontSize: ms(13),
                color: themes[mode]["headingColor"],
                textTransform: "capitalize",
                // fontWeight:"Montserrat-SemiBold",
              }}
            >
              {visitors.length > 0 ? tailedString(visitors[0].name, 6) : "-"}
            </Text>
            <View
              style={{
                flexDirection: "row",
                marginVertical: 4,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: fonts.regular,
                  fontSize: ms(12),
                  color: themes[mode]["textColor"],
                  textTransform: "capitalize",
                }}
              >
                {/* {visitors[0].phone} */}
                {visitors.length == 0 ? "-" : visitors[0].phone}
              </Text>

              {/* <Text
                style={{
                  fontFamily: fonts.regular,
                  fontSize: 12,
                  color: themes[mode]['headingColor'],
                }}>
                {name}
              </Text> */}
            </View>
          </TouchableOpacity>
        </Animated.View>
      </TouchableWithoutFeedback>
    </View>
  );
};
class HomeScreen extends PureComponent {
  constructor() {
    super();
    this.state = {
      scrollIndex: 0,
      showData: false,
      modalVisible: false,
      expired: true,
      switch_unit: false,
      switch_unit_on_notification:false,
      unitNum: "",
      quickLinkLimit: false,
      visitorVideoCall: false,
      videoAccessLoader: false,
      VideoConfigEnabled:true,
      exhaustRoute:false
    };
    if (Text.defaultProps == null) Text.defaultProps = {};
    Text.defaultProps.allowFontScaling = false;
    // const {
    //   canStart, // a boolean indicate if you can start tour guide
    //   start, // a function to start the tourguide
    //   stop, // a function  to stopping it
    //   eventEmitter, // an object for listening some events
    // } = useTourGuideController();
  }

  async componentDidMount() {
    global.unAuthorizedCount = 0;
    console.log("Route iruka",this.props?.route?.params?.triggerSwitch)
    const {
      navigation,
      listHomeFunction,
      getProfile,
      userData: { identity_id },
      bleData,
      onProfileInputChange,
      listNotification,
      showCaseTrigger,
      bleTriggerAction,
      listUnits,
      UpdateLocation,
      facilityValidation,
    } = this.props;

    requestMultiple([
      PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
      PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
      PERMISSIONS.ANDROID.BLUETOOTH_ADVERTISE,
      PERMISSIONS.ANDROID.POST_NOTIFICATIONS,
    ])
      .then((result) => {
        // …
      })
      .catch((err) => {
        console.log(err, "req err");
      });
    requestMultiplePermissions();
    listNotification();
    listUnits();
    // getLocation(UpdateLocation);
    this.focusListener = navigation.addListener("focus", async () => {
      // console.log(RNCallKeep,"call kepppp info")
      // RNCallKeep.setup(options);
      // RNCallKeep.setAvailable(true);
      // RNCallKeep.startCall("123456789","1234567890",'priya',handleType="number",hasVideo=false,options=null);

      // RNCallKeep.displayIncomingCall("E26B14F7-2CDF-48D0-9925-532199AE7C48","1234567890","poiuy");
    
      await getProfile();
      listUnits();
      listHomeFunction();
      fetchConfigs()
        .then(async ({ data }) => {
          console.log(data, "data strip config ");
          global.stripeKey = data?.payment_config?.client_key;
          await AsyncStorage.setItem(
            "stripKey",
            data?.payment_config?.client_key
          );
          this.setState({VideoConfigEnabled:data?.notification_config?.video});
        })
        .catch((err) => {
          console.log(err, "kkk");
        });
      // listNotification();
      // console.log(this.props.userData.current_unit.ble, "Dwdlkmweddddioe2d");
      // bleTriggerAction(true);/
      // setTimeout(async()=>{
      // },7000)
    });
    this.setState({ visitorVideoCall: this.props.userData.current_unit.video_call }, () => {
      console.log(this.state.visitorVideoCall, "rert.......")
    })
    // console.log(this.props.userData.current_unit.ble, "Dwdlkmweddddioe2d");

    // this.props.userData.current_unit.ble
    //   ? bleTriggerAction(true)
    //   : bleTriggerAction(false);
    let user = JSON.parse(await AsyncStorage.getItem("user"));
    let ble_data = `R${user?.data?.identity_id}`;
    console.log(ble_data, "ble home data", user);
    // Sentry.setUser({ id: user?.data?.id });

    let unit_num = `${user?.data?.current_unit.unit_number}`;
    console.log(unit_num, "unit_numsdagfaeg");
    this.setState({ unitNum: unit_num });
    ReactNativeBleAdvertiser.initializeBle();
    console.log(ble_data, identity_id, "ble data trnasfer");
    await ReactNativeBleAdvertiser?.setData(ble_data || `R${identity_id}`);
    // console.log(bleIsActive, "isactive");
    this.bleIntervalAdvertise = setInterval(() => {
      const { bleIsActive } = this.props;
      // console.log("timeout actionn", bleIsActive);
      bleIsActive &&
        (this.setState({ showData: true }),
          ReactNativeBleAdvertiser.startBroadcast());

      !bleIsActive && ReactNativeBleAdvertiser.stopBroadcast();
      // this.setState({showData: false});
    }, 2000);
    // clearBleInterval=this.bleIntervalAdvertise

    // DeviceEventEmitter.addListener('appInvoked', data => {
    //   console.log(data, 'device event emitter');
    //   const {route} = data;

    //   // Using react-navigation library for navigation.
    //   this.props.navigation.navigate(route);
    // });
    // setTimeout(async()=>{
    //   await showCaseTrigger("showcaseTrigger", true);
    // },2000)
    // await showCaseTrigger("showcaseTrigger", true);
    // await AsyncStorage.setItem("qr_expiry_extend", "false");

    let auto_Start = await AsyncStorage.getItem("auto_start");
    let extend = await AsyncStorage.getItem("extend");
    if (extend != "true") {
      await AsyncStorage.setItem("qr_expiry_extend", "false");
    }
    await AsyncStorage.setItem("extend", "true");
    console.log(auto_Start, "auto");
    autoStartParse = JSON.parse(auto_Start);
    // this.setState({ autoStartShow: true });
    // Platform.OS === "android" &&
    //   setTimeout(async () => {
    //     let ignoreShowCase = await AsyncStorage.getItem("ignoreShowCase");
    //     console.log(ignoreShowCase, "ignorecase");
    //     (await autoStartParse) === null &&
    //       ignoreShowCase == "true" &&
    //       this.setState({ ...this.state, modalVisible: true, expired: false });
    //     if (autoStartParse !== null) {
    //       console.log("date present");
    //       console.log(new Date(), "new date ");
    //       console.log(new Date(autoStartParse.Date), "expirt date did mount");
    //       if (new Date() > new Date(autoStartParse.Date)) {
    //         console.log("epxired data");
    //         await AsyncStorage.removeItem("auto_start");
    //         this.setState({ expired: false });
    //       } else {
    //         var time =
    //           new Date(autoStartParse.Date).getTime() - new Date().getTime();
    //         var days = time / (1000 * 3600 * 24);
    //         console.log(" days have ", Math.round(days));
    //       }
    //     }
    //   }, 3000);

    const resetBooking = () => {
      ["start_date", "start_time", "end_time", "comment", "accompanied"]?.map(
        (item) => {
          console.log("event listner logging 1");
          facilityValidation({
            name: item,
            value: item === "start_date" ? new Date() : "",
            error: "",
            stateChange: false,
          });
        }
      );
      facilityValidation({
        name: "fixed_amount",
        value: 0,
      });
      facilityValidation({
        name: "amount",
        value: 0,
      });
      facilityValidation({
        name: "deposit_amount",
        value: 0,
      });
      facilityValidation({
        name: "rule_ids",
        value: [],
      });
      facilityValidation({
        name: "SlotStore",
        value: [],
      });
      facilityValidation({
        name: "remarks",
        value: "",
      });
      facilityValidation({
        name: "payment_type",
        value: "",
      });
    };
    resetBooking();
    console.log("locf")
    // await this.getLocationLocal();
    console.log("locf",loc);
  
  }
  componentDidUpdate(prevProps) {
    if (this.props.userData?.current_unit?.video_call !== prevProps.userData?.current_unit?.video_call) {
      // If the value has changed, update the state
      this.setState({
        videoAccessLoader: false // Hide loader
      });
    }

    // if(this.props.route?.params?.triggerSwitch && this.props.units.length > 1 && this.state.exhaustRoute===false){
    //   this.setState({switch_unit_on_notification:true,exhaustRoute:true});
    // }
  }
  componentWillUnmount() {
    this.exit();
  }
  async exit() {
    clearInterval(this.bleIntervalAdvertise);
    await AsyncStorage.setItem("ignoreShowCase", "true");
    BackHandler.exitApp();
  }
  onRequestClose = async () => {
    this.setState({ modalVisible: false, expired: true });
    console.log("set timeout toast logging");
    var currentDate = new Date();
    var expiryDate = new Date(currentDate.setDate(currentDate.getDate() + 7));
    console.log("expiry date setted ", expiryDate);
    let DateSet = {
      Date: expiryDate,
    };
    console.log(DateSet, "date fixx");
    await AsyncStorage.setItem("auto_start", JSON.stringify(DateSet));
    var d = await AsyncStorage.getItem("auto_start");
    console.log(d, "stoage toast");
    // setShowMessage(false)
  };
  onPressSOS = () => {
    const { navigation } = this.props;
    navigation.navigate("SOSScreen");
  };

  //  getLocationLocal = async () => {
   
  //   try {
  //     const granted = await PermissionsAndroid.request(
  //       PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
  //     );
  //     console.log("locflgr",granted,PermissionsAndroid.RESULTS.GRANTED)
  //     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
  //       Geolocation.getCurrentPosition(
  //         (position) => {
  //           console.log("posst",position);
  //         },
  //         (error) => {
  //           // See error code charts below.
  //           console.log(error.code, error.message);
  //         },
  //         { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
  //     );      } else {
  //       throw new Error('Location permission denied');
  //     }
  //   } catch (error) {
  //     console.log("locfl err")
  //     throw error;

  //   }
  // };


  _renderItem({ item, navigation, dataCount }) {
    console.log(item, navigation, dataCount);
    const mode = detectTheme();
    const { title, message, expire_at, id } = item;
    const data = {
      type_id: id,
    };
    return (
      <TouchableOpacity
        // disabled={!expire_at}
        style={{
          ...styles.announment,
          backgroundColor:
            themes[mode][mode === "light" ? "bgColor" : "shadowColor"],
          shadowColor: mode === "light" ? "#e5e5e5" : "#000",
          // maxWidth: dataCount < 2 ? '63%' : '100%',
          borderColor: themes[mode]["lightWhite"],
        }}
        onPress={() => navigation.navigate("AnnouncementDetail", { data })}
      >
        <View
          style={{
            ...styles.yellowBlock,
            width:
              dataCount < 2 ? windowSize.width / 1.23 : windowSize.width / 1.5,
            backgroundColor: themes["light"]["primaryColor"],
          }}
        >
          <View
            style={{
              maxWidth: dataCount < 2 ? "55%" : "50%",
            }}
          >
            <Text style={{ ...styles.announmentHead }}>
              {tailedString(title, 40)}
            </Text>
            <Text
              style={{
                ...styles.expireTime,
                color: themes["light"]["bgColor"],
              }}
            >
              {expire_at ? moment(expire_at).format("DD MMM, hh:mm a ") : ""}
            </Text>
          </View>
          <View
            style={{
              marginTop: 10,
            }}
          >
            <Image
              style={styles.img}
              source={require("../../../../../assets/img/home/announcement.png")}
            />
          </View>
        </View>
        <Text
          style={{
            ...styles.announcementText,
            color: themes[mode]["textColor"],
            width:
              dataCount < 2 ? windowSize.width / 1.4 : windowSize.width / 1.7,
          }}
        >
          {message.substring(0, 100)}
        </Text>
      </TouchableOpacity>
    );
  }
  SwitchCondo = () => {
    console.log("efijfewfkijo");
    this.setState({ switch_unit: true });
  };
  SwitchCondoOnNotification=()=>{
    this.setState({ switch_unit_on_notification: true });
  }
  onSwitchClose = () => {
    this.setState({ switch_unit: false });
  };
  onSwitchCloseOnNotification=()=>{
    this.setState({ switch_unit_on_notification:false});
  }
  onScroll = () => {
    refer.current.scrollTo({ x: 0, y: 500, animated: false });
  };

  UpdateVideoSettings = () => {
    console.log("pppppp", this.props.userData?.current_unit?.video_call)
    Alert.alert(
      'Confirm',
      'Are you sure you want to change  vistor video call  settings?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel'
        },
        {
          text: 'OK',
          onPress: async () => {
            // Log the current state before updating
            this.setState({ videoAccessLoader: true });


            try {
              // Call API to update video call settings
              //  await this.props.callsettings("video_call", !this.props.userData?.current_unit?.video_call);
              let a = await AsyncStorage.getItem("user");
              let data = JSON.parse(a);
              console.log(data.data.current_unit.id, "ednjenjfe");
              callSettings(data.data.current_unit.id, { video_call: !this.props.userData?.current_unit?.video_call})
                .then(async(data) => {
                  console.log("Testing call setted",data);
                  await this.props.getProfile();
                })
                .catch((err) => {
                  console.log(err, "list api");
                  ToastMessage(err[0], err[1].messsage);
                });
              this.setState(prevState => ({
                visitorVideoCall: !prevState.visitorVideoCall,
              }));

              // Show toast message
              ToastMessage(200, "Video Call Settings Updated!");
            } catch (error) {
              console.error('Error updating settings:', error);
              // Hide loader in case of error
              this.setState({ videoAccessLoader: false });
              // Show error message
              ToastMessage(400, "Failed to update settings");
            }
          }
        }
      ],
      { cancelable: false }
    );
  }

  render() {
    const {
      features,
      upcomingInvites,
      announcements,
      announcementLoader,
      upcomingLoader,
      featureLoader,
      userData,
      mode,
      navigation,
      unreadCount,
      showNoticeFromApi,
      showCaseTrigger,
      condoinfo,
      infoloader,
      condoimages,
      SwitchShow,
      userData: { current_unit },
    } = this.props;
    const { onPressSOS, SwitchCondo,SwitchCondoOnNotification, onScroll, onSwitchClose,onSwitchCloseOnNotification,UpdateVideoSettings } = this;
    const { name, identity_id } = userData;
    console.log(upcomingInvites,"upiniccccc");
    const { scrollIndex } = this.state;
    global.active == 0 && onScroll();
    console.log("this.state.limit", this.state.quickLinkLimit);

    return (
      <SafeAreaView
        style={{
          backgroundColor: themes[mode]["bgColor"],
          height: "100%",
        }}
        forceInset={{ top: "never" }}
        edges={["top"]}
      >
        <StatusBar
          translucent
          barStyle={mode === "light" ? "dark-content" : "dark-content"}
          backgroundColor={themes[mode]["bgColor"]}
        />
        <WithBgHeader
          containerStyle={{
            ...commonStyles.headerSpacing,
            marginTop: Platform.OS == "android" ? -70 : -70,
          }}
        >
          <ScrollView
            contentContainerStyle={{
              ...styles.container,
            }}
            showsVerticalScrollIndicator={false}
            ref={refer}
          >
            <View style={{ ...styles.block1 }}>
              <View style={styles.block1Align}>
                <Animated.Text
                  style={{
                    ...styles.name,
                    color: themes[mode]["headingColor"],
                  }}
                >
                  {`Hello ${name ? tailedString(name, 18) : ""}👋`}
                </Animated.Text>
                <View style={styles.block1Icon}>
                  {/* <TourGuideZone
                    zone={1}
                    text={
                      "Gain touch-less access on the devices using your mobile bluetooth"
                    }
                    borderRadius={16}
                    shape={"circle"}
                    style={{ padding: 5 }}
                  > */}
                    <Animated.View>
                      <TouchableOpacity
                        style={styles.notifyIcon}
                        onPress={() => navigation.navigate("BlePermitScreen")}
                      >
                        <HomeBleIcon color={themes[mode]["headingColor"]} />
                      </TouchableOpacity>
                    </Animated.View>
                  {/* </TourGuideZone> */}

                  {/* <TourGuideZone
                    zone={2}
                    text={"Control all your notifications in one place"}
                    borderRadius={16}
                    shape={"circle"}
                    style={{ padding: 5 }}
                  > */}
                    <Animated.View>
                      <TouchableOpacity
                        style={styles.notifyIcon}
                        onPress={() => navigation.navigate("NotificationList")}
                      >
                        {unreadCount > 0 && (
                          <View style={styles.unreadCountBox} />
                        )}
                        <Bell />
                      </TouchableOpacity>
                    </Animated.View>
                  {/* </TourGuideZone> */}
                </View>
              </View>
            </View>

            <View style={{ paddingHorizontal: 20, paddingTop: 5 }}>
              {infoloader ? (
                <InfoLoader />
              ) : (
                <Animated.View>
                  <TouchableWithoutFeedback
                    onPress={() => {
                      navigate("CondoInfo", {
                        condoinfo: condoinfo,
                        condoimages: condoimages,
                      });
                    }}
                  >
                    <View
                      style={{
                        height: ms(120),
                        width: "100%",
                        backgroundColor:
                          themes[mode][
                          mode === "light" ? "bgColor" : "shadowColor"
                          ],
                        shadowColor: mode === "light" ? "#bbb" : "#000",
                        elevation: 10,
                        borderRadius: 20,
                        shadowOffset: { width: 0, height: 3 },
                        shadowOpacity: 0.9,
                        shadowRadius: 5,
                        overflow: "hidden",
                      }}
                    >
                      <View>
                        <View
                          style={{
                            width: "95%",
                            paddingLeft:ms(20),
                            paddingTop: ms(10),
                            paddingBottom: ms(10),
                          }}
                        >
                          <View
                            style={{
                              width: "100%",
                              flexDirection: "row",
                              justifyContent: "space-between",
                            }}
                          >
                            <View
                              style={{
                                flexDirection: "row",
                                flexWrap: "wrap",
                                width: "60%",
                              }}
                            >
                              <Text
                                style={{
                                  fontFamily: fonts.bold,
                                  color: "#FFC727",
                                  fontSize: ms(15),
                                }}
                              >
                                {current_unit ? current_unit.condo_name : ""}
                              </Text>

                              <Text
                                style={{
                                  color: "#989898",
                                  marginTop: 2,
                                  marginLeft: 5,
                                  fontSize:ms(12)
                                }}
                              >
                                {current_unit ? current_unit.unit_number : ""}
                              </Text>
                            </View>

                            {this.props.units.length > 1 && (
                              <TouchableOpacity
                                style={{
                                  flexDirection: "row",
                                  alignItems: "center",
                                }}
                                onPress={SwitchCondo}
                              >
                                <Text
                                  style={{
                                    fontFamily: fonts.medium,
                                    color: themes[mode]["headingColor"],
                                    fontSize:ms(12)

                                  }}
                                >
                                  Switch Unit
                                </Text>
                                <View style={{ marginTop: 2, marginLeft: 5 }}>
                                  <RightSwitchArrow />
                                </View>
                              </TouchableOpacity>
                            )}
                          </View>

                          <View style={{ minHeight: "50%", width: "70%" }}>
                            <Animated.Text
                              style={{
                                marginTop: 7,
                                fontFamily: fonts.regular,
                                color: themes[mode]["textColor"],
                                fontSize: ms(14),
                                lineHeight: ms(19),
                              }}
                            >
                              {SliceName(condoinfo.short_description, 90)
                                .replace(/\n/g, " ")
                                .trim()}
                            </Animated.Text>
                          </View>
                        </View>
                      </View>
                      <View
                        style={{
                          position: "absolute",
                          zIndex: -1,
                          bottom: 0,
                          left: -5,
                        }}
                      >
                        {mode == "dark" ? <DarkLeft /> : <LeftInfoSvg />}
                      </View>
                      <View
                        style={{ position: "absolute", zIndex: -62, right: 0 }}
                      >
                        {mode == "dark" ? <DarkRight /> : <RightInfoSvg />}
                      </View>
                      <View
                        style={{
                          position: "absolute",
                          zIndex: -1,
                          right: 30,
                          top: 35,
                        }}
                      >
                        <CondoIconSvg />
                      </View>
                    </View>
                  </TouchableWithoutFeedback>
                  <View
                    style={{
                      height: 120,
                      width: "99%",
                      backgroundColor:
                        themes[mode][
                        mode === "light" ? "bgColor" : "shadowColor"
                        ],
                      shadowColor: mode === "light" ? "#bbb" : "#000",
                      elevation: 10,
                      borderRadius: 20,
                      shadowOffset: { width: 0, height: 3 },
                      shadowOpacity: 0.9,
                      shadowRadius: 5,
                      position: "absolute",
                      zIndex: -1,
                      top: 4,
                      alignSelf: "center",
                    }}
                  ></View>
                </Animated.View>
              )}
            </View>
            <View
              style={{
                ...styles.block3,
                marginLeft: announcementLoader ? 20 : 20,
              }}
            >
              <View style={styles.block3Align}>
                <Text
                  style={{
                    ...styles.blockHead,
                    color: themes[mode]["headingColor"],
                    marginBottom: 10,
                    marginLeft: 9,
                  }}
                >
                  Announcement
                </Text>
                <Pressable
                  style={{
                    height: ms(30),
                    justifyContent: "flex-end",
                    marginRight: 16,
                  }}
                  onPress={() => {
                    navigation.navigate("Testing");
                  }}
                >
                  {announcements.length > 0 ? (
                    <Text
                      style={{
                        color: themes[mode]["headingColor"],
                        fontSize: ms(15),
                        fontFamily: "Montserrat-Medium",
                        marginTop: 10,
                      }}
                    >
                      View all
                    </Text>
                  ) : null}
                </Pressable>
              </View>
              <View>
                <View>
                  {announcementLoader ? (
                    <ScrollView
                      contentContainerStyle={{ flexDirection: "row" }}
                    >
                      {[1, 2, 3]?.map((item, index) => {
                        return <AnnouncementLoader key={index} />;
                      })}
                    </ScrollView>
                  ) : (
                    <View>
                      <FlatList
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        legacyImplementation={false}
                        data={announcements.slice(0, 5)}
                        renderItem={({ item, index }) =>
                          renderAnnouncements({
                            item,
                            navigation,
                            dataCount: announcements?.length,
                            showNoticeFromApi,
                            index,
                          })
                        }
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={{
                          flexGrow: 1,
                        }}
                      />
                    </View>
                  )}
                </View>
              </View>
            </View>

            {/* Call Enable Button */}
            {this.state.VideoConfigEnabled &&
            (!this.state.videoAccessLoader ?
              <Animated.View>
                <TouchableOpacity
                  style={{
                    height: ms(35),
                    width: "90%",
                    marginHorizontal: "5%",
                    backgroundColor: 
                    "#e8e8e3",
                    //  themes[mode][
                    //                    mode === "light" ? "bgColor" : "shadowColor"
                    //                  ],
                    shadowColor: mode === "light" ? "#bbb" : "#000",
                    elevation: 10,
                    borderRadius: 10,
                    shadowOffset: { width: 0, height: 3 },
                    shadowOpacity: 0.9,
                    shadowRadius: 5,
                    overflow: "hidden",
                    alignItems: "center",
                    justifyContent: "center",
                    marginVertical: "5%"
                  }}
                  onPress={() => UpdateVideoSettings()}>
                  <View style={{ width: "90%", paddingHorizontal: "5%", flexDirection: "row" ,justifyContent:"center",alignItems:"center"}}>
                  <Image
                      style={{ width: ms(20), height: ms(20), marginHorizontal: 10 }}
                      source={this.props.userData?.current_unit?.video_call ? require("../../../../../assets/img/home/video_on.png") : require("../../../../../assets/img/home/video_off.png")}
                    />
                    <Text
                      style={{
                        fontFamily: fonts.bold,
                        color: this.props.userData?.current_unit?.video_call ? "#2f994a" : "red",
                        fontSize: ms(14),
                        marginHorizontal:ms(10)
                      }}>
                      {this.props.userData?.current_unit?.video_call ? "Enabled Vistor Video Call !" : "Enable Vistor Video Call ?"}
                    </Text>
                  
                    <Switch
                      value={this.props.userData?.current_unit?.video_call}
                      color="green"
                      thumbColor={this.props.userData?.current_unit?.video_call?"green":"red"}
                      trackColor={{false:"red",true:"green"}}
                      onValueChange={() => UpdateVideoSettings()}
                      style={{
                        transform: [
                          { scaleX: Platform.OS == "android" ? 1.1 : 0.8 },
                          { scaleY: Platform.OS == "android" ? 1.1 : 0.8 },
                        ],
                        marginHorizontal:5
                      }}
                    />
                  </View>

                </TouchableOpacity>
              </Animated.View>
              : <VideoAccessLoader />)
                    }

            <View style={styles.block2}>
              {featureLoader ? (
                <>
                  <View
                    style={{
                      flexDirection: "row",
                    }}
                  >
                    {[1, 2, 3]?.map((item) => {
                      return (
                        <View
                          style={{
                            ...featureLoaderWrap,
                            backgroundColor: themes[mode]["bgColor"],
                            shadowColor: themes[mode]["headingColor"],
                          }}
                        >
                          <FeatureLoader />
                        </View>
                      );
                    })}
                  </View>
                </>
              ) : (
                <>
                  {features?.length > 0 && (
                    <View style={styles.block3Align}>
                      <Text
                        style={{
                          ...styles.blockHead,
                          color: themes[mode]["headingColor"],
                          marginBottom: 0,
                          marginLeft: 3,
                        }}
                      >
                        Quick Links
                      </Text>
                      <Pressable
                        style={{
                          height: ms(30),
                          justifyContent: "flex-end",
                          marginRight: 16,
                        }}
                        onPress={() => {
                          this.setState({ quickLinkLimit: true });
                        }}
                      >
                        {features.length > 6 && !this.state.quickLinkLimit ? (
                          <Text
                            style={{
                              color: themes[mode]["headingColor"],
                              fontSize: ms(15),
                              fontFamily: "Montserrat-Medium",
                              marginTop: ms(10),
                            }}
                          >
                            View all
                          </Text>
                        ) : null}
                      </Pressable>
                    </View>
                  )}
                  <FlatList
                    // horizontal
                    numColumns={3}
                    showsHorizontalScrollIndicator={false}
                    legacyImplementation={false}
                    data={
                      this.state.quickLinkLimit
                        ? [...features]
                        : [...features].splice(0, 6)
                    }
                    renderItem={({ item, index }) =>
                      renderFeatures({
                        item,
                        navigation,
                        index,
                        navi: this.props.inviteChange,
                      })
                    }
                    keyExtractor={(index) =>index }
                    style={{
                      width: "100%",
                    }}
                    contentContainerStyle={styles.featureContainer}
                  />
                </>
              )}
            </View>

            {/* {Platform.OS === "android" && !this.state.expired && (
              <VideoCallModal
                onRequestClose={this.onRequestClose}
                modalVisible={this.state.modalVisible}
              />
            )} */}

            <View style={{ ...styles.block4 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    ...styles.blockHead,
                    color: themes[mode]["headingColor"],
                  }}
                >
                  Recent Visitor
                </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate("MyVisitorsList")}
                >
                  <Text
                    style={{
                      color: themes[mode]["headingColor"],
                      fontSize: ms(15),
                      marginBottom: 20,
                      marginTop: 10,
                      fontFamily: "Montserrat-Medium",
                      marginLeft: 8,
                    }}
                  >
                    View all
                  </Text>
                </TouchableOpacity>
              </View>

              {upcomingLoader ? (
                <View
                  style={{
                    marginBottom: 10,
                    paddingHorizontal: 15,
                    flexDirection: "row",
                    marginHorizontal: 0,
                  }}
                >
                  {[1, 2, 3, 4, 5]?.map((item, index) => {
                    return <VisitorLoader key={index} />;
                  })}
                </View>
              ) : (
                <View>
                  {upcomingInvites?.length > 0 ? (
                    <FlatList
                      horizontal
                      onStartShouldSetResponder={() => { }}
                      data={upcomingInvites}
                      showsHorizontalScrollIndicator={false}
                      renderItem={({ item, index }) => {
                        return renderItem({
                          item: item,
                          navigation: navigation,
                          index,
                        });
                      }}
                      keyExtractor={(item) => item.id}
                      style={styles.visitorStyle}
                      contentContainerStyle={styles.visitorContainerStyle}
                    />
                  ) : (
                    <View style={styles.noEntryAlign}>
                      <NoVisitor opacity={0.8} />
                      <Text style={styles.noVisitText}>
                        You don’t have any visitor yet
                      </Text>
                    </View>
                  )}
                </View>
              )}
            </View>

            <View style={{ ...styles.block5 }}>
              <Text
                style={{
                  ...styles.blockHead,
                  color: themes[mode]["headingColor"],
                }}
              >
                Emergency
              </Text>

              <TouchableOpacity
                style={{
                  ...styles.sosBox,
                  backgroundColor:
                    themes[mode][mode === "light" ? "bgColor" : "shadowColor"],
                  shadowColor: themes["dark"]["boxShadow"],
                }}
                onPress={() => this.onPressSOS()}
              >
                <View style={styles.sosManIcon}>
                  <SosManIcon />
                </View>
                <View style={{ ...styles.emerTextBlock }}>
                  <Text
                    style={{
                      ...styles.emerText1,
                      color:
                        themes[mode][
                        mode === "light" ? "lightWhite" : "boxShadow"
                        ],
                    }}
                  >
                    Emergency
                  </Text>
                  <Text
                    style={{
                      ...styles.emerText2,
                      color: themes[mode]["headingColor"],
                    }}
                  >
                    {`Are you in emergency?         `}
                  </Text>
                  <Text
                    style={{
                      ...styles.emerText3,
                      color: themes[mode]["textColor"],
                    }}
                  >
                    {`Press the button below and help will reach soon`}
                  </Text>
                </View>
                <View style={styles.sosIcon}>
                  <SOSIcon />
                </View>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </WithBgHeader>
        {this.props.units.length > 1 && SwitchShow && (
          <SwitchUnitBottomView
            homefunction={this.props.listHomeFunction}
            switch_unit={this.state.switch_unit}
            SwitchCondo={SwitchCondo}
            onSwitchClose={onSwitchClose}
            onRequestClose={this.onSwitchClose}
            modalVisible={this.state.switch_unit}
            notification={this.props?.route?.params?.notification}
          />
        )}
             {this.props.units.length > 1 && SwitchShow && (
          <SwitchUnitOnNotification
            homefunction={this.props.listHomeFunction}
            switch_unit={this.state.switch_unit_on_notification}
            SwitchCondo={SwitchCondoOnNotification}
            onSwitchClose={onSwitchCloseOnNotification}
            onRequestClose={this.onSwitchCloseOnNotification}
            modalVisible={this.state.switch_unit_on_notification}
            pushnotification={this.props?.route?.params?.notification}
          />
        )}
      </SafeAreaView>
    );
  }
}

const mapStateToProps = ({
  profile: { mode, userData, bleData },
  home: {
    upcomingInvites,
    announcements,
    announcementLoader,
    upcomingLoader,
    features,
    featureLoader,
    showNoticeFromApi,
    showcaseTrigger,
    condoinfo,
    infoloader,
    condoimages,
  },
  notification: { list_notice, unreadCount },
  login: { bleIsActive },
  switchUnit: { units, SwitchShow },
}) => {
  return {
    mode,
    userData,
    upcomingInvites,
    announcements,
    announcementLoader,
    upcomingLoader,
    list_notice,
    features,
    unreadCount,
    featureLoader,
    showNoticeFromApi,
    bleData,
    bleIsActive,
    condoinfo,
    infoloader,
    condoimages,
    SwitchShow,
    units,
  };
};
const { listNotification } = notification;
const { listHomeFunction, showCaseTrigger } = home;
const { getProfile, setUser, onProfileInputChange } = profile;
const { bleTriggerAction } = login;
const { listUnits } = switchUnit;
const { inviteChange } = invite;
const { UpdateLocation } = localhelp;
const { facilityValidation } = facility;

const mapDispatchToProps = {
  listNotification,
  listHomeFunction,
  getProfile,
  setUser,
  onProfileInputChange,
  showCaseTrigger,
  bleTriggerAction,
  listUnits,
  inviteChange,
  UpdateLocation,
  facilityValidation,
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
