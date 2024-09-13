import React, { Component } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { themes, fonts, commonColors } from "../../../../themes";

import { connect } from "react-redux";

import { FocusAwareStatusBar } from "../../../../navigation/RootNavigation";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { complaint } from "../../../../redux/actions";
import SafeAreaView from "react-native-safe-area-view";
import { HeaderOnly } from "../../../../components/Header";
import { ScrollView } from "react-native-gesture-handler";

import {
  CustomTextArea,
  CustomButton,
  WithBgHeader,
} from "../../../../components";
import commonStyles from "../../../../styles/commonStyles";
import { customAnimation } from "../../../../animation/CommonAnimation";
import Animated from "react-native-reanimated";
class ReplyComplaint extends Component {
  componentDidMount() {
    const { navigation, complaintsChange } = this.props;
    this._unsubscribe = navigation.addListener("focus", async () => {
      complaintsChange({ name: "reply", value: "" });
    });
  }

  handleChange = (name, val) => {
    console.log(val, "avll;nj");
    this.props.complaintsChange({ name: "reply", value: val });
  };

  onSubmitReply = () => {
    const { complaintReply, reply, complaintValidation } = this.props;
    console.log(reply, "submitt comp");
    let err = false;
    if (reply["value"].length < 2) {
      console.log(err, "trueee");
      err = true;
      complaintValidation({
        name: "reply",
        value: reply["value"],
        error: "Please fill your comment",
      });
    }
    if (!err) {
      complaintReply();
    }
  };

  render() {
    const { handleChange, onSubmitReply } = this;
    const { reply, mode, submitted } = this.props;
    return (
      <SafeAreaView
        style={{
          backgroundColor: themes[mode]["bgColor"],
          flex: 1,
          height: "100%",
        }}
        forceInset={{ top: "never" }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          style={{
            backgroundColor: themes[mode]["bgColor"],
            flex: 1,
            // marginTop: '8%',
          }}
        >
          <WithBgHeader
            leftIcon
            headerTitle="Your Reply"
            containerStyle={{
              ...commonStyles.headerSpacing,
            }}
          >
            {/* <HeaderOnly
            showLeftIcon
            title="Your Reply"
            showRightIcon
            onPressRight={() => {}}
          /> */}
            <Animated.View
              {...customAnimation("FadeInRight", 700, 50, 0)}
              style={{
                ...commonStyles.headerSpacing,
                marginTop: "10%",
              }}
            >
              <Text
                style={{
                  fontFamily: fonts.semiBold,
                  fontSize: 14,
                  color: themes[mode]["headingColor"],
                }}
              >
                Comment
              </Text>
              <View style={{ marginTop: 15 }}>
                <CustomTextArea
                  value={reply["value"]}
                  handleChange={handleChange}
                  placeholder="Add your comment here..."
                  error={reply["error"]}
                  onSubmitEditing={onSubmitReply}
                />
              </View>
            </Animated.View>
          </WithBgHeader>
        </ScrollView>
        <View
          style={{
            position: "absolute",
            width: "100%",
            bottom: 0,
            marginTop: 60,
            paddingHorizontal: 40,
            alignSelf: "center",
            backgroundColor: themes[mode]["bgColor"],
            height: 100,
          }}
        >
          <CustomButton
            title="Submit"
            buttonStyle={{
              width: "100%",
              height: 40,
              borderRadius: 5,
              backgroundColor: themes[mode]["primaryColor"],
              marginTop: 30,
            }}
            disableBtn={reply["error"].length > 1 || submitted}
            handleSubmit={onSubmitReply}
            textStyle={{
              color: commonColors.darkWhite,
            }}
          />
        </View>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = ({
  profile: { mode },
  complaint: { reply },
  login: { submitted },
}) => {
  return {
    mode,
    reply,
    submitted,
  };
};

const {
  submitReply,
  onComplaintsChange,
  complaintReply,
  complaintValidation,
  complaintsChange,
} = complaint;
const mapDispatchToProps = {
  submitReply,
  onComplaintsChange,
  complaintReply,
  complaintValidation,
  complaintsChange,
};

export default connect(mapStateToProps, mapDispatchToProps)(ReplyComplaint);
