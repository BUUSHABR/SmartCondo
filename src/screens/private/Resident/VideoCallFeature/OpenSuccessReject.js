import React, { Component } from "react";
import { connect } from "react-redux";
import { StyleSheet, Text, View, BackHandler } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";

import { fonts, themes } from "../../../../themes";
import { detectTheme } from "../../../../helpers";
import * as RootNavigation from "../../../../navigation/RootNavigation";
import {ComplaintSuccess} from '../../../../../assets/img/svgs';
import Cancel from '../../../../../assets/img/cancel.svg';
import { ms } from "../../../../helpers/scaling";

export default class OpenSuccessReject extends Component {
  componentDidMount() {
    setTimeout(() => {
      console.log(
        this.props?.route?.params?.data?.exit,
        "call rejeujuuuuuuuuct accept "
      );
      RootNavigation.navigate("Private");
    }, 3000);
  }
  render() {
    const mode = detectTheme();
    const { imgComp, text, title } = this.props?.route?.params?.data;
    const ImageRender={
      "ComplaintSuccess":<ComplaintSuccess/>,
      "Cancel":<Cancel/>
    }
    return (
      <SafeAreaView
        style={{ backgroundColor: themes[mode]["bgColor"] }}
        forceInset={{ top: "never" }}
      >
        <ScrollView
          contentContainerStyle={{
            ...styles.container,
            backgroundColor: themes[mode]["bgColor"],
          }}
          showsVerticalScrollIndicator={false}
          style={{
            height: "100%",
            backgroundColor: themes[mode]["bgColor"],
          }}
        >
          <View style={styles.gif}>{ImageRender[imgComp]}</View>
          <Text
            style={{ ...styles.title, color: themes[mode]["headingColor"] }}
          >
            {title}
          </Text>
          <Text style={{ ...styles.text, color: themes[mode]["textColor"] }}>
            {text}
          </Text>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    marginHorizontal: 25,
    alignItems: "center",
    marginVertical: "25%",
  },
  gif: {
    width: "80%",
    height: "40%",
    margin: "10%",
  },
  text: {
    fontFamily: fonts.light,
    fontSize:ms(16),
    lineHeight: ms(22),
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: ms(22),
    marginVertical: 15,
  },
});
