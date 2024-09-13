import React, { useEffect } from "react";
import { MenuProvider } from "react-native-popup-menu";

import {
  StatusBar,
  LogBox,
  Appearance,
  AppState,
  Platform,
  Text,
  View,
  TouchableOpacity,
  Easing,
  NativeModules,
  BackHandler,
  Linking,
  Pressable,
  Modal,
} from "react-native";
import VersionCheck from "react-native-version-check";

import VoipPushNotification from "react-native-voip-push-notification";
import messaging from "@react-native-firebase/messaging";
import { Provider, useDispatch, useSelector } from "react-redux";
import Store from "./src/redux/store";
import * as RootNavigation from "./src/navigation/RootNavigation";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import FlashMessage from "react-native-flash-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { navigationRef, isReadyRef } from "./src/navigation/RootNavigation";
import { NotifyIcon } from "./assets/img/svgs";
import Public from "./src/navigation/PublicNavigator";
import SplashScreen from "./src/screens/public/SplashScreen";
import Private from "./src/navigation/privateNavigator";
import { setTheme } from "./src/redux/actions/profile";
import { remoteConfigAPI } from "./src/api/firebase";
import { OnBoard } from "./src/screens/public";
import {
  TourGuideProvider, // Main provider
  TourGuideZone, // Main wrapper of highlight component
  TourGuideZoneByPosition, // Component to use mask on overlay (ie, position absolute)
  useTourGuideController, // hook to start, etc.
} from "rn-tourguide";
import { fonts, themes } from "./src/themes";

import { addFcmToken } from "./src/redux/actions/login";
import ActiveVideoCall from "./src/screens/private/Resident/VideoCallFeature/ActiveVideoCall";
import OpenSuccessReject from "./src/screens/private/Resident/VideoCallFeature/OpenSuccessReject";
import { detectTheme } from "./src/helpers";
import { ms, vs } from "./src/helpers/scaling";

// import * as Sentry from "@sentry/react-native";

// Sentry.init({
//   dsn:
//     "https://62a9b1adca8592ace29c0c88452c683c@o484490.ingest.sentry.io/4506024917336064",
//   environment: __DEV__ ? "development" : "production",
//   sampleRate: 1,
//   tracesSampleRate: 1.0,
//   _experiments: {
//     // The sampling rate for profiling is relative to TracesSampleRate.
//     // In this case, we'll capture profiles for 100% of transactions.
//     profilesSampleRate: 1.0,
//   },
// });
console.log(__DEV__, "mode of dev ");

const { DisplayPopover } = NativeModules;
global.unAuthorizedCount = 0;
global.active = -1;
const NavStack = ({ showcase }) => {
  const Stack = createStackNavigator();
  const dispatch = useDispatch();
  const showCaseTrigger = useSelector((state) => {
    return state.home.showcaseTrigger;
  });
  let netInfo = useSelector((state) => {
    return state.home.netInfo;
  });

  const setMode = async () => {
    const mode = await AsyncStorage.getItem("mode");
    console.log("mrrfrfrf app js", mode);
    if (mode == null) {
      const theme =
        Appearance.getColorScheme() === "light" || mode == null
          ? "light"
          : "dark";
      await AsyncStorage.setItem("mode", theme);
      dispatch(setTheme(theme));
    }
  };

  useEffect(() => {
    LogBox.ignoreAllLogs();
    ignoreCase();
    return () => {
      Platform.OS === "android" &&
        AppState.addEventListener("focus", setMode).remove("focus", setMode);
    };
  }, [showCaseTrigger]);
  const ignoreCase = async () => {
    const ignoreShowcase = await AsyncStorage.getItem("ignoreShowCase");
    console.log(ignoreShowcase, "9098", showCaseTrigger);
    setMode();
    ignoreShowcase != "true" && showCaseTrigger && showcase();
    Platform.OS === "android" && AppState.addEventListener("focus", setMode);
  };

  useEffect(() => {
    console.log("remote config trigger");
    // configAPI();
    console.log("remote config finised");
  }, [netInfo]);
  const configAPI = async () => {
    const host = await AsyncStorage.getItem("host");
    console.log("remote config enterd", host);
    await remoteConfigAPI();
  };
  const config = {
    animation: "spring",
    config: {
      stiffness: 1000,
      damping: 500,
      mass: 3,
      overshootClamping: true,
      restDisplacementThresold: 0.01,
      restSpeedThresold: 0.01,
    },
  };
  const closeConfig = {
    animation: "timing",
    config: {
      duration: 100,
      easing: Easing.linear,
    },
  };
  return (
    <Stack.Navigator
      screenOptions={{ animationEnabled: true, headerShown: false }}
      initialRouteName={global.navigate ? "ActiveVideoCall" : "Splash"}
    >
      <Stack.Screen
        options={({ route, navigation }) => ({
          animationEnabled: true,
          gestureEnabled: true,
          ...TransitionPresets.DefaultTransition,
          transitionSpec: {
            open: config,
            close: closeConfig,
          },
        })}
        name="Splash"
        component={SplashScreen}
      />
      <Stack.Screen
        options={({ route, navigation }) => ({
          animationEnabled: true,
          gestureEnabled: true,
          ...TransitionPresets.DefaultTransition,
          transitionSpec: {
            open: config,
            close: closeConfig,
          },
        })}
        name="Public"
        component={Public}
      />
      <Stack.Screen
        options={({ route, navigation }) => ({
          animationEnabled: true,
          gestureEnabled: true,
          ...TransitionPresets.DefaultTransition,
          transitionSpec: {
            open: config,
            close: closeConfig,
          },
        })}
        name="Private"
        component={Private}
      />
      <Stack.Screen
        options={({ route, navigation }) => ({
          animationEnabled: true,
          gestureEnabled: true,
          ...TransitionPresets.DefaultTransition,
          transitionSpec: {
            open: config,
            close: closeConfig,
          },
        })}
        name="OnBoard"
        component={OnBoard}
      />
      <Stack.Screen name="ActiveVideoCall" component={ActiveVideoCall} />
      <Stack.Screen name="OpenSuccessReject" component={OpenSuccessReject} />
    </Stack.Navigator>
  );
};

