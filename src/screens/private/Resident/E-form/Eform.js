import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ScrollView,
  StatusBar,
  Pressable,
} from "react-native";
import React, { useState, useEffect, useReducer } from "react";
import { CustomDatePicker, CustomTextField } from "../../../../components";
import produce from "immer";
import CustomCheckBox from "../../../../components/CustomCheckBox";
import CustomPicker from "../../../../components/CustomPicker";
import CustomImagePicker from "../../../../components/CustomImagePicker";
import { isDate } from "moment";
const initialState = [
  {
    id: 0,
    type: "text",
    name: "name",
    label: "name",
    value: "",
    keyboardType: "default",
    ref: React.createRef(),
    required: false,
    error: "",
  },
  {
    id: 1,
    type: "text",
    name: "phone",
    label: "phone",
    value: "",
    keyboardType: "numeric",
    ref: React.createRef(),
    required: false,
    error: "",
  },
  {
    id: 2,
    type: "multiple-checkbox",
    name: "checkbox",
    label: "checkbox",
    value: [
      {
        id: 0,
        label: "cricket",
        selected: false,
      },
      {
        id: 1,
        label: "vollyball",
        selected: false,
      },
      {
        id: 2,
        label: "tennis",
        selected: false,
      },
    ],
    required: false,
    error: "",
  },
  {
    id: 3,
    type: "checkbox",
    name: "checkbox2",
    label: "checkbox2",
    value: [
      {
        id: 0,
        label: "apple",
        selected: false,
      },
      {
        id: 1,
        label: "mango",
        selected: false,
      },
      {
        id: 2,
        label: "jack fruit",
        selected: false,
      },
    ],
    required: false,
    error: "",
  },
  {
    id: 4,
    type: "checkbox",
    name: "checkbox3",
    label: "checkbox3",
    value: [
      {
        id: 0,
        label: "akilan",
        selected: false,
      },
      {
        id: 1,
        label: "subash",
        selected: false,
      },
      {
        id: 2,
        label: "kathir",
        selected: false,
      },
    ],
    required: false,
    error: "",
  },
  {
    id: 5,
    type: "text",
    name: "contact",
    label: "contact",
    value: "",
    keyboardType: "numeric",
    ref: React.createRef(),
    required: false,
    error: "",
  },
  {
    id: 6,
    type: "text",
    name: "company",
    label: "company",
    value: "",
    keyboardType: "default",
    ref: React.createRef(),
    required: false,
    error: "",
  },
  {
    id: 7,
    type: "text",
    name: "brand",
    label: "brand",
    value: "",
    keyboardType: "default",
    ref: React.createRef(),
    required: false,
    error: "",
  },
  {
    id: 8,
    type: "multiple-checkbox",
    name: "laptops",
    label: "laptops",
    value: [
      {
        id: 0,
        label: "HP",
        selected: false,
      },
      {
        id: 1,
        label: "dell",
        selected: false,
      },
      {
        id: 2,
        label: "samsung",
        selected: false,
      },
    ],
    required: false,
    error: "",
  },
  {
    id: 9,
    type: "text",
    name: "door no",
    label: "door no",
    value: "",
    keyboardType: "numeric",
    ref: React.createRef(),
    required: false,
    error: "",
  },
  {
    id: 10,
    type: "single-select",
    name: "select icons",
    label: "select icons",
    dropDownList: [
      { label: "Apple", value: "apple" },
      { label: "Banana", value: "banana" },
    ],
    value: "",
    keyboardType: "",
    isOpen: false,
    required: false,
    error: "",
  },
  {
    id: 11,
    type: "single-select",
    name: "select icons ii",
    label: "select icons ii",
    dropDownList: [
      { label: "Apple", value: "apple" },
      { label: "Banana", value: "banana" },
      { label: "Banana", value: "banana" },
    ],
    value: "",
    keyboardType: "",
    isOpen: false,
    required: false,
    error: "",
  },
  {
    id: 12,
    type: "text",
    name: "door no1",
    label: "door no1",
    value: "",
    keyboardType: "numeric",
    ref: React.createRef(),
    required: false,
    error: "",
  },
  {
    id: 13,
    type: "date-picker",
    name: "Date Picker",
    label: "Date Picker",
    maxDate: null,
    minDate: null,
    value: new Date(),
    keyboardType: "numeric",
    required: false,
    error: "",
  },
  {
    id: 14,
    type: "image-picker",
    name: "Image Picker",
    label: "Image Picker",
    value: null,
    keyboardType: "numeric",
    multiselect: false,
    required: false,
    error: "",
  },
  {
    id: 15,
    type: "single-select",
    name: "select s ii",
    label: "select ns ii",
    dropDownList: [
      { label: "Apple", value: "apple" },
      { label: "Banana", value: "banana" },
      { label: "Apple", value: "apple" },
      { label: "Banana", value: "banana" },
      { label: "Apple", value: "apple" },
      { label: "Banana", value: "banana" },
      { label: "Apple", value: "apple" },
      { label: "Banana", value: "banana" },
      { label: "Apple", value: "apple" },
      { label: "Banana", value: "banana" },
      { label: "Apple", value: "apple" },
      { label: "Banana", value: "banana" },
      { label: "Apple", value: "apple" },
      { label: "Banana", value: "banana" },
    ],
    value: "",
    keyboardType: "",
    isOpen: false,
    required: false,
    error: "",
  },
  {
    id: 16,
    type: "single-select",
    name: "select s ii",
    label: "select ns ii",
    dropDownList: [
      { label: "Apple", value: "apple" },
      { label: "Banana", value: "banana" },
    ],
    value: "",
    keyboardType: "",
    isOpen: false,
    required: false,
    error: "",
  },
];

