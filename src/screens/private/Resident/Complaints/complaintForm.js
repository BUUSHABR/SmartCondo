import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Keyboard,
  Alert,
  ScrollView,
} from "react-native";
import SafeAreaView from "react-native-safe-area-view";

import commonStyles from "../../../../styles/commonStyles";
import { CreateComplaintIcon, ErrorIcon } from "../../../../../assets/img/svgs";
import { themes, fonts } from "../../../../themes";

import {
  CustomSelect,
  SubmitButton,
  CustomTextField,
  WithBgHeader,
} from "../../../../components";
import FormHoc from "../../../../hoc/formHoc";
import { ms } from "../../../../helpers/scaling";

const ComplaintForm = ({}) => {
  return (
    <SafeAreaView
      style={{
        width: "100%",

        // backgroundColor: 'green',
      }}
      forceInset={{ top: "never" }}
    >
      {/* <FocusAwareStatusBar /> */}
      {/* <View style={{marginTop: '-5%'}}>
            <Header
              showLeftIcon
              leftIcon
              title="Create Complaint"
              showRightIcon
              onPressRight={() => {}}
              rightText="  "
            />
          </View> */}
      <WithBgHeader
        leftIcon
        headerTitle={"Create Request"}
        containerStyle={{
          ...commonStyles.headerSpacing,
        }}
      >
        <ScrollView
          contentContainerStyle={{
            ...commonStyles.headerSpacing,
            flexGrow: 1,
            paddingBottom: 150,
          }}
          style={{
            height: "100%",
            borderColor: "green",
            borderWidth: 1,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={{ alignSelf: "center" }}>
            <CreateComplaintIcon />
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
              onPress={() => navigation.navigate("ComplaintCategory")}
            >
              <View
                style={{
                  borderColor:
                    themes[mode][
                      complaint_type["error"].length > 2
                        ? "error"
                        : "primaryColor"
                    ],
                  borderBottomWidth: 2,
                  paddingBottom: 7,
                }}
              >
                <Text
                  style={{
                    fontFamily: fonts.semiBold,
                    fontSize:ms(20),
                    lineHeight: ms(22),
                    color: themes[mode]["primaryColor"],
                    // marginRight: 15,
                    paddingRight: 12,
                  }}
                >
                  {complaint_type["value"]
                    ? complaint_type["value"]
                    : "Category"}
                </Text>
              </View>

              <View
                style={{
                  paddingTop: 12.5,
                  paddingBottom: 9,
                  // marginBottom: 15,
                  borderColor:
                    themes[mode][
                      complaint_type["error"].length > 2
                        ? "error"
                        : "primaryColor"
                    ],
                  borderBottomWidth: 2,
                }}
              >
                <DropdownIcon color={themes[mode]["primaryColor"]} />
              </View>
            </TouchableOpacity>

            {/* <CustomSelect
                placeholder={{
                  label: 'Category',
                  value: null,
                }}
                name="gender"
                value={'parking'}
                items={[
                  {label: 'Parking', value: 'parking', key: 1},
                  {label: 'Electrical', value: 'electrical', key: 2},
                  {label: 'Maintenance', value: 'maintenance', key: 3},
                  {label: 'Cleaning', value: 'cleaning', key: 4},
                  {label: 'Entry/Exit', value: 'entryExit', key: 5},
                  {label: 'Lift', value: 'lift', key: 6},
                  {label: 'Security', value: 'security', key: 7},
                  {label: 'Personal', value: 'personal', key: 8},
                ]}
                borderColor={themes[mode]['primaryColor']}
                labelColor="primaryColor"
                borderBottomWidth={2}
                arrowColor="#FFC727"
                labelFontSize={18}
              /> */}
            <View
              style={{
                flexDirection: "row",
                marginTop: 5,
              }}
            >
              {complaint_type["error"].length > 2 ? <ErrorIcon /> : null}
              <Text
                style={{
                  fontFamily: fonts.regular,
                  fontSize: 12,
                  alignSelf: "flex-start",
                  marginLeft: 7,
                  color: themes[mode]["error"],
                }}
              >
                {complaint_type["error"].length > 2
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
              Please complete the form below to submit your {`\n`}help desk
            </Text>
            {/* <View style={{ marginTop: "0%", borderColor:"green",
          borderWidth:1 ,position:""}}> */}
            {/* <CustomTextField
                    name="subject"
                    label="Subject "
                    value={subject['value']}
                    keyboardType="default"
                    icon={<SubjectIcon />}
                    error={subject['error']}
                    onChange={handleChange}
                    onSubmitEditing={() => {
                      description.descriptionRef.current.textInput.focus();
                    }}
                  />
                  <CustomTextField
                    ref={description.descriptionRef}
                    name="description"
                    label="Detailed Description "
                    value={description['value']}
                    icon={<Note />}
                    keyboardType="default"
                    error={description['error']}
                    onChange={handleChange}
                    onSubmitEditing={() => Keyboard.dismiss()}
                  />
                </View>

                <TouchableOpacity
                  style={{
                    marginTop: 8,
                    marginLeft: 5,

                    width: '60%',
                  }}
                  onPress={selectFile}>
                  <Text
                    style={{
                      fontSize: 16,
                      lineHeight: 17,
                      fontFamily: fonts.bold,
                      textDecorationLine: 'underline',
                      color: themes[mode]['headingColor'],
                      paddingBottom: 1,
                    }}>
                    Browse file (max 10MB)
                  </Text>
                </TouchableOpacity>
                <View
                  style={{
                    marginLeft: 12,
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginVertical: 25,
                  }}>
                  {file.value ? <AttachmentIcon /> : null}
                  <Text
                    style={{
                      fontFamily: fonts.medium,
                      fontSize: 12,
                      letterSpacing: 0.5,
                      color: themes[mode]['headingColor'],
                      marginHorizontal: 7,
                      flexGrow: 1,
                    }}>
                    {file.value ? 'File selected' : ''}
                  </Text>
                  {file.value ? (
                    <TouchableOpacity
                      onPress={onCancelImage}
                      style={{
                        width: 19,
                        height: 19,
                        borderRadius: 6,
                        borderWidth: 1,
                        borderColor: themes[mode]['textColor'],
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <CrossIcon color={themes[mode]['textColor']} />
                    </TouchableOpacity>
                  ) : null} */}
            <View style={{ borderColor: "yellow" }}>
              <Eform
                data={dataSample}
                SubmitBtn={SubmitButton}
                buttonText={"Create"}
                disableBtn={submitted}
                handlesubmit={submitComplaint}
              />
            </View>
            {/* </View> */}
          </View>
        </ScrollView>
      </WithBgHeader>
    </SafeAreaView>
  );
};

export default FormHoc()(ComplaintForm);
