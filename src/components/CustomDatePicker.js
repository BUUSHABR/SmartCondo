import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Platform,
} from "react-native";

import { ArrowDown, CalendarIconBig, ErrorIcon } from "../../assets/img/svgs";
import { themes, fonts, commonColors } from "../themes";
import { detectTheme } from "../helpers";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";

class CustomDatePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clear: false,
      focus: false,
      show: false,
      date: new Date(),
      changeLabel: true,
    };
  }

  onFocus = () => {
    this.setState({ focus: true, show: true });
  };
  onBlur = () => {
    this.setState({ focus: false, show: false });
  };
  handleChange = (name, val) => {
    const { onChange, id, type } = this.props;
    val ? onChange(name, val, id, type) : onChange(name, new Date(), id, type);
    this.setState({ changeLabel: false });
  };
  render() {
    const mode = detectTheme();
    const {
      minDate,
      maxDate,
      label,
      value,
      error,
      name,
      fontStyle,
      rightIcon,
      containerStyle,
      dateFormat,
      showLabel,
      displayFormat,
      type,
    } = this.props;
    const showError = error && error.length > 5;
    const { show, changeLabel } = this.state;
    const { handleChange } = this;
    const dateStr = new Date(value);

    return (
      <TouchableWithoutFeedback
        onPress={() => {
          this.setState({ show: !show });
        }}
      >
        <TouchableOpacity
          style={{}}
          onPress={() => {
            this.setState({ show: !show });
          }}
        >
          <View
            style={[
              {
                ...containerStyle,
                flexDirection: "row",
                alignItems: "center",
              },
            ]}
          >
            <View
              style={{
                paddingBottom: Platform.OS === "android" ? 5 : 7,
                borderBottomWidth: 2,
                borderColor: commonColors[error ? "error" : "yellowColor"],
              }}
            >
              <Text
                style={[
                  {
                    ...styles.label,
                    ...fontStyle,
                  },
                ]}
              >
                {showLabel && changeLabel
                  ? label
                  : moment().isSame(value, "date")
                  ? type == "add_residents"
                    ? "Expiry Date : Today"
                    : "Today"
                  : type == "add_residents"
                  ? "Expiry Date : " +
                    moment(value).format(dateFormat || "MMM DD")
                  : moment(value).format(dateFormat || "MMM DD")}
              </Text>
            </View>

            {!rightIcon ? (
              <View
                style={{
                  ...styles.rightIconAlign,
                  borderColor: commonColors[error ? "error" : "yellowColor"],
                }}
              >
                <View
                  style={{
                    ...styles.rightIconAlign1,
                  }}
                >
                  <ArrowDown color={themes[mode]["primaryColor"]} />
                </View>
              </View>
            ) : (
              <CalendarIconBig />
            )}
          </View>
          <View style={{ height: 18 }}>
            {error?.length > 5 && (
              <Text
                style={{
                  fontFamily: fonts.regular,
                  fontSize: 12,
                  color: commonColors["error"],
                }}
              >
                {error}
              </Text>
            )}
          </View>

          {show && (
            <View style={{ backgroundColor: "white" }}>
              <DateTimePicker
                value={dateStr}
                mode={"date"}
                is24Hour={true}
                display={displayFormat || "default"}
                allowFontScaling={false}
                onChange={(val) => {
                  this.setState({
                    date: val.nativeEvent.timestamp,
                    show: false,
                  });
                  handleChange(name, val.nativeEvent.timestamp);
                }}
                minimumDate={minDate}
                maximumDate={maxDate}
              />
            </View>
          )}
        </TouchableOpacity>
      </TouchableWithoutFeedback>
    );
  }
}

export default CustomDatePicker;

const styles = StyleSheet.create({
  container: {
    width: 30,
    borderRadius: 4,
    paddingLeft: 8,
    borderBottomWidth: 1,
  },
  label: {
    fontFamily: fonts.medium,
    fontWeight: "600",
    fontSize: 20,
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
  rightIconAlign: {
    borderBottomWidth: 2,
    paddingBottom: 23.7,
    left: -10,
  },
  rightIconAlign1: { width: 21, top: 10, marginLeft: 15 },
});
