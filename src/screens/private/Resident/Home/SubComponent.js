import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
} from "react-native";
import { InviteType } from "../Invite/InviteType";
import Animated, {
  Layout,
  ZoomIn,
  ZoomInUp,
  ZoomInDown,
} from "react-native-reanimated";
import moment, { duration } from "moment";
import { fonts, themes } from "../../../../themes";
import {
  detectTheme,
  renderHomeFeatures,
  tailedString,
  windowSize,
  featureShowcase,
  capitalize,
} from "../../../../helpers";
// import { copilot, walkthroughable, CopilotStep } from "react-native-copilot";
import { inviteChange } from "../../../../redux/actions/invite";
// const CopilotText = walkthroughable(Text);
import {
  TourGuideProvider, // Main provider
  TourGuideZone, // Main wrapper of highlight component
  TourGuideZoneByPosition, // Component to use mask on overlay (ie, position absolute)
  useTourGuideController, // hook to start, etc.
} from "rn-tourguide";
import {
  Announcement,
  Announcement1,
  Announcement3,
  Announcement4,
} from "../../../../../assets/img/svgs";
import { customAnimation } from "../../../../animation/CommonAnimation";
import { ms } from "../../../../helpers/scaling";
export const renderFeatures = ({
  item,
  navigation,
  index,
  tenant_present,
  resident_type,
  dataCount,
  navi,
}) => {
  const mode = detectTheme();
   // console.log(item, "QWERTY");
    const color = [
    "#FFF6DA",
    "#FFE6E6",
    "#EAEAFF",
    "#E2F2E5",
    "#FFF6DA",
    "#FFE6E6",
    "#EAEAFF",
    "#E2F2E5",
    "#FFF6DA",
    "#FFE6E6",
    "#EAEAFF",
    "#E2F2E5",
    "#FFF6DA",
    "#FFE6E6",
    "#EAEAFF",
    "#E2F2E5",
    "#FFF6DA",
    "#FFE6E6",
    "#EAEAFF",
    "#E2F2E5",
    "#FFF6DA",
    "#FFE6E6",
    "#EAEAFF",
    "#E2F2E5",
    "#FFF6DA",
    "#FFE6E6",
    "#EAEAFF",
    "#E2F2E5",
  ];
  let showCaseData = {};
  featureShowcase?.map((data) => {
    data.name == item && (showCaseData = data);
  });
  const handleChange = () => {
    navi({ name: "purpose", value: "SelfInvite" });
    navigation.navigate("VisitorForm");
  };
  // console.log(resident_type, tenant_present, "0390487493497493484");
  let webAppList = [
    "invite",
    "facility_booking",
    "complaints",
    "documents",
    "selfinvite",
    "community",
    "selfinvite",
    "localhelp"
  ];
  let iswebApp = webAppList.includes(item);
  // console.log(iswebApp, "kjdbwkdjwd",item);
  return (
    // <CopilotStep
    //   text={showCaseData.content}
    //   order={showCaseData.order}
    //   name={showCaseData.name}
    // >
    //   <CopilotText style={{ padding: 5 }}>
    iswebApp && (
      <Animated.View key={index}>
        <TouchableOpacity
          style={{
            ...styles.featureWrap,
            backgroundColor: color[index],
            justifyContent: "center",
            alignItems: "center",
          

            // shadowColor: mode === "light" ? "#bbb" : "#000",
          }}
          onPress={() => {
            item == "selfinvite"
              ? handleChange()
              : navigation.navigate(
                  renderHomeFeatures(item, resident_type, tenant_present).screen
                );
          }}
          disabled={
            renderHomeFeatures(item, resident_type, tenant_present).disable
          }
        >
          {renderHomeFeatures(item, resident_type, tenant_present).disable && (
            <View
              style={{
                position: "absolute",
                // top: 0,
                ...styles.featureWrap,
                backgroundColor: "#F5F5F5",
                justifyContent: "center",
                alignItems: "center",
              }}
            ></View>
          )}
          <View
            style={{
              ...styles.featureIcon,
              backgroundColor: "#fff",
              width: ms(40),
              height: ms(40),
              borderRadius: ms(50),
              // marginLeft: 18,
              justifyContent: "center",
            }}
          >
            {/* {renderHomeFeatures(item).icon} */}
            {/* ../../../assets/img/gallery1.png */}
            <Image
              source={
                renderHomeFeatures(item, resident_type, tenant_present).icon
              }
              style={{
                width: ms(20),
                height: ms(18),

                // marginBottom: "10%",
              }}
            />
            {renderHomeFeatures(item, resident_type, tenant_present)
              .disable && (
              <View
                style={{
                  ...styles.featureIcon,
                  backgroundColor: "#F5F5F5",
                  width: 30,
                  height: 30,
                  borderRadius: 50,
                  // marginLeft: 18,
                  justifyContent: "center",
                  position: "absolute",
                  opacity: 0.5,
                }}
              ></View>
            )}
          </View>
          <Text
            style={{
              ...styles.featureText,
              color: renderHomeFeatures(item, resident_type, tenant_present)
                .disable
                ? "#989898"
                : "#282828",
              width: "100%",
              textAlign: "center",
              marginTop: 5,
              fontFamily:fonts.semiBold,
              opacity:0.8
              // paddingRight:5
            }}
          >
            {renderHomeFeatures(item, resident_type, tenant_present).label ==
            "Facility Booking"
              ? "Facility"
              : renderHomeFeatures(item, resident_type, tenant_present).label}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    )
    // </TourGuideZone>
    //   </CopilotText>
    // </CopilotStep>
  );
};

