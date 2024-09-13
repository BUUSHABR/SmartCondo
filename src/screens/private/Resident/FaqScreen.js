import React, { Component } from "react";
import { View, Text } from "react-native";
import { connect } from "react-redux";
import SafeAreaView from "react-native-safe-area-view";
import { ScrollView } from "react-native-gesture-handler";

import { login, profile } from "../../../redux/actions";
import {
  CustomTextArea,
  CustomButton,
  WithBgHeader,
} from "../../../components";

import commonStyles from "../../../styles/commonStyles";
import styles from "../../../styles/faq";
import { commonColors, themes } from "../../../themes";
import Animated from "react-native-reanimated";
import { customAnimation } from "../../../animation/CommonAnimation";
class FaqScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: "",
    };
  }
  componentDidMount() {
    const { navigation, complaintsChange } = this.props;
    this._unsubscribe = navigation.addListener("focus", async () => {
      this.setState({ error: "" });
      this.props.onLoginInputChange({ name: "faqMsg", value: "" });
    });
  }

  handleChange = (text, val) => {
    console.log(val, "dwddd");
    this.props.onLoginInputChange({ name: "faqMsg", value: val });
    this.setState({ error: "" });
  };

  onSubmit = () => {
    const { faqSubmit, faqMsg } = this.props;
    console.log(faqMsg, "dedekdejdedkejd");
    let err = false;
    if (faqMsg.length < 4) {
      console.log(err, "trueee");
      err = true;
      this.setState({ error: "This field required min of 3 char" });
    }
    if (!err) {
      faqSubmit();
    }
  };

  render() {
    const { handleChange, onSubmit } = this;
    const { mode, submitted, faqMsg } = this.props;
    const { error } = this.state;
    return (
      <SafeAreaView
        style={{
          ...styles.safeArea,
          backgroundColor: themes[mode]["bgColor"],
        }}
        forceInset={{ top: "never" }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          style={{
            backgroundColor: themes[mode]["bgColor"],
            flex: 1,
          }}
        >
          <WithBgHeader
            headerTitle="Report Your Bug"
            leftIcon
            containerStyle={{ ...commonStyles.headerSpacing }}
          >
            <Animated.View
              {...customAnimation("FadeInRight", 700, 50, 3)}
              style={{ marginTop: "10%", marginHorizontal: 20 }}
            >
              <Text
                style={{
                  ...commonStyles.semiBold_14,
                  color: themes[mode]["headingColor"],
                }}
              >
                Comment
              </Text>
              <View style={{ marginTop: 15 }}>
                <CustomTextArea
                  value={faqMsg}
                  handleChange={handleChange}
                  placeholder="Add your comment here..."
                  error={error}
                  onSubmitEditing={onSubmit}
                />
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
            disableBtn={error.length > 1 || submitted}
            handleSubmit={onSubmit}
          />
        </View>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = ({
  profile: { mode },
  login: { submitted, faqMsg },
}) => {
  return {
    mode,
    faqMsg,
    submitted,
  };
};

const { onLoginInputChange } = login;
const { faqSubmit } = profile;
const mapDispatchToProps = {
  onLoginInputChange,
  faqSubmit,
};

export default connect(mapStateToProps, mapDispatchToProps)(FaqScreen);
