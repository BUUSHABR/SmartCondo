import React, { Component } from "react";
import { View, Text, Keyboard } from "react-native";
import { connect } from "react-redux";
import crashlytics from "@react-native-firebase/crashlytics";
import analytics from "@react-native-firebase/analytics";
import { TouchableOpacity } from "react-native-gesture-handler";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";

import { login } from "../../redux/actions";
import { LoginHeader, CustomOTPField, SubmitButton } from "../../components";
import { OTPLock, ResendTimeCircle } from "../../../assets/img/svgs";
import { detectTheme } from "../../helpers";
import styles from "../../styles/OTPStyle";
import { themes } from "../../themes";
import { customAnimation } from "../../animation/CommonAnimation";
import Animated from "react-native-reanimated";
class OTPScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: false,
      rerender: false,
    };
  }
  componentDidMount() {
    const { navigation, sendOtpReset } = this.props;
    const {
      route: {
        params: { flow },
      },
    } = this.props;
    flow == "changePassFlow" && sendOtpReset();
    if (this.myInterval) {
      clearInterval(this.myInterval);
      this.myInterval = null;
    }

    this.focusListener = navigation.addListener("focus", () => {
      const { onLoginInputChange } = this.props;
      onLoginInputChange({ name: "seconds", value: 30 });
      onLoginInputChange({ name: "otp_token", value: "" });

      this.setState({ disabled: false });

      this.myInterval = setInterval(() => {
        const { seconds, decrement } = this.props;
        if (seconds > 0) {
          decrement();
        } else {
          clearInterval(this.myInterval);
        }
      }, 1000);
    });

    this.focusListener = navigation.addListener("blur", () => {
      const { onLoginInputChange } = this.props;
      onLoginInputChange({ name: "otp_token", value: "" });
    });

    crashlytics().log("Error in otp screen");
  }

  componentWillUnmount() {
    clearInterval(this.myInterval);
    // this.focusListener();
  }

  handleSubmitOtp = (loginFlow, Flow) => {
    const {
      // route: { name },
      validateOtp,
      forgotOtp,
      verifyForgotPassOtp,
      VerifyResetOtp,
      // token,ˀß
      route: {
        params: { flow },
      },
      token,
    } = this.props;
    Keyboard.dismiss();
    console.log(token, "dkdkdkdkdk", loginFlow);
    if (flow != "changePassFlow") {
      loginFlow ? validateOtp() : verifyForgotPassOtp();
    } else {
      console.log("kjdjdjdjdj");
      VerifyResetOtp(token);
    }
  };
  handleChange = (name, value) => {
    const { onLoginInputChange } = this.props;
    onLoginInputChange({ name, value });
    onLoginInputChange({ name: "apiOtpToken", value: value });
  };
  render() {
    const {
      sendOtpReset,
      otp_token,
      seconds,
      navigation,
      resendOtp,
      submitted,
      enableResend,
      route: {
        params: { flow },
      },
      mode,
    } = this.props;
    const { disabled } = this.state;
    console.log(flow, "hhhhhhhhhhhhskhkhdkh");
    const loginFlow = flow === "loginFlow";
    const flowPass = flow === "changePassFlow";
    console.log(flowPass, "kjwhwd");

    const { handleSubmitOtp } = this;
    const timerText = otp_token && otp_token.length === 4;
    return (
      <SafeAreaView
        style={{
          ...styles.safeArea,
          backgroundColor: themes[mode]["bgColor"],
          marginBottom: 20,
        }}
        forceInset={{ top: "never" }}
        edges={["top"]}
      >
        <KeyboardAwareScrollView
          contentContainerStyle={{
            ...styles.container,
            backgroundColor: themes[mode]["bgColor"],
          }}
          style={styles.view}
          showsVerticalScrollIndicator={false}
        >
          <SafeAreaView style={{ ...styles.safeArea }}>
            <Animated.View
              {...customAnimation("FadeInDown", 700, 50, 0)}
              style={styles.horizontalAlign}
            >
              <LoginHeader showLeftIcon image={<OTPLock />} />
            </Animated.View>

            <Animated.View
              {...customAnimation("FadeInDown", 700, 50, 0)}
              style={{ ...styles.horizontalAlign, marginBottom: 100 }}
            >
              <Text
                style={{
                  ...styles.enterCode,
                  color: themes[mode]["headingColor"],
                }}
              >
                Enter your code
              </Text>
              <Text style={{ ...styles.msg, color: themes[mode]["textColor"] }}>
                To continue, Please enter the verification code we’ve just send
                you
              </Text>
              <View style={styles.otpBlock}>
                <CustomOTPField
                  editable
                  handleChange={this.handleChange}
                  value={otp_token}
                  onSubmitEditing={() => {
                    console.log(loginFlow, "iejeudnehf", flowPass);
                    timerText ? handleSubmitOtp(loginFlow, flowPass) : null;
                  }}
                />
                <View style={styles.timerBlock}>
                  {seconds ? (
                    <View style={styles.resend}>
                      <ResendTimeCircle />
                      <Text
                        style={{
                          ...styles.secondsText,
                          color: themes[mode]["primaryColor"],
                        }}
                      >
                        {seconds < 10 ? `00:0` + seconds : `00:${seconds}`}
                      </Text>
                    </View>
                  ) : (
                    <View style={styles.align}>
                      <View>
                        <Text
                          style={{
                            ...styles.didnt,
                            color: themes[mode]["primaryColor"],
                          }}
                        >
                          Didn't receive otp?
                        </Text>
                      </View>

                      {!this.state.disabled && (
                        <TouchableOpacity
                          disabled={seconds || disabled}
                          onPress={() => {
                            console.log(flow, "dkdidididididi");
                            if (flow == "changePassFlow") {
                              sendOtpReset(), this.setState({ disabled: true });
                            } else {
                              resendOtp(), this.setState({ disabled: true });
                            }
                          }}
                        >
                          <Text
                            style={{
                              ...styles.resendText,
                              color: themes[mode]["primaryColor"],
                            }}
                          >
                            Resend
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  )}
                </View>
              </View>
            </Animated.View>
          </SafeAreaView>
        </KeyboardAwareScrollView>
        <View
          style={{
            position: "absolute",
            bottom: -20,
            width: "100%",
          }}
        >
          <SubmitButton
            buttonText="Validate OTP"
            handleSubmit={() => handleSubmitOtp(loginFlow)}
            disableBtn={!timerText || submitted}
          />
        </View>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = ({
  login: { login_type, otp_token, seconds, enableResend, submitted, token },
  profile: { mode },
}) => {
  return {
    login_type,
    otp_token,
    seconds,
    enableResend,
    mode,
    submitted,
    token,
  };
};
const {
  onLoginInputChange,
  validateOtp,
  decrement,
  resendOtp,
  forgotOtp,
  verifyForgotPassOtp,
  sendOtpReset,
  VerifyResetOtp,
} = login;

const mapDispatchToProps = {
  onLoginInputChange,
  validateOtp,
  resendOtp,
  decrement,
  resendOtp,
  forgotOtp,
  verifyForgotPassOtp,
  VerifyResetOtp,
  sendOtpReset,
};

export default connect(mapStateToProps, mapDispatchToProps)(OTPScreen);
