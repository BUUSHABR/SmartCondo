import React, { Component, PureComponent } from "react";
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  ToastAndroid,
  Platform,
  ActivityIndicator,
  Image,
} from "react-native";
import Toast from "react-native-simple-toast";

import SafeAreaView from "react-native-safe-area-view";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { themes, commonColors, fonts } from "../../../../themes";
import { connect } from "react-redux";
import { SubmitButton, WithBgHeader } from "../../../../components";
import commonStyles from "../../../../styles/commonStyles";
import { styles } from "react-native-floating-label-input/src/styles";
// import {back} from 'react-native/Libraries/Animated/Easing';
import { backgroundColor } from "react-native/Libraries/Components/View/ReactNativeStyleAttributes";
import store from "../../../../redux/store";
import {
  profile,
  facility,
  registration,
  login,
} from "../../../../redux/actions";
import { slotEnableChecker } from "../../../../helpers";
import moment from "moment";
import { ToastMessage } from "../../../../components";
import Animated, { log } from "react-native-reanimated";
import { customAnimation } from "../../../../animation/CommonAnimation";
import { ms, mvs, vs } from "../../../../helpers/scaling";
import { cloudMessagingAPI } from "../../../../api/firebase";
let toastshow = 0;
class FacilityTimeSlot extends PureComponent {
  constructor(props) {
    super(props);
    this.max_booking = this.props?.route?.params.max_booking;
    this.remaining_overallLimit = this.props.facility?.slotDetails?.remaining_overall_quota;
    this.no_peak = this.props?.route?.params.isPeak
      ? this.props?.route?.params.no_peak
      : this.props?.route?.params.max_booking;
    this.no_non_peak = this.props?.route?.params.isNonPeak
      ? this.props?.route?.params.no_non_peak
      : this.props?.route?.params.max_booking;
    this.isDefaultTime = this.props?.route?.params.isDefaultTime;
    this.minutes = this.props?.route?.params.minutes;
    this.minutesType = this.props?.route?.params.minutesType;
    (this.is_peak = this.props?.route?.params.isPeak),
      (this.is_nonPeak = this.props?.route?.params.isNonPeak),
      (this.is_quota = !this.props?.route?.params.isQuota),
      (this.amount_type = false),
      (this.fixed_amount = this.props?.route?.params?.fixed_amount),
      (this.payment_method =
        this.props?.route?.params?.payment_method == "paid" ? true : false),
      (this.peak_non_peak_count = {
        true: this.props.facility?.slotDetails?.remaining_peak_value,
        false: this.props.facility?.slotDetails?.remaining_non_peak_value,
      });
    (this.newTimeSlot = []),
      (this.state = {
        submit: false,
        peak_non_peak_count: {
          true: 0,
          false: 0,
          overAll: 0,
          limitReached: false,
        },
      });
    (this.TimeSlot = []), (this.max_duration = null);
  }
  createTimeSlot = (slots) => {
    console.log(slots, "slots createTine slot");
    const { start_date } = this.props?.route?.params;
    var start_date_split = moment(`${start_date.value}`).format("YYYY-MM-DD");
    var current_date = moment().format("YYYY-MM-DD");
    var current_time = moment().format("HH:mm");
    // let start_time = moment(from_time, "HH,mm");
    // let end_time = moment(to_time, "HH,mm");
    // if (end_time.isBefore(start_time)) {
    //   end_time.add(1, "day");
    // }
    // let arr = [];
    let new_slot = [];
    // while (start_time <= end_time) {
    //   var a = moment(start_time).format("HH,mm");
    //   var b = a.replace(",", ":");
    //   arr.push(b);
    //   start_time.add(splited, "minutes");
    // }
    console.log(this.minutesType, "create time slot dates", this.minutes);
    for (var i = 0; i < slots.length; i++) {
      let currentSlotDate = this.isDefaultTime
        ? this.minutesType == "before"
          ? moment(`${start_date_split}T${slots[i]?.from_time}Z`).subtract(
              this.minutes,
              "minutes"
            )
          : moment(`${start_date_split}T${slots[i]?.from_time}Z`).add(
              this.minutes,
              "minutes"
            )
        : moment(`${start_date_split}T${slots[i]?.from_time}Z`);

      console.log(
        currentSlotDate,
        " moment(`${current_date}T${current_time}Z`)",
        moment(`${current_date}T${current_time}Z`)
      );
      var condition =
        currentSlotDate > moment(`${current_date}T${current_time}Z`);
      console.log(condition, "create time slot condition", slots[i]);
      const dateMoment = moment(start_date.value, "YYYY-MM-DD");
      const timeMoment = moment(slots[i]?.from_time, "HH:mm");

      // Combine the date and time
      const combinedDateTime = dateMoment.set({
        hour: timeMoment.hours(),
        minute: timeMoment.minutes(),
      });
      console.log(
        "ieoujhkjkdwdjkwjdwd",
        slots[i]?.from_time,
        slots[i]?.to_time,
        slots[i]?.peak
      );
      const isClosed = this.isTimeInRangeArray({
        slot_date: start_date.value,
        slot_time: slots[i]?.from_time,
        index: i,
      });
      var temp = {
        id: i,
        disable: condition ? slots[i]?.disable || false : true,
        from_time: slots[i]?.from_time,
        to_time: slots[i]?.to_time,
        amount:
          this.props?.route?.params?.amount_type == "fixed_type"
            ? this.fixed_amount
            : slots[i]?.amount,
        peak: slots[i]?.peak,
        slotId: slots[i]?.slotid,
        isClosed: isClosed?.isClosed,
        reason: isClosed?.reason,
      };
      console.log(temp, "create time slot temp");
      new_slot.push(temp);
    }
    console.log(new_slot, "new slot");
    return new_slot;
  };
  componentDidMount = () => {
    // let {
    //   max_duration,
    //   open_time,
    //   close_time,
    //   splited_hours,
    // } = this.props?.route?.params;
    // let splited = splited_hours;
    // this.max_duration = max_duration / splited;
    // let slot = this.createTimeSlot(open_time, close_time, splited);
    // this.TimeSlot = slot;
    // console.FacilitySlotBookingsDetails
    const {
      facility: { facilitiesBookingData },
    } = this.props;
    let SlotStore = facilitiesBookingData?.SlotStore?.value;
    console.log(SlotStore, "SloteStore ComponentDitmount");
    let peak = 0;
    let non_peak = 0;
    SlotStore?.map((id) => {
      if (this.TimeSlot[id]?.peak) {
        peak++;
      } else {
        non_peak++;
      }
    });
    console.log(
      this.props.facility?.slotDetails?.remaining_peak_value - peak,
      this.props.facility?.slotDetails?.remaining_non_peak_value - non_peak,

      "commopemt did mount hours"
    );
    console.log(
      "compoenet did moiunr FacilitySlotBookingsDetails",
      peak,
      non_peak,
      // this.props.facility?.slotDetails,
      this.props.facility?.slotDetails?.total_peak_value,
      this.props.facility?.slotDetails?.total_non_peak_value
    );
    // let { facilityId, start_date } = this.props?.route?.params;
    // this.props.FacilitySlotBookingsDetails(
    //   facilityId,
    //   moment(start_date.value).format()
    // );

    this.setState({
      peak_non_peak_count: {
        true: this.props?.route?.params.isPeak
          ? this.props.facility?.slotDetails?.remaining_peak_value - peak
          : this.no_peak - this.props.facility?.slotDetails?.total_peak_value-peak,
        false: this.props?.route?.params.isNonPeak
          ? this.props.facility?.slotDetails?.remaining_non_peak_value -
            non_peak
          : this.no_non_peak -
            this.props.facility?.slotDetails?.total_non_peak_value-non_peak,
        overAll:
          this.props.facility?.slotDetails?.max_booking_quota -
          this.props.facility?.slotDetails?.slots?.length,
        limitReached: this.props.facility?.slotDetails?.booking_limit_reached,
      },
    });
  };

