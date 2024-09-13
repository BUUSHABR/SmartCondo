import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  useEffect,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  Button,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  TextInput,
  TouchableNativeFeedback,
} from "react-native-gesture-handler";
import { themes, fonts, commonColors } from "../themes";
import { detectTheme } from "../helpers";
// import {
//   ArrowDown,
//   CloseSwitch,
//   CloseVCBottom,
//   ContractorType,
//   DropDownNotify,
//   ErrorIcon,
//   NoNotify,
//   SearchIcon,
//   SwitchTick,
//   SwitchTick1,
//   TickIcon,
// } from "../../assets/img/svgs";
import { useDispatch } from "react-redux";
import { onComplaintsChange } from "../redux/actions/complaint";
import { ServerContainer } from "@react-navigation/native";
import ActionSheet, {
  useScrollHandlers,
  ActionSheetRef,
  SheetProps,
} from "react-native-actions-sheet";
import { facility, login, notification } from "../redux/actions";
// import { switchUnit, listUnits } from "../redux/actions/switch_unit";
import { listUnits, switchUnit } from "../redux/actions/switch_unit";
import { connect } from "react-redux";
// import { ApartmentIcon } from "../../assets/img/svgs";
import { navigate } from "../navigation/RootNavigation";
import {
  ApartmentIcon,
  CloseSwitch,
  CountIconNew,
  ErrorIcon,
  SwitchTick1,
  VehicleTypeIcon,
} from "../../assets/img/svgs";
import CustomButton from "./CustomButton";
import CustomImagePicker from "./CustomImagePicker";
import CustomSelect from "./CustomSelect";
import { SvgXml } from "react-native-svg";
import { ms } from "../helpers/scaling";
import CustomTextField from "./CustomTextField";
import Spinner from "react-native-loading-spinner-overlay";

