import React, { useState } from "react";
import { Text, SafeAreaView, StyleSheet } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import Lottie from "lottie-react-native";
import Animated, {
  Extrapolate,
  interpolate,
  runOnJS,
  scrollTo,
  useAnimatedGestureHandler,
  useAnimatedRef,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { fonts, themes } from "../../themes";
import { detectTheme } from "../../helpers";
let trigger;

const PulltoRefersh = (WrappedComponent) => {
  const Hoc = (propsHoc) => {
    const [toggleLottie, setToggleLottie] = useState(false);
    const [toggleGesture, setToggleGesture] = useState(true);
    const [gestureActive, setGestureActive] = useState(false);
    const flatlistRef = useAnimatedRef();
    const translationY = useSharedValue(0);
    const pullUpTranslate = useSharedValue(0);
    const REFRESH_AREA_HEIGHT = 130;
    const mode = detectTheme();
    const fetchData = () => {
      setTimeout(() => {
        console.log(trigger, "ekdkekd");
        trigger();
      }, 2000);

      setTimeout(() => {
        translationY.value = withTiming(0, { duration: 200 }, (finished) => {
          pullUpTranslate.value = 0;

          runOnJS(setToggleLottie)(false);
        });
      }, 3000);
    };
    const loadRefresh = (refresh) => {
      trigger = refresh;
    };

    const pullUpAnimation = () => {
      pullUpTranslate.value = withDelay(
        0,
        withTiming(
          pullUpTranslate.value === 0 ? -100 : 0,
          { duration: 200 },
          (finished) => {
            if (finished) {
              runOnJS(setToggleLottie)(true);
              runOnJS(fetchData)();
            }
          }
        )
      );
    };

    const gestureHandler = useAnimatedGestureHandler({
      onStart: (_, ctx) => {
        ctx.startY = translationY.value;
        runOnJS(setGestureActive)(true);
      },
      onActive: (event, ctx) => {
        const total = ctx.startY + event.translationY;
        // console.log('translateY', total);

        if (total < REFRESH_AREA_HEIGHT) {
          translationY.value = total;
        } else {
          translationY.value = REFRESH_AREA_HEIGHT;
        }

        if (total < 0) {
          translationY.value = 0;
          scrollTo(flatlistRef, 0, total * -1, false);
        }
      },
      onEnd: () => {
        runOnJS(setGestureActive)(false);
        if (translationY.value <= REFRESH_AREA_HEIGHT - 1) {
          translationY.value = withTiming(0, { duration: 200 });
        } else {
          runOnJS(pullUpAnimation)();
        }
        if (!(translationY.value > 0)) {
          runOnJS(setToggleGesture)(false);
        }
      },
    });

    const handleOnScroll = (event) => {
      const position = event.nativeEvent.contentOffset.y;
      if (position === 0) {
        setToggleGesture(true);
      } else if (position > 0 && toggleGesture && !gestureActive) {
        setToggleGesture(false);
      }
    };

    const animatedSpace = useAnimatedStyle(() => {
      return {
        height: translationY.value,
      };
    });

    const pullUpTranslateStyle = useAnimatedStyle(() => {
      const opacity = interpolate(
        translationY.value,
        [58, REFRESH_AREA_HEIGHT],
        [0, 1]
      );

      return {
        opacity,
        transform: [
          {
            translateY: pullUpTranslate.value,
          },
        ],
      };
    });

    const RefreshHeader = (
      <Animated.View style={[styles.pullToRefreshArea, animatedSpace]}>
        <Animated.View style={[styles.center, pullUpTranslateStyle]}>
          {/* <Animated.View style={pullDownIconSection}>
            <Icon name="arrow-down-circle" color="black" size={35} />
          </Animated.View> */}

          <Text
            style={{
              color: themes[mode]["lightAsh"],
              fontFamily: fonts.medium,
              fontSize: 12,
            }}
          >
            Pull Down to Refresh
          </Text>
        </Animated.View>
        {toggleLottie && (
          <>
            <Lottie
              source={require("../../../assets/gif/loader.json")}
              style={styles.lottieView}
              autoPlay
            />
          </>
        )}
      </Animated.View>
    );
    const GestureHandler = toggleGesture ? (
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={styles.gesture} />
      </PanGestureHandler>
    ) : (
      false
    );
    let HocData = {
      GestureHandler,
      RefreshHeader,
      handleOnScroll,
      flatlistRef,
      loadRefresh,
      navigation: propsHoc.navigation,
    };
    console.log("hochoc");
    [].f;
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "#f4f4f4",
        }}
      >
        <WrappedComponent {...HocData} />
      </SafeAreaView>
    );
  };
  return Hoc;
};

const styles = StyleSheet.create({
  catagory: {
    marginRight: 20,
    fontWeight: "bold",
  },
  active: {
    width: 70,
    height: 2,
    backgroundColor: "black",
    marginBottom: 20,
  },
  catagoryContainer: { flexDirection: "row", marginBottom: 5, marginTop: 30 },
  lottieAnim: {
    width: 100,
    height: 100,
    backgroundColor: "white",
    position: "absolute",
    left: -8,
    top: -8,
  },
  gesture: {
    position: "absolute",
    top: -20,
    left: 0,
    height: 40,
    width: "100%",
    // backgroundColor: 'green',
    zIndex: 99999,
  },
  lottieView: {
    width: 120,
    height: 120,
    backgroundColor: "transparent",
    marginTop: -15,
  },
  pullToRefreshArea: {
    height: 140,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    overflow: "hidden",
  },
  customStatusBar: { height: 40, backgroundColor: "#E0144C" },
  contentContainer: { flex: 1, marginHorizontal: 15, marginVertical: 15 },
  center: { justifyContent: "center", alignItems: "center" },
});
export default PulltoRefersh;