  handleSubmit = async () => {
    console.log(this.props.submitted, "this.props.submitted");
    const { onFacilityDataChange, submitControl } = this.props;
    const {
      mode,
      facility: { facilitiesBookingData },
    } = this.props;
    let SlotStore = facilitiesBookingData?.SlotStore?.value;
    // SlotStore.filter(data=>{data})
    let rule_ids = [];
    SlotStore.filter((data) => {
      console.log(this.TimeSlot[data].slotId, "this.TimeSlot[data].slotId;");
      rule_ids.push(this.TimeSlot[data].slotId);
    });
    console.log(SlotStore, "handleSubmit SlotStore", rule_ids);
    this.setState({ submit: true });
    var from_time = this.TimeSlot.filter((data) => data.id == SlotStore[0])?.map(
      (data) => data.from_time
    );
    var to_time = this.TimeSlot.filter(
      (data) => data.id == SlotStore[SlotStore.length - 1]
    )?.map((data) => data.to_time);
    var from_time = from_time[0];
    var to_time = to_time[0];
    console.log(from_time, to_time, "from time to time1 ");
    var name = "start_time";
    var value = from_time;
    onFacilityDataChange({
      name,
      value,
      stateChange: true,
    });
    var name = "end_time";
    var value = to_time;
    onFacilityDataChange({
      name,
      value,
      stateChange: true,
    });
    onFacilityDataChange({
      name: "rule_ids",
      value: rule_ids,
    });
    submitControl({ submitted: true });
    this.props.navigation.goBack();
    setTimeout(() => {
      submitControl({ submitted: false });
    }, 1000);
  };