const AttachmentBottomView = (props) => {
  const [show, setShow] = useState("dropdown");
  const [dropDownValue, setDropDownValue] = useState("");
  // console.log(props, "11p");
  const [remarks, setRemarks] = useState("");
  const { modal } = props;
  const [formData, setData] = useState({
    attachments: false,
    error: "",
  });
  const [formDeposite, setDeposite] = useState({
    attachments: false,
    error: "",
  });
  let isDeposit = props.deposit_mode == "deposit" ? true : false;

  useEffect(() => {
    // actionSheetRef.current?.show();
    if (modal) {
      handleClose(0, true);
    } else {
      handleClose(0, false);
    }
  }, [modal]);
  const handleChange = (name, value, flow) => {
    console.log(name, value, "khdvejd");

    if (flow == "payment") {
      if (name == "delete-image") {
        setData({
          ...formData,
          ["attachments"]: false,
        });
      } else {
        setData({
          ...formData,
          [name == "image-picker" ? "attachments" : name]:
            name == "image-picker"
              ? [{ uri: value.path, type: value.mime, name: "image.jpg" }]
              : value,
          error: "",
        });
      }
    }
    if (flow == "deposite") {
      if (name == "delete-image") {
        setDeposite({
          ...formDeposite,
          ["attachments"]: false,
        });
      } else {
        setDeposite({
          ...formDeposite,
          [name == "image-picker" ? "attachments" : name]:
            name == "image-picker"
              ? [{ uri: value.path, type: value.mime, name: "image.jpg" }]
              : value,
          error: "",
        });
      }
    }

    console.log(formData, "dwoidhw");
  };
  const actionSheetRef = useRef(null);
  const bottomSheetRef = useRef(null);
  const scrollHandlers = useScrollHandlers("scrollview-1", actionSheetRef);
  const formField = {
    id: 14,
    type: "image-picker",
    name: "Image Picker",
    label: "Image Picker",
    value: formData.attachments,
    keyboardType: "numeric",
    multiselect: false,
    required: false,
    error: "",
  };
  const formField2 = {
    id: 15,
    type: "image-picker",
    name: "Image Picker",
    label: "Image Picker",
    value: formDeposite.attachments,
    keyboardType: "numeric",
    multiselect: false,
    required: false,
    error: "",
  };
  const snapPoints = useMemo(() => ["50%"], []);
  const mode = detectTheme();
  const handleClose = useCallback((index, decide) => {
    if (decide) {
      actionSheetRef.current?.show();
    } else {
      actionSheetRef.current?.hide();
    }
  }, []);

  const onSubmit = () => {
    if (dropDownValue == "attachment_with_bill") {
      console.log(
        "sucesss",
        formData.attachments[0],
        props.facility.facilityId
      );
      if (
        isDeposit
          ? formData.attachments[0]?.uri && formDeposite.attachments[0]?.uri
          : formData.attachments[0]?.uri || formDeposite.attachments[0]?.uri
      ) {
        console.log(
          "sucesss",
          props.id,
          props.approval,
          formDeposite.attachments[0],
          "98338383"
        );
        setData({ ...formData, error: "" });
        const reset = () => {
          [
            "start_date",
            "start_time",
            "end_time",
            "comment",
            "accompanied",
          ]?.map((item) => {
            console.log("event listner logging 1");
            props.facilityValidation({
              name: item,
              value: item === "start_date" ? new Date() : "",
              error: "",
              stateChange: false,
            });
          });
          props.facilityValidation({
            name: "fixed_amount",
            value: 0,
          });
          props.facilityValidation({
            name: "amount",
            value: 0,
          });
          facilityValidation({
            name: "deposit_amount",
            value: 0,
          });
          props.facilityValidation({
            name: "rule_ids",
            value: [],
          });
          props.facilityValidation({
            name: "SlotStore",
            value: [],
          });
        };
        props.facilitySubmit(
          props.facility.facilityId,
          props.approval,
          formData.attachments[0],
          props.slot,
          formDeposite.attachments[0],
          reset
        );

        // props.submitControl({ submitted: false });
        props.onClose();
      } else {
        console.log("sucesss bad");

        !formData.attachments[0]?.uri &&
          setData({ ...formData, error: "This field is required" });

        !formDeposite.attachments[0]?.uri &&
          setDeposite({ ...formDeposite, error: "This field is required" });
      }
    } else {
      props.onFacilityDataChange({
        name: "remarks",
        value: remarks,
      });
      props.facilitySubmit(
        props.facility.facilityId,
        props.approval,
        false,
        props.slot
      );
      props.onClose();
    }
  };
  const showError = formData.error?.length > 5;
  const showError1 = formDeposite.error?.length > 5;
  const {
    payment_mode,
    client_key,
    country_code,
    environment,
    currency,
    merchant_account_name,
    amount,
    id,
  } = props;
  console.log(
    payment_mode,
    client_key,
    country_code,
    environment,
    currency,
    merchant_account_name,
    amount,
    id,
    "1234567890098765432123456789"
  );
  console.log(props.submitted, "loading attachmentBottom view");
  let previewImages = isDeposit
    ? [
        { uri: formData.attachments[0]?.uri },
        { uri: formDeposite.attachments[0]?.uri },
      ]
    : [{ uri: formData.attachments[0]?.uri }];
  return (
    <View style={[styles.container]}>
      <ActionSheet
        ref={actionSheetRef}
        gestureEnabled={true}
        onClose={() => {
          props.onClose();
        }}
        containerStyle={{
          backgroundColor: themes[mode]["bgColor"],
        }}
      >
        <ScrollView {...scrollHandlers} nestedScrollEnabled={true}>
          {true && (
            <View>
              <View style={{ paddingHorizontal: ms(20), paddingTop: ms(25) }}>
                <CustomSelect
                  placeholder={{
                    label: "Select Payment Type",
                    value: "",
                  }}
                  name="PaymentType"
                  value={dropDownValue}
                  label={"Offline Payment Type"}
                  items={[
                    {
                      label: "Attach Bill",
                      value: "attachment_with_bill",
                      key: 1,
                    },
                    { label: "Cash", value: "cash", key: 2 },
                    { label: "Cheque", value: "cheque", key: 3 },
                    { label: "Card", value: "card", key: 4 },
                    { label: "Others", value: "others", key: 5 },
                  ]}
                  onValueChange={(name, value) => {
                    console.log(name, value, "Custom select Payment DropDown");
                    setDropDownValue(value);
                    setShow(value);
                    setRemarks("");
                    setDeposite({ attachments: false, error: "" });
                    setData({ attachments: false, error: "" });
                    props.onFacilityDataChange({
                      name: "payment_type",
                      value: value,
                    });
                  }}
                  leftIcon={
                    <SvgXml
                      xml={VehicleTypeIcon(commonColors.lightAsh1)}
                      width={19}
                      height={14}
                    />
                  }
                  error={""}
                />
              </View>
            </View>
          )}
          {show == "attachment_with_bill" && (
            <View>
              <View>
                <Text
                  style={{
                    alignSelf: "center",
                    fontFamily: fonts.semiBold,
                    fontSize: 17,
                  }}
                >
                  Attach Bill
                </Text>
                <View
                  style={{
                    marginTop: "5%",
                    paddingHorizontal: 30,
                    flexDirection: "row",
                    width: "100%",
                    justifyContent: "space-evenly",
                  }}
                >
                  <View>
                    <CustomImagePicker
                      key={0}
                      {...formField}
                      onChange={(name, value) =>
                        handleChange(name, value, "payment")
                      }
                      isDeposit={isDeposit}
                      name={"payment image"}
                    />
                    {showError && (
                      <View
                        style={{
                          flexDirection: "row",
                          marginTop: -25,
                          marginBottom: 20,
                        }}
                      >
                        <ErrorIcon />
                        <Text
                          style={{
                            ...styles.error,
                            color: themes[mode]["error"],
                          }}
                        >
                          {formData.error}
                        </Text>
                      </View>
                    )}
                  </View>

                  <View>
                    {isDeposit && (
                      <>
                        <CustomImagePicker
                          key={0}
                          {...formField2}
                          onChange={(name, value) =>
                            handleChange(name, value, "deposite")
                          }
                          isDeposit={isDeposit}
                          name={"deposite image"}
                        />
                        {showError1 && (
                          <View
                            style={{
                              flexDirection: "row",
                              marginTop: -25,
                              marginBottom: 20,
                            }}
                          >
                            <ErrorIcon />
                            <Text
                              style={{
                                ...styles.error,
                                color: themes[mode]["error"],
                              }}
                            >
                              {formDeposite.error}
                            </Text>
                          </View>
                        )}
                      </>
                    )}
                  </View>
                </View>
                <View
                  style={{
                    width: "100%",
                    justifyContent: "space-between",
                    flexDirection: "row",
                    paddingHorizontal: 20,
                  }}
                >
                  <CustomButton
                    title={"Preview"}
                    buttonStyle={{
                      ...styles.buttonStyle,
                      width: 150,
                    }}
                    textStyle={{
                      color: themes[mode]["headingColor"],
                    }}
                    handleSubmit={async () => {
                      console.log(
                        formData.attachments?.uri,
                        "edkjed76890iehfdefefef"
                      );
                      if (formData.attachments[0]?.uri) {
                        await props.onClose();
                        setTimeout(() => {
                          navigate("ImageViewer", {
                            data: previewImages,
                            attachment: true,
                            payment_mode,
                            client_key,
                            country_code,
                            environment,
                            currency,
                            merchant_account_name,
                            amount,
                            id,
                            deposit_mode: props.deposit_mode,
                            approval: props.approval,
                          });
                        }, 300);
                      }
                    }}
                  />
                  <CustomButton
                    title="Submit"
                    buttonStyle={{
                      ...styles.buttonStyle,
                      backgroundColor: themes[mode]["primaryColor"],
                      width:
                        dropDownValue == "attachment_with_bill" ? 150 : "90%",
                      alignSelf:
                        dropDownValue == "attachment_with_bill"
                          ? "flex-end"
                          : "center",
                    }}
                    textStyle={{
                      color: commonColors.darkWhite,
                    }}
                    handleSubmit={onSubmit}
                  />
                </View>
              </View>
            </View>
          )}

          {["card", "cheque", "cash", "others"].includes(show) && (
            <View style={{ paddingHorizontal: ms(20) }}>
              <CustomTextField
                autoCap={true}
                name="remarks"
                label={"Remarks"}
                value={remarks}
                onChange={(name, value) => {
                  setRemarks(value);
                }}
                keyboardType="default"
                icon={
                  <SvgXml
                    xml={CountIconNew(commonColors.lightAsh1)}
                    width={14}
                    height={15}
                  />
                }
                error={""}
              />
            </View>
          )}
          {dropDownValue != "" && dropDownValue != "attachment_with_bill" && (
            <CustomButton
              title="Submit"
              buttonStyle={{
                ...styles.buttonStyle,
                backgroundColor: themes[mode]["primaryColor"],
                width: dropDownValue == "attachment_with_bill" ? 150 : "90%",
                alignSelf:
                  dropDownValue == "attachment_with_bill"
                    ? "flex-end"
                    : "center",
              }}
              textStyle={{
                color: commonColors.darkWhite,
              }}
              handleSubmit={onSubmit}
            />
          )}
        </ScrollView>
      </ActionSheet>
      <Spinner
        visible={props.submitted}
        textContent={"Please Wait..."}
        textStyle={{ color: "#FFF" }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 24,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
  searchSection: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f6f6f6",
    borderRadius: 10,
    paddingHorizontal: 20,
    marginHorizontal: 20,
  },
  searchIcon: {
    padding: 10,
  },
  input: {
    flex: 1,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 0,
    backgroundColor: "#f6f6f6",
    color: "#424242",
    borderRadius: 10,
    marginLeft: 15,
  },
  error: {
    fontFamily: fonts.regular,
    fontSize: 12,
    alignSelf: "flex-start",
    marginLeft: 7,
  },
  modalContainer: {
    width: "100%",
    // position: "absolute",
    // height: 500,
    bottom: 0,
    // borderTopLeftRadius: 30,
    // borderTopRightRadius: 30,
    // borderBottomLeftRadius: 8,
    // borderBottomRightRadius: 8,
    elevation: 30,
    zIndex: 12,
  },
  align: {
    width: 80,
    alignSelf: "flex-end",
    marginHorizontal: 20,
    marginVertical: 15,
  },
  filterWrap: {
    marginVertical: 20,
    marginHorizontal: 25,
  },
  filterText: {
    fontFamily: fonts.bold,
    fontSize: 16,
    letterSpacing: 0.5,
    marginBottom: 15,
  },
  section1: { marginVertical: 10 },
  flexAlign: { flexDirection: "row", alignItems: "center" },
  checkBox: {
    width: 19,
    height: 19,
    borderRadius: 7,
    borderWidth: 1.5,
    justifyContent: "center",
    alignItems: "center",
  },
  checkBoxSmall: {
    width: 15,
    height: 15,
    borderRadius: 6,
    borderWidth: 1.5,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontFamily: fonts.medium,
    fontSize: 14,
    letterSpacing: 0.3,
  },
  dateAlign: {
    marginVertical: 20,
    marginHorizontal: 15,
    flexDirection: "row",
  },
  dateBox: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginLeft: 10,
  },
  dateText: {
    fontFamily: fonts.light,
    fontSize: 12,
    letterSpacing: 0.4,
    marginLeft: 10,
  },
  buttonStyle: {
    borderRadius: 5,
    alignSelf: "flex-end",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 15,
    borderWidth: 1,
  },
  buttonTextStyle: {
    fontFamily: fonts.medium,
    fontSize: 14,
    marginVertical: 5,
    marginBottom: 7,
    marginHorizontal: 20,
  },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: themes["light"]["harp"],
    justifyContent: "center",
    alignItems: "center",
  },
});
const mapStateToProps = ({
  profile: { mode, userData },
  facility,
  switchUnit: { units, current_condo, current_unit, switchLoader },
  login: { submitted },
}) => {
  return {
    mode,
    userData,
    units,
    facility,
    switchLoader,
    submitted,
  };
};
const { listNotification } = notification;
const { facilitySubmit, facilityValidation, onFacilityDataChange } = facility;
const { submitControl } = login;

const mapDispatchToProps = {
  listUnits,
  switchUnit,
  listNotification,
  facilitySubmit,
  facilityValidation,
  onFacilityDataChange,
  submitControl,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AttachmentBottomView);
