import React, { Component } from "react";
import { View, Text, Keyboard, BackHandler } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { connect } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";

import { login } from "../../redux/actions";
import { themes } from "../../themes";
import { SubmitButton, CustomPassword } from "../../components";
import { Header } from "../../components/Header";
import styles from "../../styles/setPassword";
import { detectTheme } from "../../helpers";
import { navigate } from "../../navigation/RootNavigation";
import Animated from "react-native-reanimated";
import { customAnimation } from "../../animation/CommonAnimation";
class SetPassword extends Component {
  constructor(props) {
    super(props);
    this.confirmPassRef = React.createRef();
  }

  async componentDidMount() {
    const { navigation, phone } = this.props;
    this.focusListener = navigation.addListener("blur", () => {
      const { onLoginInputChange } = this.props;
      onLoginInputChange({ name: "new_pass", value: "" });
      onLoginInputChange({ name: "confirm_pass", value: "" });
      onLoginInputChange({ name: "otp_token", value: "" });
    });
  }

  handleSubmit = (loginFlow) => {
    const {
      setPassword,
      setNewPassword,
      new_pass,
      confirm_pass,
      formValidation,
      route: {
        params: { flow },
      },
    } = this.props;

    Keyboard.dismiss();
    let baseValidation =
      !new_pass.length ||
      new_pass.length < 3 ||
      !confirm_pass.length ||
      confirm_pass.length < 3;

    let err = false;

    if (baseValidation) {
      if (new_pass.length === 0) {
        err = true;
        formValidation({
          field: "new_pass",
          message: "This is mandatory",
        });
      } else if (new_pass.length < 3) {
        err = true;
        formValidation({
          field: "new_pass",
          message: "Password should be min of 3 char",
        });
      }
      if (confirm_pass.length === 0) {
        err = true;
        formValidation({
          field: "confirm_pass",
          message: "This is mandatory",
        });
      } else if (confirm_pass.length < 3) {
        err = true;
        formValidation({
          field: "confirm_pass",
          message: "Password should be min of 3 char",
        });
      }
    } else if (new_pass != confirm_pass) {
      err = true;
      formValidation({
        field: "confirm_pass",
        message: "Password doesn't match",
      });
    }
    if (!err) {
      flow == "ChangeloginFlow"
        ? setPassword()
        : loginFlow
        ? setPassword()
        : setNewPassword();
    }
  };

  handleChange = (name, value) => {
    this.props.formValidation({ field: [name], message: null });
    this.props.onLoginInputChange({ name, value });
  };
  focusNext = () => {
    this.confirmPassRef.current.textInput.focus();
  };

  render() {
    const {
      submitted,
      errors,
      new_pass,
      confirm_pass,
      route: {
        params: { flow },
      },
      mode,
    } = this.props;
    const loginFlow = flow === "loginFlow";
    const { handleSubmit, handleChange, focusNext } = this;
    return (
      <KeyboardAwareScrollView
        contentContainerStyle={{
          ...styles.container,
          backgroundColor: themes[mode]["bgColor"],
        }}
        style={{ flex: 1 }}
        scrollEnabled={false}

      >
        <SafeAreaView
          style={{ ...styles.safeArea }}
          forceInset={{ top: "never" }}
        >
          <View style={{ marginTop: "-5%" }}>
            <Header
              showLeftIcon={
                flow == "ChangeloginFlow" ? true : loginFlow ? false : true
              }
              leftIcon={
                flow == "ChangeloginFlow" ? true : loginFlow ? false : true
              }
            />
          </View>

          <Animated.View
          {...customAnimation("FadeInRight", 700, 50, 3)}
            style={{ ...styles.wrapper, marginTop: loginFlow ? "25%" : "30%" }}
          >
            <Text
              style={{ ...styles.title, color: themes[mode]["headingColor"] }}
            >
              Create New Password
            </Text>
            <Text style={{ ...styles.msg, color: themes[mode]["textColor"] }}>
              {loginFlow
                ? "Before you proceed, take a few minutes to set up your account password"
                : " Your new password must be different from previous used passwords"}
            </Text>
            <View style={{ marginTop: 15 }}>
              <View style={{ marginVertical: 10 }}>
                <CustomPassword
                  name="new_pass"
                  label="New Password"
                  value={new_pass}
                  onChange={handleChange}
                  onSubmitEditing={focusNext}
                  error={errors?.new_pass}
                />
              </View>
              <View style={{ zIndex: 1001 }}>
                <CustomPassword
                  ref={this.confirmPassRef}
                  name="confirm_pass"
                  label="Confirm Password"
                  value={confirm_pass}
                  onChange={handleChange}
                  onSubmitEditing={handleSubmit}
                  error={errors?.confirm_pass}
                />
              </View>
            </View>
          </Animated.View>
          <View style={{ position: "absolute", bottom: 0, width: "100%" }}>
            <SubmitButton
              buttonText={"Set Password"}
              handleSubmit={() => handleSubmit(loginFlow)}
              disableBtn={submitted}
            />
          </View>
        </SafeAreaView>
      </KeyboardAwareScrollView>
    );
  }
}

const mapStateToProps = ({
  login: { username, new_pass, confirm_pass, login_type, errors, submitted },
  profile: { mode },
}) => {
  return {
    username,
    new_pass,
    confirm_pass,
    login_type,
    errors,
    mode,
    submitted,
  };
};
const {
  onLoginInputChange,
  setPassword,
  setNewPassword,
  formValidation,
} = login;

const mapDispatchToProps = {
  onLoginInputChange,
  setPassword,
  setNewPassword,
  formValidation,
};

export default connect(mapStateToProps, mapDispatchToProps)(SetPassword);
