import React, { useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  StatusBar,
  Appearance,
} from "react-native";
// import LottieView from 'lottie-react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";

import { fonts, themes } from "../../themes";
import * as RootNavigation from "../../navigation/RootNavigation";
import { setTheme } from "../../redux/actions/profile";
import { ms } from "../../helpers/scaling";

const LoadingSplash = () => {
  const dispatch = useDispatch();

  let mode = useSelector((state) => {
    console.log(
      "dwbdwhbdw nullllll",
      state.profile.mode,
      typeof state.profile.mode
    );

    return state.profile.mode != ("dark" || "light")
      ? Appearance.getColorScheme()
      : state.profile.mode;
  });

  console.log(mode, "dkjnddjw");
  useEffect(() => {
    fetchToken();
  }, []);
  const fetchToken = async () => {
    mode != ("dark" || "light") &&
      dispatch(setTheme(Appearance.getColorScheme()));
    if ((await AsyncStorage.getItem("mode")) != "null") {
      console.log("splash screen succes");
      dispatch(setTheme(await AsyncStorage.getItem("mode")));

      // NativeModules.OpenSettings.openDisplaySettings(() => {});
    } else {
      console.log("splash screen failed");
      dispatch(setTheme(Appearance.getColorScheme()));
    }
    let token = await AsyncStorage.getItem("auth_token");

    let launch = await AsyncStorage.getItem("firstLaunch");
    console.log(launch, "outside");

    setTimeout(() => {
      console.log(launch, "inside", JSON.parse(token));
      if (JSON.parse(token)) {
        console.log("private navigation)))))))))(00e0938092874028743298972682528",global.navigate);
         RootNavigation.navigate("Private");
         global.navigate=false
      } else {
        console.log("public navigation");
        RootNavigation.navigate(launch ? "Public" : "OnBoard");
        global.navigate=false
      }
    }, 2000);
  };

  return (
    <SafeAreaView
      style={{ ...styles.safeArea, backgroundColor: themes[mode]["bgColor"] }}
    >
      <StatusBar hidden={false} />
      <View style={styles.gif}>
        <Image
          source={require("../../../assets/img/sflogo.png")}
          style={{
            width: ms(300),
            height:ms(280),
            marginBottom: "5%",
            resizeMode:"cover",
            
          }}
        />
        {/* <LottieView
          source={require('../../../assets/gif/condo.json')}
          autoPlay
          loop
          duration={6000}
        /> */}
      </View>
      <Text style={{ ...styles.condo, color: themes[mode]["headingColor"],marginBottom:"2%" }}>
        Smart Facility
      </Text>
      <Text
        style={{
          ...styles.tagLine,
          color: themes[mode][mode === "light" ? "tagLine" : "lineColor"],
        }}
      >
        Expedite your Facility Use
      </Text>
    </SafeAreaView>
  );
};

export default LoadingSplash;

const styles = StyleSheet.create({
  safeArea: { flex: 1, justifyContent: "center", alignItems: "center" },
  condo: {
    fontFamily: fonts.semiBold,
    fontSize: 30,
  },
  tagLine: {
    fontFamily: fonts.regular,
    fontSize: 18,
  },
  gif: {
    // width: '80%',
    // height: '40%',
    margin: "10%",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
});
