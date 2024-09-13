import React, { Component } from "react";
import {
  View,
  Text,
  Keyboard,
  ScrollView,
  Platform,
  Alert,
  TouchableOpacity,
  PermissionsAndroid,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { connect } from "react-redux";
import SafeAreaView from "react-native-safe-area-view";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import ImagePicker from "react-native-image-crop-picker";

import { themes, fonts, commonColors } from "../../../../themes";
import {
  NameIcon,
  PhoneIcon,
  VisitorVector,
  ContractorVector,
  DeliveryVector,
  PickupVector,
  ContractorType,
  Count,
  Note,
  ArrowRight,
  CountIconBig,
  CrossIcon,
  AttachmentIcon,
  CompanyNameIcon,
  SelfInvit,
} from "../../../../../assets/img/svgs";
import {
  nameValidation,
  phoneValidation,
  numberPlateValidation,
  companyNameValidation,
  titleize,
  generateSubsequentDates,
} from "../../../../helpers";
import {
  CustomPicker,
  CustomSelect,
  CustomTextField,
  SubmitButton,
  TypeSelect,
  WithBgHeader,
} from "../../../../components";
import CustomDatePicker from "../../../../components/CustomDatePicker";
import { invite } from "../../../../redux/actions";
import data from "../../../private/InviteData.json";
import commonStyles from "../../../../styles/commonStyles";
import { selectContactPhone } from "react-native-select-contact";
import Animated from "react-native-reanimated";
import { customAnimation } from "../../../../animation/CommonAnimation";
import InviteBottomView from "../../../../components/InviteBottomView";
import Spinner from "react-native-loading-spinner-overlay";
import Share from "react-native-share";
import { fetchConfigs } from "../../../../api/home";
import moment from "moment";
import { ms } from "../../../../helpers/scaling";
import BottomView from "../../../../components/BottomSheet";
import { FlatList } from "react-native";
import CustomDateSlider from "../../../../components/CustomDateSlider";

const scrollRef = React.createRef();

class VisitorForm extends Component {
  constructor() {
    super();
    this.state = {
      localStorageData: {},
      smsModal: false,
      sms: true,
      loader: false,
      isContractorShare: false,
      sendInviteVia: "",
      buttonFlow: "",
      visitor_allowed_time: {},
      mobilecode: "+65"
    };
    this.handleCountryCode = this.handleCountryCode.bind(this);
  }

  async componentDidMount() {
    const { inviteChange, invite, setSubvisitorList } = this.props;

    const name = "visiting_time";
    const value = new Date();
    inviteChange({ name, value });
    const reInvite = this.props?.route?.params
      ? this.props?.route?.params.purpose
      : false;
    console.log(reInvite, "111wertyyuu");
    console.log(reInvite);
    if (typeof reInvite == "string") {
      //  await setSubvisitorList(titleize(reInvite=="guest"?"Visitor":reInvite))
      // const {subVisitorTypeArr,subVisitorOrgArr} =invite

      console.log(
        "reinvite did mount ",
        titleize(this.props?.route?.params.purpose)
      );
      inviteChange({
        name: "purpose",
        value: titleize(this.props?.route?.params.purpose),
      });
      const { details } = this.props?.route?.params;
      console.log(details, "did mount invites", "isTypes");
      let detaile = details[0];
      this.props?.route?.params.sub_visitor_type &&
        inviteChange({
          name: "sub_visitor",
          value: this.props?.route?.params.sub_visitor_type,
        });
      for (let x in detaile) {
        console.log(detaile[x], "ldlldld", x);
        let decide = ["name", "phone", "vehicle_number", "employer"].includes(
          x
        );
        console.log(decide, "did mount decide");
        if (decide) {
          console.log(decide, "did mount decide true");
          if (x == "employer") {
            inviteChange({
              name: "company",
              value: detaile[x],
            });
          } else {
            inviteChange({
              name: x,
              value: detaile[x],
            });
          }
        }
      }
    } else {
    }

    const localStorage = await AsyncStorage.getItem("user");
    this.setState({
      localStorageData: {
        ...JSON.parse(localStorage).data,
      },
    });

    fetchConfigs()
      .then(({ data }) => {
        console.log(
          // data?.invite_config?.send_invite_via,
          data,
          "Akialksjnkwdnwkdnedjdnefd"
        );
        const { purpose } = this.props.invite.inviteeData;

        this.setState({
          visitor_allowed_time: data?.visitor_allowed_time,
          isContractorShare: data?.invite_config?.auto_approve_contractor,
          sendInviteVia: data?.invite_config?.send_invite_via,
          buttonFlow: this.ButtonFlow(
            purpose,
            data?.invite_config?.send_invite_via,
            data?.invite_config?.auto_approve_contractor
          ),
        });
      })
      .catch((err) => {
        console.log(err, "kkk");
      });
  }
  handleSubmit = (share) => {
    let err = false;
    Keyboard.dismiss();
    const { invite, inviteeValidation, createInvite } = this.props;
    const {
      name,
      phone,
      sub_visitor,
      purpose,
      vehicle_number,
      company,
    } = invite.inviteeData;

    let invite_type = purpose.value;
    let type = data[invite_type];
    if (purpose.value == "SelfInvite") {
      ["name", "phone", "sub_visitor", "vehicle_number"]?.map((item) => {
        if (type.company.show) {
          console.log("company true 1");
          err =
            nameValidation(name.value) ||
            phoneValidation(phone.value) ||
            (vehicle_number.value.length > 0 &&
              numberPlateValidation(vehicle_number.value));
          //   ||
          // companyNameValidation(company.value);
          // companyNameValidation(company.value)
        } else {
          err =
            nameValidation(name.value) ||
            phoneValidation(phone.value) ||
            (vehicle_number.value.length > 0 &&
              numberPlateValidation(vehicle_number.value));
          console.log(err, "else");
        }
        if (item === "name") {
          err = nameValidation(name.value);
          if (err) {
            inviteeValidation({
              name: "name",
              value: this.state.localStorageData.name,
              error: nameValidation(name.value),
            });
            scrollRef.current.scrollTo({ x: 0, y: 100, animated: false });
          }
        }
        if (item === "phone") {
          err = phoneValidation(phone.value);
          console.log("ppp", err, phone.value);
          if (err) {
            inviteeValidation({
              name: "phone",
              value: this.state.localStorageData.phone,
              error: phoneValidation(phone.value),
            });
            scrollRef.current.scrollTo({ x: 0, y: 100, animated: false });
          }
        }
        if (item === "vehicle_number" && type.textName.show) {
          console.log("vehicle true 2");
          err = numberPlateValidation(vehicle_number.value);
          if (err) {
            inviteeValidation({
              name: "vehicle_number",
              value: vehicle_number["value"],
              error: numberPlateValidation(vehicle_number.value),
            });
            scrollRef.current.scrollTo({ x: 0, y: 100, animated: false });
          }
        }
        if (type.company.show) {
          console.log("company true 2");
          if (item === "company") {
            if (companyNameValidation(company.value)) {
              inviteeValidation({
                name: "company",
                value: company["value"],
                error: companyNameValidation(company.value),
              });
              scrollRef.current.scrollTo({ x: 0, y: 100, animated: false });
            }
          }
        }
        if (
          purpose["value"] === "Contractor" ||
          purpose["value"] === "Delivery" ||
          purpose["value"] === "Pickup / Drop"
        ) {
          if (!sub_visitor["value"]) {
            err = true;
            inviteeValidation({
              name: "sub_visitor",
              value: sub_visitor["value"],
              error: "This field is required",
            });
          }
        }
      });
    } else {
      ["name", "phone", "sub_visitor", "vehicle_number"]?.map((item) => {
        if (type.company.show) {
          console.log("company true 1");
          err =
            nameValidation(name.value) ||
            phoneValidation(phone.value) ||
            (vehicle_number.value.length > 0 &&
              numberPlateValidation(vehicle_number.value));
          //   ||
          // companyNameValidation(company.value);
          // companyNameValidation(company.value)
        } else {
          err =
            nameValidation(name.value) ||
            phoneValidation(phone.value) ||
            (vehicle_number.value.length > 0 &&
              numberPlateValidation(vehicle_number.value));
          console.log(err, "else");
        }
        if (item === "name") {
          err = nameValidation(name.value);
          if (err) {
            inviteeValidation({
              name: "name",
              value: name["value"],
              error: nameValidation(name.value),
            });
            scrollRef.current.scrollTo({ x: 0, y: 100, animated: false });
          }
        }
        if (item === "phone") {
          err = phoneValidation(phone.value);
          console.log("ppp", err, phone.value);
          if (err) {
            inviteeValidation({
              name: "phone",
              value: phone["value"],
              error: phoneValidation(phone.value),
            });
            scrollRef.current.scrollTo({ x: 0, y: 100, animated: false });
          }
        }
        if (item === "vehicle_number" && vehicle_number.value.length > 0) {
          console.log("vehicle true 2");
          if (numberPlateValidation(vehicle_number.value)) {
            inviteeValidation({
              name: "vehicle_number",
              value: vehicle_number["value"],
              error: numberPlateValidation(vehicle_number.value),
            });
            scrollRef.current.scrollTo({ x: 0, y: 100, animated: false });
          }
        }
        // if (type.company.show) {
        //   console.log("company true 2");
        //   if (item === "company") {
        //     if (companyNameValidation(company.value)) {
        //       inviteeValidation({
        //         name: "company",
        //         value: company["value"],
        //         error: companyNameValidation(company.value),
        //       });
        //       scrollRef.current.scrollTo({ x: 0, y: 100, animated: false });
        //     }
        //   }
        // }
        if (
          purpose["value"] === "Contractor" ||
          purpose["value"] === "Delivery" ||
          purpose["value"] === "Pickup / Drop"
        ) {
          if (!sub_visitor["value"]) {
            err = true;
            inviteeValidation({
              name: "sub_visitor",
              value: sub_visitor["value"],
              error: "This field is required",
            });
          }
        }
      });
    }

    console.log(err, "ppooppoo");
    if (!err) {
      // createInvite();
      console.log(share, "oeioieqoieoqieoqei");
      if (share) {
        createInvite(
          true,
          false,
          this.qrLoader,
          Share,
          this.state.isContractorShare
        );
      } else {
        if (purpose.value == "SelfInvite") {
          createInvite(false, true, null, null, this.state.isContractorShare);
        } else {
          createInvite(false, null, null, null, this.state.isContractorShare);
        }
      }
    }
  };

  handleInputChange = (name, value) => {
    console.log(name, value, "ginger")
    const { inviteChange } = this.props;
    // "vehicle_number" == name && (value=value.toUpperCase())
    inviteChange({ name, value });
  };

  handleCountryCode = (type, id, value, label) => {
    console.log("Hello33", id, label, value, type);
    const { inviteChange } = this.props;
    this.setState({ mobilecode: value });
    inviteChange({
      name: "country_code",
      value: value,
    });
  };
  selectContact = () => {
    const { invite, inviteChange } = this.props;
    const {
      inviteeData: { name },
    } = invite;

    if (Platform.OS == "android") {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
        title: "Contacts",
        message: "This app would like to view your contacts.",
        buttonPositive: "Please accept bare mortal",
      })
        .then((data) => {
          console.log(data, "success");
          if (data != "denied" && data != "never_ask_again") {
            console.log("logged dkehefejf efkehufefjef efkehfekfjefefkefkefu");
            selectContactPhone()
              .then((selection) => {
                console.log(selection, "fekjhebfmenfhegf");
                if (!selection) {
                  return null;
                }

                let { contact, selectedPhone } = selection;
                console.log(
                  `Selected ${selectedPhone.type} phone number ${selectedPhone.number} from ${contact.name} details`
                );
                // selection.forEach(data=>{
                //   console.log("details",data);
                // })
                console.log(selection, "selection");
                // return selectedPhone.number;
                console.log(name, "123123123123");
                let phoneNumber = selectedPhone.number
                  .split(" ")
                  .join("")
                  .split("-")
                  .join("");
                const countryCodeLength =
                  phoneNumber.length == 13
                    ? phoneNumber.length - 10
                    : phoneNumber.length - 8;

                const components =
                  phoneNumber[0] == "+"
                    ? phoneNumber.substr(countryCodeLength, phoneNumber.length)
                    : phoneNumber;
                name.value.length == 0 &&
                  inviteChange({ name: "name", value: contact.name });
                inviteChange({
                  name: "phone",
                  value: components,
                });
              })
              .catch((err) => {
                console.log(err, "error");
              });
          }
          // Contacts.getAll()
          //   .then(contacts => {
          //     let array = [];
          //     console.log(contacts.length, 'length');
          //     contacts.forEach((data, index) => {
          //       let num;
          //       data.phoneNumbers.forEach(data => {
          //         console.log(data.number, 'jdjdjdj');
          //         num = data.number;
          //       });
          //        console.log(typeof num,"op");
          //       let datas = {
          //         number: num,
          //         name: data.givenName,
          //       };
          //       typeof num == "string" && array.push(datas);
          //     });
          //     setData(array);
          //     setloading(false);
          //   })
          //   .catch(e => {
          //     console.log(e);
          //   });
        })
        .catch((err) => {
          console.log(err, "error");
        });
    } else {
      selectContactPhone()
        .then((selection) => {
          console.log(selection, "fekjhebfmenfhegf");
          if (!selection) {
            return null;
          }

          let { contact, selectedPhone } = selection;
          console.log(
            `Selected ${selectedPhone.type} phone number ${selectedPhone.number} from ${contact.name} details`
          );
          // selection.forEach(data=>{
          //   console.log("details",data);
          // })
          console.log(selection, "selection");
          // return selectedPhone.number;
          console.log(name, "123123123123");
          let phoneNumber = selectedPhone.number
            .split(" ")
            .join("")
            .split("-")
            .join("");
          const countryCodeLength =
            phoneNumber.length == 13
              ? phoneNumber.length - 10
              : phoneNumber.length - 8;

          const components =
            phoneNumber[0] == "+"
              ? phoneNumber.substr(countryCodeLength, phoneNumber.length)
              : phoneNumber;
          name.value.length == 0 &&
            inviteChange({ name: "name", value: contact.name });
          inviteChange({
            name: "phone",
            value: components,
          });
        })
        .catch((err) => {
          console.log(err, "error");
        });
    }
  };
  smsModalShow = (value) => {
    this.setState({ smsModal: value });
  };
  qrLoader = (value) => {
    // console.log(loader,"loader value ");
    this.setState({ loader: value });
  };
  selectType = (type) => {
    const { navigation, inviteChange } = this.props;
    inviteChange({ name: "purpose", value: type });
    navigation.navigate("SubVisitorType", { subvisit: true });
  };
  onCancelImage = () => {
    const { inviteChange } = this.props;
    inviteChange({ name: "file", value: "" });
  };
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
            cropping: true,
            mediaType: "photo",
            freeStyleCropEnabled: true,
          }).then((image) => {
            console.log(image, "cma img");
            handleInputChange("file", image);
          });
        },
      },
    ]);
  };

  ButtonFlow = (purpose, sendInviteVia, isContractorShare) => {
    console.log(sendInviteVia, "00000000000000000 invite123");
    let result = "";
    if (purpose.value == "SelfInvite") {
      console.log("111111111111111111111111 invite123");
      result = "send";
    } else if (purpose.value == "Contractor") {
      console.log("22222222222222222222222 invite123");
      if (isContractorShare) {
        if (sendInviteVia == "share" || sendInviteVia == "send + share") {
          console.log("333333333333333333333333 invite123");

          result = sendInviteVia;
        } else {
          console.log("444444444444444444444 invite123");
          result = "send";
        }
      } else {
        result = "send";
      }
    } else {
      console.log("55555555555555555555 invite123");
      result = sendInviteVia;
    }

    // purpose.value == "SelfInvite"
    //   ? "send"
    //   : purpose.value == "Contractor"
    //   ? sendInviteVia == "share" || sendInviteVia == "share+send"
    //     ? this.state.isContractorShare
    //       ? sendInviteVia
    //       : "send"
    //     : sendInviteVia
    //   : sendInviteVia;
    console.log(result, "6666666666666666666666666 invite123");
    return result;
  };

  handleDateChange = () => {

  }
  render() {
    const { mode, submitted, invite } = this.props;
    const reinvite = this.props?.route?.params
      ? this.props?.route?.params.purpose
      : false;
    const { sendInviteVia, isContractorShare } = this.state;
    const {
      inviteeData: {
        file,
        name,
        phone,
        visiting_time,
        remarks,
        no_of_visitor,
        sub_visitor,
        company,
        purpose,
        vehicle_number,
      },
    } = invite;
    const {
      handleSubmit,
      handleInputChange,
      selectType,
      selectFile,
      onCancelImage,
      selectContact,
    } = this;
    const invite_type = typeof reinvite === "string" ? reinvite : purpose.value;
    console.log(reinvite, "reinvite");
    let invite_Type = titleize(invite_type);
    console.log(invite_type.toLowerCase(), "pppppppkjdkjdpppp");

    let type = data[invite_Type];
    console.log("typeinvwkjfwkjfwkjfwkjfite", visiting_time.value);
    const formField = {
      id: 0,
      q_id: 0,
      type: "single-select",
      label: "Please Select Mobile Code",
      value: "",
      standard: { id: 42, label: "Singapore(+65)", value: "+65", selected: false, code: "sg" },
      dropDownList:
        [
          // { id: 0, label: "Australia(+61)", value: "+61", selected: false, code: "au" },
          // { id: 1, label: "Canada(+1)", value: "+1", selected: false, code: "ca" },
          // { id: 2, label: "China(+86)", value: "+86", selected: false, code: "cn" }, // China entry
          // { id: 3, label: "Denmark(+45)", value: "+45", selected: false, code: "dk" }, // New entry
          // { id: 4, label: "Germany(+49)", value: "+49", selected: false, code: "de" }, // New entry
          // { id: 5, label: "Hong Kong(+852)", value: "+852", selected: false, code: "hk" }, // Hong Kong entry
          // { id: 10, label: "United Kingdom(+44)", value: "+44", selected: false, code: "gb" },
          // { id: 7, label: "Indonesia(+62)", value: "+62", selected: false, code: "id" }, // New entry
          { id: 1, label: "India(+91)", value: "+91", selected: false, code: "in" },

          { id: 2, label: "Malaysia(+60)", value: "+60", selected: false, code: "my" },
          { id: 3, label: "Singapore(+65)", value: "+65", selected: false, code: "sg" },

        ],
      required: true,
      error: "",
    };
    // const SubsequentDate = generateSubsequentDates(10);

    // const renderDate = ({ item, index }) => {
    //   console.log("debree",item)
    //   const activetimestamp = new Date(visiting_time?.value);
    //   const itemtimestamp = new Date(item.value);
    //   const formatDate = (date) => {
    //     return moment(date).format('DD/MM/YYYY');
    //   };
    //   return (
    //     <>
    //       <TouchableOpacity
    //         style={{
    //           backgroundColor: themes[mode].black,//formatDate(activetimestamp) === formatDate(itemtimestamp) ? commonColors.yellowColor : themes[mode].black
    //           borderRadius: 10, width: 50, alignItems: "center", justifyContent: "space-evenly", height: "100%"
    //         }}
    //         onPress={() => handleInputChange('visiting_time', item.value)}>
    //         <Text style={{
    //           alignSelf: "center",
    //           textAlign: "center",
    //           color: themes[mode].black,//formatDate(activetimestamp) === formatDate(itemtimestamp) ? commonColors.darkWhite : themes[mode].black,
    //           fontSize: ms(10),

    //           letterSpacing: 0.5,
    //           fontFamily: fonts.semiBold

    //         }}>{item.weekday}</Text>
    //         <Text style={{
    //           alignSelf: "center",
    //           textAlign: "center",
    //           color:themes[mode].black,// formatDate(activetimestamp) === formatDate(itemtimestamp) ? commonColors.darkWhite : themes[mode].black,
    //           fontSize: ms(16),
    //           letterSpacing: 0.5,
    //           fontFamily: fonts.semiBold
    //         }}>{item.day}</Text>
    //         <Text style={{
    //           alignSelf: "center",
    //           textAlign: "center",
    //           color: themes[mode].black,//formatDate(activetimestamp) === formatDate(itemtimestamp) ? commonColors.darkWhite : themes[mode].black,
    //           fontSize: ms(10),
    //           letterSpacing: 0.5,
    //           fontFamily: fonts.semiBold
    //         }}>{item.month}</Text>
    //       </TouchableOpacity>

    //     </>
    //   )
    // };
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
            backgroundColor: themes[mode]["bgColor"],
          }}
          forceInset={{ top: "never" }}
        >
          <WithBgHeader
            leftIcon
            headerTitle={type.header}
            containerStyle={{
              ...commonStyles.headerSpacing,
            }}
          >
            <ScrollView
              ref={scrollRef}
              contentContainerStyle={{
                flexGrow: 1,
                paddingBottom: ms(100),
              }}
              style={{
                height: "100%",
              }}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <Animated.View
                // {...customAnimation("FadeInRight", 700, 50, 3)}
                style={{
                  ...commonStyles.headerSpacing,
                  marginVertical: 0,
                }}
              >
                <View style={{ alignSelf: "center" }}>
                  {invite_Type === "Visitor" ? (
                    <VisitorVector />
                  ) : invite_Type === "Contractor" ? (
                    <ContractorVector />
                  ) : invite_Type === "Delivery" ? (
                    <DeliveryVector />
                  ) : invite_Type == "SelfInvite" ? (
                    <SelfInvit />
                  ) : null}
                </View>
                <View style={{ marginTop: "15%" }}>
                  <Text
                    style={{
                      fontFamily: fonts.regular,
                      fontSize: ms(16),
                      color: "#282828",
                    }}
                  >
                    {type.subHead}
                  </Text>

                  {purpose.value == "SelfInvite" && (
                    <Text
                      style={{
                        color: "#989898",
                        // marginTop: 10,
                        // marginBottom: 10,
                        fontFamily: fonts.regular,
                        lineHeight: ms(22),
                        fontSize: ms(16),
                      }}
                    >
                      Vehicles added via self-invite will be granted access to
                      the visitor barricade only on the day they are added and
                      are permitted to stay within the condo premises for a
                      maximum of 15 minutes. This applies to vehicles such as
                      taxis and cabs.
                    </Text>
                  )}
                  {invite_type != "SelfInvite" && (
                    <View style={{ flexDirection: "row", marginTop: 10 }}>
                      <Text
                        style={{
                          fontFamily: fonts.semiBold,
                          fontSize: ms(16),
                          fontWeight: "600",
                          color: themes[mode]["headingColor"],
                        }}
                      >
                        Expiry time :
                      </Text>
                      <Text
                        style={{
                          fontFamily: fonts.semiBold,
                          fontSize: ms(16),
                          fontWeight: "600",
                          color: themes[mode]["headingColor"],
                        }}
                      >
                        {" "}
                        {moment().isSame(visiting_time?.value, "date")
                          ? "Today"
                          : moment(visiting_time?.value).format("MMM DD")}{" "}
                        {this.state.visitor_allowed_time[
                          invite_type.toLowerCase() == "visitor"
                            ? "guest"
                            : invite_type.toLowerCase()
                        ]?.replace(/Today/gi, "")}
                      </Text>
                    </View>
                  )}
                  {type.datepicker.show && (
                    // <View
                    //   style={{
                    //     marginTop: 17,
                    //     marginBottom: Platform.OS === "android" ? "5%" : "5%",
                    //   }}
                    // >
                    //   <CustomDatePicker
                    //     name="visiting_time"
                    //     maxDate={new Date().setDate(new Date().getDate() + 45)}
                    //     minDate={new Date()}
                    //     value={visiting_time.value}
                    //     onChange={handleInputChange}
                    //     displayFormat={
                    //       Platform.OS === "android" ? "default" : "inline"
                    //     }
                    //   />
                    // </View>
                    <>
                      {/* <View style={{
                        width: "100%",
                        marginTop: "5%",
                        borderColor: "#FFFF",
                        height: 100,
                        backgroundColor:
                          themes[mode][
                          mode === "light" ? "bgColor" : "shadowColor"
                          ],
                        shadowColor: mode === "light" ? "#bbb" : "#000",
                        elevation: 10,
                        borderRadius: 5,
                        shadowOffset: { width: 0, height: 3 },
                        shadowOpacity: 0.9,
                        shadowRadius: 5,
                        flex: 1, flexDirection: "row"
                      }}>
                        <>
                          <View style={{ width: "15%", alignContent: "center", alignItems: "center", justifyContent: "space-evenly", flexDirection: "column", backgroundColor: commonColors.yellowColor, color: commonColors.darkWhite, borderRadius: 5 }}>
                            <Text style={{ color: commonColors.darkWhite, fontFamily: fonts.semiBold }}>
                              {moment(visiting_time?.value).format('ddd')}
                            </Text>
                            <Text style={{ color: commonColors.darkWhite, fontFamily: fonts.semiBold }}>
                              {moment(visiting_time?.value).format('DD')}
                            </Text>
                            <Text style={{ color: commonColors.darkWhite, fontFamily: fonts.semiBold }}>
                              {moment(visiting_time?.value).format('MMM')}
                            </Text>
                          </View>
                          <View style={{ width: "85%" }}>
                            <FlatList
                              data={SubsequentDate}
                              renderItem={renderDate}
                              keyExtractor={item => item.title}
                              horizontal={true}
                              showsHorizontalScrollIndicator={false}
                              contentContainerStyle={{
                                // marginHorizontal: 5,
                                alignContent: "center"
                              }}
                              style={{
                                height: ms(100),
                                width: "100%",
                                height: "70%",
                                borderBottomWidth: 2,
                                borderBottomColor: "#0000002B"
                              }}
                            />
                            <View style={{ width: "100%", paddingHorizontal: "8%", paddingVertical: "1%" }}>
                              <Text style={{ textAlign: "right", fontSize: ms(12), fontFamily: fonts.semiBold }}>More</Text>
                            </View>
                          </View>
                        </>
                      </View> */}

                      <CustomDateSlider
                        time={visiting_time.value}
                        handleInputChange={handleInputChange}
                      />
                    </>

                  )}
                </View>
                <View>
                  <Text
                    style={{
                      fontFamily: fonts.semiBold,
                      fontSize: ms(16),
                      fontWeight: "600",
                      color: themes[mode]["headingColor"],
                      marginTop: 10,
                    }}
                  >
                    {/* {`Add your ${
                      invite_type === "Visitor"
                        ? "Guest"
                        : invite_type == "SelfInvite"
                        ? "Vehicle"
                        : invite_type
                    } Details`} */}
                  </Text>
                  {type.name.show && (
                    <View style={{ marginTop: 15 }}>
                      <CustomTextField
                        name="name"
                        label={type.name.label}
                        value={name.value}
                        onChange={handleInputChange}
                        // onSubmitEditing={() =>
                        //   phone.phoneRef.current.textInput.focus()
                        // }
                        keyboardType="default"
                        icon={<NameIcon />}
                        error={name["error"]}
                      />
                    </View>
                  )}
                  {type.phone.show && (
                    <View>
                      <BottomView
                        key={0}
                        {...formField}
                        onChange={this.handleCountryCode}
                      />

                      <CustomTextField
                        // ref={phone.phoneRef}
                        name="phone"
                        label={type.phone.label}
                        value={phone.value}
                        onChange={handleInputChange}
                        // onSubmitEditing={() =>
                        //   vehicle_number.vehicleRef.current.textInput.focus()
                        // }
                        keyboardType="numeric"
                        maxLength={this.state.mobilecode == "+65" ? 8 : 10}
                        icon={<PhoneIcon />}
                        error={phone["error"]}
                        contact={true}
                        selectContact={selectContact}
                      />
                    </View>
                  )}
                  {type.sub_visitor.show && (
                    <TypeSelect
                      ref={this.sub_visitor}
                      name="sub_visitor"
                      label={type.sub_visitor.label}
                      value={sub_visitor.value}
                      onPress={() => selectType(invite_Type)}
                      leftIcon={<ContractorType />}
                      rightIcon={<ArrowRight color="#C1C1C1" />}
                      error={sub_visitor["error"]}
                    />
                  )}

                  {type.vehicle_number.show && (
                    <View style={{}}>
                      <CustomTextField
                        autoCap={true}
                        // ref={vehicle_number.vehicleRef}
                        name="vehicle_number"
                        label={"Vehicle Number"}
                        value={vehicle_number.value || ""}
                        onChange={(name, value) => {
                          // let a = value.toUpperCase();
                          handleInputChange(name, value);
                        }}
                        // onSubmitEditing={() => {
                        //   console.log(invite_type, "kklllkkk");
                        //   if (invite_Type != "SelfInvite") {
                        //     invite_type === "Contractor"
                        //       ? company.companyRef.current.textInput.focus()
                        //       : remarks.remarksRef.current.textInput.focus();
                        //   }
                        // }}
                        keyboardType="default"
                        icon={<CountIconBig />}
                        error={vehicle_number["error"]}
                      />
                    </View>
                  )}
                  {type.company.show && (
                    <View style={{}}>
                      <CustomTextField
                        // ref={company.companyRef}
                        name="company"
                        label={"Company Name"}
                        value={company.value || ""}
                        onChange={handleInputChange}
                        // onSubmitEditing={() =>
                        //   remarks.remarksRef.current.textInput.focus()
                        // }
                        keyboardType="default"
                        icon={<CompanyNameIcon />}
                        error={company["error"]}
                      />
                    </View>
                  )}
                  {type.remarks.show && (
                    <View>
                      <CustomTextField
                        // ref={remarks.remarksRef}
                        name="remarks"
                        label={type.remarks.label}
                        value={remarks.value}
                        onChange={handleInputChange}
                        // onSubmitEditing={() => {
                        //   // Keyboard.dismiss();
                        //   invite_type === "Visitor" ||
                        //   invite_type === "Contractor"
                        //     ? no_of_visitor.no_of_visitorRef.current.textInput.focus()
                        //     : handleSubmit();
                        // }}
                        keyboardType="default"
                        // multiline
                        icon={<Note />}
                      />
                    </View>
                  )}
                </View>

                {type.no_of_visitor.show ? (
                  <View>
                    <Text
                      style={{
                        fontFamily: fonts.semiBold,
                        fontSize: ms(16),
                        fontWeight: "600",
                        color: themes[mode]["headingColor"],
                        marginVertical: ms(20),
                      }}
                    >
                      {type.addTitle}
                    </Text>
                    <View style={{ marginBottom: ms(30) }}>
                      <CustomTextField
                        ref={no_of_visitor.no_of_visitorRef}
                        name="no_of_visitor"
                        label={type.no_of_visitor.label}
                        value={no_of_visitor.value}
                        onChange={handleInputChange}
                        onSubmitEditing={() => handleSubmit()}
                        keyboardType="numeric"
                        maxLength={2}
                        icon={<Count />}
                      />
                    </View>
                  </View>
                ) : null}

                {type.attachment.show ? (
                  <View>
                    <TouchableOpacity
                      style={{
                        marginTop: 8,
                        marginLeft: 5,

                        width: "60%",
                      }}
                      onPress={selectFile}
                    >
                      <Text
                        style={{
                          fontSize: ms(16),
                          lineHeight: ms(17),
                          fontFamily: fonts.bold,
                          textDecorationLine: "underline",
                          color: themes[mode]["headingColor"],
                          paddingBottom: 1,
                        }}
                      >
                        Browse file (max 10MB)
                      </Text>
                    </TouchableOpacity>
                    <View
                      style={{
                        marginLeft: ms(12),
                        flexDirection: "row",
                        alignItems: "center",
                        marginVertical: ms(25),
                      }}
                    >
                      {file.value ? <AttachmentIcon /> : null}
                      <Text
                        style={{
                          fontFamily: fonts.medium,
                          fontSize: ms(12),
                          letterSpacing: 0.5,
                          color: themes[mode]["headingColor"],
                          marginHorizontal: ms(7),
                          flexGrow: 1,
                        }}
                      >
                        {file.value ? "File selected" : ""}
                      </Text>
                      {file.value ? (
                        <TouchableOpacity
                          onPress={onCancelImage}
                          style={{
                            width: ms(19),
                            height: ms(19),
                            borderRadius: 6,
                            borderWidth: 1,
                            borderColor: themes[mode]["textColor"],
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <CrossIcon color={themes[mode]["textColor"]} />
                        </TouchableOpacity>
                      ) : null}
                    </View>
                  </View>
                ) : null}
              </Animated.View>
            </ScrollView>
            {Platform.OS == "android" && (
              <View style={{ position: "absolute", bottom: 0, width: "100%" }}>
                <SubmitButton
                  buttonText={invite_Type ? "Submit" : "Send"}
                  handleSubmit={handleSubmit}
                  disableBtn={submitted}
                  share={this.state.buttonFlow}
                  Invite={true}
                />
              </View>
            )}
            <InviteBottomView
              smsShow={this.state.smsModal}
              handleChange={this.smsModalShow}
              createInvite={this.props.createInvite}
              qrloader={this.qrLoader}
            />
            <Spinner
              visible={this.state.loader}
              textContent={"Please Wait..."}
              textStyle={{ color: "#FFF" }}
            />
          </WithBgHeader>
          {Platform.OS == "ios" && (
            <View style={{ position: "absolute", bottom: 0, width: "100%" }}>
              <SubmitButton
                buttonText={invite_Type ? "Submit" : "Send"}
                handleSubmit={handleSubmit}
                disableBtn={submitted}
                share={this.state.buttonFlow}
                Invite={true}
              />
            </View>
          )}
        </SafeAreaView>
      </KeyboardAwareScrollView>
    );
  }
}

const mapStateToProps = ({
  profile: { mode },
  invite,
  login: { submitted },
}) => {
  return {
    mode,
    invite,
    submitted,
  };
};
const {
  inviteChange,
  inviteeValidation,
  initialVisitorInvite,
  setSubvisitorList,
  createInvite,
} = invite;

const mapDispatchToProps = {
  inviteChange,
  inviteeValidation,
  initialVisitorInvite,
  setSubvisitorList,
  createInvite,
};
export default connect(mapStateToProps, mapDispatchToProps)(VisitorForm);
