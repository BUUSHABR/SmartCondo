import React, { Component } from "react";
import { Keyboard, Text } from "react-native";
import { connect } from "react-redux";
import crashlytics from "@react-native-firebase/crashlytics";
import analytics from "@react-native-firebase/analytics";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LoginComponent } from "../../components";
import { login, profile } from "../../redux/actions";
import {
  usernameValidation,
  passwordValidation,
  handleBackButton,
  phoneValidation,
} from "../../helpers";
import { SafeAreaView } from "react-native-safe-area-context";
import {  themes } from "../../themes";

class LoginScreen extends Component {
  constructor(props) {
    super(props);

    if (Text.defaultProps == null) Text.defaultProps = {};
    Text.defaultProps.allowFontScaling = false;
  }
  async componentDidMount() {
    const { navigation, phone } = this.props;
    await AsyncStorage.setItem("firstLaunch", "launched");
    this.focusListener = navigation.addListener("focus", () => {
      const { onLoginInputChange } = this.props;
      onLoginInputChange({ name: "otp_token", value: "" });
    });

    this.focusListener = navigation.addListener("blur", () => {
      const { onLoginInputChange, formValidation } = this.props;
      const arr = ["username", "confirm_pass"];
      arr?.map((val) => {
        onLoginInputChange({ name: val, value: "" });
        formValidation({ field: val, message: null });
      });
    });

    // crashlytics().crash();

    crashlytics().setUserId("crash test in simulatore");
    // crashlytics().setAttribute('Crashed user is', phone);
    crashlytics().log("Error in login screen");
    await analytics().setAnalyticsCollectionEnabled(true);

    await analytics().logEvent("user", {
      name: "username",
      message: "analytics test",
    });
   
  }

  componentWillUnmount() {
    const { onLoginInputChange } = this.props;
    onLoginInputChange({ name: "username", value: "" });
    handleBackButton(); 
  }

  handleInputChange = (name, value) => {
    const { onLoginInputChange, formValidation } = this.props;

    name === "login_type" &&
      onLoginInputChange({ name: "username", value: "" });
    name === "username" &&
      onLoginInputChange({ name: "apiUsername", value: value });
    name === "confirm_pass" &&
      onLoginInputChange({ name: "apiConfirmpass", value: value });

    let names = ["username", "confirm_pass"];
    names?.map((item) => {
      name === "login_type" && onLoginInputChange({ name: item, value: "" });
      formValidation({ field: item, message: null });
    });

    onLoginInputChange({ name, value });
    formValidation({ field: name, message: null });
  };

  handleSubmit = () => {
    const {
      login_type,
      sendOtp,
      userLogin,
      confirm_pass,
      username,
      formValidation,
    } = this.props;
    Keyboard.dismiss();

    let err = false;

    if (login_type === "otp") {
      err = usernameValidation(username) ? true : false;
      if (err) {
        formValidation({
          field: "username",
          message: phoneValidation(username),
        });
      } else if (!err) {
        sendOtp();
      }
    }
    if (login_type === "password") {
      if (usernameValidation(username)) {
        err = true;
        formValidation({
          field: "username",
          message: phoneValidation(username),
        });
      }
      if (passwordValidation(confirm_pass)) {
        err = true;
        formValidation({
          field: "confirm_pass",
          message: passwordValidation(confirm_pass),
        });
      } else if (!err) {
        userLogin();
      }
    }
  };

  forgotPassword = () => {
    this.props.forgotPassword();
  };

  render() {
    const {
      username,
      new_pass,
      confirm_pass,
      login_type,
      errors,
      submitted,
      navigation,
      mode,
    } = this.props;
    const { handleInputChange, handleSubmit, forgotPassword } = this;
    return (
        <LoginComponent
          data={{
            username,
            new_pass,
            confirm_pass,
            login_type,
            errors,
            submitted,
            mode,
          }}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          forgotPassword={forgotPassword}
          navigation={navigation}
        />
    );
  }
}

const mapStateToProps = ({
  login: {
    username,
    new_pass,
    confirm_pass,
    login_type,
    errors,
    submitted,
    apiUsername,
    apiConfirmpass,
  },
  profile: { mode },
}) => {
  return {
    username,
    new_pass,
    confirm_pass,
    login_type,
    errors,
    submitted,
    mode,
    apiUsername,
    apiConfirmpass,
  };
};
const {
  onLoginInputChange,
  formValidation,
  sendOtp,
  userLogin,
  setPassword,
  forgotPassword,
} = login;
const { setTheme } = profile;

const mapDispatchToProps = {
  setTheme,
  onLoginInputChange,
  formValidation,
  sendOtp,
  userLogin,
  setPassword,
  forgotPassword,
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
