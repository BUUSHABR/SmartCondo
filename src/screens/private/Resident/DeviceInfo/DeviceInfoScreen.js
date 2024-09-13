import React, { Component } from "react";
import { View, Text, ScrollView } from "react-native";
import { connect } from "react-redux";
import SafeAreaView from "react-native-safe-area-view";

import { profile } from "../../../../redux/actions";
import { CustomButton, WithBgHeader } from "../../../../components";

import commonStyles from "../../../../styles/commonStyles";
import styles from "../../../../styles/faq";
import { commonColors, fonts, themes } from "../../../../themes";
import { deviceDetails } from "../../../../helpers/deviceSupport";
import Animated from "react-native-reanimated";
import { customAnimation } from "../../../../animation/CommonAnimation";
import { ms } from "../../../../helpers/scaling";
class DeviceInfoScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: "",
      deviceInfo: {},
    };
  }
  async componentDidMount() {
    const { navigation, complaintsChange } = this.props;
    let info = await deviceDetails();
    this.setState({ deviceInfo: info });
    console.log(info, "innnnnnnn");
    this._unsubscribe = navigation.addListener("focus", async () => {
      this.setState({ error: "" });

      this.props.onLoginInputChange({ name: "faqMsg", value: "" });
    });
  }

  handleChange = (val) => {
    this.props.onLoginInputChange({ name: "faqMsg", value: val });
    this.setState({ error: "" });
  };

  onSubmit = () => {
    const { submitDeviceInfo, faqMsg } = this.props;
    submitDeviceInfo();
  };

  render() {
    const { mode, submitted, faqMsg } = this.props;
    const { error, deviceInfo } = this.state;
    let statement = [
      {
        text:
          "Submitting your devicec information will help us to resolve your issues better",
      },
      {
        text: "The below information will be sent to the developers",
      },
    ];
    console.log(deviceDetails(), "detialllsss");
    return (
      <SafeAreaView
        style={{
          ...styles.safeArea,
          backgroundColor: themes[mode]["bgColor"],
        }}
        forceInset={{ top: "never" }}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            height: "100%",
            paddingBottom: 100,
          }}
          style={{
            backgroundColor: themes[mode]["bgColor"],
            flex: 1,
          }}
        >
          <WithBgHeader
            headerTitle="Share Device Info"
            leftIcon
            containerStyle={{ ...commonStyles.headerSpacing }}
          >
            <Animated.View
              {...customAnimation("FadeInDown", 700, 50, 1)}
              style={{ marginTop: "8%", marginHorizontal: 20, maxWidth: "80%" }}
            >
              {statement?.map((item) => {
                return (
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      marginBottom: 10,
                    }}
                  >
                    <Text
                      style={{
                        ...commonStyles.regular_14,
                        lineHeight:ms(22),
                        color: themes[mode]["textColor"],
                      }}
                    >
                      {item.text}
                    </Text>
                  </View>
                );
              })}

              <View style={{ marginTop: 15 }}>
                <View
                  style={{
                    padding: 15,
                    justifyContent: "center",
                    borderWidth: 1,
                    borderColor: themes[mode]["textColor"],
                    borderRadius: 10,
                  }}
                >
                  {Object.entries(deviceInfo)?.map((item) => {
                    return (
                      <Text
                        style={{
                          fontFamily: fonts.regular,
                          fontSize: 14,
                          marginVertical: 4,
                          color: themes[mode]["headingColor"],
                        }}
                      >{`${item[0]} : ${item[1]}`}</Text>
                    );
                  })}
                </View>
              </View>
            </Animated.View>
          </WithBgHeader>
        </ScrollView>
        <View
          style={{
            ...styles.buttonAlign,
            backgroundColor: themes[mode]["bgColor"],
          }}
        >
          <CustomButton
            title="Submit"
            buttonStyle={{
              ...styles.buttonStyle,
              backgroundColor: themes[mode]["primaryColor"],
            }}
            textStyle={{
              color: commonColors.darkWhite,
            }}
            disableBtn={submitted}
            handleSubmit={this.onSubmit}
          />
        </View>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = ({ profile: { mode }, login: { submitted } }) => {
  return {
    mode,
    submitted,
  };
};
const { submitDeviceInfo } = profile;
const mapDispatchToProps = {
  submitDeviceInfo,
};

export default connect(mapStateToProps, mapDispatchToProps)(DeviceInfoScreen);
