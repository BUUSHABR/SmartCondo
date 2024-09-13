import React, { Component } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";

import { FocusAwareStatusBar } from "../navigation/RootNavigation";
import { Building, LeftCorner, RightCorner } from "../../assets/img/svgs";
import {
  LoginType,
  CustomUsername,
  SubmitButton,
  CustomPassword,
} from "../components";
import styles from "../styles/login";
import { themes } from "../themes";
import { customAnimation } from "../animation/CommonAnimation";
import Animated from "react-native-reanimated";
class LoginComponent extends Component {
  constructor(props) {
    super(props);
    this.passRef = React.createRef();
  }

  focusNext = () => {
    this.passRef.current.textInput.focus();
  };

  render() {
    const {
      handleInputChange,
      handleSubmit,
      forgotPassword,
      data: { username, confirm_pass, login_type, errors, submitted, mode },
      navigation,
    } = this.props;
    const { focusNext } = this;

    return (
      <SafeAreaView
        style={{
          ...styles.safeArea,
          backgroundColor: themes[mode]["bgColor"],
        }}
        forceInset={{ top: "never" }}
        edges={["top"]}
      >
        <KeyboardAwareScrollView
          scrollEnabled={false}
          behavior="padding"
          contentContainerStyle={{ ...styles.container }}
          showsVerticalScrollIndicator={false}
          style={{
            ...styles.scrollContainer,
            backgroundColor: themes[mode]["bgColor"],
          }}
        >
          <FocusAwareStatusBar />
          <Animated.View
            {...customAnimation("FadeInDown", 500, 50, 0)}
            style={styles.row1}
          >
            <View style={styles.leftCorner}>
              <LeftCorner />
            </View>
            <LoginType
              login_type={login_type}
              onChange={handleInputChange}
              navigation={navigation}
            />
            <View style={{ marginVertical: "-5%" }}>
              <View style={styles.centerAlign}>
                <Building />
              </View>
              <View style={styles.rightCorner}>
                <RightCorner />
              </View>
            </View>
          </Animated.View>
          <Animated.View
            {...customAnimation("FadeInDown", 700, 50, 0)}
            style={styles.row2}
          >
            <Text
              style={{
                ...styles.welcome,
                color: themes[mode]["headingColor"],
              }}
            >
              {login_type === "otp" ? "Welcome to" : "Welcome Back,"}
            </Text>
            {login_type === "otp" && (
              <Text
                style={{
                  ...styles.name,
                  color: themes[mode]["headingColor"],
                }}
              >
                {login_type === "otp" ? "Smart Facility" : ""}
              </Text>
            )}
            <View
              style={{
                ...styles.textField,
                marginTop: 20,
              }}
            >
              <CustomUsername
                name="username"
                label="Mobile Number"
                value={username}
                onChange={handleInputChange}
                onSubmitEditing={
                  login_type === "otp" ? handleSubmit : focusNext
                }
                error={errors?.username}
              />
            </View>
            {login_type === "password" && (
              <View style={styles.textField}>
                <CustomPassword
                  ref={this.passRef}
                  name="confirm_pass"
                  label="Password"
                  value={confirm_pass}
                  onChange={handleInputChange}
                  onSubmitEditing={handleSubmit}
                  error={errors?.confirm_pass}
                  minLength={3}
                />
              </View>
            )}
          </Animated.View>

          <View>
            {login_type === "password" && (
              <Animated.View {...customAnimation("FadeInDown", 300, 50, 0)}>
                <TouchableOpacity
                  style={styles.forgot}
                  onPress={forgotPassword}
                >
                  <Text
                    style={{
                      ...styles.forgotText,
                      color: themes[mode]["headingColor"],
                    }}
                  >
                    Forgot Password?
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            )}
            <SubmitButton
              buttonText={login_type === "password" ? "Login" : "Send OTP"}
              handleSubmit={handleSubmit}
              disableBtn={submitted}
            />
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    );
  }
}

export default LoginComponent;
