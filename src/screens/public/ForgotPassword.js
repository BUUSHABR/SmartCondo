import React, { Component } from "react";
import { View, Text, Keyboard } from "react-native";
import { connect } from "react-redux";
import crashlytics from "@react-native-firebase/crashlytics";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";

import { login } from "../../redux/actions";
import { LoginHeader, SubmitButton, CustomUsername } from "../../components";
import { ForgotPassIcon } from "../../../assets/img/svgs";
import {
  usernameValidation,
  detectTheme,
  phoneValidation,
} from "../../helpers";
import styles from "../../styles/OTPStyle";
import { themes } from "../../themes";
import { customAnimation } from "../../animation/CommonAnimation";
import Animated from "react-native-reanimated";
class ForgotPassword extends Component {
  componentDidMount() {
    const { navigation, phone } = this.props;
    this.focusListener = navigation.addListener("blur", () => {
      const { onLoginInputChange } = this.props;
      onLoginInputChange({ name: "username", value: "" });
    });
  }
  handleSubmit = () => {
    const { username, formValidation, forgotPassSendOtp } = this.props;
    Keyboard.dismiss();
    let err = false;
    err = phoneValidation(username) ? true : false;

    if (err) {
      formValidation({
        field: "username",
        message: phoneValidation(username),
      });
    } else if (!err) {
      forgotPassSendOtp();
    }
  };

  handleChange = (name, value) => {
    this.props.onLoginInputChange({ name, value });
    this.props.onLoginInputChange({ name: "apiUsername", value: value });

    this.props.formValidation({ field: name, message: null });
  };

  render() {
    const { submitted, username, errors, mode } = this.props;
    const { handleSubmit, handleSubmitOtp } = this;

    return (
      <KeyboardAwareScrollView
        contentContainerStyle={{
          ...styles.container,
          backgroundColor: themes[mode]["bgColor"],
        }}
        style={styles.view}
        scrollEnabled={false}
      >
        <SafeAreaView style={styles.safeArea} forceInset={{ bottom: "never" }}>
          <Animated.View
            {...customAnimation("FadeInDown", 700, 50, 0)}
            style={styles.horizontalAlign}
          >
            <LoginHeader showLeftIcon image={<ForgotPassIcon />} />
          </Animated.View>

          <Animated.View
            {...customAnimation("FadeInDown", 700, 50, 0)}
            style={{ ...styles.horizontalAlign, marginBottom: "20%" }}
          >
            <Text
              style={{
                ...styles.enterCode,
                color: themes[mode]["headingColor"],
              }}
            >
              Forgot Password
            </Text>
            <Text style={{ ...styles.msg, color: themes[mode]["textColor"] }}>
              Enter your registered Mobile Number we will send you OTP to reset
              your password
            </Text>
            <View style={{ marginVertical: "7%" }}>
              <CustomUsername
                name="username"
                label="Mobile Number"
                value={username}
                onChange={this.handleChange}
                onSubmitEditing={handleSubmit}
                error={errors?.username}
              />
            </View>
          </Animated.View>

          <SubmitButton
            buttonText={"Send OTP"}
            handleSubmit={handleSubmit}
            disableBtn={submitted}
          />
        </SafeAreaView>
      </KeyboardAwareScrollView>
    );
  }
}

const mapStateToProps = ({
  login: { username, login_type, errors, submitted },
  profile: { mode },
}) => {
  return {
    username,
    login_type,
    errors,
    mode,
    submitted,
  };
};
const { onLoginInputChange, forgotPassSendOtp, formValidation } = login;

const mapDispatchToProps = {
  onLoginInputChange,
  forgotPassSendOtp,
  formValidation,
};

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword);
