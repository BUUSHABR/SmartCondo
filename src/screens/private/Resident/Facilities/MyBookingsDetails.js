import React, { Component, useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Keyboard,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableHighlight,
  // ScrollView,
  RefreshControl,
  Modal,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import { connect, useDispatch, useSelector } from "react-redux";
import { themes, commonColors, fonts } from "../../../../themes";
import {
  detectTheme,
  timeAgo,
  capitalize,
  tailedString,
  customTimeFunction,
} from "../../../../helpers";
import ViewDetailsComponent from "../../../../components/ViewDetailsComponent";
import { cancelInvite } from "../../../../api/invite";
import { cancelBookedFacility } from "../../../../api/facility_booking";
import { facility } from "../../../../redux/actions";
import moment from "moment";
import SafeAreaView from "react-native-safe-area-view";
import { ShowVisitorDetailsLoader } from "../../../../../assets/img/loader";
import { WithBgHeader } from "../../../../components";
import commonStyles from "../../../../styles/commonStyles";
import { acos } from "react-native-reanimated";

class MyBookingsDetails extends Component {
  componentDidMount() {
    const { navigation, showBookingDetails, onClickFacilities } = this.props;
    const {
      data: { type_id, share, web_ui },
    } = this.props?.route?.params;
    this._unsubscribe = navigation.addListener("focus", async () => {
      console.log(type_id, "iddddd in invite detaillssss");
      showBookingDetails(type_id);
    });
    this._unsubscribe1 = navigation.addListener("blur", async () => {
      console.log("BLURRR INVITE");
      onClickFacilities({ name: "showCancelButton", value: true });
      onClickFacilities({ name: "bookingDetails", value: {} });
    });
  }
  onCancel = (id) => {
    const { cancelBooking, onClickFacilities } = this.props;
    cancelBooking(id);

    onClickFacilities({
      name: "showCancelButton",
      value: false,
    });
  };
  render() {
    const {
      bookingDetails,
      submitted,
      mode,
      cancelBooking,
      showCancelButton,
      userData,
    } = this.props;
    console.log(
     bookingDetails, 
      "detailss++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++"
    );
    console.log(
      // bookingDetails,
      userData.id,
      "eduta"
    );
    const {
      booking_owner,
      facility,
      resident,
      from_time,
      to_time,
      comment,
      status,
      no_of_occupants,
      id,
      payment_image,
      deposit_image,
      payment,
      invoice_url,
      facility_answers,
      remarks,
      stripe_call_back_url,
      payment_mode,
      amount,
      deposit_amount,
    
     payment_type, } = bookingDetails;
    console.log("ginger",payment_mode,status,bookingDetails);
    const { name, phone } = userData;
    const {
      data: { share, web_ui },
    } = this.props?.route?.params;
    let data;
    console.log(facility, "facility data data", payment, payment_image);

    if (
      payment?.amount?.value == 0 ||
      payment?.amount?.value == null ||
      (payment?.amount ? false : payment_image == (null || undefined))
    ) {
      console.log("8888888888888 facility");
      if (amount != 0) {
        data = {
          costing: {
            label: " ",
            value: amount - deposit_amount,
          },
          deposite: {
            label: " ",
            value: deposit_amount,
          },
          total_costing: {
            label: " ",
            value: amount,
          },
        };
      } else {
        data = {};
      }
    } else {
      console.log(
        payment?.amount?.value,
        "888888888888800000000000000000 facility",
        payment ? payment?.deposit_amount : facility?.deposit_amount
      );
      data = {
        costing: {
          label: " ",
          value:
            payment?.amount?.value -
            (payment
              ? payment?.deposit_amount || 0
              : facility?.deposit_amount || 0),
        },
        deposite: {
          label: " ",
          value: payment ? payment?.deposit_amount : facility?.deposit_amount,
        },
        total_costing: {
          label: " ",
          value: payment?.amount?.value,
        },
      };
    }
    console.log(data, "09823918321313183 facility", facility);
    // const {
    //   cancel_after_approval,
    //   last_minute_cancellation_duration,
    // } = facility;
    console.log(
      facility?.cancel_after_approval,
      facility?.last_minute_cancellation_duration,
      from_time,
      "last min cancellation datas"
    );
    const isTimeUp = moment(from_time)
      .subtract(facility?.last_minute_cancellation_duration, "minutes")
      .isAfter();
    console.log(
      isTimeUp,
      "isTimeUp BoookingDetails",
      status === "Upcoming" ||
        status === "Confirmed" ||
        status == "Pending" ||
        status == "Reserved" ||
        status == "Payment Initiated",
      "next",
      showCancelButton,
      facility?.cancel_after_approval,
      isTimeUp
    );
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: themes[mode]["bgColor"],
          // height: '100%',
        }}
        forceInset={{ top: "never" }}
      >
        {Object.keys(bookingDetails).length < 1 ? (
          <WithBgHeader
            leftIcon
            headerTitle="Booking Details"
            containerStyle={{
              ...commonStyles.headerSpacing,
            }}
          >
            <View
              style={{
                ...commonStyles.headerSpacing,
              }}
            >
              {[1, 2, 3, 4]?.map((item) => {
                return <ShowVisitorDetailsLoader />;
              })}
            </View>
            {console.log(
              from_time,
              "accompanied started----------------------------------------------------------------------------------------------------"
            )}
          </WithBgHeader>
        ) : (
          <ViewDetailsComponent
            details={{
              payment: payment,
              notes: false,
              stripe_call_back_url: stripe_call_back_url,
              payment_type: payment_type,
              status: status,
              payment_mode:payment_mode,
              headerProp: {
                title: `Booking Details`,
                onPressRight: () => {},
                rightText: " ",
                showLeftIcon: true,
                leftIcon: true,
              },
              remarks: remarks,
              facility_answers: facility_answers,
              detailsProp: {
                bookedby: { label: "", value: booking_owner?.name ? booking_owner.name:"Removed User"},
                // phone: { label: "", value: phone },
                booking_name: { label: "", value: facility?.name },
                date: { label: "", value: from_time },
                start_time: { label: "", value: from_time },
                end_time: { label: "", value: to_time },
                status_type: { label: "", value: status },
                remarks: { label: "", value: remarks },
                ...data,
                // accompanied: {label: '', value: no_of_occupants},
              },
              descriptionProp: {
                notes: { label: "", value: comment },
              },
              paidProps: {
                paid: { label: "", value: payment_image },
              },
              depositeProps: {
                paid: { label: "", value: deposit_image },
              },
              downloadedProps: {
                dowloadpdf: { label: "", value: invoice_url },
              },
              share: true,
              web_ui: web_ui,
              id: id,
              detailsActionButton:
                (status === "Upcoming" ||
                  status === "Confirmed" ||
                  status == "Pending" ||
                  status == "Reserved" ||
                  status == "Payment Initiated") &&
                (showCancelButton && facility?.cancel_after_approval
                  ? isTimeUp
                  : true)
                    &&
                  userData.id === booking_owner?.id 
                  ? [
                      {
                        btnText: "Cancel Booking",
                        action: () => {
                          Alert.alert(
                            "Cancel Booking",
                            "Are you sure you want to cancel your booking?",
                            [
                              {
                                text: "No",
                                onPress: () => {},
                                style: "cancel",
                              },
                              {
                                text: "Yes",
                                onPress: () => {
                                  this.onCancel(id);
                                },
                              },
                            ]
                          );
                        },
                        buttonStyle: {
                          borderColor: commonColors.yellowColor,
                          backgroundColor: commonColors.yellowColor,
                        },
                        textStyle: {
                          color: themes[mode]["headingColor"],
                        },
                        disableBtn: submitted,
                      },
                    ]
                  : null,
            }}
          />
        )}
      </SafeAreaView>
    );
  }
}

const mapStateToProps = ({
  profile: { mode, userData },
  facility: { bookingDetails, showCancelButton },
  login: { submitted },
}) => {
  return {
    mode,
    bookingDetails,
    showCancelButton,
    submitted,
    userData,
  };
};

const { showBookingDetails, onClickFacilities, cancelBooking } = facility;

const mapDispatchToProps = {
  showBookingDetails,
  onClickFacilities,
  cancelBooking,
};
export default connect(mapStateToProps, mapDispatchToProps)(MyBookingsDetails);