  slotStateCheck = (id) => {
    console.log("logging r", id);
    const {
      facility: { facilitiesBookingData },
    } = this.props;
    let SlotStore = facilitiesBookingData?.SlotStore?.value;
    const { TimeSlot } = this;
    console.log(TimeSlot, "slotes slot check");
    let templength = SlotStore.length;
    if (TimeSlot?.some((data) => data.id === id)) {
      if (TimeSlot[id].disable) {
        return "gdisabled";
      }
      if (SlotStore.length === 0) {
        return "genabled";
      }

      let storecheck = SlotStore.includes(id);
      if (storecheck) {
        if (SlotStore[0] == id || SlotStore[templength - 1] == id) {
          return "yenabled";
        } else {
          return "ydisabled";
        }
      } else {
        if (SlotStore[0] - 1 == id || SlotStore[templength - 1] + 1 == id) {
          if (this.max_duration == SlotStore.length) {
            if (SlotStore[templength - 1] + 1 == id) {
              Platform.OS == "android"
                ? ToastAndroid.show("you reached your time limit", 10)
                : Toast.show("you reached your time limit", 3);
            }
            if (SlotStore[templength - 1] + 1 == TimeSlot.length) {
              Platform.OS == "android"
                ? ToastAndroid.show("you reached your time limit", 10)
                : Toast.show("you reached your time limit", 3);
            }
            return "gdisabled";
          }
          return "genabled";
        } else {
          return "gdisabled";
        }
      }
    }
  };

  slotbook = (id, slotDetail, slotState) => {
    const {
      facility: { facilitiesBookingData, slotDetails },
      facilityChange,
    } = this.props;
    let SlotStore = facilitiesBookingData?.SlotStore?.value;
    let slotBooking = this.peak_non_peak_count;
    console.log(
      "this.props.facility?.slotDetails?.slots",
      this.remaining_overallLimit,
      SlotStore?.length
    );
    console.log(JSON.stringify(slotBooking), "[slot book details]", slotState);

    if (
      this.props.facility?.slotDetails?.slots?.some(
        (data) => data.id == this.TimeSlot[id]?.slotId
      )
    ) {
      if (slotState != "yenabled") {
        ToastMessage(200, "Already booked this slot");
        return;
      }
    }
    if (this.is_quota) {
      if (this.remaining_overallLimit - SlotStore?.length == 0) {
        if (slotState != "yenabled") {
          ToastMessage(200, "Over all booking limit has been reached.");
          return;
        }
      }
      if (true) {
        if (this.state.peak_non_peak_count.true == 0) {
          if (slotDetail.peak) {
            if (slotState != "yenabled") {
              ToastMessage(200, "Peak hour booking limit has been reached");
              return;
            }
          }
        }
      }
      if (true) {
        if (this.state.peak_non_peak_count.false == 0) {
          if (!slotDetail.peak) {
            if (slotState != "yenabled") {
              ToastMessage(200, "Non-peak hour booking limit has been reached");
              return;
            }
          }
        }
      }
    }

    const { onFacilityDataChange } = this.props;
    let peak = this.state.peak_non_peak_count.true;
    let non_peak = this.state.peak_non_peak_count.false;
    let logic = true;
    console.log(peak, non_peak, "this.peak_non_peak_count");
    var temp = [...SlotStore];
    if (temp.includes(id)) {
      const index = temp.findIndex((get) => {
        return get === id;
      });
      if (index == 0) {
        logic = false;
        console.log(JSON.stringify(this.TimeSlot[id]), "983928320");

        if (this.TimeSlot[id]?.peak) {
          // this.props.facility?.slotDetails?.remaining_peak_value != peak &&
          peak++;
        } else {
          // this.props.facility?.slotDetails?.remaining_non_peak_value != peak &&
          non_peak++;
        }

        temp.shift();
      } else {
        console.log(JSON.stringify(this.TimeSlot[id]), "98392832");
        logic = false;
        if (this.TimeSlot[id]?.peak) {
          // this.props.facility?.slotDetails?.remaining_peak_value != peak &&
          peak++;
        } else {
          // this.props.facility?.slotDetails?.remaining_non_peak_value != peak &&
          non_peak++;
        }
        temp.pop();
      }
    } else {
      var slot_length = temp.length;
      this.max_duration > slot_length && temp.push(id);
    }
    temp.sort((a, b) => a - b);

    console.log(SlotStore, "Slotstorw222");
    console.log(
      peak,
      non_peak,
      "this.peak_non_peak_count 1",
      JSON.stringify(temp),
      id
    );
    if (logic) {
      if (this.TimeSlot[id]?.peak) {
        peak != 0 && peak--;
      } else {
        non_peak != 0 && non_peak--;
      }
    }
    var totalAmount = this.TimeSlot.reduce(function(accumulator, obj) {
      if (temp.includes(obj.id)) {
        return accumulator + obj.amount;
      } else {
        return accumulator;
      }
    }, 0);
    console.log(peak, non_peak, "this.peak_non_peak_count 2");

    this.setState({
      peak_non_peak_count: {
        ...this.peak_non_peak_count,
        true: peak,
        false: non_peak,
        overAll:
          this.props.facility?.slotDetails?.max_booking_quota -
          (this.no_peak -
            this.peak_non_peak_count.true +
            this.no_non_peak -
            this.peak_non_peak_count.false),
      },
    });

    console.log(temp, "slot book temp ", totalAmount, peak, non_peak);
    // this.newTimeSlot = this.TimeSlot?.map((obj, index) => {
    //   if (!temp.includes(index)) {
    //     console.log(
    //       peak,
    //       non_peak,
    //       "32839232983",
    //       peak == 0 && obj?.peak,
    //       non_peak == 0 && !obj?.peak
    //     );
    //     if (peak == 0 && obj?.peak) {
    //       return { ...obj, disable: true };
    //     } else if (non_peak == 0 && !obj?.peak) {
    //       return { ...obj, disable: true };
    //     } else {
    //       return { ...obj };
    //     }
    //   }
    //   return obj;
    // });

    // console.log(JSON.stringify(this.peak_non_peak_count), "countTrueFalse");
    onFacilityDataChange({
      name: "SlotStore",
      value: temp,
    });
    onFacilityDataChange({
      name: "amount",
      value: totalAmount,
    });

    console.log(SlotStore, "slot book ");

    let rule_ids = [];
    temp.filter((data) => {
      console.log(this.TimeSlot[data].slotId, "this.TimeSlot[data].slotId;");
      rule_ids.push(this.TimeSlot[data].slotId);
    });
    console.log(temp, "handleSubmit SlotStore", rule_ids);
    var from_time = this.TimeSlot.filter((data) => data.id == temp[0])?.map(
      (data) => data.from_time
    );
    var to_time = this.TimeSlot.filter(
      (data) => data.id == temp[temp.length - 1]
    )?.map((data) => data.to_time);
    var from_time = from_time[0];
    var to_time = to_time[0];
    console.log(from_time, to_time, "from time to time1 ");
    var name = "start_time";
    var value = from_time;
    onFacilityDataChange({
      name,
      value,
      stateChange: true,
    });
    var name = "end_time";
    var value = to_time;
    onFacilityDataChange({
      name,
      value,
      stateChange: true,
    });
    onFacilityDataChange({
      name: "rule_ids",
      value: rule_ids,
    });
  };

