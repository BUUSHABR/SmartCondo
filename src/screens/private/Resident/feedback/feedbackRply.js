import React, { useState } from "react";
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
  CustomImagePicker,
} from "../../../../components";
import commonStyles from "../../../../styles/commonStyles";
import { customAnimation } from "../../../../animation/CommonAnimation";
import Animated from "react-native-reanimated";
import { ticketComment } from "../../../../api/feedback";
import { serialize } from "object-to-formdata";
import { ms } from "../../../../helpers/scaling";
import feedback from "../../../../redux/reducers/feedback";
const FeedbackRply = (props) => {
  const [feedbacks, setFeedBack] = useState({
    attachments: [],
    comment: "",
  });
  const [error, setError] = useState({
    comment: "",
  });
  const formField = {
    id: 14,
    type: "image-picker",
    name: "Image Picker",
    label: "Image Picker",
    value: feedbacks.attachments,
    keyboardType: "numeric",
    multiselect: true,
    required: false,
    error: "",
  };

  const handleChange = (name, val) => {
    setFeedBack({ ...feedbacks, comment: val });
  };

  const onSubmitReply = () => {
    console.log(feedbacks, "feedbacks onSubmitRepley");
    setError({
      comment:
        feedbacks["comment"]?.length == 0 ? "This Field is required" : "",
    });
    if (feedbacks["comment"]?.length != 0) {
      console.log("onSubmitReplykdwkkd");
      let formdata = serialize({
        ticket_comment: {
          message: feedbacks.comment,
          ticket_id: props?.route?.params?.data.type_id,
          attachments: feedbacks.attachments?.map((data, index) => {
            return {
              uri: data.path,
              type: data.mime,
              name: `image${index}.jpg`,
            };
          }),
        },
      });
      console.log("onSubmitReply22", formdata);

      ticketComment(formdata)
        .then((data) => {
          props.navigation.goBack();
        })
        .catch((err) => {});
    }
  };

  const { reply, mode, submitted } = props;
  console.log(feedbacks, "feedbacksfeedbacks");
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
                value={feedbacks.comment}
                handleChange={handleChange}
                placeholder="Add your comment here..."
                error={error.comment}
                //   onSubmitEditing={onSubmitReply}
              />
            </View>

            {true && (
              <View
                style={{
                  paddingVertical: ms(20),
                }}
              >
                <CustomImagePicker
                  key={0}
                  {...formField}
                  onChange={
                    (name, value) => {
                      console.log(name, "name customImage Picker", value);
                      if (name == "delete-image") {
                        setFeedBack({
                          ...feedbacks,
                          attachments: value,
                        });
                      } else {
                        setFeedBack({
                          ...feedbacks,
                          attachments: [...feedbacks.attachments, ...value],
                        });
                      }
                    }
                    // handleChange(name, value, "payment")
                  }
                  isDeposit={false}
                  name={"Feedback Image"}
                />
              </View>
            )}
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
};

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

export default connect(mapStateToProps, mapDispatchToProps)(FeedbackRply);
