import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  NativeModules,
  ScrollView,
  Linking,
} from "react-native";
import SafeAreaView from "react-native-safe-area-view";

import { connect } from "react-redux";
import { themes } from "../../../../themes";
import { WithBgHeader } from "../../../../components";

import commonStyles from "../../../../styles/commonStyles";
import styles from "../../../../styles/deviceInfo";
import { ButtonIcon } from "../../../../../assets/img/svgs";
import {
  autoStartPermit,
  checkCustomizedOS,
  deviceDetails,
  overlayPermit,
} from "../../../../helpers/deviceSupport";
import Animated from "react-native-reanimated";
import { customAnimation } from "../../../../animation/CommonAnimation";
class DeviceInfoHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deviceName: "",
    };
  }
  async componentDidMount() {
    const details = await deviceDetails();
    this.setState({ deviceName: details?.Manufacturer.toLowerCase() });
    console.log(
      details.Manufacturer.toLowerCase(),
      this.state.deviceName,
      "detailssss"
    );
  }

  redirectAppInfo = async () => {
    console.log(this.state.deviceName, "redirect info");
    this.state.deviceName === "xiaomi"
      ? await NativeModules.OpenSettings.allowBackgroundProcess((data) => {
          console.log(data, "AUTO STARTTT");
        })
      : await Linking.openSettings();
  };

  render() {
    const { mode, navigation } = this.props;
    const arr = [
      {
        label: "Why Touchless Entry didn’t work?",
        description:
          "View the permissions required to make touchless entry work",
        screen: "DevicePermitSteps",
        show: true,
      },

      {
        label: "Go To Settings",
        description: "Shortcut to your settings page",
        screen: "",
        show: true,
      },
      {
        label: "Go To Overlay Setting",
        description: "Shortcut to your allow background settings page",
        screen: "",
        show: true,
      },
      {
        label: "Go To AutoStart Settings",
        description: "Shortcut to your allow autostart settings page",
        screen: "",
        show: checkCustomizedOS(),
      },
      {
        label: "Share Device Info",
        description: "Send your basic device info to the developers",
        screen: "DeviceInfoScreen",
        show: true,
      },
    ];
    return (
      <SafeAreaView
        forceInset={{ top: "never" }}
        style={{
          ...styles.safeArea,
          backgroundColor: themes[mode]["bgColor"],
        }}
      >
        <WithBgHeader
          headerTitle={`FAQ`}
          leftIcon
          containerStyle={{
            ...commonStyles.headerSpacing,
          }}
          titleCase="uppercase"
          rightText="   "
        >
          <Animated.View
            {...customAnimation("FadeInDown", 700, 50, 1)}
            style={styles.bodyTop}
          >
            <ScrollView
              contentContainerStyle={styles.containerStyle}
              showsVerticalScrollIndicator={false}
            >
              <View>
                <View style={{ ...styles.listWrapper }}>
                  {arr?.map((item, index) => {
                    const { screen, description, label, show } = item;
                    return (
                      <View>
                        {show && (
                          <TouchableOpacity
                            style={styles.subscribe_row}
                            onPress={async () => {
                              index === 1
                                ? this.redirectAppInfo()
                                : index === 2
                                ? overlayPermit()
                                : index === 3
                                ? autoStartPermit()
                                : navigation.navigate(screen);
                            }}
                          >
                            <View style={{ maxWidth: "83%" }}>
                              <Text
                                style={{
                                  ...styles.label,
                                  color: themes[mode]["headingColor"],
                                }}
                              >
                                {label}
                              </Text>
                              <Text
                                style={{
                                  ...styles.description,
                                  color: themes[mode]["textColor"],
                                }}
                              >
                                {description}
                              </Text>
                            </View>
                            <TouchableOpacity
                              style={styles.checkBox}
                              onPress={async () => {
                                index === 2
                                  ? await NativeModules.OpenSettings.allowBackgroundProcess(
                                      (data) => {
                                        console.log(data, "ALOOW BACKGEOUND");
                                      }
                                    )
                                  : navigation.navigate(screen);
                              }}
                            >
                              <ButtonIcon
                                color={themes[mode]["primaryColor"]}
                              />
                            </TouchableOpacity>
                          </TouchableOpacity>
                        )}
                      </View>
                    );
                  })}
                </View>
              </View>
            </ScrollView>
          </Animated.View>
        </WithBgHeader>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = ({ profile: { mode } }) => {
  return {
    mode,
  };
};

const mapDispatchToProps = (state) => ({});
export default connect(mapStateToProps, mapDispatchToProps)(DeviceInfoHome);