const App = (props) => {
  const [isUpdate, setUpdate] = React.useState(false);
  const [isUpdateFirebase, setUpdateFirebase] = React.useState("");
  let theme = DefaultTheme;
  const route = navigationRef.current?.getCurrentRoute();
  console.log(route, "route name form ref handling");
  useEffect(() => {
    Platform.OS == "ios" && VoipRegister();
    console.log(
      DisplayPopover,
      "DisplayPopover functions from  native modules"
    );
    if (Platform.OS === "android") {
      setInterval(() => {
        DisplayPopover.checkOverlayPermission().then((data) => {
          if (Platform.OS === "android") {
            !data &&
              DisplayPopover.requestOverlayPermission()
                .then((Data) => {
                  console.log(
                    "DisplayPopover functions from  native modules requestOverlayPermission",
                    Data
                  );
                  !Data && BackHandler.exitApp();
                })
                .catch((err) => {
                  console.log(
                    "DisplayPopover functions from  native modules requestOverlayPermission error",
                    err
                  );
                });
          }
        });
      }, 5000);
    }
  }, []);
  const VoipRegister = async () => {
    console.log("before register");
    VoipPushNotification.addEventListener("register", async (token) => {
      console.log("voip token: " + token);
      await AsyncStorage.setItem("voip_token", token);
      addFcmToken(token);
    });

    VoipPushNotification.registerVoipToken();
    let deviceToken = await messaging().getAPNSToken();
    console.log(deviceToken);
    console.log("registerIosDevice called");
  };
  useEffect(() => {
    console.log("remote confie ttrrigger");

    configAPI();
    console.log("remote config finised");
    VersionCheck.needUpdate().then(async (res) => {
      console.log(res.isNeeded, "[App Update]");
      if (res.isNeeded) {
        setUpdate(res.isNeeded);
      }
    });
    let AppListner = AppState.addEventListener("change", navigationTheme);
    Platform.OS === "android" &&
      AppState.addEventListener("focus", navigationTheme);
    return () => {
      AppListner.remove("change", navigationTheme);
      Platform.OS === "android" && AppListner.remove("focus", navigationTheme);
    };
  }, []);
  const configAPI = async () => {
    const host = await AsyncStorage.getItem("host");
    console.log("remote config enterd", host);
    await remoteConfigAPI(setUpdateFirebase);

    console.log("remote config enterd after", host);
  };
  useEffect(() => {
    copilot();

    return () => {};
  }, []);
  
  const copilot = async () => {
    let ignoreShowCase = await AsyncStorage.getItem("ignoreShowCase");
    console.log(ignoreShowCase, "showcase");
    props.copilotEvents?.on("stepChange", handleStepChange);
  };
  const handleStepChange = (step) => {
    console.log(`currrent step is : ${step.name}`);
  };
  const navigationTheme = () => {
    theme =
      Store.getState().profile.mode === "dark" ||
      Appearance.getColorScheme() === "dark"
        ? DarkTheme
        : DefaultTheme;
  };
  console.log(isUpdate, isUpdateFirebase, "update available modal");

  return (
    <Provider store={Store}>
      <MenuProvider>
        <TourGuideProvider
          {...{ borderRadius: 16 }}
          {...{ tooltipComponent: TooltipComponent }}
          preventOutsideInteraction
          androidStatusBarVisible={true}
        >
          <SafeAreaProvider style={{ flex: 1 }}>
            <NavigationContainer
              ref={navigationRef}
              onReady={() => {
                isReadyRef.current = true;
              }}
              theme={theme}
            >
              <StatusBar hidden={false} />
              <NavStack showcase={props.start} />
              {isUpdate &&
                isUpdateFirebase == "true" &&
                ![null, "ActiveVideoCall", "OpenSuccessReject"].includes(
                  route?.name
                ) && <AppUpdateModal />}
            </NavigationContainer>
          </SafeAreaProvider>
          <FlashMessage
            position="top"
            icon="success"
            renderFlashMessageIcon={NotifyIcon}
            floating={true}
          ></FlashMessage>
        </TourGuideProvider>
      </MenuProvider>
    </Provider>
  );
};

