import React, { Component, useEffect, useState } from "react";
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  Button,
  Image,
} from "react-native";
import Animated, { log } from "react-native-reanimated";
import SafeAreaView from "react-native-safe-area-view";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { themes, commonColors, fonts } from "../../../../themes";
import { connect } from "react-redux";
import { SubmitButton, WithBgHeader } from "../../../../components";
// import * as RootNavigation from '../navigation/RootNavigation';
import commonStyles from "../../../../styles/commonStyles";
import {
  FacilityPaymentIcon,
  PaymentDtIcon,
  PaynowIcon,
} from "../../../../../assets/img/svgs";
import Clipboard from "@react-native-clipboard/clipboard";
import { Dimensions } from "react-native";
import AttachmentBottomView from "../../../../components/AttachmentBottomView";
import { customAnimation } from "../../../../animation/CommonAnimation";
import { StripePayment } from "./facilityStripe";
import { facility } from "../../../../redux/actions";
import Spinner from "react-native-loading-spinner-overlay/lib";
import { ms } from "../../../../helpers/scaling";
const FacilityPayment = (props) => {
  const [modal, setModal] = useState(false);
  const [disableBtn, setDisableBtn] = useState(false);
  useEffect(() => {
    focusListener = props.navigation.addListener("focus", async () => {
      console.log("krishnakdsdsdudysujhdksdjskdjks");
      props?.route?.params?.open && setModal(true);
    });
  }, []);

  const { mode } = props;
  
  const { facilitiesBookingData } = props.facility;
  const {
    payment_mode,
    client_key,
    country_code,
    environment,
    currency,
    merchant_account_name,
    amount,
    slot,
    deposit_mode,
    payment_mode_type,
    id,
    approval,
  } = props?.route?.params;
  const windowHeight = Dimensions.get("window").height;
  console.log(
    "potty",
    payment_mode_type,
    payment_mode,
    props?.route?.params,
    mode,

  );
  console.log(
    "potty2",
    facilitiesBookingData

  );
  const resetBooking = () => {
    ["start_date", "start_time", "end_time", "comment", "accompanied"]?.map(
      (item) => {
        console.log("event listner logging 1");
        props.facilityValidation({
          name: item,
          value: item === "start_date" ? new Date() : "",
          error: "",
          stateChange: false,
        });
      }
    );
  };
  const handleButton = (value) => {
    setDisableBtn(value);
  };
  console.log(
    facilitiesBookingData.amount_type.value,
    facilitiesBookingData.fixed_amount.value,
    facilitiesBookingData.rule_ids.value,
    facilitiesBookingData.amount.value,
    "facility payment submit889"
  );
  console.log(props.submitted, "facility attachment submitted");
  const FREE_SERVICE = (!facilitiesBookingData.amount.value
    && !facilitiesBookingData.deposit_amount.value )|| payment_mode=="unpaid";
    console.log("lolopo",payment_mode,FREE_SERVICE)

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
        }}
        forceInset={{ top: "never" }}
      >
        <WithBgHeader
          leftIcon
          headerTitle={FREE_SERVICE ? "Confirm Booking" : "Payment"}
          containerStyle={{
            ...commonStyles.headerSpacing,
          }}
        >
          <ScrollView
            contentContainerStyle={{
              marginHorizontal: 15,
            }}
            style={{
              height: "100%",
            }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Animated.View
              // {...customAnimation("FadeInDown", 700, 200, 0)}

              style={{
                flex: 1,
                // backgroundColor:"red",
                height: windowHeight - 63,
                width: "100%",
                alignItems: "center",
                marginTop: 30,
              }}
            >
              <View>
                <FacilityPaymentIcon />
              </View>
              <View>

                <View style={{ paddingHorizontal: 30, marginTop: 25 }}>
                  <Text
                    style={{
                      color: themes[mode]["lightAsh"],
                      fontFamily: fonts.regular,
                      textAlign: "center",
                      fontSize:ms(15)
                    }}
                  >
                    {!FREE_SERVICE ? (
                      'In order to complete the reservation, please include the payment receipt that was issued.'
                    ) : "No Services Charges are imposed on this Facility Booking , please confirm to proceed booking."}
                  </Text>
                </View>
                {FREE_SERVICE ?
                  <TouchableOpacity
                    style={{
                      justifyContent: "space-evenly",
                      alignItems: "center",
                      alignSelf: "center",
                      marginTop: 40,
                      height: 130,
                      width: 130,
                      backgroundColor: "white",
                      borderRadius: 5,
                      shadowOffset: { width: 2, height: 1 },
                      shadowOpacity: 0.15,
                      // shadowColor: "#bbb",
                      shadowRadius: 10,
                      shadowOpacity: 0.1,
                      elevation: 5,
                      paddingHorizontal: 1
                    }}
                    disabled={disableBtn}
                    onPress={async() => {
                      console.log("[Facility Gateway] onPress Unpaid");
                      payment_mode=="unpaid"?
                    (  console.log("sdfsdf", id,
                    approval,slot),
                      props.facilitySubmit(
                          id,
                          approval,
                          false,
                          slot == "active" ? "enable" : "disable"
                        )
                      ):
                      StripePayment(
                        facilitiesBookingData,
                        props?.route?.params?.id,
                        handleButton,
                        facilitiesBookingData.amount_type.value,
                        facilitiesBookingData.fixed_amount.value,
                        facilitiesBookingData.rule_ids.value,
                        facilitiesBookingData.amount.value,
                        facilitiesBookingData.deposit_amount.value
                      );
                    }}
                  >
                    <View>
                      <Image
                        source={require("../../../../../assets/img/confirmbooking.png")}
                        style={{
                          width: 50,
                          height: 50,
                        }}
                      />
                    </View>
                    <View>
                      <Text
                        style={{
                          color: themes[mode]["HeadingColor"],
                          fontFamily: fonts.medium,
                        }}
                      >
                        Confirm Booking
                      </Text>
                    </View>
                  </TouchableOpacity> :
                  <View
                    style={{ justifyContent: "center", alignItems: "center" }}
                  >
                    <View
                      style={{
                        alignItems: "center",
                        marginTop: 35,
                        flexDirection: "row",
                        justifyContent: "space-evenly",
                        // backgroundColor: "red",
                        alignSelf: "center",
                        width: "100%",
                      }}
                    >
                      {["both", "attachment"].includes(payment_mode) && (
                        <TouchableOpacity
                          style={{
                            justifyContent: "space-evenly",
                            alignItems: "center",
                            alignSelf: "center",
                            height: 130,
                            width: 130,
                            backgroundColor: "white",
                            borderRadius: 5,
                            shadowOffset: { width: 2, height: 1 },
                            shadowOpacity: 0.15,
                            // shadowColor: "#bbb",
                            shadowRadius: 10,
                            shadowOpacity: 0.1,
                            elevation: 5,
                            // marginLeft: 35,
                          }}
                          disabled={props.submitted}
                          onPress={() => {
                            setModal(true);
                          }}
                        >
                          <View>
                            <Image
                              source={require("../../../../../assets/img/attachment3.png")}
                              style={{
                                width: 50,
                                height: 50,
                              }}
                            />
                          </View>
                          <View>
                            <Text
                              style={{
                                color: themes[mode]["HeadingColor"],
                                fontFamily: fonts.medium,
                              }}
                            >
                              Offline Payment
                            </Text>
                          </View>
                        </TouchableOpacity>
                      )}

                      {["both", "gateway"].includes(payment_mode) && (
                        <TouchableOpacity
                          style={{
                            justifyContent: "space-evenly",
                            alignItems: "center",
                            alignSelf: "center",

                            height: 130,
                            width: 130,
                            backgroundColor: "white",
                            borderRadius: 5,
                            shadowOffset: { width: 2, height: 1 },
                            shadowOpacity: 0.15,
                            // shadowColor: "#bbb",
                            shadowRadius: 10,
                            shadowOpacity: 0.1,
                            elevation: 5,
                          }}
                          disabled={disableBtn}
                          onPress={() => {
                            console.log("[Facility Gateway] onPress");
                            // DispatchPayment(
                            //   facilitiesBookingData,
                            //   props?.route?.params?.id,
                            //   handleButton
                            // );
                            StripePayment(
                              facilitiesBookingData,
                              props?.route?.params?.id,
                              handleButton,
                              facilitiesBookingData.amount_type.value,
                              facilitiesBookingData.fixed_amount.value,
                              facilitiesBookingData.rule_ids.value,
                              facilitiesBookingData.amount.value,
                              facilitiesBookingData.deposit_amount.value
                            );
                          }}
                        >
                          <View>
                            <Image
                              source={require("../../../../../assets/img/paynow1.png")}
                              style={{
                                width: 50,
                                height: 50,
                              }}
                            />
                          </View>
                          <View>
                            <Text
                              style={{
                                color: themes[mode]["HeadingColor"],
                                fontFamily: fonts.medium,
                              }}
                            >
                              Online Payment
                            </Text>
                          </View>
                        </TouchableOpacity>
                      )}


                    </View>
                    {payment_mode_type?.paylater && (
                      <TouchableOpacity
                        style={{
                          justifyContent: "space-evenly",
                          alignItems: "center",
                          alignSelf: "center",
                          marginVertical: 20,
                          height: 130,
                          width: 130,
                          backgroundColor: "white",
                          borderRadius: 5,
                          shadowOffset: { width: 2, height: 1 },
                          shadowOpacity: 0.15,
                          // shadowColor: "#bbb",
                          shadowRadius: 10,
                          shadowOpacity: 0.1,
                          elevation: 5,
                        }}
                        disabled={disableBtn}
                        onPress={() => {
                          console.log("[Facility Gateway] onPress");
                          // DispatchPayment(
                          //   facilitiesBookingData,
                          //   props?.route?.params?.id,
                          //   handleButton
                          // );
                          StripePayment(
                            facilitiesBookingData,
                            props?.route?.params?.id,
                            handleButton,
                            facilitiesBookingData.amount_type.value,
                            facilitiesBookingData.fixed_amount.value,
                            facilitiesBookingData.rule_ids.value,
                            facilitiesBookingData.amount.value,
                            facilitiesBookingData.deposit_amount.value,
                            true,
                          );
                        }}
                      >
                        <View>
                          <Image
                            source={require("../../../../../assets/img/paylater.png")}
                            resizeMode='contain'
                            style={{
                              width: 70,
                              height: 70,
                            }}
                          />
                        </View>
                        <View>
                          <Text
                            style={{
                              color: themes[mode]["HeadingColor"],
                              fontFamily: fonts.medium,
                            }}
                          >
                            Pay Later
                          </Text>
                        </View>
                      </TouchableOpacity>
                    )}
                  </View>}
              </View>
            </Animated.View>
          </ScrollView>
        </WithBgHeader>
        <AttachmentBottomView
          modal={modal}
          onClose={() => {
            setModal(false);
          }}
          id={props?.route?.params?.id}
          approval={props?.route?.params?.approval}
          callback={props?.route?.params?.callback}
          slot={props?.route?.params?.slot}
          payment_mode={payment_mode}
          client_key={client_key}
          country_code={country_code}
          environment={environment}
          currency={currency}
          merchant_account_name={merchant_account_name}
          amount={amount}
          deposit_mode={deposit_mode}
          disable={props.submitted}
        />
        <Spinner
          visible={disableBtn}
          textContent={"Please Wait..."}
          textStyle={{ color: "#FFF" }}
        />
      </SafeAreaView>
    </KeyboardAwareScrollView>
  );
};

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
const { facilityValidation,facilitySubmit } = facility;

const mapDispatchToProps = {
  facilityValidation,
  facilitySubmit
  
};
const Styles = StyleSheet.create({
  timeSlotBox: {
    width: "30%",
    paddingVertical: 14,
    borderRadius: 5,
    alignItems: "center",
    marginHorizontal: 5,
    marginVertical: 12,
  },
  slotText: {
    fontFamily: fonts.semiBold,
  },
  slotMain: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: "5%",
    justifyContent: "center",
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(FacilityPayment);
