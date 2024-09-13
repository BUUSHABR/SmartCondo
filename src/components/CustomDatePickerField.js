import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

import { themes, fonts, commonColors } from "../themes";
import { detectTheme } from "../helpers";
import moment from "moment";
import { ClockIcon, ClockIconBig, ContractorType } from "../../assets/img/svgs";

class CustomDatePickerField extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clear: false,
      focus: false,
      show: false,
      date: new Date(),
      change: false,
    };
  }

  onFocus = () => {
    this.setState({ focus: true, show: true });
  };
  onBlur = () => {
    this.setState({ focus: false, show: false });
  };
  handleChange = (name, val) => {
    const { onChange } = this.props;
    val ? onChange(name, val) : onChange(name, new Date());
    this.setState({ change: true });
  };
  render() {
    const mode = detectTheme();

    const {
      placeholder,
      minDate,
      maxDate,
      disabled,
      label,
      value,
      error,
      name,
      fontStyle,
      timeFormat,
      showRightIcon,
      displayFormat,
    } = this.props;
    const showError = error && error.length > 5;
    const { clear, focus, show, date, dateObj, change } = this.state;
    const { onFocus, onBlur, handleChange } = this;
    const timeStr = new Date(value);

    return (
      <>
        <TouchableWithoutFeedback
          onPress={() => {
            this.setState({ show: !show });
          }}
        >
          <TouchableOpacity
            style={{
              borderBottomWidth: show ? 0 : 1,
              paddingBottom: 5,
              borderColor: commonColors[error ? "error" : "lightAsh1"],
            }}
            onPress={() => {
              this.setState({ show: !show });
            }}
          >
            <View
              style={{
                flexDirection: "row",
                // justifyContent: "center",
                alignItems: "center",

                paddingTop: 10,
              }}
            >
              <View style={{ flexDirection: "row" }}>
                <View style={{ marginLeft: 3 }}>
                  <ContractorType />
                </View>
                <Text
                  style={{
                    fontFamily: change ? fonts.semiBold : fonts.regular,
                    color: change
                      ? themes[mode]["headingColor"]
                      : themes[mode]["lightAsh"],
                    marginLeft: 14,
                    // fontFamily: fonts.semiBold,
                    // fontSize: 16,
                  }}
                >
                  {change ? value && moment(value).format("DD-MM-YYYY") : label}
                </Text>
              </View>
              {showRightIcon && (
                <View>
                  <ClockIconBig />
                </View>
              )}
            </View>

            {show && name && (
              <DateTimePicker
                value={timeStr}
                mode={"date"}
                is24Hour={false}
                display={displayFormat || "spinner"}
                allowFontScaling={false}
                onChange={(val) => {
                  this.setState({
                    date: val.nativeEvent.timestamp,
                    show: false,
                  });
                  handleChange(
                    name,
                    moment(val.nativeEvent.timestamp).format()
                  );
                }}
                minimumDate={minDate}
                maximumDate={maxDate}
                style={{
                  height: show && name ? 150 : 0,
                }}
              />
            )}
          </TouchableOpacity>
        </TouchableWithoutFeedback>
        <View style={{ height: 18 }}>
          {error?.length > 5 && (
            <Text
              style={{
                fontFamily: fonts.regular,
                fontSize: 12,
                color: commonColors["error"],
                marginTop:5
              }}
            >
              {error}
            </Text>
          )}
        </View>
      </>
    );
  }
}

export default CustomDatePickerField;

const styles = StyleSheet.create({
  container: {
    width: 30,
    borderRadius: 4,
    paddingLeft: 8,
    borderBottomWidth: 2,
  },
  label: {
    fontFamily: fonts.medium,
    fontWeight: "600",
    fontSize: 18,
    borderColor: themes["light"]["primaryColor"],
    color: themes["light"]["primaryColor"],
  },
  picker: {
    height: 5,
    borderRadius: 4,
    borderWidth: 0,
  },
  dateInput: {
    borderWidth: 0,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginLeft: 2,
  },
  placeholder: {
    fontFamily: fonts.medium,
    fontSize: 14,
  },
  dateText: {
    fontFamily: fonts.medium,
    fontSize: 16,
    top: 2,
  },
  disabled: {
    fontFamily: fonts.medium,
    fontSize: 14,
    borderWidth: 0,
    height: 20,
    bottom: 4,
  },
  dateIcon: {
    position: "absolute",
    left: "4%",
    marginVertical: "4.5%",
  },
  error: {
    fontFamily: fonts.regular,
    fontSize: 12,
    alignSelf: "flex-end",
  },
  topView: {
    marginVertical: 8,
  },
  errorBlock: { height: 15, margin: 3 },
});
