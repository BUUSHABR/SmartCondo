import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  useWindowDimensions,
  Animated,
  StatusBar,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import {
  OnBoardInviteIcon,
  TouchlessIcon,
  VideoCallIcon,
} from "../../../assets/img/svgs";
import commonStyles from "../../styles/commonStyles";
import { fonts, themes } from "../../themes";
import { navigate } from "../../navigation/RootNavigation";
import { handleBackButton } from "../../helpers";
import { useSelector } from "react-redux";
import SafeAreaView from "react-native-safe-area-view";
import { borderColor } from "react-native/Libraries/Components/View/ReactNativeStyleAttributes";
import { ms } from "../../helpers/scaling";

function OnBoard() {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [currentScroll, setCurrentScroll] = React.useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef(null);
  const mode = useSelector((state) => {
    return state.profile.mode;
  });
  useEffect(() => {
    return () => {
      handleBackButton();
    };
  }, []);
  const slides = [
    {
      id: 1,
      title: "Pre-Invitation",
      content:
        "Manage all your visitors, with the easy to manage invitation flow and get instant notifications when they arrive",
      Image: OnBoardInviteIcon,
    },
    {
      id: 2,
      title: "Touchless-Entry Access",
      content:
        "Residents can now use their mobile phones to gain access in all your devices via your unique QR or via mobile bluetooth",
      Image: TouchlessIcon,
    },
    {
      id: 3,
      title: "Visitor Access Control",
      content:
        "Have complete control over the visitors of your unit. You can now speak with the visitors before your grant them access",
      Image: VideoCallIcon,
    },
  ];
  const viewbleItemChanged = useRef(({ viewableItems }) => {
    console.log(viewableItems, "viewableItems");
    viewableItems.length > 0 && setCurrentIndex(viewableItems[0].index);
    viewableItems.length > 0 && setCurrentScroll(viewableItems[0].index);
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;
  return (
    <SafeAreaView
      style={{ ...styles.container, backgroundColor: themes[mode]["bgColor"] }}
    >
      <StatusBar
        translucent
        barStyle={mode === "light" ? "dark-content" : "light-content"}
        backgroundColor={themes[mode]["bgColor"]}
      />
      <View style={styles.pagination}>
        <Paginater data={slides} scrollX={scrollX} />
      </View>
      <FlatList
        data={slides}
        horizontal
        pagingEnabled
        renderItem={({ item }) => (
          <OnBoardingItems
            item={item}
            currentIndex={currentIndex}
            slides={slides}
            slidesRef={slidesRef}
            mode={mode}
            currentScroll={currentScroll}
          />
        )}
        keyExtractor={(item) => item.id}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onViewableItemsChanged={viewbleItemChanged}
        viewabilityConfig={viewConfig}
        ref={slidesRef}
        scrollEventThrottle={32}
        bounces={false}
        showsHorizontalScrollIndicator={false}
        onScrollToIndexFailed
      />
    </SafeAreaView>
  );
}

const OnBoardingItems = ({
  item,
  currentIndex,
  slides,
  slidesRef,
  mode,
  index,
  currentScroll,
}) => {
  const { id, title, content, Image } = item;
  const { width } = useWindowDimensions();
  const onScroll = () => {
    if (currentIndex < slides.length - 1) {
      slidesRef.current.scrollToIndex({ index: currentIndex + 1 });
    }
  };
  const onScrollBack = () => {
    if (currentIndex < slides.length - 1) {
      slidesRef.current.scrollToIndex({ index: currentIndex - 1 });
    }
  };
  const handler = (event) => {
    console.log(event, "events");
  };
  return (
    <View style={{ ...styles.container, width }}>
      <View style={{ ...styles.container, flex: 4 }}>
        <Image />
        <Text
          style={{
            ...styles.title,
            color: themes[mode][mode === "light" ? "tagLine" : "lineColor"],
          }}
        >
          {title}
        </Text>
        <View style={styles.content}>
          <Text
            style={{
              ...styles.alignContent,
              fontFamily: "Montserrat-Light",
              color: themes[mode][mode === "light" ? "tagLine" : "lineColor"],
            }}
          >
            {content}
          </Text>
        </View>
      </View>

      <View style={styles.btnContainer}>
        {title == "Pre-Invitation" && (
          <View style={{ ...styles.inviteBtn, width }}>
            <TouchableOpacity
              disabled={currentScroll == 0 ? false : true}
              onPress={onScroll}
              style={{
                marginRight: 23,
                paddingHorizontal: 15,
                paddingVertical: 10,
              }}
            >
              <Text
                style={{
                  // ...fonts.light,
                  // fontFamily:"Montserrat-Light",
                  fontWeight: "normal",
                  fontSize: 17,
                  color:
                    themes[mode][mode === "light" ? "tagLine" : "lineColor"],
                }}
              >
                Next
              </Text>
            </TouchableOpacity>
          </View>
        )}
        {title == "Touchless-Entry Access" && (
          <View style={{ ...styles.TEA, width }}>
            <TouchableOpacity
              disabled={currentScroll == 1 ? false : true}
              style={{ paddingHorizontal: 15, paddingVertical: 10 }}
              onPress={onScrollBack}
            >
              <Text
                style={{
                  // ...fonts.light,
                  fontWeight: "normal",
                  fontSize: 17,
                  color:
                    themes[mode][mode === "light" ? "tagLine" : "lineColor"],
                }}
              >
                Previous
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={currentScroll == 1 ? false : true}
              style={{ paddingHorizontal: 15, paddingVertical: 10 }}
              onPress={onScroll}
            >
              <Text
                style={{
                  // ...fonts.light,
                  fontWeight: "normal",
                  fontSize: 17,
                  color:
                    themes[mode][mode === "light" ? "tagLine" : "lineColor"],
                }}
              >
                Next
              </Text>
            </TouchableOpacity>
          </View>
        )}
        {title == "Visitor Access Control" && (
          <View style={{ ...styles.btncenter, width }}>
            <TouchableOpacity
              disabled={currentIndex == 2 ? false : true}
              onPress={() => navigate("Public")}
              style={styles.startedBtn}
            >
              <Text
                style={{
                  fontWeight: "normal",
                  fontSize: 17,
                  color: "#fff",
                  fontWeight: "500",
                  letterSpacing: 0.5,
                }}
              >
                Get Started
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const Paginater = ({ data, scrollX }) => {
  const { width } = useWindowDimensions();

  return (
    <View style={{ flexDirection: "row", height: 64, alignItems: "flex-end" }}>
      {data?.map((_, i) => {
        const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
        const dotWidth = scrollX.interpolate({
          inputRange,
          outputRange: [10, 20, 10],
          extrapolate: "clamp",
        });
        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: ["#C1C1C1", "#FFC727", "#C1C1C1"],
          extrapolate: "clamp",
        });
        return (
          <Animated.View
            style={[styles.dot, { width: dotWidth, backgroundColor: opacity }]}
            key={i.toString()}
          ></Animated.View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...commonStyles.safeAreaAlign,
    ...commonStyles.centerAlignOnly,
    position: "relative",
    height: "100%",
  },
  title: {
    marginTop: 40,
    fontFamily: fonts.semiBold,
    fontSize: 17,
    fontWeight: "600",
  },
  content: {
    marginTop: 0,
    padding: 30,
  },
  alignContent: {
    textAlign: "center",
    // fontFamily: fonts.light,
    fontWeight: "normal",
    lineHeight:ms(22),
    fontSize:ms(16)
  },
  dot: {
    height: 10,
    borderRadius: 5,
    marginHorizontal: 8,
  },
  pagination: {},
  btnContainer: {
    flex: 0.5,
    justifyContent: "flex-end",
    marginBottom: 20,
  },
  inviteBtn: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  TEA: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  btncenter: {
    flexDirection: "row",
    justifyContent: "center",
  },
  startedBtn: {
    backgroundColor: "#FFC727",
    paddingHorizontal: 100,
    borderRadius: 5,
    height: 45,
    justifyContent: "center",
  },
});

export default OnBoard;