export const renderAnnouncements = ({ item, navigation, dataCount, index }) => {
  const mode = detectTheme();
  const { title, message, expire_at, id } = item;
  console.log(item, "hxchc");
  const data = {
    type_id: id,
  };

  const MyVisitorArrData = [
    { icon: "#FFC727" },
    { icon: "#373E91" },
    { icon: "#C278C8" },
    { icon: "#7FB7F8" },
    { icon: "#FFC727" },
    { icon: "#373E91" },
    { icon: "#C278C8" },
    { icon: "#7FB7F8" },
    { icon: "#FFC727" },
    { icon: "#373E91" },
    { icon: "#C278C8" },
    { icon: "#7FB7F8" },
    { icon: "#FFC727" },
    { icon: "#373E91" },
    { icon: "#C278C8" },
    { icon: "#7FB7F8" },
  ];

  const icon = MyVisitorArrData[index].icon;
  const Announcements = (
    <TouchableOpacity
    key={index}
      // disabled={!expire_at}
      style={{
        ...styles.announment,
        backgroundColor:
          themes[mode][mode === "light" ? "bgColor" : "shadowColor"],
        shadowColor: mode === "light" ? "#e5e5e5" : "#000",
        // maxWidth: dataCount < 2 ? '63%' : '100%',
        borderColor: themes[mode]["lightWhite"],
        height: ms(140),
        marginLeft: dataCount < 2 ? 8 : 0,
        // marginRight:index == 0?40:0
      }}
      onPress={() => navigation.navigate("AnnouncementDetail", { data })}
    >
      <View
        style={{
          ...styles.yellowBlock,
          width:
            dataCount < 2 ? windowSize.width / 1.24 : windowSize.width / 1.55,
          backgroundColor: icon,
        }}
      >
        <View style={{ position: "absolute", zIndex: -1, top: 0, right: -5 }}>
          <Announcement />
        </View>
        <View
          style={{
            maxWidth:
              dataCount < 2 ? windowSize.width / 0.25 : windowSize.width / 1.2,
          }}
        >
          <Text
            style={{
              ...styles.announmentHead,
              paddingLeft: dataCount < 2 ? 10 : 4,
              width:
                dataCount < 2
                  ? windowSize.width / 1.3
                  : windowSize.width / 1.63,
            }}
          >
            {capitalize(tailedString(title.toLowerCase(), dataCount < 2 ? 16 : 16))}
          </Text>
          {/* <Text
            style={{
              ...styles.expireTime,
              color: themes["light"]["bgColor"],
              paddingLeft: dataCount < 2 ? 5 : 0,
              marginLeft: dataCount < 2 ? 5 : 4,
            }}
          >
            {expire_at ? moment(expire_at).format("DD MMM, hh:mm a ") : ""}
          </Text> */}
          <Text
            style={{
              ...styles.announcementText,
              color: themes["light"]["bgColor"],
              width:
                dataCount < 2
                  ? windowSize.width / 1.3
                  : windowSize.width / 1.63,
              fontSize: ms(14),
              paddingLeft: dataCount < 2 ? 5 : 0,
              marginTop: expire_at ? ms(51) : ms(30),
              marginLeft: dataCount < 2 ? 5 : 4,


              // marginBottom: 15,
            }}
          >
            {tailedString(message, expire_at ? 83 : 100)}
          </Text>
        </View>
        <View
          style={{
            position: "absolute",
            zIndex: -62,
            right: 0,
            bottom: 0,
            left: -1,
          }}
        >
          <Announcement1 />
        </View>
      </View>
    </TouchableOpacity>
  );
  // </TourGuideZone>
  //   </CopilotText>
  // </CopilotStep>
  // );
  // if(item.type==)
  if (index == 0) {
    return (
      <>
      {/* <TourGuideZone
        zone={3}
        text={"Stay in the know with all your condo-wide announcements"}
        borderRadius={16}
        style={{ paddingHorizontal: 10 }}
      > */}
        {Announcements}
      {/* </TourGuideZone> */}
      </>
    );
  }
  return Announcements;
};

