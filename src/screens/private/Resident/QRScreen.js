import React, { Component } from "react";
import { connect } from "react-redux";
import moment from "moment";

import { View, Text, ScrollView, Image, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as RootNavigation from "../../../navigation/RootNavigation";
import SafeAreaView from "react-native-safe-area-view";
import { FocusAwareStatusBar } from "../../../navigation/RootNavigation";
import { commonColors, fonts, themes } from "../../../themes";
import QRCode from "react-native-qrcode-svg";
import { HeaderOnly } from "../../../components/Header";
import {
  capitalize,
  capitalizeTwoLetter,
  UnitNumExtraction,
} from "../../../helpers";
// import DeviceBrightness from 'react-native-device-brightness';
import ScreenBrightness from "react-native-screen-brightness";
import ReactNativeBleAdvertiser from "@teamdotworld/rn-ble-advertiser";
import { WithBgHeader } from "../../../components";
import commonStyles from "../../../styles/commonStyles";
import {
  TourGuideProvider, // Main provider
  TourGuideZone, // Main wrapper of highlight component
  TourGuideZoneByPosition, // Component to use mask on overlay (ie, position absolute)
  useTourGuideController, // hook to start, etc.
} from "rn-tourguide";
import { profile } from "../../../redux/actions";
import { SettingIcon } from "../../../../assets/img/svgs";
import { ms } from "../../../helpers/scaling";
class QRScreen extends Component {
  mount = false;
  constructor(props) {
    super(props);
    this.state = {
      brightness: 0.5,
      data: {
        timeStamp: moment().unix(),
        timeFuture: "",
      },
    };
  }
  handleAppStateChange = () => {
    this.getTimeStamp();
    // this.getTimeDifference();
  };

  getTimeStamp = async () => {
    const {
      userData: { identity_id, units },
    } = this.props;
    console.log(units, identity_id, "get stam[ppp");
    const auth_token = await AsyncStorage.getItem("auth_token");
    const timeStamp = moment().unix();
    const timeFuture = moment()
      .add(5, "minutes")
      .unix();
    let getUnit = units?.map((item) => {
      return item.unit_number;
    });
    const qrData = `R${identity_id}${timeFuture}-${UnitNumExtraction(
      getUnit
    ).join()}`;

    // const bleData = `R${identity_id}`;
    console.log(qrData, auth_token, "gettt");

    this.setState({
      timeStamp,
      timeFuture,
      qrData: auth_token ? qrData : null,
    });

    // Platform.OS==="ios"?ReactNativeBleAdvertiser.initialize():ReactNativeBleAdvertiser.init();

    // ReactNativeBleAdvertiser.initializeBle();

    // bleData !== 'undefined'
    //   ? await ReactNativeBleAdvertiser.setData(bleData)
    //   : null;

    // setTimeout(() => {
    //   ReactNativeBleAdvertiser.startBroadcast();
    // }, 4000);
  };

  // setAndroidBright = () => {
  //   this._unsubscribe = this.props.navigation.addListener('focus', async () => {
  //     const brightness = await DeviceBrightness.getBrightnessLevel();
  //     this.setState({brightness});
  //     DeviceBrightness.setBrightnessLevel(1);
  //   });
  //   this._unsubscribeBlur = this.props.navigation.addListener(
  //     'blur',
  //     async () => {
  //       DeviceBrightness.setBrightnessLevel(this.state.brightness);
  //     },
  //   );
  // };

  // setIosBright = () => {
  //   this._unsubscribe = this.props.navigation.addListener('focus', async () => {
  //     const brightness = await ScreenBrightness.getBrightness();
  //     this.setState({brightness});
  //     ScreenBrightness.setBrightness(1);
  //   });
  //   this._unsubscribeBlur = this.props.navigation.addListener(
  //     'blur',
  //     async () => {
  //       ScreenBrightness.setBrightness(this.state.brightness || 0.5);
  //     },
  //   );
  // };

  async componentDidMount() {
    const { employee_type, valid_till } = this.props?.userData;
    const netInfo = this.props?.netInfo;
    // const {setAndroidBright, setIosBright} = this;
    this.mount = true;

    this.getTimeStamp();

    setInterval(() => {
      this.getTimeStamp();
    }, 300000);

    // Platform.OS === 'android' ? setAndroidBright() : setIosBright();
    // setIosBright();
    this._unsubscribe1 = this.props.navigation.addListener(
      "focus",
      async () => {
        this.handleAppStateChange();
      }
    );

    // try {
    //   throw new Error("Error");
    // } catch (error) {
    //   crashlytics().log("error caught in CheckinQR");
    // }
    console.log("98989898");
  }
   componentWillUnmount() {
   this.unmount()
  }
  unmount=()=>{
    this._unsubscribe;
    this.__unsubscribeBlur;
    this.mount = false;
    this._unsubscribe1;
  }
  render() {
    const {
      userData: { name, identity_id },
      mode,
      user_image,
    } = this.props;
    const { qrData } = this.state;
    return (
      <SafeAreaView
        style={{
          backgroundColor: themes[mode]["bgColor"],
          flex: 1,
          height: "100%",
        }}
        forceInset={{ top: "never" }}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            backgroundColor: themes[mode]["bgColor"],
          }}
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
        >
          {/* <FocusAwareStatusBar /> */}
          <View style={{}}>
            {/* <View
              style={{
                marginTop: '7%',
                marginBottom: '2%',
              }}>
              <HeaderOnly
                title="Checkin QR"
                showLeftIcon={false}
                onPressRight
              />
            </View> */}
            <WithBgHeader
              headerTitle="Checkin QR"
              containerStyle={{
                ...commonStyles.headerSpacing,
              
              }}
              marginLeft={15}
              // rightIcon={<SettingIcon color={themes[mode]['primaryColor']} />}
              // onPressRightIcon={() => {
              //   RootNavigation.navigate('CallSetting');
              // }}
            >
              <View
                style={{
                  ...commonStyles.headerSpacing,
                  marginTop: 0,
                  flex:1,
                  justifyContent:"center",
                  marginBottom:80
                  // backgroundColor:"red",
                }}
              >
                <View
                  style={{
                    // height: 320,
                    borderRadius: 10,
                    backgroundColor: themes["light"]["dimWhite"],
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "10%",
                    marginBottom: 35,
                    paddingVertical: 20,
                    marginHorizontal: 15,
                    paddingBottom:50
                  }}
                >
                  {!user_image ? (
                    <View
                      style={{
                        width: 60,
                        height: 60,
                        borderRadius: 30,
                        backgroundColor: themes["light"]["primaryColor"],
                        justifyContent: "center",
                        alignItems: "center",
                        position: "absolute",
                        top: -30,
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: fonts.semiBold,
                          fontSize:ms(24),
                          color: themes["light"]["headingColor"],
                        }}
                      >
                        {name && capitalizeTwoLetter(name)}
                      </Text>
                    </View>
                  ) : (
                    <Image
                      style={{
                        width: 60,
                        height: 60,
                        borderRadius: 30,
                        backgroundColor:"black",
                        justifyContent: "center",
                        alignItems: "center",
                        position: "absolute",
                        top: -30,
                      }}
                      source={{ uri:user_image }}
                    />
                  )}
                  <Text
                    style={{
                      fontFamily: fonts.bold,
                      fontSize: ms(22),
                      lineHeight: ms(24),
                      color: themes["light"]["headingColor"],
                      // textTransform: 'capitalize',
                      marginVertical: "10%",
                      marginHorizontal: 20,
                      textAlign: "center",
                    }}
                  >
                    {name ? capitalize(name) : ""}
                  </Text>
                  {/* <TourGuideZone
                    zone={6}
                    text={
                      "Get instant access in all device via QR for a hassle-free entry"
                    }
                    borderRadius={16}
                    style={{ padding: 10, height: 220, width: 220 }}
                  > */}
                    {identity_id != "" ? (
                      <View>
                        <QRCode value={qrData} size={200} />
                      </View>
                    ) : (
                      // <Text>hi</Text>
                      <View
                        style={{
                          height: 200,
                          // width: 400,
                          // borderColor: "red",
                          // borderWidth: 1,
                          // backgroundColor:"red",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: fonts.regular,
                            fontSize: ms(16),
                            lineHeight:ms(23),
                            letterSpacing: 0.2,
                            color: "#282828",
                            alignSelf: "center",
                            textAlign: "center",
                            paddingBottom: 25,
                          }}
                        >
                          Could not fetch data {`\n`} from server.{`\n`} Please
                          check your {`\n`} internet connection.
                        </Text>
                      </View>
                    )}
                  {/* </TourGuideZone> */}
                </View>

                <Text
                  style={{
                    fontFamily: fonts.regular,
                    fontSize: ms(16),
                    lineHeight: ms(23),
                    letterSpacing: 0.2,
                    color: themes[mode]["headingColor"],
                    alignSelf: "center",
                    textAlign: "center",
                  }}
                >
                  {`Scan your QR in the near by device.`}
                </Text>
              </View>
            </WithBgHeader>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = ({
  profile: { mode, userData, bleData, userimage,user_image },
  home: { netInfo },
}) => {
  return {
    mode,
    userData,
    bleData,
    netInfo,
    userimage,
    user_image
  };
};
const { onProfileInputChange } = profile;
const mapDispatchToProps = {
  onProfileInputChange,
};

export default connect(mapStateToProps, mapDispatchToProps)(QRScreen);
