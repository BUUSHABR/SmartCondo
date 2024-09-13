import React, { useReducer, useRef } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { connect } from "react-redux";
import SafeAreaView from "react-native-safe-area-view";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { themes, fonts } from "../../../../themes";
import { detectTheme } from "../../../../helpers";
import { useSelector } from "react-redux";
import { SubmitButton, WithBgHeader } from "../../../../components";
import { ErrorIcon } from "../../../../../assets/img/svgs";
import { complaint } from "../../../../redux/actions";
import { DropdownIcon } from "../../../../../assets/img/svgs";
import commonStyles from "../../../../styles/commonStyles";
import Eform from "../../../../components/Eform";
import { FormReducer } from "../../../../components/Eform";
import { isDate } from "moment";
import { SvgUri } from "react-native-svg";
import { navigate } from "../../../../navigation/RootNavigation";
import Animated from "react-native-reanimated";
import { ms } from "../../../../helpers/scaling";
import { KeyboardAvoidingView } from "react-native";
const mode = detectTheme();

const AddComplaint = (props) => {
  const question_id = useSelector(
    (state) => state.complaint.helpDeskQuestions.id
  );
  const refer = useRef(null);

  console.log(props.questionsList, "23423dd4234");
  const [Formdata, dispatch] = useReducer(FormReducer, props.questionsList);

  const {
    subject,
    description,
    file,
    complaint_type,
    navigation,
    submitted,
  } = props;
  console.log(complaint_type, subject, description, file, "add complaintt ");

  const handleSubmit = () => {
    console.log("hello handle submit calling");
    let Answers = [];
    let err = false;

    Formdata.forEach((data) => {
      console.log(
        data.type == "date-time-picker" || data.type == "date-picker"
          ? new Date(data.value).toISOString()
          : data.value,
        "wpfjqfmoijdwqlkmsbjfwqk mshfekj cs",
        data
      );
      Answers.push({
        question_id: data.q_id,
        value:
          data.type == "date-time-picker" || data.type == "date-picker"
            ? new Date(data.value).toISOString()
            : data.value,
      });
    });
    Formdata.forEach((data) => {
      const { type, value, id, required } = data;

      if (required) {
        console.log(value, "098nbcdcjc54321", data);
        ["text", "single-select", "text-area", "multiple-select"].includes(
          type
        ) &&
          !value?.length > 0 &&
          (err = true) &&
          dispatch({
            id,
            value,
            type: "error-handler",
            error: "this field is required",
          });

        "image-picker" == type &&
          ((value != null && Object.keys(value)?.length == 0) ||
            value == null) &&
          (err = true) &&
          dispatch({
            id,
            value,
            type: "error-handler",
            error: "this field is required",
          });
        "date-picker" == type &&
          !isDate(value) &&
          (err = true) &&
          dispatch({
            id,
            value,
            type: "error-handler",
            error: "this field is required",
          });
      }
    });
    console.log(err, "resefefeult");

    console.log(question_id, "answee", Answers);
    Formdata.some((data) => data.error != "")
      ? refer.current.scrollTo({ top: 0 })
      : console.log("passed a exam1");
    !err && props.helpDeskSubmit(question_id, Answers);
  };
  console.log(props.banner_url, "kjbewfewfbwfbwfewf");
  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{
        flexGrow: 1,
        backgroundColor: themes[mode]["bgColor"],
        height: "100%",
      }}
      style={{
        flex: 1,
      }}
      showsVerticalScrollIndicator={false}
      scrollEnabled={true}
    >
      <SafeAreaView
        style={{
          width: "100%",
        }}
        forceInset={{ top: "never" }}
      >
        <KeyboardAvoidingView >
        <WithBgHeader
          leftIcon
          headerTitle={"Create Your Request"}
          containerStyle={{
            ...commonStyles.headerSpacing,
          }}
          onPressLeftIcon={() => {
            navigate("ComplaintCategory");
          }}
        >
          <ScrollView
            contentContainerStyle={{
              ...commonStyles.headerSpacing,
              flexGrow: 1,
              paddingBottom: 200,
            }}
            style={{
              height: "100%",
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            ref={refer}
          >
            <Animated.View>
              <View style={{ alignSelf: "center", width: 250, height: 150 }}>
                <SvgUri
                  width="250"
                  height="150"
                  uri={props.banner_url ? props.banner_url : null}
                />
              </View>
              <View style={{ marginTop: "15%" }}>
                <Text
                  style={{
                    fontFamily: fonts.regular,

                    fontSize: ms(14),
                    color: themes[mode]["headingColor"],
                  }}
                >
                  We are here to assist you!
                </Text>
              </View>
              <View
                style={{
                  marginTop: "5%",
                  marginBottom: "3%",
                }}
              >
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 5,
                  }}
                  onPress={() =>
                    navigation.navigate("ComplaintCategory", { data: true })
                  }
                >
                  <View
                    style={{
                      borderColor:
                        themes[mode][
                          complaint_type["error"]?.length > 2
                            ? "error"
                            : "primaryColor"
                        ],
                      borderBottomWidth: 2,
                      paddingBottom: 7,
                      flexDirection: "row",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: fonts.semiBold,
                        fontSize:ms(20),
                        lineHeight:ms(22),
                        color: themes[mode]["primaryColor"],
                        paddingRight: 12,
                      }}
                    >
                      {complaint_type["value"]
                        ? complaint_type["value"]
                        : "Category"}
                    </Text>
                    <View style={{ marginTop: 8 }}>
                      <DropdownIcon color={themes[mode]["primaryColor"]} />
                    </View>
                  </View>
                </TouchableOpacity>

                <View
                  style={{
                    flexDirection: "row",
                    marginTop: 5,
                  }}
                >
                  {complaint_type["error"]?.length > 2 ? <ErrorIcon /> : null}
                  <Text
                    style={{
                      fontFamily: fonts.regular,
                      fontSize: 12,
                      alignSelf: "flex-start",
                      marginLeft: 7,
                      color: themes[mode]["error"],
                    }}
                  >
                    {complaint_type["error"]?.length > 2
                      ? complaint_type["error"]
                      : ""}
                  </Text>
                </View>
              </View>
              <View>
                <Text
                  style={{
                    fontSize: ms(14),
                    lineHeight: ms(20),
                    fontFamily: fonts.medium,
                    color: themes[mode]["headingColor"],
                    letterSpacing: 0.2,
                  }}
                >
                  Please complete the form below to submit your {`\n`}request
                </Text>
                <Eform Formdata={Formdata} dispatch={dispatch} />
              </View>
            </Animated.View>
          </ScrollView>
        </WithBgHeader>
        </KeyboardAvoidingView>
      </SafeAreaView>
      <View
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
        }}
      >
        <SubmitButton
          buttonText="Create"
          disableBtn={submitted}
          handleSubmit={handleSubmit}
        />
      </View>
    </KeyboardAwareScrollView>
  );
  // }
};

const mapStateToProps = ({
  profile: { mode },
  complaint: {
    subject,
    description,
    complaint_type,
    file,
    banner_url,
    helpDeskQuestions,
    questionsList,
  },
  login: { submitted },
}) => {
  return {
    mode,
    subject,
    description,
    complaint_type,
    file,
    submitted,
    banner_url,
    helpDeskQuestions,
    questionsList,
  };
};

const {
  complaintValidation,
  createComplaint,
  complaintsChange,
  helpDeskSubmit,
} = complaint;
const mapDispatchToProps = {
  complaintValidation,
  createComplaint,
  complaintsChange,
  helpDeskSubmit,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddComplaint);
