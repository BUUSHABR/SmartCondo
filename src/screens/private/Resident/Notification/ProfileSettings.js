import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  Platform,
} from "react-native";
import { connect } from "react-redux";
import CheckBox from "@react-native-community/checkbox";

import { login, notification, profile } from "../../../../redux/actions";
import { detectTheme } from "../../../../helpers";
import { themes, fonts } from "../../../../themes";
import { HeaderOnly } from "../../../../components/Header";
import SafeAreaView from "react-native-safe-area-view";
import {
  FocusAwareStatusBar,
  navigationRef,
} from "../../../../navigation/RootNavigation";
import { TickIcon, CrossIcon } from "../../../../../assets/img/svgs";
import styles from "../../../../styles/notificationSubscribe";
import {
  SubscribeLoader,
  BottomLoader,
} from "../../../../../assets/img/loader";
import { WithBgHeader } from "../../../../components";
import commonStyles from "../../../../styles/commonStyles";
import { Switch } from "react-native-paper";
import ReactNativeBleAdvertiser from "@teamdotworld/rn-ble-advertiser";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import ToggleSwitch from "toggle-switch-react-native";
import Animated from "react-native-reanimated";
import { customAnimation } from "../../../../animation/CommonAnimation";
import { fetchConfigs } from "../../../../api/home";
class ProfileSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      video: true,
      ble: true,
      VideoConfigEnabled:false,
    };
  }
  onSelect = async (name) => {
    if (name == "Video call") {
      this.setState({ video: !this.state.video });
      this.props.callsettings("video_call", !this.state.video);
    } else {
      this.setState({ ble: !this.state.ble });
      console.log(this.state.ble, "blutiith beofre");

      if (!this.state.ble) {
        console.log(this.state.ble, "blutiith turn on");
        this.props.bleTriggerAction(true);
        this.props.blesettings(true);
        let user = JSON.parse(await AsyncStorage.getItem("user"));
        let ble_data = `R${user?.data?.identity_id}`;
        console.log(
          "R",
          ble_data,
          "43kfhu43f43f43fb43bf",
          "R",
          this.props.userData.identity_id
        );

        ReactNativeBleAdvertiser.initializeBle();
        await ReactNativeBleAdvertiser.setData(
          ble_data || `R${this.props.userData.identity_id}`
        );
      } else {
        console.log(this.state.ble, "blutiith offed");
        this.props.bleTriggerAction(false);
        this.props.blesettings(false);
        await ReactNativeBleAdvertiser.stopBroadcast();
      }
    }
    // console.log(this.props.userData.call_type,"jnewicewcuwcbewcbebcewc");
  };

  componentDidMount() {
    console.log("did mountjnjwd");
    const { navigation } = this.props;

    this.props.getProfile();
    this._unsubscribe = navigation.addListener("blur", async () => {
      this.props.getProfile();
    });
    console.log(
      this.props.userData.current_unit.ble,
      "jnewicewcuwcbewcbebcewc"
    );
    fetchConfigs()
        .then(async ({ data }) => {      
          this.setState({VideoConfigEnabled:data?.notification_config?.video});
        })
        .catch((err) => {
          console.log(err, "kkk");
        });

    if (!this.props.userData.current_unit.video_call) {
      this.setState({ video: false });
    } else {
      this.setState({ video: true });
    }
    if (!this.props.userData.current_unit.ble) {
      this.setState({ ble: false });
    } else {
      this.setState({ ble: true });
    }
  }

  componentWillUnmount() {}

  onModeChange = async (decide) => {
    const { mode, setTheme } = this.props;
    console.log(decide, "deicifdefkmefmkef fefefefm");
    if (decide == "clicked") {
      const theme = mode === "light" ? "dark" : "light";
      setTheme(theme);
      await AsyncStorage.setItem("mode", theme);
      // NativeModules.OpenSettings.openDisplaySettings(() => {});
    }
  };
  render() {
    const { renderItem, itemSeperator } = this;
    const { notice_subscribe, mode } = this.props;
    console.log(notice_subscribe, "renderrr");
    return (
      <SafeAreaView
        style={{
          ...styles.container,
          backgroundColor: themes[mode]["bgColor"],
        }}
        forceInset={{ top: "never" }}
      >
        <View style={styles.align}>
          {/* <HeaderOnly
            title="Settings"
            mode={mode}
            showLeftIcon
            showRightIcon
            onPressRight={() => {}}
          /> */}
          <WithBgHeader
            headerTitle={"Settings"}
            leftIcon
            containerStyle={{ ...commonStyles.headerSpacing }}
          >
            {/* <BottomLoader /> */}
            {true ? (
              <Animated.View {...customAnimation("FadeInDown", 700, 50, 1)}>
                 {this.state.VideoConfigEnabled && 
                <View style={{ ...styles.subscribe_row, marginTop: 15 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      width: "100%",
                      paddingHorizontal: 10,
                    }}
                  >
                   
                    <View style={{ width: "70%" }}>
                      <Text
                        style={{
                          ...styles.subscribe_name,
                          color: themes[mode]["headingColor"],
                        }}
                      >
                        Enable Visitor Video Call
                      </Text>
                      <Text
                        style={{
                          ...styles.subscribe_msg,
                          color: themes[mode]["textColor"],
                        }}
                      >
                        Speak with your visitor through live video call before
                        accepting their entry.
                      </Text>
                    </View>
                    
                    <View style={{ marginTop: 0 }}>
                      <Switch
                        value={this.state.video}
                        color="#FFC727"
                        onValueChange={() => this.onSelect("Video call")}
                        style={{
                          transform: [
                            { scaleX: Platform.OS == "android" ? 1.1 : 0.8 },
                            { scaleY: Platform.OS == "android" ? 1.1 : 0.8 },
                          ],
                        }}
                      />
                    </View>
                  </View>
                </View>
                      }
                <View style={{ ...styles.subscribe_row, marginTop: 15 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      width: "100%",
                      paddingHorizontal: 10,
                    }}
                  >
                    <View style={{ width: "70%" }}>
                      <Text
                        style={{
                          ...styles.subscribe_name,
                          color: themes[mode]["headingColor"],
                        }}
                      >
                        Touchless Access via BLE
                      </Text>
                      <Text
                        style={{
                          ...styles.subscribe_msg,
                          color: themes[mode]["textColor"],
                        }}
                      >
                        Enable touchless entry access using the latest Bluetooth
                        technology
                      </Text>
                    </View>
                    <View style={{ marginTop: 0 }}>
                      <Switch
                        value={this.state.ble}
                        color="#FFC727"
                        onValueChange={() => this.onSelect("Bluetooth")}
                        style={{
                          transform: [
                            { scaleX: Platform.OS == "android" ? 1.1 : 0.8 },
                            { scaleY: Platform.OS == "android" ? 1.1 : 0.8 },
                          ],
                        }}
                      />
                    </View>
                  </View>
                </View>

                <View style={{ ...styles.subscribe_row, marginTop: 15 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      width: "100%",
                      paddingHorizontal: 10,
                    }}
                  >
                    <View style={{ width: "70%" }}>
                      <Text
                        style={{
                          ...styles.subscribe_name,
                          color: themes[mode]["headingColor"],
                        }}
                      >
                        Enable Dark Mode
                      </Text>
                      <Text
                        style={{
                          ...styles.subscribe_msg,
                          color: themes[mode]["textColor"],
                        }}
                      >
                        You can enable dark mode here to improve the readability
                        on this app.
                      </Text>
                    </View>
                    <View style={{ marginTop: 0 }}>
                      {/* <ToggleSwitch
                        isOn={mode === "dark" ? true : false}
                        size="small"
                        onToggle={() => this.onModeChange("clicked")}
                        onColor={themes[mode]["switchOn"]}
                        offColor={themes[mode]["switchOff"]}
                        thumbOnStyle={{
                          backgroundColor: themes[mode]["thumbOn"],
                        }}
                        thumbOffStyle={{
                          backgroundColor: themes[mode]["thumbOff"],
                        }}
                      /> */}
                      <Switch
                        value={mode === "dark" ? true : false}
                        color="#FFC727"
                        onValueChange={() => this.onModeChange("clicked")}
                        style={{
                          transform: [
                            { scaleX: Platform.OS == "android" ? 1.1 : 0.8 },
                            { scaleY: Platform.OS == "android" ? 1.1 : 0.8 },
                          ],
                        }}
                      />
                    </View>
                  </View>
                </View>
              </Animated.View>
            ) : (
              // <FlatList
              //   data={[
              //     { name: "IVR", description: "Enable IVR Call", select: true },
              //     {
              //       name: "Video call",
              //       description: "Enable Video Call",
              //       select: true,
              //     },
              //   ]}
              //   renderItem={renderItem}
              //   keyExtractor={(item) => item.id}
              //   style={styles.flatlist}
              //   ItemSeparatorComponent={itemSeperator}
              // />
              <View style={styles.flatlist}>
                {[1, 2, 3, 4, 5, 6, 7]?.map((item) => {
                  return <SubscribeLoader />;
                })}
              </View>
            )}
          </WithBgHeader>
        </View>
        <FocusAwareStatusBar />
      </SafeAreaView>
    );
  }
}

const mapStateToProps = ({
  notification: { notice_subscribe },
  profile: { mode, userData },
}) => {
  return {
    notice_subscribe,
    mode,
    userData,
  };
};
const {
  onSubscribeNotice,
  listSubscription,
  callsettings,
  blesettings,
} = notification;
const { getProfile, setTheme } = profile;
const { bleTriggerAction } = login;

const mapDispatchToProps = {
  onSubscribeNotice,
  listSubscription,
  callsettings,
  getProfile,
  bleTriggerAction,
  blesettings,
  setTheme,
};
export default connect(mapStateToProps, mapDispatchToProps)(ProfileSettings);
