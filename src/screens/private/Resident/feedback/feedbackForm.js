import { View, Text, SafeAreaView, ScrollView, Platform } from "react-native";
import React, { useState } from "react";
import { detectTheme, isValidDate } from "../../../../helpers";
import { commonColors, fonts, themes } from "../../../../themes";
import commonStyles from "../../../../styles/commonStyles";
import {
  CustomButton,
  CustomImagePicker,
  CustomTextArea,
  CustomTextField,
  CustomDatePickerField,
  ToastMessage,
  WithBgHeader,
} from "../../../../components";
import { FacilitySuccess, Note } from "../../../../../assets/img/svgs";
import { ms } from "../../../../helpers/scaling";
import BottomView from "../../../../components/BottomSheet";
import { navigate } from "../../../../navigation/RootNavigation";
import { useEffect } from "react";
import { ticketCategories, ticketCreate } from "../../../../api/feedback";
import CheckBox from "@react-native-community/checkbox";
import { serialize } from "object-to-formdata";
import moment from "moment";

const FeedbackForm = () => {
  const [feedback, setFeedBack] = useState({
    category: "",
    title: "",
    description: "",
    attachments: [],
    priority: "",
    location: "",
    average_duration_to_resolve: "",
    start_date: "",
    end_date: "",
    make_escalation: {
      yes: false,
      no: true,
    },
  });
  const [isAttachement, setIsAttachment] = useState(false);
  const [isComment, setIsComment] = useState(false);

  const [error, setError] = useState({
    category: "",
    priority: "",
    title: "",
    start_date: "",
    end_date: "",
  });
  const [categoriesList, setCategoriesList] = useState([]);
  const mode = detectTheme();
  const formField = {
    id: 14,
    type: "image-picker",
    name: "Image Picker",
    label: "Image Picker",
    value: feedback.attachments,
    keyboardType: "numeric",
    multiselect: true,
    required: false,
    error: "",
  };
  const formDropdown = {
    id: 1,
    q_id: "b59ca50c-431c-4288-97a5-1e21d777a437",
    type: "single-select",
    label: "Choose a category",
    value: feedback.category,
    dropDownList: categoriesList,
    required: true,
    error: error.category,
  };
  const formDropdown2 = {
    id: 1,
    q_id: "b59ca50c-431c-4288-97a5-1e21d777a437",
    type: "single-select",
    label: "Choose a priority",
    value: feedback.priority,
    dropDownList: [
      {
        id: "eb059379-39f3-4ab4-84d1-9710bf4fae88",
        label: "High",
        value: "high",
        position: 1,
        question_id: "b59ca50c-431c-4288-97a5-1e21d777a437",
        selected: false,
      },
      {
        id: "3a01830b-21bd-4c92-a070-65f44679339c",
        label: "Medium",
        value: "medium",
        position: 2,
        question_id: "b59ca50c-431c-4288-97a5-1e21d777a437",
        selected: false,
      },
      {
        id: "aba5b9aa-b683-4654-bd90-79e3170df53d",
        label: "Low",
        value: "low",
        position: 3,
        question_id: "b59ca50c-431c-4288-97a5-1e21d777a437",
        selected: false,
      },
    ],
    required: true,
    error: error.priority,
  };
  console.log(feedback, "feedback form state", formDropdown);
  useEffect(() => {
    ticketCategories()
      .then(({ data }) => {
        console.log(data, "success ticketCategories");
        let categoriesList = data?.map((data, index) => {
          const {
            id,
            name,
            enable_attachment_section,
            enable_comment_section,
          } = data;
          return {
            id: id,
            label: name,
            position: index + 1,
            selected: false,
            question_id: index,
            value: "",
            enable_attachment_section,
            enable_comment_section,
          };
        });
        setCategoriesList(categoriesList);
      })
      .catch((err) => {
        console.log(err, "err ticketCategories");
      });
  }, []);

  const handleSubmit = () => {
    let make_escalation_data = { start_date: "", end_date: "" };
    if (feedback.make_escalation.yes) {
      console.log(isValidDate(feedback.start_date), "handleSubmit");
      make_escalation_data = {
        start_date: !isValidDate(feedback.start_date)
          ? "This Field is required"
          : "",
        end_date: !isValidDate(feedback.end_date)
          ? "This Field is required"
          : "",
      };
    }
    setError({
      title: feedback["title"].length == 0 ? "This Field is required" : "",
      category:
        feedback["category"].length == 0 ? "This Field is required" : "",
      priority:
        feedback["priority"].length == 0 ? "This Field is required" : "",
      ...make_escalation_data,
    });
    if (
      feedback["title"].length != 0 &&
      feedback["category"].length != 0 &&
      feedback["category"].length != 0
    ) {
      if (
        feedback.make_escalation
          ? feedback["start_date"].length != 0 &&
            feedback["end_date"].length != 0
          : true
      ) {
        let postData = {
          tickets: {
            ticket_category_id: feedback.category,
            title: feedback.title,
            description: feedback.description,
            attachments: feedback?.attachments?.map((data, index) => {
              return {
                uri: data.path,
                type: data.mime,
                name: `image${index}.jpg`,
              };
            }),
            priority:
              formDropdown2.dropDownList[
                formDropdown2.dropDownList.findIndex(
                  (obj) => obj.id === feedback.priority
                )
              ]?.value,
            location: feedback.location,
            make_escalation: feedback.make_escalation.yes || false,
            start_date: feedback.start_date,
            end_date: feedback.end_date,
          },
        };
        console.log(postData, "PostData");
        let formData = serialize(postData);

        ticketCreate(formData)
          .then((data) => {
            navigate("SuccessPage", {
              title: `Your feedback successfully submited`,
              message: `  `,
              image: <FacilitySuccess />,
              navigateTo: "Home",
            });
          })
          .catch((err) => {
            const message = err[1].data ? err[1].data[0] : err[1]?.message;
            ToastMessage(err[0], message, err);
          });
      }
    }
  };

  const CheckBoxComponent = () => {
    return (
      <View style={{ paddingVertical: ms(7) }}>
        <View
          style={{
            flexDirection: "row",

            alignItems: "center",
          }}
        >
          <Note />
          <Text
            style={{
              color: themes[mode]["lightAsh"],
              fontFamily: fonts.regular,
              fontSize: 13,
              letterSpacing: 1,
              paddingVertical: ms(14),
              marginLeft: ms(7),
            }}
          >
            Make Escalation
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
          }}
        >
          <View style={{ flexDirection: "row", paddingRight: ms(10) }}>
            <CheckBox
              tintColors={{
                true: "#FFC727",
                false: themes[mode]["headingColor"],
              }}
              disabled={false}
              value={feedback.make_escalation.yes}
              onValueChange={(value) => {
                console.log(value, "from 1122 yes");
                setFeedBack({
                  ...feedback,
                  make_escalation: {
                    ...feedback.make_escalation,
                    yes: value,
                    no: !value,
                  },
                });
              }}
              boxType="square"
              onCheckColor="#FFC727"
              onTintColor="#FFC727"
              lineWidth={1.0}
              style={{
                width: ms(30),
                height: ms(20),
              }}
            />
            <Text
              style={{
                color: themes[mode]["headingColor"],
                fontSize: 13,
                alignSelf: "center",
                marginLeft: Platform.OS == "ios" ? 10 : 15,
              }}
            >
              Yes
            </Text>
          </View>
          <View style={{ flexDirection: "row", paddingHorizontal: ms(10) }}>
            <CheckBox
              tintColors={{
                true: "#FFC727",
                false: themes[mode]["headingColor"],
              }}
              disabled={false}
              value={feedback.make_escalation.no}
              onValueChange={(value) => {
                console.log(value, "from 1122 no");
                setFeedBack({
                  ...feedback,
                  make_escalation: {
                    ...feedback.make_escalation,
                    yes: !value,
                    no: value,
                  },
                });
              }}
              boxType="square"
              onCheckColor="#FFC727"
              onTintColor="#FFC727"
              lineWidth={1.0}
              style={{
                width: ms(30),
                height: ms(20),
              }}
            />
            <Text
              style={{
                color: themes[mode]["headingColor"],
                fontSize: 13,
                alignSelf: "center",
                marginLeft: Platform.OS == "ios" ? 10 : 15,
              }}
            >
              No
            </Text>
          </View>
        </View>

        <View
          style={{
            borderBottomColor: themes[mode]["borderColor"],
            borderWidth: 0.3,
            opacity: 0.4,
            marginTop: ms(13),
          }}
        />
        <View style={{}}>
          {false ? (
            <Text
              style={{
                fontFamily: fonts.regular,
                fontSize: 12,
                color: commonColors["error"],
                marginTop: 9,
              }}
            >
              This field is mandatory
            </Text>
          ) : null}
        </View>
      </View>
    );
  };
  console.log(error, "error form ");
  return (
    <SafeAreaView
      style={{
        flex: 1,
        height: "100%",
        backgroundColor: themes[mode]["bgColor"],
      }}
      forceInset={{ top: "never" }}
    >
      <WithBgHeader
        leftIcon
        headerTitle="FeedBack"
        containerStyle={{
          ...commonStyles.headerSpacing,
        }}
      >
        <View
          style={{
            paddingHorizontal: ms(10),
            flex: 1,
          }}
        >
          <ScrollView
            contentContainerStyle={{
              // marginHorizontal: 20,
              // flexGrow: 1,
              // paddingBottom: 200,
              // ...commonStyles.headerSpacing,
              marginHorizontal: 15,
            }}
            style={{
              height: "100%",
              // marginTop: '-58%',
            }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View>
              <BottomView
                {...formDropdown}
                onChange={(name, value) => {
                  console.log(value, categoriesList, "list veiew");
                  setFeedBack({ ...feedback, category: value });
                  const data =
                    categoriesList[
                      categoriesList.findIndex((obj) => obj.id === value)
                    ];
                  console.log(data, "feedFormCatergoriesList");
                  setIsAttachment(data?.enable_attachment_section);
                  setIsComment(data?.enable_comment_section);
                }}
              />

              <CustomTextField
                name={"title"}
                label={"Title"}
                value={feedback.title}
                onChange={(name, value) => {
                  setFeedBack({ ...feedback, title: value });
                }}
                onSubmitEditing={() => {}}
                keyboardType="default"
                icon={<Note />}
                error={error.title}
              />
              <CustomTextField
                name={"location"}
                label={"Location"}
                value={feedback.location}
                onChange={(name, value) => {
                  setFeedBack({ ...feedback, location: value });
                }}
                onSubmitEditing={() => {}}
                keyboardType="default"
                icon={<Note />}
              />
              <View style={{ marginVertical: 10 }}>
                <CustomDatePickerField
                  name="start_date"
                  minDate={new Date()}
                  // value={moment(dob).format('DD/MMM/YYYY')}
                  label="Start Date"
                  // showToday={false}
                  value={new Date()}
                  onChange={(name, value) => {
                    setFeedBack({
                      ...feedback,
                      start_date: value,
                    });
                  }}
                  error={error.start_date}
                  // showLabel
                  displayFormat={
                    Platform.OS === "android" ? "default" : "inline"
                  }
                />
              </View>
              <View style={{ marginVertical: 10 }}>
                <CustomDatePickerField
                  name="end_date"
                  minDate={new Date()}
                  // value={moment(dob).format('DD/MMM/YYYY')}
                  label="End Date"
                  // showToday={false}
                  value={new Date()}
                  onChange={(name, value) => {
                    setFeedBack({
                      ...feedback,
                      end_date: value,
                    });
                  }}
                  error={error.end_date}
                  // showLabel
                  displayFormat={
                    Platform.OS === "android" ? "default" : "inline"
                  }
                />
              </View>
              <CheckBoxComponent />
              <BottomView
                {...formDropdown2}
                onChange={(name, value) => {
                  setFeedBack({ ...feedback, priority: value });
                }}
              />
              {isComment && (
                <CustomTextArea
                  value={feedback.description}
                  handleChange={(name, value) => {
                    setFeedBack({ ...feedback, description: value });
                  }}
                  placeholder="Discribe your feedback"
                  error={""}
                  Color={true}
                />
              )}
              {isAttachement && (
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
                        console.log(name, "name customImage Picker");
                        if (name == "delete-image") {
                          setFeedBack({
                            ...feedback,
                            attachments: value,
                          });
                        } else {
                          setFeedBack({
                            ...feedback,
                            attachments: [...feedback.attachments, ...value],
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
            </View>
            <View style={{ paddingHorizontal: ms(10) }}>
              <CustomButton
                title={"Create Feedback"}
                handleSubmit={() => handleSubmit()}
                buttonStyle={{
                  backgroundColor: themes[mode]["primaryColor"],
                }}
              />
            </View>
          </ScrollView>
        </View>
      </WithBgHeader>
    </SafeAreaView>
  );
};

export default FeedbackForm;
