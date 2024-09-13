import {
  View,
  Text,
  ScrollView,
  StatusBar,
  Pressable,
  StyleSheet,
  useColorScheme,
  FlatList,
  PermissionsAndroid,
  ActivityIndicator,
  Platform
} from "react-native";
import React, {
  useReducer,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  CustomDatePicker,
  CustomTextField,
  CustomCheckBox,
  CustomPicker,
  CustomImagePicker,
} from ".";
import produce, { setAutoFreeze } from "immer";
import { isDate } from "moment";
import CustomTextArea from "./CustomTextArea";
import commonStyles from "../styles/commonStyles";
import { fonts, themes } from "../themes";
import { detectTheme } from "../helpers";
import SubmitHoc from "../hoc/formHoc";
import { BottomTabView } from "@react-navigation/bottom-tabs";
import BottomView from "./BottomSheet";
import { TouchableOpacity } from "react-native-gesture-handler";
import { ArrowDown, ContractorType } from "../../assets/img/svgs";
import { useSelector } from "react-redux";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { selectContactPhone } from "react-native-select-contact";
import axios from "axios";
import CustomDateTimePicker from "./CustomDateTimePicker";
import Permissions from "react-native-permissions";
const reducer = (state, action) => {
  switch (action.type) {
    case "multiple-checkbox":
      state[action.id].value[action.arrayId].selected = action.value;
      state[action.id].error = "";
      break;
    case "checkbox":
      state[action.id].value?.map((data) => {
        data.id == action.arrayId
          ? (data.selected = action.value)
          : data.selected && (data.selected = !action.value);
      });
      state[action.id].error = "";
      break;
    case "single-select":
      state[action.id].value = action.value;
      state[action.id].error = "";
      break;
    case "error-handler":
      state[action.id].error = action.error;
      break;
    default:
      state[action.id].value = action.value;
      state[action.id].error = "";
      break;
  }
};
setAutoFreeze(false);
export const FormReducer = produce(reducer);

const Eform = ({ Formdata, dispatch }) => {
  const [count, scount] = useState(false);
  useEffect(() => {
    console.log("triggered", Formdata);
    scount((c) => c + 1);
    setTimeout(() => {
      console.log("triggering one timeout");
      scount(true);
    }, 1500);
    return () => {
      scount(false);
    };
  }, []);
  console.log(Formdata, "port");

  const mode = detectTheme();
  const modee = useColorScheme();
  setAutoFreeze(false);

  const isOpen = useSelector((state) => state.complaint.onSheetOpen);
  const handleChange = (index, value, id, type, arrayId, isOpen) => {
    console.log(id, value, "uiuiiuuiu");
    dispatch({ id, value, type: type, arrayId, isOpen, index });
  };
  const handleChangeArea = (name, value, id, type) => {
    dispatch({ id, value, type: type });
  };
  const handleSubmit = () => {
    console.log("hello handle submit calling");

    Formdata.forEach((data) => {
      const { type, value, id, required } = data;
      if (required) {
        ["text", "single-select", "text-area"].includes(type) &&
          !value.length > 0 &&
          dispatch({
            id,
            value,
            type: "error-handler",
            error: "this field is required",
          });
        ["multiple-checkbox", "checkbox"].includes(type) &&
          !value.some((data) => data.selected == true) &&
          dispatch({
            id,
            value,
            type: "error-handler",
            error: "this field is required",
          });
        "image-picker" == type &&
          ((value != null && Object.keys(value).length == 0) ||
            value == null) &&
          dispatch({
            id,
            value,
            type: "error-handler",
            error: "this field is required",
          });
        "date-picker" == type &&
          !isDate(value) &&
          dispatch({
            id,
            value,
            type: "error-handler",
            error: "this field is required",
          });
      }
    });
    let a = Formdata.every((data) => data.error == "");
    // console.log(a, "result");
    Formdata.every((data) => data.error == "") && console.log("passed a exam");
    Formdata.some((data) => data.error != "")
      ? this.scroll.scrollTo({ x: 0, y: 0, animated: true })
      : console.log("");
  };

  let formList = Formdata?.map((formField, index) => {
    const { type, id, label } = formField;
    let formSliceId =
      Formdata.slice(id + 1).findIndex((data) => data.type == "text") + id + 1;
    switch (type) {
      case "text":
        return (
          <CustomTextField
            key={index}
            ref={formField.ref}
            {...formField}
            onChange={handleChange}
            icon={<ContractorType />}
            onSubmitEditing={() =>
              formSliceId != -1 &&
              Formdata[formSliceId].ref.current.textInput.focus()
            }
          />
        );
      case "multiple-checkbox":
        return (
          <CustomCheckBox key={index} {...formField} onChange={handleChange} />
        );
      case "checkbox":
        return (
          <CustomCheckBox key={index} {...formField} onChange={handleChange} />
        );
      case "multiple-select":
      case "single-select":
        return (
          <View style={{ marginTop: "2%", marginBottom: "4%" }}>
            <BottomView key={index} {...formField} onChange={handleChange} />
          </View>
        );
      case "date-picker":
      case "date-time-picker":
        return (
          <View style={{ marginTop: "2%", marginBottom: "4%" }}>
            <CustomDateTimePicker
              key={index}
              {...formField}
              onChange={handleChange}
              displayFormat={
                 Platform.OS === "android" ? "default" : "inline"
              }
            />
          </View>
        );
      case "image-picker":
        return (
          <View style={{ marginTop: "2%" }}>
            <CustomImagePicker
              key={index}
              {...formField}
              onChange={handleChange}
            />
          </View>
        );
      case "text-area":
        return (
          <View
            style={{
              marginTop: "0%",
              flex: 1,
              marginHorizontal: 0,
              marginBottom: "7%",
            }}
          >
            <CustomTextArea
              ref={formField.ref}
              theme="bottomBorder"
              {...formField}
              handleChange={handleChangeArea}
            />
          </View>
        );
      default:
        return (
          <>
            <View>
              <Text>akilan</Text>
            </View>
          </>
        );
    }
  });
  return (
    <>
      <KeyboardAwareScrollView
        contentContainerStyle={{
          flexGrow: 1,
          backgroundColor: themes[mode]["bgColor"],
          height: "100%",
        }}
        style={{
          flex: 1,
          backgroundColor: themes[mode]["bgColor"],
          position: "relative",
        }}
      >
        {/* <View>
          <CustomDateTimePicker
            name="visiting_time"
            mode="date"
            label="Date and Time"
            // color={COLORS.primary}
            maxDate={new Date().setDate(new Date().getDate() + 45)}
            minDate={new Date()}
            value={new Date()}
            // onChanges={handleInputChange}
          />
        </View> */}
        <View
          style={{
            paddingHorizontal: "0%",
            flex: 1,
            // backgroundColor: isOpen ? "grey" : "white",
          }}
        >
          <ScrollView
            ref={(c) => {
              // this.scroll = c;
            }}
            style={{
              flex: 1,
            }}
            contentContainerStyle={{
              flexGrow: 1,
              paddingBottom: 0,
            }}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
          >
            <View>
              {!count ? (
                <View style={{marginTop:300}}>
                <ActivityIndicator size="small" color="#FFC727" />
                </View>
              ) : (
                formList
              )}
            </View>
          </ScrollView>
        </View>
      </KeyboardAwareScrollView>
    </>
  );
};
export default Eform;
