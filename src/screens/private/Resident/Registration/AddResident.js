import React, { Component } from "react";
import { View, Keyboard, Text, Platform } from "react-native";
import { connect } from "react-redux";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import SafeAreaView from "react-native-safe-area-view";

import {
  FocusAwareStatusBar,
  navigate,
} from "../../../../navigation/RootNavigation";
import { fonts, themes } from "../../../../themes";
import { registration, login } from "../../../../redux/actions";
import { ErrorIcon, NameIcon, PhoneIcon } from "../../../../../assets/img/svgs";

import {
  nameValidation,
  phoneValidation,
  mailOnlyREGEX,
} from "../../../../helpers";
import {
  CustomDatePicker,
  CustomTextField,
  SubmitButton,
  WithBgHeader,
} from "../../../../components";
import commonStyles from "../../../../styles/commonStyles";
import { submitControl } from "../../../../redux/actions/login";
import BottomView from "../../../../components/BottomSheet";
import Animated from "react-native-reanimated";
import { customAnimation } from "../../../../animation/CommonAnimation";
import { fetchConfigs } from "../../../../api/home";
import AsyncStorage from "@react-native-async-storage/async-storage";
class AddResident extends Component {
  constructor(props) {
    super(props);
    this.phoneRef = React.createRef();
    this.vehicleRef = React.createRef();
    this.state = {
      error: false,
      shown: false,
      isEdit: true,
    };
  }
  componentDidMount() {
    const {
      navigation,
      clearState,
      formValidation,
      onRegisterInputChange,
    } = this.props;
    this.focusListener = navigation.addListener("focus", () => {
      this.getResidentType(onRegisterInputChange);
    });
    this.blueListener = navigation.addListener("blur", () => {
      clearState("add_residents");
      ["name", "phone"]?.map((item) => {
        formValidation({
          field: item,
          message: "",
        });
        onRegisterInputChange({ type: "add_residents", name: item, value: "" });
      });
    });
  }
  componentWillUnmount() {
    this.unmount();
  }
  unmount = () => {
    this.focusListener;
    this.blueListener;
  };
  getResidentType = async (onRegisterInputChange) => {
    const localStorage = await AsyncStorage.getItem("user");
    const resident_type = JSON.parse(localStorage).data.current_unit
      .resident_type;
    fetchConfigs()
      .then(async ({ data }) => {
        console.log(data, "config api  Add resident form configuration1");
        const resident_flow =
          resident_type == "tenant" ||
          (resident_type == "owner" &&
            !data?.resident_config?.sc_resident_create_access)
            ? resident_type
            : "";
        onRegisterInputChange({
          type: "add_residents",
          name: "resident_type",
          value: resident_flow,
        });
        this.setState({
          isEdit:
            resident_type == "tenant"
              ? false
              : data?.resident_config?.sc_resident_create_access,
        });
      })
      .catch((err) => {
        console.log(err, "kkk");
      });
    
  };

  focusNext = (refs) => {
    this[refs].current.textInput.focus();
  };
  handleInputChange = (name, value) => {
    const { onRegisterInputChange, formValidation } = this.props;
    console.log(name, value, "exp time add");
    if (name == "single-select" && value == 0) {
      console.log(name, value, "exp time add 1");
      onRegisterInputChange({
        type: "add_residents",
        name: "exp_time",
        value: new Date(),
      });
    }
    const type = [
      { id: 0, label: "Owner", value: "owner", selected: false },
      { id: 1, label: "Tenant", value: "tenant", selected: false },
    ];
    console.log(name, value, "add resident valuee");
    onRegisterInputChange({
      type: "add_residents",
      name: name == "single-select" ? "resident_type" : name,
      value: name == "single-select" ? type[value].value :value.replace(/^[^a-zA-Z0-9]+/, ''),
    });
    formValidation({
      field: name == "single-select" ? "resident_type" : name,
      message: "",
    });

    this.setState({ error: false });
  };

