import React, { Component } from "react";
import {
  StyleSheet,
  Platform,
  View,
  Text,
  TouchableOpacity,
} from "react-native";

import { themes, fonts } from "../themes";
import { FloatingLabelInput } from "react-native-floating-label-input";
import {
  ErrorIcon,
  NameIcon,
  MessageBox,
  PhoneIcon,
  ArrowRight,
  PhoneBookIcon,
} from "../../assets/img/svgs";
import { detectTheme } from "../helpers";
import { ms } from "../helpers/scaling";

class CustomTextField extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clear: false,
      focus: false,
    };
  }

  componentDidMount() {
    if (this.props.onRef != null) {
      this.props.onRef(this);
    }
  }

  onSubmitEditing() {
    this.props.onSubmitEditing();
  }
  handleChange = (name, value, id, type) => {
    const { onChange, keyboardType } = this.props;
    console.log("1 log");
    if (name === "name") {
      console.log("2 log");

      if (value.length > 0 && /^[a-zA-Z ]+$/.test(value)) {
        console.log("3 log");
        onChange(name, value, id, type);
      }

      if (value === "") {
        console.log("4 log");
        onChange(name, value, id, type);
      }
    }

    if (
      name === "phone" ||
      name === "accompanied" ||
      keyboardType === "numeric"
    ) {
      console.log("5 log");
      if (
        name === "accompanied"
          ? value.match(/^[1-9]*$/)
          : value.match(/^[0-9]*$/)
      ) {
        console.log("6 log");
        onChange(name, value, id, type);
      }
    } else {
      console.log("7 log");
      onChange(name, value, id, type);
    }
    this.setState({ clear: false, focus: true });
  };

  onFocus = () => {
    const { editable } = this.props;
    this.setState({ focus: true });
  };
  onBlur = () => {
    this.setState({ focus: false });
  };

  useComponent = (name) => {
    const items = {};
    if (name === "name") {
      items = {
        keyboardType: "default",
        icon: <NameIcon />,
      };
      return items;
    } else if (name === "phone") {
      items = {
        keyboardType: "phone-pad",
        icon: <PhoneIcon />,
      };
      return items;
    } else if (name === "email") {
      items = {
        keyboardType: "default",
        icon: <MessageBox />,
      };
      return items;
    }
    return items;
  };

  render() {
    const mode = detectTheme();

    const {
      value,
      error,
      label,
      onSubmitEditing,
      name,
      editable,
      returnKeyType,
      icon,
      keyboardType,
      maxLength,
      multiline,
      selected,
      rightIcon,
      showRightIcon,
      id,
      type,
      contact,
      selectContact,
      autoCap,
    } = this.props;
    const { handleChange, onBlur, onFocus } = this;
    const showError = error?.length > 5;
    const { focus } = this.state;
    return (
      <View style={{ marginBottom: "6%" }}>
        <FloatingLabelInput
          autoCapitalize={autoCap ? "characters" : "none"}
          keyboardType={
            Platform.OS === "ios"
              ? keyboardType || "default"
              : keyboardType || "visible-password"
          }
          ref={(input) => (this.textInput = input)}
          name={name}
          editable={editable == false ? editable : selected}
          label={label}
          isFocused={focus || value?.length > 0}
          value={value}
          maxDecimalPlaces={6}
          onSubmit={onSubmitEditing}
          onChangeText={(val) => handleChange(name, val, id, type)}
          onFocus={onFocus}
          onBlur={onBlur}
          returnKeyType={returnKeyType || "next"}
          blurOnSubmit={false}
          allowFontScaling={false}
          containerStyles={{
            ...styles.container,
            borderColor: themes[mode][showError ? "error" : "borderColor"],
          }}
          multiline={multiline}
          customLabelStyles={{
            ...styles.customLabel,
            colorFocused: themes[mode]["lightAsh"],
            color: themes[mode]["lightAsh"],
            colorBlurred: themes[mode]["lightAsh"],
            fontSizeFocused: ms(12),
            fontSizeBlurred:ms(12),
            topFocused: -22,
            leftFocused: -20,
            topBlurred: ms(2),
            leftBlurred:ms(9),
            
            
  
          }}
          labelStyles={styles.label}
          inputStyles={{
            ...styles.input,
            color:
              themes[mode][editable === false ? "ashColor" : "headingColor"],
          }}
          minLength={3}
          maxLength={maxLength}
          leftComponent={
            <View
              style={{
                marginTop: 8,
              }}
            >
              {icon ? icon : <NameIcon />}
            </View>
          }
          rightComponent={
            !contact ? (
              <View
                style={{
                  alignSelf: "flex-end",
                  marginBottom: 15,
                  marginRight: 15,
                }}
              >
                {rightIcon
                  ? showRightIcon || <ArrowRight color={"#C1C1C1"} />
                  : null}
              </View>
            ) : (
              <View
                style={{
                  alignSelf: "flex-end",
                  marginBottom: 15,
                  marginRight: 15,
                  // borderColor: "red",
                  // borderWidth: 1,
                  paddingTop: 15,
                }}
              >
                <TouchableOpacity
                  style={{ padding: 20 }}
                  onPress={selectContact}
                >
                  <PhoneBookIcon />
                </TouchableOpacity>
              </View>
            )
          }
        />
        <View style={{ margin: 3 }}>
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
      </View>
    );
  }
}

export default CustomTextField;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: ms(58),
    borderBottomWidth: 1,
    paddingLeft: Platform.OS === "ios" ? 7 : 5,
    justifyContent: "center",
    alignItems: "center",
    fontFamily: fonts.regular,
  },
  customLabel: {
    fontFamily: fonts.semiBold,
  },
  label: {
    fontFamily: fonts.regular,
    width:"40%",height:"30%"
  },
  input: {
    fontFamily: fonts.semiBold,
    fontWeight: "600",
    fontSize: ms(16),
    marginLeft: ms(10),
    letterSpacing: 0.7,
    padding: 0,
    paddingTop: ms(6),
  },
  error: {
    fontFamily: fonts.regular,
    fontSize: ms(12),
    alignSelf: "flex-start",
    marginLeft: ms(7),
  },
});