export const Button = ({ wrapperStyle, style, ...rest }) => (
  <View
    style={[
      { paddingTop: 10, paddingRight: 10, paddingBottom: 10 },
      wrapperStyle,
    ]}
  >
    <Text style={[{ color: "#FFC727" }, style]} {...rest} />
  </View>
);

const TooltipComponent = ({
  isFirstStep,
  isLastStep,
  handleNext,
  handlePrev,
  handleStop,
  currentStep,
  labels,
}) => {
  const {
    canStart, // a boolean indicate if you can start tour guide
    start, // a function to start the tourguide
    stop, // a function  to stopping it
    eventEmitter, // an object for listening some events
  } = useTourGuideController();
  console.log(
    currentStep.name1,
    "curendjhdbwfkbkbefwjfbwf fbwif wjf",
    currentStep.text
  );
  return (
    <View
      style={{
        borderRadius: 16,
        paddingTop: 24,
        alignItems: "center",
        justifyContent: "center",
        paddingBottom: 16,
        width: "80%",
        backgroundColor: "#ffffffef",
      }}
    >
      <View style={{ flex: 1, paddingHorizontal: 14 }}>
        <Text
          testID="stepDescription"
          style={{ textAlign: "center", fontFamily: fonts.regular }}
        >
          {currentStep.text}
        </Text>
        {console.log(currentStep.text, "current step and 555")}
      </View>
      <View
        style={[
          {
            marginTop: 10,
            flexDirection: "row",
            justifyContent: "space-around",
            paddingHorizontal: 0,
            width: "100%",
          },
        ]}
      >
        {!isLastStep ? (
          <TouchableOpacity
            onPress={async () => {
              stop();
              await AsyncStorage.setItem("ignoreShowCase", "true");
              currentStep.text ==
                "Pre-Invite your visitors based on their purpose" ||
              currentStep.text ==
                "Get instant access in all device via QR for a hassle-free entry"
                ? RootNavigation.navigate("Private")
                : null;
              currentStep.text == "Know the details of your recent visitors" &&
                (global.active = -1);
              handleStop();
            }}
          >
            <Button>{labels.skip || "Skip"}</Button>
          </TouchableOpacity>
        ) : null}

        {!isLastStep ? (
          <TouchableOpacity
            onPress={() => {
              currentStep.text ==
                "Stay in the know with all your condo-wide announcements" &&
                RootNavigation.navigate("InviteHome");

              currentStep.text ==
                "Pre-Invite your visitors based on their purpose" &&
                RootNavigation.navigate("QRScreen");

              handleNext();
            }}
          >
            <Button>{labels.next || "Next"}</Button>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={async () => {
              console.log("finish");
              stop();
              await AsyncStorage.setItem("ignoreShowCase", "true");
              RootNavigation.navigate("Private");
              handleStop();
            }}
          >
            <Button>{labels.finish || "Finish"}</Button>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const AppUpdateModal = () => {
  const mode = detectTheme();

  const appUpdate = () => {
    Linking.openURL(global.appLink);
  };
  return (
    <Modal animationType="fade" transparent visible>
      <Pressable
        style={[
          Platform.OS == "ios"
            ? {
                backgroundColor: "#000000",
                opacity: 0.3,
              }
            : {
                backgroundColor: "#232f34",
                opacity: 0.4,
              },
          {
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
          },
        ]}
      />
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          marginTop: 22,
        }}
      >
        <View
          style={{
            // margin: 20,
            backgroundColor: "white",
            borderRadius: 20,
            paddingHorizontal: 20,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 10,
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
            width: "90%",
            paddingVertical: vs(30),
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              alignContent: "center",
              paddingHorizontal: 5,
              marginTop: 5,
              marginBottom: 10,

              marginTop: 0,
              marginBottom: 10,
            }}
          >
            <Text
              style={{
                color: themes[mode]["headingColor"],
                fontWeight: "700",
                fontSize: 17,
              }}
            >
              Update Available
            </Text>
          </View>
          <View style={{ alignSelf: "center", width: "100%" }}>
            <Text
              grey
              style={{
                color: themes[mode]["headingColor"],
                textAlign: "center",
                marginTop: 10,
                paddingBottom: vs(20),
              }}
            >
              Update now to enjoy the latest features,Don't miss out, update
              your app today !
            </Text>

            <TouchableOpacity
              style={{
                backgroundColor: "#FFC727",
                justifyContent: "center",
                alignItems: "center",
                paddingVertical: vs(10),
                borderRadius: ms(10),
                marginTop: ms(10),
              }}
              onPress={appUpdate}
            >
              <Text style={{ color: "white", letterSpacing: 2 }}>Update</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default App;
