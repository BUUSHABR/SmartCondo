import React, { Component } from "react";
import {
  View,
  Text,
  AppState,
  ScrollView,
  NativeModules,
  StyleSheet,
  Platform,
  Linking,
} from "react-native";
import { connect } from "react-redux";
import { BluetoothStatus } from "react-native-bluetooth-status";
import LocationSwitch from "react-native-location-switch";

import { themes, fonts } from "../../../themes";
import styles from "../../../styles/bluetooth";
import EnableBluetooth from "../../../../assets/img/home/bluetooth.svg";
import { CustomButton, WithBgHeader } from "../../../components";
import { setBle } from "../../../redux/actions/profile";
import SafeAreaView from "react-native-safe-area-view";
import commonStyles from "../../../styles/commonStyles";
import { BleInfoIcon } from "../../../../assets/img/svgs";
import Animated from "react-native-reanimated";
import { customAnimation } from "../../../animation/CommonAnimation";
class BlePermitScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bluetooth: false,
      location: false,
      response: false,
    };
  }

  onPressRight = () => {
    this.props.navigation.navigate("DeviceInfoHome");
  };

  handleAppStateChange = async () => {
    const bluetooth_state = await BluetoothStatus.state();
    LocationSwitch.isLocationEnabled(
      () => {
        this.setState({
          location: true,
        });
      },
      () => {
        this.setState({
          location: false,
        });
      }
    );

    this.setState({ bluetooth: bluetooth_state });
    this.props.setBle();
    setTimeout(() => {
      this.setState({ response: true });
    });
  };

  handleChangeBle = async () => {
    Platform.OS === "android"
      ? NativeModules.OpenSettings.openBluetoothSettings((data) => {})
      : Linking.openURL("App-Prefs:Bluetooth");
  };

  handleChangeLocation = async () => {
    Platform.OS === "android"
      ? NativeModules.OpenSettings.openLocationSettings((data) => {})
      : Linking.openURL("App-Prefs:Privacy&path=LOCATION");
  };

  async componentDidMount() {
    let listenerState = Platform.OS === "android" ? "focus" : "change";
    this.handleAppStateChange();
    AppState.addEventListener(listenerState, this.handleAppStateChange);
  }

  componentWillUnmount() {
    let listenerState = Platform.OS === "android" ? "focus" : "change";
    AppState.removeEventListener(listenerState, this.handleAppStateChange);
  }

  viewStatusText = (item) => {
    const { bluetooth, location } = this.state;
    let obj = {
      bluetooth: {
        enableText: "Bluetooth Connection is Enabled",
        buttonTxt: "Bluetooth On",
        action: this.handleChangeBle,
        status: bluetooth,
      },
      location: {
        enableText: "Location Connection is Enabled",
        buttonTxt: "Location On",
        action: this.handleChangeLocation,
        status: location,
      },
    };
    return obj[item];
  };

  render() {
    const { mode } = this.props;
    const { bluetooth, location, response } = this.state;
    const { viewStatusText, onPressRight } = this;
    let bothTrue = bluetooth && location;
    return (
      <SafeAreaView
        style={{
          ...styles.safeArea,
          backgroundColor: themes[mode]["bgColor"],
        }}
        forceInset={{ top: "never" }}
      >
        <WithBgHeader
          headerTitle="Touchless Entry"
          leftIcon
          containerStyle={{
            ...commonStyles.headerSpacing,
          }}
          rightIcon={Platform.OS === "android" ? <BleInfoIcon /> : null}
          onPressRightIcon={Platform.OS === "android" ? onPressRight : null}
        >
          <Animated.View
            {...customAnimation("FadeInDown", 700, 50, 1)}
            style={styles.bodyTop}
          >
            <ScrollView
              contentContainerStyle={styles.containerStyle}
              showsVerticalScrollIndicator={false}
            >
              <View style={{ ...styles.wrapper }}>
                <View style={styles.alignment}>
                  <EnableBluetooth />
                  <View style={styles.block1}>
                    <Text
                      style={{
                        ...styles.enableText,
                        color: themes[mode]["headingColor"],
                      }}
                    >
                      Enable Bluetooth
                    </Text>
                    <Text
                      style={{
                        ...styles.allowMsg,
                        color: themes[mode]["headingColor"],
                      }}
                    >
                      Enable bluetooth access to activate contactless checkin
                    </Text>
                    <Text></Text>
                    {response && (
                      <View>
                        {bothTrue ? (
                          <Text style={styles.enabled}>
                            {`Bluetooth is Enabled`}
                          </Text>
                        ) : (
                          ["bluetooth"]?.map((item) => {
                            return (
                              <View>
                                {viewStatusText(item).status ? (
                                  <Text style={styles.enabled}>
                                    {viewStatusText(item).enableText}
                                  </Text>
                                ) : null}
                                <View
                                  style={{
                                    ...styles.buttonWrap,
                                  }}
                                >
                                  {!viewStatusText(item).status ? (
                                    <CustomButton
                                      title={viewStatusText(item).buttonTxt}
                                      handleSubmit={viewStatusText(item).action}
                                    />
                                  ) : null}
                                </View>
                              </View>
                            );
                          })
                        )}
                      </View>
                    )}
                  </View>
                </View>
              </View>
            </ScrollView>
          </Animated.View>
        </WithBgHeader>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = ({ profile: { mode, ble, location } }) => {
  return {
    mode,
    ble,
    location,
  };
};

const mapDispatchToProps = {
  setBle,
};

export default connect(mapStateToProps, mapDispatchToProps)(BlePermitScreen);