const reducer = (state, action) => {
  switch (action.type) {
    case "text":
      state[action.id].value = action.value;
      state[action.id].error = "";
      break;
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
      action.index != "single-select" &&
        state?.map((data) => {
          data.type == "single-select" && data.id !== action.id
            ? (state[data.id].isOpen = false)
            : (state[action.id].isOpen = true);
        });
      state[action.id].error = "";
      break;
    case "date-picker":
      state[action.id].value = action.value;
      state[action.id].error = "";
      break;
    case "image-picker":
      state[action.id].value = action.value;
      state[action.id].error = "";
      break;
    case "error-handler":
      state[action.id].error = action.error;
      break;
    default:
      return <></>;
  }
};

const FormReducer = produce(reducer);

const Eform = () => {
  const [Formdata, dispatch] = useReducer(FormReducer, initialState);
  console.log(Formdata, "port");
  const handleChange = (index, value, id, type, arrayId, isOpen) => {
    dispatch({ id, value, type: type, arrayId, isOpen, index });
  };
  const handleSubmit = () => {
    console.log("hello handle submit calling");

    Formdata.forEach((data) => {
      const { type, value, id } = data;
      ["text", "single-select"].includes(type) &&
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
        ((value != null && Object.keys(value).length == 0) || value == null) &&
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
    });
    Formdata.some((data) => data.error != "") &&
      this.scroll.scrollTo({ x: 0, y: 0, animated: true });
  };
  let formDesign = Formdata?.map((formField) => {
    const { type, id } = formField;
    let formSliceId =
      Formdata.slice(id + 1).findIndex((data) => data.type == "text") + id + 1;
    switch (type) {
      case "text":
        return (
          <CustomTextField
            ref={formField.ref}
            {...formField}
            onChange={handleChange}
            onSubmitEditing={() =>
              formSliceId != -1 &&
              Formdata[formSliceId].ref.current.textInput.focus()
            }
          />
        );
      case "multiple-checkbox":
        return <CustomCheckBox {...formField} onChange={handleChange} />;
      case "checkbox":
        return <CustomCheckBox {...formField} onChange={handleChange} />;
      case "single-select":
        return <CustomPicker {...formField} onChange={handleChange} />;
      case "date-picker":
        return <CustomDatePicker {...formField} onChange={handleChange} />;
      case "image-picker":
        return <CustomImagePicker {...formField} onChange={handleChange} />;
      default:
        return <></>;
    }
  });

  return (
    <View style={{ paddingHorizontal: "10%", flex: 1 }}>
      <Text>Eform - {Formdata[0].value}</Text>
      <ScrollView
        ref={(c) => {
          this.scroll = c;
        }}
        style={{
          flex: 1,
          paddingTop: StatusBar.currentHeight,
        }}
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: 100,
        }}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
      >
        <View>{formDesign}</View>
        <Text>hello</Text>
        {/* <CustomImagePicker /> */}
      </ScrollView>
      {/* <Pressable
        style={{
          backgroundColor: "#FFC727",
          width: 100,
          height: 30,
          justifyContent: "center",
          alignItems: "center",
          alignSelf: "center",
        }}
        onPress={handleSubmit}
      >
        <Text>Submit</Text>
      </Pressable> */}
    </View>
  );
};
export default Eform;
