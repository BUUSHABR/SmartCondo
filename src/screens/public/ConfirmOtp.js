import React, { Component } from "react";
import { View, Text, Keyboard, BackHandler } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { connect } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";

import { login } from "../../redux/actions";
import { commonColors, fonts, themes } from "../../themes";
import { SubmitButton, CustomPassword, CustomButton } from "../../components";
import { Header } from "../../components/Header";
import styles from "../../styles/setPassword";
import { detectTheme } from "../../helpers";
import { navigate } from "../../navigation/RootNavigation";
import { OtpConfirmIcon } from "../../../assets/img/svgs";
import AsyncStorage from "@react-native-async-storage/async-storage";

class ConfirmOtp extends Component {
  constructor(props) {
    super(props);
    this.confirmPassRef = React.createRef();
    this.state = {
      number: "",
    };
  }
  componentDidMount() {
      this.getNumber()
  }
  getNumber = async () => {
    const localStorage = await AsyncStorage.getItem("user");
    console.log(JSON.parse(localStorage).data.phone,"didmdwmldw");
    this.setState({ number: JSON.parse(localStorage).data.phone });
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
              showLeftIcon={loginFlow ? false : true}
              leftIcon={loginFlow ? false : true}
            />
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                position: "absolute",
                top: 100,
                width: "100%",
                paddingHorizontal: 30,
              }}
            >
              <OtpConfirmIcon />
              <Text
                style={{
                  color: themes[mode]["headingColor"],
                  fontFamily: fonts.medium,
                  fontSize: 20,
                }}
              >
                Send OTP
              </Text>
              <Text
                style={{
                  color: themes[mode]["lightAsh"],
                  fontFamily: fonts.medium,
                  fontSize: 15,
                  marginTop:10
                }}
              >
                Are you want to send OTP to
              </Text>
              <Text style={{
                  color: themes[mode]["headingColor"],
                  fontFamily: fonts.medium,
                  fontSize: 15,
                  marginTop:10
                }}>{this.state.number ? this.state.number : ""}</Text>
            </View>
          </View>

          <View
            style={{
              position: "absolute",
              width: "100%",
              paddingHorizontal: 40,
              bottom: 0,
              marginBottom: 20,
            }}
          >
            <CustomButton
              title={"Send OTP"}
              buttonStyle={{
                borderColor: commonColors.yellowColor,
                backgroundColor: commonColors.yellowColor,
              }}
              textStyle={{
                color: "#fff",
              }}
              handleSubmit={() => {
                navigate("ChangePassword", { flow: "changePassFlow" });
              }}
              disableBtn={false}
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

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmOtp);
