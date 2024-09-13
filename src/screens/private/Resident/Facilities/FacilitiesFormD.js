import React, { Component } from "react";
import {
  View,
  Text,
  Keyboard,
  StyleSheet,
  ScrollView,
  Dimensions,
  FlatList,
  Platform,
  Alert,

  // TouchableOpacity,
  // TouchableOpacity
} from "react-native";
import moment from "moment";
import { connect } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as RootNavigation from "../../../../navigation/RootNavigation";
import { FocusAwareStatusBar } from "../../../../navigation/RootNavigation";
import SafeAreaView from "react-native-safe-area-view";
import { TouchableOpacity } from "react-native-gesture-handler";
import CheckBox from "@react-native-community/checkbox";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import ImagePicker from "react-native-image-crop-picker";

import { themes, commonColors, fonts } from "../../../../themes";
import {
  profile,
  facility,
  registration,
  login,
} from "../../../../redux/actions";
import { Header } from "../../../../components/Header";
import {
  CustomTimePicker,
  CustomDatePicker,
  FacilityTypes,
  SubmitButton,
  CustomTextField,
  WithBgHeader,
  TypeSelect,
  ToastMessage,
} from "../../../../components";
import FacilityFormData from "../../Resident/Facilities/facility_form_data.json";
import {
  CalendarIcon,
  CalendarIconBig,
  Note,
  NoteIconSmall,
  FacilityTimeSlotIcon,
  ArrowRight,
  OccupationIcon,
} from "../../../../../assets/img/svgs";
import commonStyles from "../../../../styles/commonStyles";
import {
  convertToLocalTimeFormat,
  convertToTimeFormat,
  timeDiff,
  joinDateTime,
  convertToLocalDateFormat,
  generateSubsequentDates,
} from "../../../../helpers";
import Animated from "react-native-reanimated";
import { customAnimation } from "../../../../animation/CommonAnimation";
import { FacilityPaymentConfig } from "../../../../api/facility_booking";
import { fetchConfigs } from "../../../../api/home";
import { ms, vs } from "../../../../helpers/scaling";
import { styles } from "react-native-floating-label-input/src/styles";
import Spinner from "react-native-loading-spinner-overlay";
import FacilityTimeSlot from "./facilityTimeSlot";
import FacilityTimeSlotD from "./facilityTimeSlotD";

class FacilitiesForm extends Component {
  constructor(props) {
    super(props);
    (this.slots = []),
      (this.state = {
        active: false,
        isError: false,
        showFacilityTimeSlot: false,
      });
  }
  componentDidMount() {
    // const {
    //   navigation,
    //   phone,
    //   facilityChange,
    //   facilityValidation,
    //   facility: { facilitiesTypesList },
    //   submitControl,
    // } = this.props;
    // console.log("did mount called ");
    // const {
    //   facilitiesBookingData
    // } = this.props?.facility;
    // this.focusListener = navigation.addListener('blur', () => {
    //   console.log(facilitiesBookingData,"before event lisner calling");
    //   ['start_date', 'start_time', 'end_time', 'comment', 'accompanied']?.map(item => {
    //     console.log("event listner logging 1");
    //     facilityValidation({
    //       name: item,
    //       value: facilitiesBookingData[item].value,
    //       error: facilitiesBookingData[item].error,
    //       stateChange: false,
    //     });
    //   });
    //   submitControl({ submitted: false });
    // });

    console.log("rendering facility form");
    const { facility } = this.props;
    const {
      facilitiesBookingData: { start_date },
    } = facility;
    const {
      id,
      deposit_amount,
      payment_method,
      deposit_mode,
    } = this.props?.route?.params;
    this.slotsGenerate(start_date.value);
    console.log(id, "facility id");
    this.props.facilityChange({
      name: "facilityId",
      value: id,
    });
    payment_method == "paid" && deposit_mode == "deposit";
    this.props.onFacilityDataChange({
      name: "deposit_amount",
      value:
        payment_method == "paid" && deposit_mode == "deposit"
          ? deposit_amount
          : 0,
    });
  }
  slotsGenerate = async (date) => {
    const { id, isQuota } = this.props?.route?.params;

    await this.props.FacilitySlotBookingsDetails(
      id,
      moment(date).format("DD-MM-yyyy")
    );
    setTimeout(async () => {
      const isHoliday = this.props.facility?.slotDetails
        ?.today_is_public_holiday;
      console.log(this.props.facility?.slotDetails, "today_is_public_holiday");
      const current_day = moment(date)
        .format("dddd")
        .toLowerCase();
      console.log(JSON.stringify(this.props?.route?.params), "slotsgenerated");
      const {
        facility_settings: { active_slots },
      } = this.props?.route?.params;
      console.log(current_day, "current_day slots Genereted", active_slots);
      const Slots = await this.getKeyByValue(
        active_slots,
        isHoliday ? "public_holiday" : current_day
      );
      console.log(Slots, "slots Genereted");
      this.slots = Slots;
      this.props.facilityChange({
        name: "slots",
        value: Slots,
      });
      this.props.onFacilityDataChange({
        name: "amount_type",
        value: this.props?.route?.params?.facility_settings?.amount_type,
      });
      this.props.onFacilityDataChange({
        name: "fixed_amount",
        value: this.props?.route?.params?.facility_settings?.fixed_amount,
      });
      this.props.onFacilityDataChange({
        name: "payment_method",
        value: this.props?.route?.params?.payment_method,
      });
    }, 1000);
  };

