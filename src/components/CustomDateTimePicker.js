import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, SafeAreaView, Image } from "react-native";
import {
  TextInput,
  State,
  TouchableOpacity,
} from "react-native-gesture-handler";
import DateTimePicker from "@react-native-community/datetimepicker";
import symbolicateStackTrace from "react-native/Libraries/Core/Devtools/symbolicateStackTrace";
import {
  ContractorType,
  DateTimeIcon,
  Date_Icon,
  Date_Time_Icon,
  ErrorIcon,
} from "../../assets/img/svgs";
import moment from "moment";
import { fonts, themes } from "../themes";
import { detectTheme } from "../helpers";
import { ms } from "../helpers/scaling";
let datanext = new Date();
const CustomDateTimePicker = ({ color, ...props }) => {
  const containerWidth = props.textStyle ? props.textStyle.width : "100%";
  const {
    value,
    name,
    onChange,
    error,
    minDate,
    maxDate,
    id,
    type,
    label,
    displayFormat
  } = props;
  const [date, setDate] = useState(new Date());
  const [time, settime] = useState(new Date());
  const [showDate, setDates] = useState(false);
  const [showTime, setTime] = useState(false);
  const [isAct, setisAct] = useState(true);
  const showError = error?.length > 5;
  const mode = detectTheme();

  // useEffect(() => {
  //   console.log(date, "date and time", time, dateTime);
  //   type == "date-time-picker"
  //     ? onChange("date-time-picker", new Date(a), id, type)
  //     : onChange("date-time-picker", new Date(date), id, type);
  // }, [date, time]);
  const onChanges = async (event, selectedDate, modes) => {
    console.log(event, "mode", selectedDate ? selectedDate : new Date());
    const currentDate = selectedDate ? selectedDate : new Date();
    let a =
      moment(currentDate).format("YYYY-MM-DD") +
      " " +
      moment(currentDate).format("HH:mm:ss");
    let b = moment(currentDate).format("YYYY-MM-DD");
    const dateTime = moment(a, "YYYY-MM-DD HH:mm:ss").format();
    const date = moment(b, "YYYY-MM-DD HH:mm:ss").format();
    if (type == "date-time-picker") {
      console.log(dateTime, "date picker", value);
      if (modes == "date") {
        datanext = dateTime;
        console.log(dateTime,"wdlhwidwdlkwndjhded");
        setDates(false);
        // setDate(currentDate);
        setTime(true);
        onChange("date-time-picker", new Date(dateTime), id, type);
      }
      if (modes == "time") {
        console.log(datanext, "date time picker", value);

        let next =
          moment(datanext).format("YYYY-MM-DD") +
          " " +
          moment(currentDate).format("HH:mm:ss");

        const dateTime1 = moment(next, "YYYY-MM-DD HH:mm:ss").format();
        console.log(dateTime1, "dwkbdhdw");
        setTime(false);
        // settime(currentDate);
        //   onChanges(name, date);
        onChange("date-time-picker", new Date(dateTime1), id, type);
      }
    } else {
      setDates(false);
      setDate(currentDate);
      console.log(currentDate, "kjsbcksjdgadjkad", date);
      onChange("date-time-picker", new Date(currentDate), id, type);
    }
  };

  const showDatepicker = () => {
    setDates(true);
  };

  let dat =
    type == "date-time-picker"
      ? value.toLocaleDateString() + " " + value.toLocaleTimeString()
      : value.toLocaleDateString();
  return (
    <SafeAreaView>
      <View style={{ width: containerWidth }}>
        {/* {props.label && (
          <View style={{ zIndex: 1 }}>
            <Text style={{ ...styles.label, color: color }}>{props.label}</Text>
          </View>
        )} */}
        <Text
          style={{
            fontFamily: fonts.regular,
            color: themes[mode]["lightAsh"],
            fontSize: ms(12),
          }}
        >
          {label}
        </Text>
        <TouchableOpacity style={{ width: "100%" }} onPress={showDatepicker}>
          <View
            style={{
              ...styles.inputAndroid,
              borderBottomColor:
                themes[mode][showError ? "error" : "borderColor"],
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View style={{position:"absolute",top:ms(7),left:ms(-19)}}>
              <ContractorType/>
              </View>
              <Text
                style={{
                  fontFamily: fonts.semiBold,
                  fontWeight: "600",
                  fontSize: ms(12),
                  marginLeft: ms(10),
                  letterSpacing: ms(0.7),
                  padding: 0,
                  paddingTop: ms(6),
                  color: themes[mode]["headingColor"],
                }}
              >
                {dat ? dat : ""}{" "}
              </Text>
              <View style={{ marginRight: ms(-10), }}>
                {/* <TouchableOpacity onPress={showDatepicker}> */}
                {type == "date-time-picker" ? (
                  <Date_Time_Icon />
                ) : (
                  <Date_Icon />
                )}
                {/* </TouchableOpacity> */}
              </View>
            </View>
          </View>
        </TouchableOpacity>

        {showDate && (
          <DateTimePicker
            testID="dateTimePicker"
            value={value}
            mode="date"
            is24Hour={true}
            display={displayFormat || 'default'}

            onChange={(event, selectedDate) =>
              onChanges(event, selectedDate, "date")
            }
            minimumDate={minDate}
            maximumDate={maxDate}
            display={displayFormat || 'default'}

          />
        )}
        {showTime && (
          <DateTimePicker
            testID="dateTimePicker"
            value={value}
            mode="time"
            is24Hour={true}
            display={displayFormat || 'default'}

            onChange={(event, selectedDate) =>
              onChanges(event, selectedDate, "time")
            }
            minimumDate={minDate}
            maximumDate={maxDate}
            display={displayFormat || 'default'}

          />
        )}
        {showError && (
          <View style={{ flexDirection: "row", marginVertical: 5 }}>
            <ErrorIcon />
            <Text
              style={{
                ...styles.error,
                color: themes[mode]["error"],
              }}
            >
              {error}
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  input: {
    // ...FONTS.body4,
    lineHeight: ms(17),
    // Default Text width and height
    height: ms(58),
    // margin: 12,
    borderWidth: 1,
    borderRadius: 15,
    borderColor: "#E8E6EA",
    color: "black",
    paddingLeft: 20,
  },
  label: {
    // ...FONTS.body5,
    position: "absolute",
    top: -8,
    left: 20,
    color: "black",
    color: "black",
    paddingRight: 8,
    paddingLeft: 8,
    lineHeight: ms(14),
  },
  bottomLabel: {
    // ...FONTS.body5,
    lineHeight: ms(14),
    color: "black",
    textAlign: "right",
    fontSize: 12,
    marginTop: 5,
    marginRight: 12,
  },
  textarea: {
    // ...FONTS.body4,
    fontSize: ms(14),
    lineHeight: ms(17),
    minHeight: ms(130),
    textAlignVertical: "top",
    paddingRight: 8,
    paddingLeft: 21,
    height: ms(58),
    fontSize: ms(16),
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#E8E6EA",
    borderRadius: 15,
    color: "black",
    paddingRight: 30,
  },
  inputAndroid: {
    // ...FONTS.body4,
    lineHeight: ms(14),
    paddingRight: 8,
    paddingLeft: 21,
    height: ms(58),
    fontSize: ms(16),
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "transparent",
    color: "black",
    paddingRight: 30,
    justifyContent: "center",
  },
  error: {
    fontFamily: fonts.regular,
    fontSize: ms(12),
    alignSelf: "flex-start",
    marginLeft: 7,
  },
});

export default CustomDateTimePicker;
