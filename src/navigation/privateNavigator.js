import React, { useEffect, useCallback } from "react";
import { View, Platform, BackHandler, Text } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import messaging from "@react-native-firebase/messaging";
import { createStackNavigator } from "@react-navigation/stack";
import { ResidentStack, AdminStack, SecurityStack } from "../screens/private";
import { handleBackButton } from "../helpers";
import Public from "../navigation/PublicNavigator";
import { homePageLoader } from "../redux/actions/home";
import { LoginScreen } from "./../screens/public";
import { cloudMessagingAPI } from "../api/firebase";
import HomeScreen from "../screens/private/Resident/Home/HomeScreen";
import NetInfo from "@react-native-community/netinfo";
import FeatureModal from "../components/FeatureModal";
import AsyncStorage from "@react-native-async-storage/async-storage";

global.info;
const Stack = createStackNavigator();

const Private = () => {

  const dispatch = useDispatch();
  const appFeature=useSelector(state=>state.home.appFeature)
  const FeatureData=useSelector(state=>state.home.featureData)
  const onBackPress = (props) => {
    console.log("go backkkk");
    props.navigation.goBack();
    return true;
  };
  useCallback(() => {
    console.log("use call backkk");
    const onBackPress = (props) => {
      console.log("go backkkk");
      props.navigation.goBack();
      return true;
    };

    BackHandler.addEventListener("hardwareBackPress", onBackPress);
  });
  useEffect(()=>{
    setTimeout(()=>{
      feature()

    },7000)
  },[])
  const feature=async()=>{
   let b= await AsyncStorage.getItem('appfeature')
   let content=JSON.parse(b)
   console.log(content,"pricbejchbejbcehbcehbcec");

   if(content?.content){
   console.log(content,"prejehcbejchbejbcehbcehbcec");

    dispatch(homePageLoader("appFeature", true));
    dispatch(homePageLoader("featureData", content));
  }
   console.log(b,"privatejehcbejchbejbcehbcehbcec");
  }
  // function handleFirstConnectivityChange(isConnected) {
  //   console.log('Then, is ' + (isConnected ? 'online' : 'offline'));
  //   NetInfo.isConnected.removeEventListener(
  //     'connectionChange',
  //     handleFirstConnectivityChange
  //   );
  // }
  useEffect( () => {
    // const setUserDetails = async () => {
    //   await dispatch(setUser());
    // };

    // setUserDetails();
    // await cloudMessagingAPI();
    console.log("hello999");
    let unsubscribe = NetInfo.addEventListener((state) => {
      console.log("Connection type", state.type);
      console.log("Is connected?", state.isConnected);
      dispatch(homePageLoader("netInfo", state.isConnected));
    });
    // setInterval(() => {
    //   NetInfo.fetch().then((state) => {
    //     console.log("Connection type setInterval", state.type);
    //     console.log("Is connected? set interval", state.isConnected);
    //     global.info = state.isConnected;

    //     dispatch(homePageLoader("netInfo", state.isConnected));
    //   });
    // }, 2000);
    // NetInfo.addEventListener("connectionChange", handleFirstConnectivityChange);

    return  () => {
  const TOPIC = "Subscribe";
      // setUserDetails();
      // await cloudMessagingAPI();
      unsubscribe();
      BackHandler.removeEventListener("hardwareBackPress", onBackPress);
      messaging().unsubscribeFromTopic(TOPIC);
    };
  }, [dispatch]);
  return (<>
    <Stack.Navigator
      screenOptions={{ animationEnabled: false, headerShown: false }}
    >
      <Stack.Screen
        name="ResidentStack"
        component={ResidentStack}
        listeners={{
          focus: () =>
            BackHandler.addEventListener("hardwareBackPress", handleBackButton),
          blur: () =>
            BackHandler.removeEventListener(
              "hardwareBackPress",
              handleBackButton
            ),
        }}
      />
      <Stack.Screen
        name="AdminStack"
        component={AdminStack}
        listeners={{
          focus: () =>
            BackHandler.addEventListener("hardwareBackPress", handleBackButton),
          blur: () =>
            BackHandler.removeEventListener(
              "hardwareBackPress",
              handleBackButton
            ),
        }}
      />
      <Stack.Screen
        name="SecurityStack"
        component={SecurityStack}
        listeners={{
          focus: () =>
            BackHandler.addEventListener("hardwareBackPress", handleBackButton),
          blur: () =>
            BackHandler.removeEventListener(
              "hardwareBackPress",
              handleBackButton
            ),
        }}
      />

      <Stack.Screen name="Public" component={Public} />
      {/* <Stack.Screen name="HomeScreen" component={HomeScreen} /> */}
    </Stack.Navigator>
    <FeatureModal appFeature={appFeature} FeatureData={FeatureData}/>
    </>
  );
};

export default Private;