  getKeyByValue = (object, value) => {
    console.log(value, "iiiiiiii");
    const matchedKey = Object.keys(object).find((key) => key === value);
    let modifiedArray = [];
    console.log(matchedKey, "mathced key slots Genereted");
    if (matchedKey) {
      modifiedArray = object[matchedKey]?.map((obj, index) => {
        return {
          ...obj,
          disable: obj?.status == "active" ? false : true,
          amount: obj?.custom_amount,
          id: index,
          slotid: obj?.id,
        };
      });
    } else {
      return [];
    }
    console.log(modifiedArray, "modifiedArray  slots Genereted");

    return modifiedArray != undefined ? modifiedArray : [];
  };

  handleQuestionChange = (value, index, type, prev) => {
    console.log("enters handleQuestionChange", value, index, type, prev);
    this.props.onFacilityQuestionChange({ value, index, type, prev });
  };
  handleInputChange = (name, value) => {
    console.log(name, value, "namehandleInPUT changeee");
    var data = value;
    if (name == "start_date") {
      var data = moment.utc(value).format();
      this.slotsGenerate(data);

      console.log(data, "ios modify validation");
    }
    const {
      facilitySubmit,
      facilityValidation,
      onFacilityDataChange,
    } = this.props;
    if (name === "start_date" || name === "start_time" || name === "end_time") {
      console.log("start date called ");
      console.log("logging start date on facility on change");
      onFacilityDataChange({
        name,
        value: data,
        stateChange: true,
      });
      onFacilityDataChange({
        name: "start_time",
        value: "",
        stateChange: false,
      });
      onFacilityDataChange({
        name: "end_time",
        value: "",
        stateChange: false,
      });
      onFacilityDataChange({
        name: "amount",
        value: 0,
      });
      onFacilityDataChange({
        name: "SlotStore",
        value: [],
      });
    } else {
      onFacilityDataChange({
        name,
        value: data,
        stateChange: false,
      });
    }

    facilityValidation({
      name: name,
      value: data,
      error: "",
      stateChange: true,
    });
  };
  selectTimeSlot = (click) => {
    const {
      navigation,
      facilityValidation,
      facility: { facilitiesTypesList, facilityId },
      facilityChange,
    } = this.props;
    const {
      open_time,
      close_time,
      max_duration,
      splited_hours,
      slot,
      deposit_amount,
      slots,
      max_booking,
      no_non_peak,
      no_peak,
      facility_settings: { amount_type, fixed_amount },
      payment_method,
      isPeak,
      isNonPeak,
      isQuota,
      isDefaultTime,
      minutes,
      minutesType,
    } = this.props?.route?.params;
    const {
      facilitiesBookingData: { start_date, start_time, end_time },
      facilitiesBookingData,
    } = this.props?.facility;
    if (click == "clicked") {
      this.focusListener = navigation.addListener("blur", () => {
        console.log(facilitiesBookingData, "before event lisner calling");
        if (!this.state.active) {
          [
            "start_date",
            "start_time",
            "end_time",
            "comment",
            "accompanied",
          ]?.map((item) => {
            console.log("event listner logging 122333");
            facilityValidation({
              name: item,
              value: facilitiesBookingData[item].value,
              error: facilitiesBookingData[item].error,
              stateChange: item == "start_date" ? true : false,
            });
          });
          submitControl({ submitted: false });
        }
      });
    }

    this.focusListener = navigation.addListener("focus", () => {
      console.log("event listner logging 2");
      facilityChange({
        name: "facilities_type",
        value: facilitiesTypesList.filter((item) => {
          return item.name;
        }),
      });
    });
    // let err=false
    // if (!facilitiesBookingData['start_date'].stateChange) {
    //   // console.log("entrtrd", item);
    //   err = true;
    //   facilityValidation({
    //     name: 'start_date',
    //     value: facilitiesBookingData['start_date'].value,
    //     error: 'This field is mandatory',
    //     stateChange: true,
    //   });
    // }
    console.log(
      "start madifired jsjlslslslkslsls",
      slots,
      this.slots,
      facilityId
    );

    (!this.props.facility.loader || isQuota) &&
      // navigation.navigate("FacilityTimeSlot", {
      //   open_time,
      //   close_time,
      //   max_duration,
      //   start_date,
      //   splited_hours,
      //   slots: this.slots,
      //   max_booking,
      //   no_non_peak,
      //   no_peak,
      //   facilityId,
      //   amount_type,
      //   fixed_amount,
      //   payment_method,
      //   isPeak,
      //   isNonPeak,
      //   isQuota,
      //   isDefaultTime,
      //   minutes,
      //   minutesType,
      // });
      console.log("dde2",this?.props?.route?.params,this.slots)
      this.setState({ showFacilityTimeSlot: !this.state.showFacilityTimeSlot });
  };
  handleChange = ({ name, value, navigate }) => {
    console.log(name, value, "subvisitor changee");
    this.props.inviteChange({ name, value });

    navigate && this.props.navigation.goBack();
  };
  handleQuestions = ({ item }) => {
    let err = false;
    console.log(item, "handleQuestions");
    const { questions } = this.props?.facility.facilitiesBookingData;
    const index = questions.value?.findIndex(
      (obj) => obj.facility_question_id === item.id
    );
    console.log(index, "question index");
    if (typeof questions.value[index]?.answer === "string") {
      if (questions.value[index]?.answer.length == 0) {
        err = true;
      } else {
        err = false;
      }
    } else {
      if (
        questions.value[index]?.answer.yes == false &&
        questions.value[index]?.answer.no == false
      ) {
        err = true;
      } else {
        err = false;
      }
    }
    if (item.question_type == "text") {
      return (
        <View style={{ marginTop: "0%" }}>
          <CustomTextField
            name={item.question}
            label={item.question}
            value={questions.value[index]?.answer}
            onChange={(name, value) =>
              value.length < 100 &&
              this.handleQuestionChange(
                value,
                questions.value[index].facility_question_id,
                "text",
                questions.value[index]?.answer
              )
            }
            onSubmitEditing={() => { }}
            keyboardType="default"
            icon={<Note />}
          />
          <View style={{ height: 18, marginTop: -9 }}>
            {this.state.isError && err ? (
              <Text
                style={{
                  fontFamily: fonts.regular,
                  fontSize: 12,
                  color: commonColors["error"],
                }}
              >
                This field is mandatory
              </Text>
            ) : null}
          </View>
        </View>
      );
    } else {
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
                color: themes[this.props.mode]["lightAsh"],
                fontFamily: fonts.regular,
                fontSize: 13,
                letterSpacing: 1,
                paddingVertical: ms(14),
                marginLeft: ms(7),
              }}
            >
              {item.question}
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
                  false: themes[this.props.mode]["headingColor"],
                }}
                disabled={false}
                value={questions.value[index]?.answer?.yes}
                onValueChange={(value) =>
                  this.handleQuestionChange(
                    value,
                    questions.value[index].facility_question_id,
                    "yes",
                    questions.value[index]?.answer?.yes
                  )
                }
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
                  ...styles.subscribe_name,
                  color: themes[this.props.mode]["headingColor"],
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
                  false: themes[this.props.mode]["headingColor"],
                }}
                disabled={false}
                value={questions.value[index]?.answer?.no}
                onValueChange={(value) =>
                  this.handleQuestionChange(
                    value,
                    questions.value[index].facility_question_id,
                    "no",
                    questions.value[index]?.answer?.no
                  )
                }
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
                  ...styles.subscribe_name,
                  color: themes[this.props.mode]["headingColor"],
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
              borderBottomColor: themes[this.props.mode]["borderColor"],
              borderWidth: 0.3,
              opacity: 0.4,
              marginTop: ms(13),
            }}
          />
          <View style={{}}>
            {this.state.isError && err ? (
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
    }
  };
  handleSubmit = async () => {
    let Error = [];
    Keyboard.dismiss();
    // submitControl({ submitted: false })

    const { facilityValidation, submitControl } = this.props;
    const {
      facilityId,
      facilitiesBookingData: { start_date, start_time, end_time },
      facilitiesBookingData,
    } = this.props?.facility;
    const { questions } = this.props?.facility.facilitiesBookingData;

    console.log(facilitiesBookingData, "feljfelhfkjewqhbekhbewhf");
    const {
      open_time,
      close_time,
      id,
      approval,
      slot,
      payment_method,
      payment_mode,
      amount,
      deposit_mode,
      facility_settings: { amount_type, fixed_amount, status },
      enable_questions,
    } = this.props?.route?.params;
    let err = false;
    let slotTime = (time) => {
      return moment(time, "HH:mm a").format("hh:mm A");
    };
    if (status != "inactive") {
      let arr = ["start_date", "start_time"];
      arr?.map((item) => {
        console.log(item);
        if (
          !facilitiesBookingData[item].stateChange ||
          facilitiesBookingData[item].value == undefined
        ) {
          console.log("entldlwdlwdrtrd", facilitiesBookingData[item]);
          err = true;
          Error.push(true);
          facilityValidation({
            name: item,
            value: facilitiesBookingData[item].value,
            error: "This field is mandatory",
            stateChange: false,
          });
        }
      });
    }
    if (enable_questions) {
      console.log("98u329830232932");
      questions.value?.map((data) => {
        console.log(
          data?.answer,
          typeof data?.answer,
          "handleSubmit questions validation"
        );
        if (typeof data?.answer === "string") {
          if (data?.answer.length == 0) {
            Error.push(true);
            // this.setState({ isError: true });
          } else {
            Error.push(false);
            // this.setState({ isError: false });
          }
        } else {
          if (data?.answer.yes == false && data?.answer.no == false) {
            Error.push(true);
            // this.setState({ isError: true });
          } else {
            Error.push(false);
            // this.setState({ isError: false });
          }
        }
      });
      if (Error.includes(true)) {
        err = true;
        this.setState({ isError: true });
      } else {
        err = false;
        this.setState({ isError: false });
      }
    }
    console.log(!err, "HandleSubmit conditions");
    if (!err) {
      if (payment_method == "paid") {
        submitControl({ submitted: true });
        console.log("entered gateway config");
        fetchConfigs()
          .then(({ data }) => {
            console.log(data, "72672762762");
            const { attachment, gateway } = payment_mode;
            console.log(attachment, gateway, "09302930192019212");
            let payment_define = "";
            if (attachment && gateway) {
              payment_define = "both";
            } else {
              if (attachment) {
                payment_define = "attachment";
              }
              if (gateway) {
                payment_define = "gateway";
              }
            }
            const payment_methods = data?.payment_config
              ?.enable_payement_gateway
              ? payment_define
              : "attachment";
            console.log(payment_mode, "09876543234567890-");
            this.setState({ active: true });
            console.log(facilityId, "dkkkdkkkkdkkkkqwe");
            submitControl({ submitted: false });

            RootNavigation.navigate("FacilityPayment", {
              id: facilityId,
              approval: approval,
              slot: status == "active" ? "enable" : "disable",
              payment_mode: payment_methods,
              client_key: "",
              country_code: "",
              environment: "",
              currency: "",
              merchant_account_name: "",
              amount: "",
              deposit_mode,
              payment_mode_type: payment_mode,
            });
          })
          .catch((err) => {
            ToastMessage(err[0], err[1]?.message, err);
          });
      } else {
        RootNavigation.navigate("FacilityPayment", {
          id: facilityId,
          approval: approval,
          slot: status == "active" ? "enable" : "disable",
          payment_mode: payment_method,
          client_key: "",
          country_code: "",
          environment: "",
          currency: "",
          merchant_account_name: "",
          amount: "",
          deposit_mode,
          payment_mode_type: "",
        });
        console.log(facilityId, approval, status)

        // await this.props.facilitySubmit(
        //   facilityId,
        //   approval,
        //   false,
        //   status == "active" ? "enable" : "disable"
        // );
        // this.gobackReset("clicked");
      }
    }
  };
  onCancelImage = () => { };
  selectFile = () => {
    const { handleInputChange } = this;
    Alert.alert("", "You can select pictures from here", [
      {
        text: "Cancel",
        onPress: () => { },
        style: "cancel",
      },
      {
        text: "Gallery",
        onPress: () => {
          ImagePicker.openPicker({
            cropping: true,
            freeStyleCropEnabled: true,
            mediaType: "photo",
            multiple: true,
            compressImageQuality: 0.5,
          }).then((image) => {
            console.log(image, "select gal img");
            handleInputChange("file", image);
          });
        },
      },
      {
        text: "Camera",
        onPress: () => {
          ImagePicker.openCamera({
            width: 300,
            height: 400,
            mediaType: "photo",
            cropping: true,
            multiple: true,
            compressImageQuality: 0.5,
            freeStyleCropEnabled: true,
          }).then((image) => {
            console.log(image, "cma img");
            handleInputChange("file", image);
          });
        },
      },
    ]);
  };
  gobackReset = (click) => {
    const {
      navigation,
      phone,
      facilityChange,
      facilityValidation,
      facility: { facilitiesTypesList },
      submitControl,
    } = this.props;
    console.log("did mount called ");
    const { facilitiesBookingData } = this.props?.facility;
    this.focusListener = navigation.addListener("blur", () => {
      console.log(facilitiesBookingData, "before event lisner calling");

      [
        "start_date",
        "start_time",
        "end_time",
        "comment",
        "accompanied",
        "amount_type",
        "payment_method",
      ]?.map((item) => {
        console.log("event listner logging 1");
        facilityValidation({
          name: item,
          value: item === "start_date" ? new Date() : "",
          error: "",
          stateChange: false,
        });
      });
      facilityValidation({
        name: "fixed_amount",
        value: 0,
      });
      facilityValidation({
        name: "amount",
        value: 0,
      });
      facilityValidation({
        name: "deposit_amount",
        value: 0,
      });
      facilityValidation({
        name: "rule_ids",
        value: [],
      });
      facilityValidation({
        name: "SlotStore",
        value: [],
      });
      facilityValidation({
        name: "questions",
        value: [],
      });
      submitControl({ submitted: false });
    });

    this.focusListener = navigation.addListener("focus", () => {
      console.log("event listner logging 2");
      facilityChange({
        name: "facilities_type",
        value: facilitiesTypesList.filter((item) => {
          return item.name;
        }),
      });
    });
  };
  componentWillUnmount() {
    // this.props?.route?.params?.payment_method != "paid" &&
    // this.gobackReset("clicked");
  }


  render() {
    let {
      id,
      name,
      open_time,
      close_time,
      time_slot,
      payment_method,

      slot,
      deposit_mode,
      deposit_amount,
      facility_settings: { amount_type, fixed_amount, status },
      advanceBookingDate,
      enable_questions,
      questions,
    } = this.props?.route?.params;

    const {
      mode,
      submitted,
      facility,
      onFacilityDataChange,
      facilitySubmit,
    } = this.props;
    const {
      facility_type,
      facilitiesBookingData: {
        start_time,
        end_time,
        comment,
        start_date,
        court,
        accompanied,
        file,
        amount,
      },
    } = facility;
    const data = FacilityFormData;
    console.log(
      // start_date,
      "date starterds checinh****************",
      // deposit_mode,
      facility.facilitiesBookingData.questions
    );
    const {
      handleInputChange,
      handleSubmit,
      selectTimeSlot,
      selectFile,
    } = this;
    let showError = start_time.error || end_time.error;
    let accompaniederror = accompanied.error;
    console.log(
      showError,
      facility.facilitiesBookingData,
      submitted,
      "fac proposs"
    );
    const total_amount = amount?.value + deposit_amount;
    const SubsequentDate = generateSubsequentDates(10);
    console.log(
      total_amount,
      "total_amount",
      amount_type == "fixed_type" ? fixed_amount : amount?.value,
      deposit_amount
    );
    const renderDate = ({ item,index }) => {
      const activetimestamp = new Date(start_date.value);
      const itemtimestamp = new Date(item.value);
      const formatDate = (date) => {
        return moment(date).format('DD/MM/YYYY');
      };
      return (
        <>      
          <TouchableOpacity
          style={{
            marginHorizontal: 2,
            borderColor: formatDate(activetimestamp) === formatDate(itemtimestamp) ? commonColors.yellowColor : themes[mode].black,
            borderWidth:2,
            borderRadius: 5, paddingHorizontal: 5, paddingVertical: 2, width: 50, alignItems: "center", justifyContent: "center",height:"100%"
          }}
          onPress={() => handleInputChange('start_date', item.value)}>
          <Text style={{
            alignSelf: "center",
            textAlign: "center",
            color:  formatDate(activetimestamp) === formatDate(itemtimestamp) ? commonColors.yellowColor : themes[mode].black,
            fontSize: ms(10),
         
            letterSpacing: 0.5,
            fontFamily:fonts.semiBold
            
          }}>{item.weekday}</Text>
           <Text style={{
            alignSelf: "center",
            textAlign: "center",
            color:  formatDate(activetimestamp) === formatDate(itemtimestamp) ? commonColors.yellowColor : themes[mode].black,
            fontSize: ms(16),
            letterSpacing: 0.5,
            fontFamily:fonts.semiBold
          }}>{item.day}</Text>
           <Text style={{
            alignSelf: "center",
            textAlign: "center",
            color:  formatDate(activetimestamp) === formatDate(itemtimestamp) ? commonColors.yellowColor : themes[mode].black,
            fontSize: ms(10),
            letterSpacing: 0.5,
            fontFamily:fonts.semiBold
          }}>{item.month}</Text>
        </TouchableOpacity>
        {/* {index===5 &&
          <TouchableOpacity
          style={{
            marginHorizontal: 2,
            backgroundColor: formatDate(activetimestamp) === formatDate(itemtimestamp) ? commonColors.yellowColor : themes[mode].lightAsh,
            borderRadius: 5, paddingHorizontal: 5, paddingVertical: 2, width: 50, alignItems: "center", justifyContent: "center",height:"100%"
          }}>
            <Image
            source={require("../../../../../assets/img/noslots.png")}
            style={{
              width: "100%",
              height: vs(200),
              alignSelf: "center",
            }}
          />
          </TouchableOpacity>} */}
        
        </>
      )
    };
    return (
      <KeyboardAwareScrollView
        contentContainerStyle={{
          flexGrow: 1,
          backgroundColor: themes[mode]["bgColor"],
          height: "100%",
        }}
        style={{
          flex: 1,
          backgroundColor: themes[mode]["bgColor"],
        }}
        scrollEnabled={false}
      >
        <SafeAreaView
          style={{
            width: "100%",
            // marginHorizontal: 20,
          }}
          forceInset={{ top: "never" }}
        >
          {/* <FocusAwareStatusBar /> */}
          {/* <View style={{marginTop: '-7%'}}>
            <Header
              showLeftIcon
              leftIcon
              title={name}
              showRightIcon
              onPressRight={() => {}}
              rightText="  "
            />
          </View> */}
          <WithBgHeader
            leftIcon
            headerTitle={name}
            containerStyle={{
              ...commonStyles.headerSpacing,
            }}
            onPressLeftIcon={() => {
              // this.gobackReset("clicked");
              RootNavigation.goBack();
            }}
          >
            {/* {payment_method == "paid" && (
              <View
                style={{
                  backgroundColor: "white",
                  elevation: 4,
                  shadowOffset: { width: 1, height: 1 },
                  shadowOpacity: 0.55,
                  shadowRadius: 0.5,
                  paddingVertical: ms(20),
                  marginHorizontal: ms(10),
                  borderRadius: ms(10),
                  paddingHorizontal: ms(20),
                }}
              >
                {payment_method == "paid" && (
                  <Text
                    style={{
                      alignSelf: "center",
                      textAlign: "center",
                      color: themes[mode]["lightAshDark"],
                      fontSize: ms(11),
                      letterSpacing: 0.5,
                      paddingBottom: ms(10),
                    }}
                  >
                    Customize your slots with flexible pricing options for each
                    selected time slot
                  </Text>
                )}
                {payment_method == "paid" && (
                  <View style={{ marginTop: "0%" }}>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        paddingHorizontal: 20,
                      }}
                    >
                      <View>
                        <Text
                          style={{
                            color: "black",
                            fontFamily: fonts.semiBold,
                            fontSize: 15,
                          }}
                        >
                          Your Costing
                        </Text>
                      </View>
                      <View>
                        <Text
                          style={{
                            color: "black",
                            fontFamily: fonts.bold,
                          }}
                        >
                          {amount?.value?.toFixed(1) || ""} $
                        </Text>
                      </View>
                    </View>
                  </View>
                )}

                {payment_method == "paid" &&
                  deposit_mode == "deposit" &&
                  deposit_amount && (
                    <View style={{ marginTop: "0%" }}>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          paddingHorizontal: 20,
                          marginTop: 10,
                        }}
                      >
                        <View>
                          <Text
                            style={{
                              color: "black",
                              fontFamily: fonts.semiBold,
                              fontSize: 15,
                            }}
                          >
                            Deposit Costing
                          </Text>
                        </View>
                        <View>
                          <Text
                            style={{
                              color: "black",
                              fontFamily: fonts.bold,
                            }}
                          >
                            {deposit_amount.toFixed(1)} $
                          </Text>
                        </View>
                      </View>
                    </View>
                  )}
                {payment_method == "paid" &&
                  deposit_mode == "deposit" &&
                  deposit_amount && (
                    <View style={{ marginTop: "0%" }}>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          paddingHorizontal: 20,
                          marginTop: 10,
                        }}
                      >
                        <View>
                          <Text
                            style={{
                              color: "black",
                              fontFamily: fonts.semiBold,
                              fontSize: 15,
                            }}
                          >
                            Total Costing
                          </Text>
                       
                        </View>
                        <View>
                          <Text
                            style={{
                              color: "black",
                              fontFamily: fonts.bold,
                            }}
                          >
                            {total_amount.toFixed(1)} $
                          </Text>
                        </View>
                      </View>
                    </View>
                  )}
              </View>
            )} */}

            <ScrollView
              contentContainerStyle={{
                // marginHorizontal: 20,
                flexGrow: 1,
                paddingBottom: 200,
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
              <Animated.View {...customAnimation("FadeInRight", 700, 50, 3)}>
                <View
                  style={{
                    marginTop: 5,
                    marginBottom: 40,
                    marginHorizontal: 5,
                  }}
                >
                  {/* <CustomDatePicker
                    name="start_date"
                    maxDate={new Date().setDate(
                      new Date().getDate() + advanceBookingDate - 1 || 1
                    )}
                    minDate={new Date()}
                    // value={moment(dob).format('DD/MMM/YYYY')}
                    // label="Date"
                    // showToday={false}
                    value={start_date.value}
                    onChange={handleInputChange}
                    error={start_date.error}
                    // showLabel
                    displayFormat={
                      Platform.OS === "android" ? "default" : "inline"
                    }
                  /> */}
                  {/* <FlatList
                    data={SubsequentDate}
                    renderItem={renderDate}
                    keyExtractor={item => item.title}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{
                      marginHorizontal: 5,
                      alignContent:"center"
                    }}
                    style={{
                      height:ms(60),
                      width: "100%",
                    }}
                  /> */}
                </View>
                <View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginTop: "-5%",
                      marginHorizontal: 0,
                    }}
                  >
                    {/* {status != "inactive" && (
                      <View style={{ width: "100%" }}>
                        <TypeSelect
                          name="Select Your Slot"
                          label="Select Your Slot"
                          value={
                            start_time.value != "" &&
                              start_time.value != undefined
                              ? `${start_time.value} - ${end_time.value}`
                              : ""
                          }
                          onPress={() => {
                            selectTimeSlot("clicked");
                          }}
                          leftIcon={<FacilityTimeSlotIcon />}
                          rightIcon={<ArrowRight color="#C1C1C1" />}
                          error={false}
                        />
                      </View>
                    )} */}
                  </View>
                  {/* {this.state.showFacilityTimeSlot && */}

                    <View>
                      <FacilityTimeSlotD
                        open_time={this.props?.route?.params?.open_time}                      
                        close_time={this.props?.route?.params?.close_time}
                        max_duration={this.props?.route?.params?.max_duration}
                        start_date={this.props?.route?.params?.start_date}
                        splited_hours={this.props?.route?.params?.splited_hours}
                        slots={this.slots}
                        max_booking={this.props?.route?.params?.max_booking}
                        no_non_peak={this.props?.route?.params?.no_non_peak}
                        no_peak={this.props?.route?.params?.no_peak}
                        facilityId={this.props?.facility?.facilityId}
                        amount_type={this.props?.route?.params?.facility_settings?.amount_type}
                        fixed_amount={this.props?.route?.params?.facility_settings?.fixed_amount}
                        payment_method={this.props?.route?.params?.payment_method}
                        isPeak={this.props?.route?.params?.isPeak}
                        isNonPeak={this.props?.route?.params?.isNonPeak}
                        isQuota={this.props?.route?.params?.isQuota}
                        isDefaultTime={this.props?.route?.params?.isDefaultTime}
                        minutes={this.props?.route?.params?.minutes}
                        minutesType={this.props?.route?.params?.minutesType}
                        SubsequentDate={SubsequentDate}
                        renderDate={renderDate}

                      />

                    </View>
                  {/* } */}
                  <View style={{ height: 18, marginTop: -9 }}>
                    {showError ? (
                      <Text
                        style={{
                          fontFamily: fonts.regular,
                          fontSize: 12,
                          color: commonColors["error"],
                        }}
                      >
                        {showError}
                      </Text>
                    ) : null}
                  </View>
                </View>
                {/* <View style={{ marginTop: '0%' }}>
                <CustomTextField
                ref={accompanied.nameRef}
                name={'accompanied'}
                label={'No. of Accompanied'}
                value={accompanied.value}
                onChange={handleInputChange}
                onSubmitEditing={() => {
                  comment.nameRef.current.textInput.focus()
                }}
                keyboardType="numeric"
                multiline
                icon={<OccupationIcon />}
                error={accompanied.error}
                maxLength={1}
                />
              </View> */}

              
                {/* <View style={{ marginTop: "0%" }}>
                  <CustomTextField
                    ref={comment.nameRef}
                    name={"comment"}
                    label={"Comment"}
                    value={comment.value}
                    onChange={handleInputChange}
                    onSubmitEditing={() => { }}
                    keyboardType="default"
                    multiline
                    icon={<Note />}
                  />
                </View>
                {console.log(enable_questions, questions, "enable questions")}
                {enable_questions && questions.length > 0 && (
                  <View>
                    <Text
                      style={{
                        color: themes[mode]["headingColor"],
                        fontFamily: fonts.bold,
                        fontSize: 15,
                        letterSpacing: 1,
                      }}
                    >
                      Questions
                    </Text>
                    <FlatList
                      showsVerticalScrollIndicator={false}
                      // legacyImplementation={true}
                      data={questions}
                      renderItem={this.handleQuestions}
                      keyExtractor={(item, index) => index}
                      style={{
                        marginTop: "2%",
                       
                        // zIndex: 10001,
                        // marginHorizontal: 20,
                      }}
                      contentContainerStyle={{
                        flexGrow: 1,
                        paddingBottom: "70%",
                        width: "100%",
                    
                        // marginRight: 20,
                      }}
                    />
                  </View>
                )} */}
              </Animated.View>
            </ScrollView>
           
          </WithBgHeader>
       
        </SafeAreaView>
        <View style={{position: "absolute", bottom: 0, width: "100%" }}>
        <View style={{top:ms(60),zIndex:1,width:"40%",marginHorizontal:5}}>
           
           {deposit_amount && (
           <Text
             style={{
                color: themes[mode]["headingColor"],
                fontFamily: fonts.bold,
                fontSize: 12,
                letterSpacing: 1,
              }}
            >
                Deposit Amount:{deposit_amount}
            </Text>
           )
            }
            {/* {
            (facility.facilitiesBookingData?.amount?.value) && (
            <Text 
             style={{
                color: themes[mode]["headingColor"],
                fontFamily: fonts.bold,
                fontSize: 12,
                letterSpacing: 1,
              }}>
                Slot Amount:{ facility.facilitiesBookingData?.amount?.value?.toFixed(1)}
            </Text>
              )
            } */}
            <Text
              style={{
                color: themes[mode]["headingColor"],
                fontFamily: fonts.bold,
                fontSize: 12,
                letterSpacing: 1,
              }}>
                Total Amount:{deposit_amount+facility.facilitiesBookingData?.amount?.value}
            </Text>
          </View>
          <SubmitButton
            buttonText={payment_method == "paid" ? "Book Now" : "Submit"}
            handleSubmit={handleSubmit}
            disableBtn={submitted}
          />
         
        </View>
        <Spinner
          visible={this.props.facility.loader}
          textContent={"Please Wait..."}
          textStyle={{ color: "#FFF" }}
        />
      </KeyboardAwareScrollView>
    );
  }
}

const mapStateToProps = ({
  profile: { mode },
  facility,
  login: { submitted },
}) => {
  return {
    mode,
    facility,
    submitted,
  };
};
// const {} = myvisitor;
const {
  facilitySubmit,
  onFacilityDataChange,
  facilityValidation,
  facilityChange,
  FacilitySlotBookingsDetails,
  onFacilityQuestionChange,
} = facility;
const { submitControl } = login;

const mapDispatchToProps = {
  facilitySubmit,
  onFacilityDataChange,
  facilityValidation,
  facilityChange,
  submitControl,
  FacilitySlotBookingsDetails,
  onFacilityQuestionChange,
};
export default connect(mapStateToProps, mapDispatchToProps)(FacilitiesForm);