  handleDateandTime({ date, time }) {
    const dateMoment = moment(date, "YYYY-MM-DD");
    const timeMoment = moment(time, "HH:mm");

    // Combine the date and time
    const combinedDateTime = dateMoment.set({
      hour: timeMoment.hours(),
      minute: timeMoment.minutes(),
    });
    console.log(combinedDateTime.format("HH:mm"), "handleDateandTime");
    return combinedDateTime;
  }

  isTimeInRangeArray({ slot_date, slot_time, index }) {
    let isBlock = [];
    let isClosed = false;
    const { handleDateandTime } = this;
    const { closure_time } = this.props.facility?.slotDetails;
    const slotTime = handleDateandTime({
      date: slot_date,
      time: slot_time,
    });
    console.log(closure_time, "closure_time", index, "s");
    // console.log(slottime,combinedDateTime,"0987098767896");
    // const start_date_split = moment(`${start_date}`).format("YYYY-MM-DD");

    // const Time = moment(`${start_date_split}T${time}Z`);
    // const timeMoment = Time;

    // console.log(slottime, "fromTimeMoment first", time);
    let reason = "";
    for (const rangeObj of closure_time) {
      const {
        from_date,
        to_date,
        start_time,
        end_time,
        mode_of_closure,
        days,
        facility_closure: { note_to_resident },
      } = rangeObj;
      reason = note_to_resident;
      // console.log(facility_closure, "range: ", index);
      const startOfDay = moment(from_date).startOf("day");

      // End of the day
      const endOfDay = moment(to_date).endOf("day");
      console.log(mode_of_closure, "mode_of_closure", index);
      if (mode_of_closure == "block") {
        const fromtimeBLock = handleDateandTime({
          date: from_date,
          time: start_time,
        });
        const endtimeBLock = handleDateandTime({
          date: to_date,
          time: end_time,
        });
        isBlock.push(
          slotTime.isBetween(fromtimeBLock, endtimeBLock, null, "[]")
        );
      } else if (mode_of_closure == "daily" || mode_of_closure == "weekly") {
        if (mode_of_closure == "weekly") {
          const dayName = moment(slot_date).format("dddd");
          if (!days.includes(dayName.toLowerCase())) {
            isBlock.push(false);
          }
        }
        const dayName = moment(slot_date).format("dddd");
        const isRun = days.includes(dayName.toLowerCase());
        console.log(
          days.includes(dayName.toLowerCase()),
          "oijdodjowdjwodjowdj",
          JSON.stringify(days),
          dayName.toLowerCase()
        );
        const isRunCondition = mode_of_closure == "daily" ? true : isRun;
        console.log(
          `[Check time isBetwee] slot_time  :  ${slotTime.format()}  startDay : ${startOfDay.format()} endDay : ${endOfDay.format()}`
        );
        if (
          isRunCondition &&
          slotTime.isBetween(startOfDay, endOfDay, null, "[]")
        ) {
          const from_time = handleDateandTime({
            date: slot_date,
            time: start_time,
          });
          const to_time = handleDateandTime({
            date: slot_date,
            time: end_time,
          });

          console.log(
            ` [Daily]  slot_time  :  ${slotTime.format()} from_time  : ${from_time.format()} to_time : ${to_time.format()}  check : ${slotTime.isBetween(
              from_time,
              to_time,
              null,
              "[]"
            )}`
          );
          console.log(
            "loop slotTime",
            slotTime.isBetween(from_time, to_time, null, "[]"),
            index
          );
          if (slotTime.isBetween(from_time, to_time, null, "[]")) {
            isBlock.push(slotTime.isBetween(from_time, to_time, null, "[]"));
          }
          // break;
        } else {
          // return false;
        }
      } else if (mode_of_closure == "weekly") {
      } else {
        // return false;
      }
      // const fromTimeMoment = moment(rangeObj.from_time);
      // const toTimeMoment = moment(rangeObj.to_time);
      // console.log(
      //   "fromTimeMoment",

      //   // fromTimeMoment.format("hh:mm:ss"),
      //   // toTimeMoment.format("hh:mm:ss"),
      //   // time.format("hh:mm:ss"),
      //   rangeObj,
      //   slottime,
      //   combinedDateTime.format("HH:mm"),
      //   combinedDateTime.isBetween(fromTimeMoment, toTimeMoment, null, "[]")
      // );

      // if (
      //   // combinedDateTime.isBetween(fromTimeMoment, toTimeMoment, null, "[]")
      // ) {
      //   return true;
      // }

      // if ()
      // return isClosed;
    }

    // return false;
    console.log(
      this.state.peak_non_peak_count.overAll,
      "this.state.peak_non_pl",
      this.props.facilitiesBookingData?.facility?.SlotStore?.value
    );
    return {
      isClosed: isBlock.includes(true),
      reason: isBlock.includes(true) ? reason : "",
    };
  }
  render() {
    console.log(
      this.props?.route?.params.max_booking,
      "no of slotes count check,",
      this.props?.route?.params.no_non_peak,
      this.props?.route?.params.isNonPeak,
      this.props?.route?.params.isPeak
    );
    const {
      mode,
      facility: {
        facilitiesBookingData: { amount, SlotStore },
        slotDetails,
        loader,
        slots,
      },
    } = this.props;
    console.log(
      "this.state.peak_non_peak_count.overAll",
      slotDetails?.total_non_peak_value,
      slotDetails?.total_peak_value
    );
    const { handleSubmit, slotbook, slotStateCheck } = this;
    console.log("logging", "ddddd", slots);
    let {
      max_duration,
      open_time,
      close_time,
      splited_hours,
      // slots,
      facilityId,
      start_date,
    } = this.props?.route?.params;
    let splited = splited_hours;
    this.max_duration = max_duration / splited;
    this.TimeSlot = this.createTimeSlot(slots);
    console.log(this.TimeSlot, "pooioiud");
    console.log(
      amount.value,
      "294209420940294",
      slotDetails,
      loader,
      slots,
      this.props.facility?.slotDetails?.booking_limit_reached,
      this.TimeSlot.length,
      !this.props.facility?.slotDetails?.booking_limit_reached &&
        this.TimeSlot.length != 0
    );
    console.log(
      // this.props.facility?.slotDetails?.slot,
      // this.TimeSlot,
      "facilitiesBookingData?.SlotStore",

      this.props.facility?.slotDetails?.booking_limit_reached,
      this.props.facility?.slotDetails?.remaining_overall_quota
    );
    let isBookingLimitReached =
      this.props.facility?.slotDetails?.booking_limit_reached ||
      this.props.facility?.slotDetails?.remaining_overall_quota == 0;
    // if (!this.is_peak && !this.is_nonPeak) {
    //   isBookingLimitReached =
    //     this.props.facility?.slotDetails?.booking_limit_reached ||
    //     slotDetails?.total_peak_value + slotDetails?.total_non_peak_value ===
    //       this.max_booking;
    // } else if (!this.is_peak) {
    //   isBookingLimitReached =
    //     this.props.facility?.slotDetails?.booking_limit_reached ||
    //     slotDetails?.total_peak_value +
    //       (this.no_non_peak -
    //         this.props.facility?.slotDetails?.remaining_non_peak_value) ===
    //       this.max_booking;
    // } else if (!this.is_nonPeak) {
    //   isBookingLimitReached =
    //     this.props.facility?.slotDetails?.booking_limit_reached ||
    //     this.props.facility?.slotDetails?.remaining_overall_quota == 0;
    // }
    this.props.facility?.slotDetails?.booking_limit_reached ||
    !this.is_peak ||
    !this.is_nonPeak
      ? slotDetails?.total_peak_value + slotDetails?.total_non_peak_value ===
        this.max_booking
      : false;
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
            headerTitle="Select Your Slot"
            onPressLeftIcon={handleSubmit}
            containerStyle={{
              ...commonStyles.headerSpacing,
            }}
          >
            {!isBookingLimitReached &&
              this.TimeSlot.length != 0 &&
              (this.is_quota || this.payment_method) && (
                <View
                  style={{
                    backgroundColor: "white",
                    elevation: 4,
                    shadowOffset: { width: 1, height: 1 },
                    shadowOpacity: 0.55,
                    shadowRadius: 0.5,
                    paddingVertical: ms(25),
                    marginHorizontal: ms(20),
                    borderRadius: ms(10),
                    paddingHorizontal: ms(20),
                  }}
                >
                  <View>
                    {this.is_quota && (
                      <View>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginBottom: ms(10),
                          }}
                        >
                          <View
                            style={{
                              height: mvs(15),
                              width: ms(15),
                              backgroundColor: "#FFC727",
                              borderRadius: ms(20),
                            }}
                          ></View>
                          <View
                            style={{
                              flexDirection: "row",
                              marginLeft: ms(5),
                              flex: 1,
                              flexWrap: "wrap",
                            }}
                          >
                            <Text
                              style={{
                                color: "black",
                                fontFamily: fonts.bold,
                                fontSize: ms(12),
                                alignSelf: "center",
                              }}
                            >
                              OverAll Limit :{" "}
                            </Text>
                            <Text
                              style={{
                                color: themes[mode]["lightAshDark"],
                                fontFamily: fonts.medium,
                                fontSize:ms(12),
                              }}
                            >
                              {console.log(
                                this.no_non_peak,
                                this.state.peak_non_peak_count.false,

                                "booking count and data"
                              )}
                              {this.remaining_overallLimit -
                                SlotStore?.value?.length}
                              /{this.max_booking}{" "}
                              {`( Reset on ${moment(
                                this.props.facility?.slotDetails?.resets_on
                              ).format("DD MMM YYYY")})`}
                            </Text>
                          </View>
                        </View>
                        {true && (
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                            }}
                          >
                            <View
                              style={{
                                height: mvs(15),
                                width: ms(15),
                                backgroundColor: "green",
                                borderRadius: ms(20),
                              }}
                            ></View>
                            <View
                              style={{
                                flexDirection: "row",
                                marginLeft: ms(5),
                                flex: 1,
                                flexWrap: "wrap",
                              }}
                            >
                              <Text
                                style={{
                                  color: "black",
                                  fontFamily: fonts.bold,
                                  fontSize: ms(12),
                                  alignSelf: "center",
                                }}
                              >
                                Peak Hour : {""}
                              </Text>
                              <Text
                                style={{
                                  color: themes[mode]["lightAshDark"],
                                  fontFamily: fonts.medium,
                                  fontSize: ms(12),
                                }}
                              >
                                {this.state.peak_non_peak_count.true}/
                                {this.no_peak} Left{" "}
                                {this.is_peak
                                  ? `( Reset on ${moment(
                                      this.props.facility?.slotDetails
                                        ?.peak_solt_resets_on
                                    ).format("DD MMM YYYY")})`
                                  : `( Reset on ${moment(
                                      this.props.facility?.slotDetails
                                        ?.resets_on
                                    ).format("DD MMM YYYY")})`}{" "}
                              </Text>
                            </View>
                          </View>
                        )}
                        {true && (
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              marginTop: ms(10),
                            }}
                          >
                            <View
                              style={{
                                height: mvs(15),
                                width: ms(15),
                                backgroundColor: "orange",
                                borderRadius: ms(20),
                              }}
                            ></View>
                            <View
                              style={{
                                flexDirection: "row",
                                marginLeft: ms(5),
                                flex: 1,
                                flexWrap: "wrap",
                              }}
                            >
                              <Text
                                style={{
                                  color: "black",
                                  fontFamily: fonts.bold,
                                  fontSize: ms(12),
                                  alignSelf: "center",
                                }}
                              >
                                Non Peak Hour :{" "}
                              </Text>
                              <Text
                                style={{
                                  color: themes[mode]["lightAshDark"],
                                  fontFamily: fonts.medium,
                                  fontSize: ms(12),
                                }}
                              >
                                {this.state.peak_non_peak_count.false}/
                                {this.no_non_peak} Left{" "}
                                {this.is_nonPeak
                                  ? `( Reset on ${moment(
                                      this.props.facility?.slotDetails
                                        ?.non_peak_slot_reset_on
                                    ).format("DD MMM YYYY")})`
                                  : `( Reset on ${moment(
                                      this.props.facility?.slotDetails
                                        ?.resets_on
                                    ).format("DD MMM YYYY")})`}
                              </Text>
                            </View>
                          </View>
                        )}

                        <View
                          style={{
                            borderColor: "grey",
                            borderWidth: 0.5,
                            width: "100%",
                            marginVertical: ms(10),
                          }}
                        />
                      </View>
                    )}
                    {this.payment_method && (
                      <View>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            paddingHorizontal: ms(5),
                          }}
                        >
                          <Text
                            style={{
                              color: "black",
                              fontFamily: fonts.bold,
                              fontSize:ms(12),
                            }}
                          >
                            Total Amount
                          </Text>
                          <Text
                            style={{
                              color: "black",
                              fontFamily: fonts.bold,
                              fontSize: ms(12),
                            }}
                          >
                            $ {amount?.value?.toFixed(1)} {}
                          </Text>
                        </View>
                      </View>
                    )}
                  </View>
                </View>
              )}
            <ScrollView
              contentContainerStyle={{
                marginHorizontal: 15,
              }}
              style={{
                height: "100%",
                flex: 1,
              }}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {!isBookingLimitReached && this.TimeSlot.length != 0 ? (
                <View style={Styles.slotMain}>
                  {!loader ? (
                    this.TimeSlot?.map((data, index) => {
                      console.log(
                        this.state.submit,
                        "ffjhbrfrfhbfjrf",
                        data,
                        index
                      );
                      let slotState =
                        !this.state.submit && slotStateCheck(data.id);
                      let disable =
                        data.disable ||
                        slotState === "gdisabled" ||
                        slotState === "ydisabled";
                      let prizeColor = "";
                      switch (slotState) {
                        case "genabled":
                          prizeColor = "#C1C1C1";
                          break;
                        case "gdisabled":
                          prizeColor = "#E0E0E0";
                          break;
                        case "yenabled":
                          prizeColor = "#FFE291";
                          break;
                        case "ydisabled":
                          prizeColor = "#FFE291";
                          break;
                      }
                      const imagePath = data?.peak
                        ? disable
                          ? slotState !== "gdisabled"
                            ? require("../../../../../assets/img/peakhrD.png")
                            : require("../../../../../assets/img/pDis.png")
                          : require("../../../../../assets/img/peakhr.png")
                        : disable
                        ? slotState !== "gdisabled"
                          ? require("../../../../../assets/img/nonpeakD.png")
                          : require("../../../../../assets/img/nonDis.png")
                        : require("../../../../../assets/img/nonpeak.png");

                      console.log(
                        data,
                        "enabke98298392",
                        this.props.facility?.slotDetails?.slots?.some(
                          (data) => data.id == data?.slotId
                        )
                      );
                      const { start_date } = this.props?.route?.params;
                      const start_date_split = moment(
                        `${start_date.value}`
                      ).format("YYYY-MM-DD");

                      const time = moment(
                        `${start_date_split}T${data?.from_time}Z`
                      );
                      console.log("09878987");
                      console.log(
                        start_date_split,
                        // data,
                        moment(
                          `${start_date_split}T${data?.from_time}Z`
                        ).format(),
                        "test123"
                      );
                      const timeRangeArray = this.props.facility?.slotDetails
                        ?.closure_time;
                      const isClosed = false;
                      const isBooked = this.props.facility?.slotDetails?.slots?.some(
                        (Data) => Data.id == data?.slotId
                      );
                      return (
                        <Animated.View
                          style={[
                            {
                              ...Styles.timeSlotBox,
                              borderColor: data?.isClosed
                                ? "#FF6347"
                                : "transparent",
                              borderWidth: 0.3,
                            },
                            Styles[isBooked ? "ydisabled" : slotState],
                          ]}
                          {...customAnimation("FadeInDown", 700, 50, index)}
                        >
                          <TouchableOpacity
                            key={index}
                            onPress={() =>
                              !data?.isClosed &&
                              slotbook(data.id, data, slotState)
                            }
                            disabled={disable}
                          >
                            <View
                              style={{
                                // width: "100%",
                                // backgroundColor: "red",
                                // justifyContent: "space-between",
                                flexDirection: "row",
                                paddingBottom: ms(5),
                                // gap:2
                                // position:"absolute"
                              }}
                            >
                              <Image
                                source={
                                  isBooked
                                    ? data?.peak
                                      ? require("../../../../../assets/img/peakhrD.png")
                                      : require("../../../../../assets/img/nonpeakD.png")
                                    : imagePath
                                }
                                style={{
                                  width: ms(70),
                                  height: vs(10),
                                }}
                              />
                              {/* {this.props.facility?.slotDetails?.slots?.some(
                                (Data) => Data.id == data?.slotId
                              ) && (
                                <Image
                                  source={require("../../../../../assets/img/booked.png")}
                                  style={{
                                    width: ms(9),
                                    height: vs(8),
                                  }}
                                />
                              )} */}
                            </View>
                            <Text
                              style={[
                                Styles.slotText,
                                { color: disable ? "#C1C1C1" : "#282828" },
                              ]}
                            >
                              {data.from_time} - {data.to_time}
                            </Text>
                            {!data?.isClosed &&
                              this.payment_method &&
                              !this.amount_type && (
                                <View
                                  style={{
                                    backgroundColor: prizeColor,
                                    paddingVertical: 3,
                                    alignItems: "center",
                                    marginTop: 5,
                                    borderRadius: 5,
                                    alignSelf: "flex-end",
                                    paddingHorizontal: ms(10),
                                  }}
                                >
                                  <Text
                                    style={{
                                      color: disable ? "#C1C1C1" : "#282828",
                                      fontFamily: fonts.bold,
                                    }}
                                  >
                                    $ {data?.amount}
                                  </Text>
                                </View>
                              )}
                            {data?.isClosed && (
                              <View
                                style={{
                                  backgroundColor: "#FF6347",
                                  paddingVertical: 3,
                                  alignItems: "center",
                                  marginTop: 5,
                                  borderRadius: 5,
                                  alignSelf: "center",
                                  paddingHorizontal: ms(15),
                                }}
                              >
                                <Text
                                  style={{
                                    color: "white",
                                    fontFamily: fonts.bold,
                                  }}
                                >
                                  Closed
                                </Text>
                              </View>
                            )}
                            {isBooked && (
                              <View
                                style={{
                                  backgroundColor: "#66D47E",
                                  paddingVertical: 3,
                                  alignItems: "center",
                                  marginTop: 5,
                                  borderRadius: 5,
                                  alignSelf: "center",
                                  paddingHorizontal: ms(15),
                                }}
                              >
                                <Text
                                  style={{
                                    color: "#FCFEFC",
                                    fontFamily: fonts.bold,
                                    fontSize: ms(13),
                                  }}
                                >
                                  Booked
                                </Text>
                              </View>
                            )}
                          </TouchableOpacity>
                        </Animated.View>
                      );
                    })
                  ) : (
                    <ActivityIndicator size="large" color={"#FFC727"} />
                  )}
                  {this.props.facility?.slotDetails?.closure_time?.length >
                    0 && (
                    <View
                      style={{
                        marginVertical: ms(20),
                        paddingHorizontal: 20,
                        width: "100%",
                      }}
                    >
                      <Text
                        style={{
                          color: themes[mode]["headingColor"],
                          fontFamily: fonts.bold,
                          fontWeight: "700",
                          fontSize: ms(15),
                          letterSpacing: 1,
                          marginBottom: 5,
                        }}
                      >
                        Reason for closed
                      </Text>
                      {this.props.facility?.slotDetails.closure_time?.map(
                        (data) => {
                          console.log(data, "closure data tyme");
                          const {
                            start_time,
                            end_time,
                            facility_closure: { note_to_resident },
                          } = data;
                          return (
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                                marginVertical: 5,
                                width: "75%",
                              }}
                            >
                              <View style={{ width: 80 }}>
                                <Text
                                  style={{
                                    color: themes[mode]["lightAsh"],
                                    fontFamily: fonts.medium,

                                    fontSize: ms(13),
                                  }}
                                >
                                  {start_time} - {end_time}
                                </Text>
                              </View>
                              <View
                                style={{
                                  height: 5,
                                  width: 5,
                                  borderRadius: 50,
                                  backgroundColor: themes[mode]["lightAsh"],
                                  marginHorizontal: 10,
                                }}
                              />
                              <Text
                                style={{
                                  color: themes[mode]["lightAsh"],
                                  fontFamily: fonts.medium,

                                  fontSize:ms(13),
                                }}
                              >
                                {note_to_resident}
                              </Text>
                            </View>
                          );
                        }
                      )}
                    </View>
                  )}
                </View>
              ) : (
                <View
                  style={{
                    // alignSelf:"center"
                    marginTop: ms(90),
                  }}
                >
                  <Image
                    source={require("../../../../../assets/img/noslots.png")}
                    style={{
                      width: "100%",
                      height: vs(200),
                      alignSelf: "center",
                    }}
                  />
                  <Text
                    style={{
                      alignSelf: "center",
                      fontSize:ms(17),
                      color: themes[mode]["headingColor"],
                      marginVertical: ms(30),
                      fontWeight: "700",
                      letterSpacing: 0.5,
                      textAlign: "center",
                      paddingHorizontal: ms(20),
                    }}
                  >
                    {this.props?.route?.params.max_booking != 0 &&
                    isBookingLimitReached
                      ? "You have reached the maximum limit for bookings"
                      : this.TimeSlot.length == 0
                      ? "No slots available for today"
                      : ""}
                  </Text>
                </View>
              )}
            </ScrollView>
          </WithBgHeader>
        </SafeAreaView>
        <View style={{ position: "absolute", bottom: 0, width: "100%" }}>
          <SubmitButton
            buttonText="Next"
            handleSubmit={() => handleSubmit("name", "value")}
            disableBtn={this.props.submitted}
          />
        </View>
      </KeyboardAwareScrollView>
    );
  }
}

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
    marginBottom: "25%",
  },
  genabled: {
    backgroundColor: "#EFEFEF",
  },
  gdisabled: {
    backgroundColor: "#F9F9F9",
  },
  yenabled: {
    backgroundColor: "#FFC727",
  },
  ydisabled: {
    backgroundColor: "#FFE9A9",
  },
});

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

const {
  facilitySubmit,
  onFacilityDataChange,
  facilityValidation,
  facilityChange,
  FacilitySlotBookingsDetails,
} = facility;
const { submitControl } = login;

const mapDispatchToProps = {
  facilitySubmit,
  onFacilityDataChange,
  facilityValidation,
  facilityChange,
  submitControl,
  FacilitySlotBookingsDetails,
};

export default connect(mapStateToProps, mapDispatchToProps)(FacilityTimeSlot);
