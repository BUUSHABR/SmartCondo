import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  useWindowDimensions,
} from "react-native";
import { themes, fonts, commonColors } from "../../../../themes";

import { connect } from "react-redux";

import {
  FocusAwareStatusBar,
  navigate,
} from "../../../../navigation/RootNavigation";
import RenderHTML from "react-native-render-html";
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
import { detectTheme, SliceName } from "../../../../helpers";
import { ms } from "../../../../helpers/scaling";

class ComplaintTerms extends Component {
  constructor(props) {
    super(props);

    this.state = {
      formsData: [],
    };
  }
  componentDidMount() {
    let formsData = [];
    console.log(this.props.helpDeskQuestions.questions, "hellojhbdjbdjeqd");
    this.props.helpDeskQuestions.questions.forEach((data, index) => {
      switch (data.question_type) {
        case "text":
          var data = {
            id: index,
            q_id: data.id,
            type: "text",
            label: data.name,
            value: "",
            required: data.validation.required,
            error: "",
            ref: React.createRef(),
            keyboardType: data.keyboard_type,
          };
          formsData.push(data);
          break;
        case "text_area":
          var data = {
            id: index,
            q_id: data.id,
            type: "text-area",
            label: data.name,
            value: "",
            required: data.validation.required,
            error: "",
            ref: React.createRef(),
            keyboardType: data.keyboard_type,
          };
          formsData.push(data);
          break;
        case "date_picker":
          var data = {
            id: index,
            q_id: data.id,
            type: "date-picker",
            label: data.name,
            value: new Date(),
            required: data.validation.required,
            error: "",
          };
          formsData.push(data);
          break;
        case "date_time_picker":
          var data = {
            id: index,
            q_id: data.id,
            type: "date-time-picker",
            label: data.name,
            value: new Date(),
            required: data.validation.required,
            error: "",
          };
          formsData.push(data);
          break;
        case "single_select":
          console.log(data.options, "igjgjjjjjjj");
          var data = {
            id: index,
            q_id: data.id,
            type: "single-select",
            label: data.name,
            value: "",
            dropDownList: data.options?.map((v) => ({ ...v, selected: false })),
            required: data.validation.required,
            error: "",
          };
          formsData.push(data);
          break;
        case "multiple_select":
          var data = {
            id: index,
            q_id: data.id,
            type: "multiple-select",
            label: data.name,
            value: "",
            dropDownList: data.options?.map((v) => ({ ...v, selected: false })),
            required: data.validation.required,
            error: "",
          };
          formsData.push(data);
          break;
      }
    });
    console.log(formsData, "2342342kdd984934ncjk c34");
    this.setState({ formsData: formsData });
    // this.formsData=formsData
  }
  onSubmit = () => {
    console.log(this.state.formsData, "S");

    navigate("AddComplaint", {
      back: false,
      questionData: this.state.formsData,
    });
  };

  render() {
    const mode = detectTheme();
    // const { width } = useWindowDimensions();
    console.log(this.props?.route?.params.terms, "jhbvuvgeuvjbvkjvbkrev");
    console.log(
      this.state.DataQuestion,
      "0000wwkjbcc000",
      this.props?.route?.params.value
    );
    //     const html = `
    //   <h1>This HTML snippet is now rendered with native components !</h1>
    //   <h2>Enjoy a webview-free and blazing fast application</h2>
    //   <img src="https://i.imgur.com/dHLmxfO.jpg?2" />
    //   <em style="textAlign: center;">Look at how happy this native cat is</em>
    // `;
    const html = this.props?.route?.params?.terms;
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
          style={{
            backgroundColor: themes[mode]["bgColor"],
            flex: 1,
            // marginTop: '8%',
            // paddingBottom:500
            // height:"100%"
          }}
          showsVerticalScrollIndicator={false}
        >
          <WithBgHeader
            leftIcon
            headerTitle={SliceName(this.props?.route?.params.value, 20)}
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
            <View
              style={{
                ...commonStyles.headerSpacing,
                marginTop: "3%",
              }}
            >
              <Text
                style={{
                  fontFamily: fonts.semiBold,
                  fontSize: ms(16),
                  color: themes[mode]["headingColor"],
                }}
              >
                Terms and conditions
              </Text>
              <View style={{ marginTop: ms(10), marginBottom: ms(100) }}>
                <RenderHTML
                  contentWidth={"100%"}
                  source={{ html }}
                  tagsStyles={{
                    p: { color: themes[mode]["headingColor"],fontSize:ms(12) },
                  }}
                />
              </View>
            </View>
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
            title="Next"
            buttonStyle={{
              width: "100%",
              height: 40,
              borderRadius: 5,
              backgroundColor: themes[mode]["primaryColor"],
              marginTop: 30,
            }}
            // disableBtn={reply["error"].length > 1 || submitted}
            handleSubmit={this.onSubmit}
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
  complaint: { reply, helpDeskQuestions },
  login: { submitted },
}) => {
  return {
    mode,
    reply,
    submitted,
    helpDeskQuestions,
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

export default connect(mapStateToProps, mapDispatchToProps)(ComplaintTerms);
