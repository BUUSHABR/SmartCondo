import { View, Text ,StyleSheet } from "react-native";
import React, { useState, useCallback, useEffect } from "react";
// import DropDownPicker from "react-native-dropdown-picker";
import { fonts, themes } from "../themes";
import { detectTheme } from "../helpers";
import { ErrorIcon } from "../../assets/img/svgs";
const CustomPicker = (props) => {
  const { onChange, id, type, value, dropDownList, label, isOpen ,error} = props;
  const [open1, setOpen1] = useState(false);
  const [value1, setValue1] = useState(value);
  const [items1, setItems1] = useState(dropDownList);
  const showError = error?.length > 5;
  const mode = detectTheme();
  const onCityOpen = useCallback(() => {
    console.log("open");
    setOpen1(true);
    onChange("isOpenCall", value1, id, type, "", open1);
  }, []);
  // useEffect(()=>{
  // DropDownPicker.setListMode("SCROLLVIEW");
  // },[])
  useEffect(() => {
    console.log(value1, "pop");
    onChange("single-select", value1, id, type, "", open1);
  }, [value1]);
  useEffect(() => {
    console.log(value1, "pop");
    setOpen1(isOpen);
  }, [isOpen]);
  console.log(value1, "llll");
  return (
    <View>
      <View style={{}}>
        <Text>{label}</Text>
        {/* <DropDownPicker
      dropDownDirection="TOP"
          open={open1}
          value={value1}
          items={items1}
          maxHeight={500}
          setOpen={setOpen1}
          setValue={setValue1}
          setItems={setItems1}
          onOpen={onCityOpen}
          dropDownContainerStyle={{
            backgroundColor: "white",
            // elevation: 20,
            borderColor: "transparent",
          }}
          listParentContainerStyle={{
            borderColor: "transparent",
          }}
          listChildContainerStyle={{
            borderColor: "transparent",
            paddingLeft: 20,
          }}
          style={{ borderColor: "transparent" }}
          flatListProps={{
            initialNumToRender: 10,
          }}
        /> */}
      </View>
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
  );
};
const styles = StyleSheet.create({
  error: {
    fontFamily: fonts.regular,
    fontSize: 12,
    alignSelf: "flex-start",
    marginLeft: 7,
  },
});
export default CustomPicker;