  onSubmit = () => {
    const { name, phone, resident_type } = this.props.add_residents;
    const { formValidation } = this.props;
    let err = false;
    let err1 = false;
    let err2 = false;
    let err3 = false;
    Keyboard.dismiss();
    submitControl({ submitted: true });
    ["name", "email", "resident_type"]?.map((item) => {
      console.log(item, name, phone, "itemm");
      err = nameValidation(name);
      err1 = nameValidation(name);
      // err2 = phoneValidation(phone);
      err3 = resident_type == "" || resident_type == undefined ? true : false;
      if (item === "name") {
        err1 = nameValidation(name);
        console.log(err, "name validatiuonjd");

        if (err1) {
          formValidation({
            field: "name",
            message: nameValidation(name),
          });
        }
      }
      if (item === "resident_type") {
        console.log("cccdvevc", resident_type);
        err3 = resident_type == "" || resident_type == undefined ? true : false;
        console.log("poneefkneof", err);
        console.log(err, "resident tyupe validatiuonjd");

        if (err3) {
          console.log("resident_type resident_type");
          formValidation({
            field: "resident_type",
            message: "This field is required",
          });
        }
      }
    });
    console.log(err, "last resuleuyfef");
    if (!err1 && !err3) {
      this.props.residentsRegistration();
    }
  };
  render() {
    const {
      add_residents: { name, phone, resident_type, exp_time },
      errors,
      submitted,
      mode,
    } = this.props;
    const formField = {
      id: 0,
      q_id: 0,
      type: "single-select",
      label: "Resident Type",
      value: "",
      dropDownList: [
        { id: 0, label: "Owner", value: "owner", selected: false },
        { id: 1, label: "Tenant", value: "tenant", selected: false },
      ],
      required: false,
      error: "",
    };
    const { handleInputChange, onSubmit, handleChangedropdown } = this;
    const { error } = this.state;
    console.log("kdlkdlklkdhd", errors);
    return (
      <KeyboardAwareScrollView
        contentContainerStyle={{
          flexGrow: 1,
          backgroundColor: themes[mode]["bgColor"],
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
          <FocusAwareStatusBar />
          <WithBgHeader
            leftIcon
            onPressLeftIcon={() => {
              this.props.formValidationReset();
              navigate("ListResident");
            }}
            headerTitle="Create New Resident"
            containerStyle={{
              ...commonStyles.headerSpacing,
            }}
          >
            <Animated.View
              {...customAnimation("FadeInRight", 700, 50, 3)}
              style={{
                ...commonStyles.headerSpacing,
                marginTop: 15,
              }}
            >
              {resident_type == "tenant" && (
                <CustomDatePicker
                  name="exp_time"
                  type="add_residents"
                  minDate={new Date()}
                  value={exp_time}
                  onChange={handleInputChange}
                  displayFormat={
                    Platform.OS === "android" ? "default" : "inline"
                  }
                />
              )}

              <CustomTextField
                name="name"
                label="Name "
                value={name}
                onChange={handleInputChange}
                onSubmitEditing={() => this.focusNext("phoneRef")}
                keyboardType="default"
                icon={<NameIcon />}
                error={errors?.name}
              />
              <CustomTextField
                ref={this.phoneRef}
                name="phone"
                label="Mobile Number"
                value={phone}
                onChange={handleInputChange}
                onSubmitEditing={onSubmit}
                keyboardType="numeric"
                maxLength={10}
                icon={<PhoneIcon />}
                error={errors?.phone}
              />
              <View style={{ marginTop: "2%", marginBottom: "4%" }}>
                {this.state.isEdit && (
                  <BottomView
                    key={0}
                    {...formField}
                    onChange={handleInputChange}
                  />
                )}
                <View style={{ margin: 3 }}>
                  {errors.resident_type?.length > 5 && (
                    <View style={{ flexDirection: "row", marginVertical: 5 }}>
                      <ErrorIcon />
                      <View>
                        <Text
                          style={{
                            fontFamily: fonts.regular,
                            fontSize: 12,
                            alignSelf: "flex-start",
                            marginLeft: 7,
                            color: themes[mode]["error"],
                          }}
                        >
                          {errors?.resident_type}
                        </Text>
                      </View>
                    </View>
                  )}
                </View>
              </View>
            </Animated.View>
          </WithBgHeader>
        </SafeAreaView>
        <View style={{ position: "absolute", bottom: 0, width: "100%" }}>
          <SubmitButton
            handleSubmit={onSubmit}
            disableBtn={submitted || error}
            buttonText="Create"
          />
        </View>
      </KeyboardAwareScrollView>
    );
  }
}

const mapStateToProps = ({
  registration: { add_residents },
  profile: { mode },
  login: { errors, submitted },
}) => {
  return {
    add_residents,
    submitted,
    mode,
    errors,
  };
};
const {
  residentsRegistration,
  onRegisterInputChange,
  clearState,
} = registration;
const { formValidation, formValidationReset } = login;
const mapDispatchToProps = {
  residentsRegistration,
  onRegisterInputChange,
  clearState,
  formValidation,
  formValidationReset,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddResident);