export const renderRecentEntries = () => {
  return (
    <View style={{ marginVertical: "4%" }}>
      <TouchableOpacity
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
        onPress={showVisitorDetails}
      >
        <View
          style={{
            flexDirection: "row",
          }}
        >
          <View
            style={{
              width: 35,
              height: 35,
              borderRadius: 17,
              backgroundColor: bgColor,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {icon}
          </View>
          <View style={{ marginLeft: 15 }}>
            <Text
              style={{
                fontFamily: fonts.regular,
                fontSize: 12,
                color: themes[mode]["headingColor"],
                textTransform: "capitalize",
              }}
            >
              {visitors && visitors[0].name}
            </Text>
            <View style={{ flexDirection: "row", marginVertical: 8 }}>
              <Text
                style={{
                  fontFamily: fonts.bold,
                  fontSize: 12,
                  color: themes[mode]["headingColor"],
                  textTransform: "capitalize",
                }}
              >
                {visitor_type}
              </Text>
              <Text
                style={{
                  fontFamily: fonts.regular,
                  fontSize: 12,
                  color: themes[mode]["textColor"],
                  textTransform: "capitalize",
                }}
              >
                {sub_visitor_type ? `  \u2022  ${sub_visitor_type}` : ""}
              </Text>
            </View>
          </View>
        </View>
        <View>
          <View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <MyVisitorUserIcon />
              <Text
                style={{
                  fontFamily: fonts.regular,
                  fontSize: 12,
                  marginLeft: 5,
                }}
              >
                {visitors?.length}
              </Text>
            </View>
          </View>
          <Text
            style={{
              fontFamily: fonts.regular,
              fontSize: 10,
              color: themes[mode]["headingColor"],
              marginVertical: 10,
            }}
          >
            {timeAgo(visit_time)}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  featureWrap: {
    // borderRadius: 35,
    borderTopLeftRadius: 10,
    borderBottomRightRadius: 10,
    paddingVertical: 12,
    // paddingLeft: 10,
    // paddingRight: 25,
    // shadowOffset: { width: 0, height: 3 },
    // shadowOpacity: 0.5,
    // shadowRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    // borderWidth: 1,
    // borderColor: "transparent",
    // elevation: 3,
    marginRight: 15,
    marginVertical: 15,
    marginLeft: Platform.OS === "android" ? 0 : 2,
    width: ms(95),
    height: ms(85),
  },
  featureIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  featureText: {
    fontFamily: fonts.regular,
    fontSize: ms(13),
    textAlign: "justify",
    // marginLeft: 15,
  },
  announment: {
    borderRadius: 20,
    elevation: 2,
    margin: 5,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    // marginRight: 10,

    borderWidth: 1,
    borderColor: "transparent",
    overflow: "hidden",
    // width:"100%"
  },
  yellowBlock: {
    height: ms(140),
    borderRadius: 20,
    // margin: 5,
    paddingHorizontal: 10,
    paddingVertical: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    // width:"110%"
  },
  announmentHead: {
    fontFamily: fonts.bold,
    fontSize: ms(18),
    lineHeight: ms(23),
    color: "#fff",
    flexGrow: 1,
    letterSpacing: 0.2,
    position: "absolute",
    padding: 10,
    marginTop: -12,
  },

  announcementText: {
    fontFamily: fonts.regular,
    fontSize: ms(12),
    lineHeight: ms(18),
    // marginVertical: 3,
    // marginLeft: 10,
    position: "absolute",

    paddingRight: 23,
    paddingBottom: 10,
  },
  expireTime: {
    fontFamily: fonts.medium,
    fontSize: 12,
    letterSpacing: 0.2,
    position: "absolute",
    marginTop: 25,
  },
  img: { width: 120, height: 120 },
});
