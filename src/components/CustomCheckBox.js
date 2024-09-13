import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
// import CheckBox from "@react-native-community/checkbox";
import { fonts, themes } from "../themes";
import { detectTheme } from "../helpers";
import { ErrorIcon } from "../../assets/img/svgs";
function CustomCheckBox({ onChange, value, id, type, label, error }) {
  const showError = error?.length > 5;
  const mode = detectTheme();
  const GridView = ({ data }) => (
    <View style={{ flexDirection: "row", paddingHorizontal: 10 }}>
      {/* <CheckBox
        tintColors={{ true: "#FFC727", false: "black" }}
        disabled={false}
        value={data.selected}
        onValueChange={(newValue) =>
          onChange("checkbox", newValue, id, type, data.id)
        }
      /> */}
      <Text>{data.label}</Text>
    </View>
  );

  return (
    <View>
      <Text
        style={{ color: "grey", fontSize: 14, opacity: 0.4, marginBottom: 10 }}
      >
        {label}
      </Text>
      <View>
        <FlatList
          data={value}
          renderItem={({ item }) => <GridView data={item} />}
          keyExtractor={(item) => item.id}
          numColumns={3}
          key={(item) => item.id}
        />
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
const styles = StyleSheet.create({
  error: {
    fontFamily: fonts.regular,
    fontSize: 12,
    alignSelf: "flex-start",
    marginLeft: 7,
  },
});
export default CustomCheckBox;
