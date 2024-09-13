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
  FlatList
} from "react-native";
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { FacilitySlotBookingsDetails, onFacilityDataChange } from '../../../../redux/actions/facility_booking';
import { ms, mvs,vs } from '../../../../helpers/scaling';
import { customAnimation } from '../../../../animation/CommonAnimation';
import Animated from 'react-native-reanimated';
import Toast from "react-native-simple-toast";
import { themes, commonColors, fonts } from "../../../../themes";
import moment from "moment";
import { ToastMessage } from "../../../../components";

export default function FacilityTimeSlotD({
  open_time,
  close_time,
  max_duration,
  start_date,
  splited_hours,
  slots,
  max_booking,
  no_non_peak,
  no_peak,
  facilityId,
  amount_type,
  fixed_amount,
  payment_method,
  isPeak,
  isNonPeak,
  isQuota,
  isDefaultTime,
  minutes,
  minutesType,
  renderDate,
  SubsequentDate
}) {
  console.log(amount_type, slots, facilityId, "dde");
  const dispatch=useDispatch();
  const fact = useSelector((state) => state?.facility);
  const profile = useSelector((state) => state?.profile);
  const mode = profile?.mode || "light";

  const loader=fact?.loader
  const slotDetails = fact?.slotDetails || {};
  const slot = fact?.slots;
  const facilitiesBookingData = fact?.facilitiesBookingData
  console.log("fact", fact, slotDetails);
  const remainingOverallLimit = slotDetails.remaining_overall_quota;
  const remainingPeakValue = slotDetails.remaining_peak_value;
  const remainingNonPeakValue = slotDetails.remaining_non_peak_value;
  let isBookingLimitReached = slotDetails?.booking_limit_reached || slotDetails?.remaining_overall_quota == 0;

  const no_peak_value = isPeak ? no_peak : max_booking;
  const no_non_peak_value = isNonPeak ? no_non_peak : max_booking;

  const [submit, setSubmit] = useState(false);
  const [peakNonPeakCount, setPeakNonPeakCount] = useState({
    true: 0,
    false: 0,
    overAll: 0,
    limitReached: false,
  });

  const [showFacilityTimeSlot, setShowFacilityTimeSlot] = useState(false);

  const newTimeSlot = [];

  let max_duration_value = null;

  const paymentMethod = payment_method === "paid";
  const calculatePeakNonPeak = () => {
    let SlotStore = facilitiesBookingData?.SlotStore?.value;
    console.log(SlotStore, "SlotStore ComponentDidMount");
    let peak = 0;
    let non_peak = 0;
    SlotStore?.forEach((id) => {
      if (TimeSlot[id]?.peak) {
        peak++;
      } else {
        non_peak++;
      }
    });

    console.log(
      remainingPeakValue - peak,
      remainingNonPeakValue - non_peak,
      "ComponentDidMount hours"
    );

    console.log(
      "ComponentDidMount FacilitySlotBookingsDetails",
      peak,
      non_peak,
      slotDetails?.total_peak_value,
      slotDetails?.total_non_peak_value
    );

    setPeakNonPeakCount({
      true: isPeak
        ? remainingPeakValue - peak
        : no_peak - slotDetails?.total_peak_value - peak,
      false: isNonPeak
        ? remainingNonPeakValue - non_peak
        : no_non_peak - slotDetails?.total_non_peak_value - non_peak,
      overAll: slotDetails?.max_booking_quota - slotDetails?.slots?.length,
      limitReached: slotDetails?.booking_limit_reached,
    });
    console.log(isQuota, paymentMethod, TimeSlot, isBookingLimitReached, "mmm")
  };

  const isTimeInRangeArray = ({ slot_date, slot_time, index }) => {
    let isBlock = [];
    let isClosed = false;
    const { closure_time } = slotDetails;
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
      peakNonPeakCount.overAll,
      "this.state.peak_non_pl",
      fact?.SlotStore?.value
    );
    return {
      isClosed: isBlock.includes(true),
      reason: isBlock.includes(true) ? reason : "",
    };
  }
  const handleDateandTime = ({ date, time }) => {
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
  const CreateTimeSlot = (slots) => {
    console.log(slots, "slots createTine slot");
    const start_date = facilitiesBookingData?.start_date
    var start_date_split = moment(`${start_date?.value}`).format("YYYY-MM-DD");
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
    console.log(minutesType, "create time slot dates", minutes);
    for (var i = 0; i < slots.length; i++) {
      let currentSlotDate = isDefaultTime
        ? minutesType == "before"
          ? moment(`${start_date_split}T${slots[i]?.from_time}Z`).subtract(
            minutes,
            "minutes"
          )
          : moment(`${start_date_split}T${slots[i]?.from_time}Z`).add(
            minutes,
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
      const isClosed = isTimeInRangeArray({
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
          amount_type == "fixed_type"
            ? fixed_amount
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

  const slotStateCheck = (id) => {
    console.log("logging r", id);
    let SlotStore = facilitiesBookingData?.SlotStore?.value;
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
          if (max_duration == SlotStore.length) {
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

  const slotbook = (id, slotDetail, slotState) => {

    let SlotStore = facilitiesBookingData?.SlotStore?.value;
    let slotBooking = peakNonPeakCount;
    console.log(
      remainingOverallLimit,
      SlotStore?.length
    );
    console.log(JSON.stringify(slotBooking), "[slot book details]", slotState);

    if (
      slotDetails?.slots?.some(
        (data) => data.id == TimeSlot[id]?.slotId
      )
    ) {
      if (slotState != "yenabled") {
        ToastMessage(200, "Already booked this slot");
        return;
      }
    }
    if (isQuota) {
      if (remainingOverallLimit - SlotStore?.length == 0) {
        if (slotState != "yenabled") {
          ToastMessage(200, "Over all booking limit has been reached.");
          return;
        }
      }
      if (true) {
        if (peakNonPeakCount.true == 0) {
          if (slotDetail.peak) {
            if (slotState != "yenabled") {
              ToastMessage(200, "Peak hour booking limit has been reached");
              return;
            }
          }
        }
      }
      if (true) {
        if (peakNonPeakCount.false == 0) {
          if (!slotDetail.peak) {
            if (slotState != "yenabled") {
              ToastMessage(200, "Non-peak hour booking limit has been reached");
              return;
            }
          }
        }
      }
    }


    let peak = peakNonPeakCount.true;
    let non_peak = peakNonPeakCount.false;
    let logic = true;
    console.log(peak, non_peak, "this.peak_non_peak_count");
    var temp = [...SlotStore];
    if (temp.includes(id)) {
      const index = temp.findIndex((get) => {
        return get === id;
      });
      if (index == 0) {
        logic = false;
        console.log(JSON.stringify(TimeSlot[id]), "983928320");

        if (TimeSlot[id]?.peak) {
          // this.props.facility?.slotDetails?.remaining_peak_value != peak &&
          peak++;
        } else {
          // this.props.facility?.slotDetails?.remaining_non_peak_value != peak &&
          non_peak++;
        }

        temp.shift();
      } else {
        console.log(JSON.stringify(TimeSlot[id]), "98392832");
        logic = false;
        if (TimeSlot[id]?.peak) {
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
      max_duration > slot_length && temp.push(id);
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
      if (TimeSlot[id]?.peak) {
        peak != 0 && peak--;
      } else {
        non_peak != 0 && non_peak--;
      }
    }
    var totalAmount = TimeSlot.reduce(function (accumulator, obj) {
      if (temp.includes(obj.id)) {
        return accumulator + obj.amount;
      } else {
        return accumulator;
      }
    }, 0);
    console.log(peak, non_peak, "this.peak_non_peak_count 2");

    setPeakNonPeakCount({
      ...peakNonPeakCount,
      true: peak,
      false: non_peak,
      overAll:
        slotDetails?.max_booking_quota -
        (no_peak -
          peakNonPeakCount.true +
          no_non_peak -
          peakNonPeakCount.false),
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
    dispatch(onFacilityDataChange({
      name: "SlotStore",
      value: temp,
    }))
    dispatch(onFacilityDataChange({
      name: "amount",
      value: totalAmount,
    }))

    console.log(SlotStore, "slot book ");

    let rule_ids = [];
    temp.filter((data) => {
      console.log(TimeSlot[data].slotId, "this.TimeSlot[data].slotId;");
      rule_ids.push(TimeSlot[data].slotId);
    });
    console.log(temp, "handleSubmit SlotStore", rule_ids);
    var from_time = TimeSlot.filter((data) => data.id == temp[0])?.map(
      (data) => data.from_time
    );
    var to_time = TimeSlot.filter(
      (data) => data.id == temp[temp.length - 1]
    )?.map((data) => data.to_time);
    var from_time = from_time[0];
    var to_time = to_time[0];
    console.log(from_time, to_time, "from time to time1 ");
    var name = "start_time";
    var value = from_time;
    dispatch(onFacilityDataChange({
      name,
      value,
      stateChange: true,
    }))
    var name = "end_time";
    var value = to_time;
    dispatch(onFacilityDataChange({
      name,
      value,
      stateChange: true,
    }))
    dispatch(onFacilityDataChange({
      name: "rule_ids",
      value: rule_ids,
    }))
  };

  const TimeSlot = CreateTimeSlot(slot);
  useEffect(() => {
    calculatePeakNonPeak();
    const startDate = facilitiesBookingData?.start_date?.value;
    if (facilityId && startDate) {
      console.log(startDate, "dde3")
      dispatch(FacilitySlotBookingsDetails(facilityId, moment(startDate).format()));
    }
  }, []);


  return (


    <View style={{ borderWidth: 0 }}>

      {isBookingLimitReached == false &&
        TimeSlot != 0 &&
        (isQuota || paymentMethod) && (
          <View
            style={{
              backgroundColor: "white",
              elevation: 4,
              shadowOffset: { width: 1, height: 1 },
              shadowOpacity: 0.55,
              shadowRadius: 0.5,
              paddingVertical: ms(10),
              marginHorizontal: ms(20),
              borderRadius: ms(10),
              paddingHorizontal: ms(20),
            }}
          >
            <View>
              {!isQuota && (
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
                          fontSize: ms(12),
                        }}
                      >
                        {console.log(
                          no_non_peak,
                          peakNonPeakCount.false,

                          "booking count and data"
                        )}
                        {remainingOverallLimit -
                          facilitiesBookingData?.SlotStore?.value?.length}
                        /{max_booking}{" "}
                        {`( Reset on ${moment(
                          fact?.slotDetails?.resets_on
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
                          {peakNonPeakCount.true}/
                          {no_peak} Left{" "}
                          {isPeak
                            ? `( Reset on ${moment(
                              fact?.slotDetails
                                ?.peak_solt_resets_on
                            ).format("DD MMM YYYY")})`
                            : `( Reset on ${moment(
                              fact.slotDetails
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
                            fontSize:ms(12),
                          }}
                        >
                          {peakNonPeakCount.false}/
                          {no_non_peak} Left{" "}
                          {isNonPeak
                            ? `( Reset on ${moment(
                              fact?.slotDetails
                                ?.non_peak_slot_reset_on
                            ).format("DD MMM YYYY")})`
                            : `( Reset on ${moment(
                              fact?.slotDetails
                                ?.resets_on
                            ).format("DD MMM YYYY")})`}
                        </Text>
                      </View>
                    </View>
                  )}

                  {/* <View
                    style={{
                      borderColor: "grey",
                      borderWidth: 0.5,
                      width: "100%",
                      marginVertical: ms(10),
                    }}
                  /> */}
                </View>
              )}
              {/* {payment_method && (
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
                        fontSize: 12,
                      }}
                    >
                      Total Amount
                    </Text>
                    <Text
                      style={{
                        color: "black",
                        fontFamily: fonts.bold,
                        fontSize: 12,
                      }}
                    >
                      $ {facilitiesBookingData?.amount?.value?.toFixed(1)} { }
                    </Text>
                  </View>
                </View>
              )} */}
            </View>
          </View>
        )}
                 <View
                  style={{
                    marginTop: 15,
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
                  <FlatList
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
                  />
                </View>
      {!isBookingLimitReached && TimeSlot.length != 0 ? (
        <View style={Styles.slotMain}>
          {!loader ? (
            TimeSlot?.map((data, index) => {
              console.log(
                submit,
                "ffjhbrfrfhbfjrf",
                data,
                index
              );
              let slotState =
                !submit && slotStateCheck(data.id);
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
                slotDetails?.slots?.some(
                  (data) => data.id == data?.slotId
                )
              );
              const { start_date } = facilitiesBookingData;
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
              const timeRangeArray = slotDetails
                ?.closure_time;
              const isClosed = false;
              const isBooked = slotDetails?.slots?.some(
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
                    style={{flexDirection:"row"}}
                  >
                    <View
                      style={{
                        width: 5,
                        height:5,
                        backgroundColor: "red",
                        // justifyContent: "space-between",
                        flexDirection: "row",
                        paddingBottom: ms(5),
                        // borderWidth:2,
                        borderRadius:100,
                        gap:2,margin:5
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
                      payment_method &&
                      !amount_type && (
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
          {slotDetails?.closure_time?.length >
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
                    fontSize:ms(15),
                    letterSpacing: 1,
                    marginBottom: 5,
                  }}
                >
                  Reason for closed
                </Text>
                {slotDetails.closure_time?.map(
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

                            fontSize: ms(13),
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
      ): (
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
              fontSize: ms(17),
              color: themes[mode]["headingColor"],
              marginVertical: ms(30),
              fontWeight: "700",
              letterSpacing: 0.5,
              textAlign: "center",
              paddingHorizontal: ms(20),
            }}
          >
            {max_booking != 0 &&
            isBookingLimitReached
              ? "You have reached the maximum limit for bookings"
              : TimeSlot.length == 0
              ? "No slots available for today"
              : ""}
          </Text>
        </View>
      )}
    </View>


  )
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
    fontSize:ms(12)
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