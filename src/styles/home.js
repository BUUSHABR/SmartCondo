import { StyleSheet, Appearance, Platform } from "react-native";
import { fonts, themes } from "../themes";
import { detectTheme, screenSize } from "../helpers";
import { ms } from "../helpers/scaling";

export default StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingBottom: 10,
  },
  block1: {
    paddingHorizontal: 25,
    marginTop: "10%",
  },
  block1Align: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  name: {
    fontFamily: fonts.bold,
    fontSize: ms(22),
    lineHeight: ms(26),
    maxWidth: "70%",
    textTransform: "capitalize",
  },
  block1Icon: {
    flexDirection: "row",
    // marginTop: 2,
  },
  unreadCountBox: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: themes["light"]["error"],
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    right: 12,
    top: 2,
    zIndex: 1001,
  },
  block2: {
    marginLeft: 20,
  },
  featureLoaderWrap: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    margin: 5,
    borderRadius: 20,
    elevation: 3,
    marginVertical: 20,
  },
  featureContainer: {
    width:"100%",
    alignItems:"center"
  },
  block3: {
    marginTop: 20,
    marginBottom: Platform.OS === "android" ? 1 : 5,
    marginLeft: 25,
  },
  block3Align: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: 10,
  },
  scrollTextAlign: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
    marginTop: -5,
  },
  scrollText1: {
    fontFamily: fonts.regular,
    fontSize: 12,
  },
  scrollText2: {
    fontFamily: fonts.semiBold,
    fontSize: 18,
    marginBottom: 7,
    marginLeft: 2,
    letterSpacing: 0.5,
  },
  seperatorLine: {
    borderBottomWidth: 1,
    marginBottom: 5,
    marginTop: -10,
  },
  visitorStyle: {
    zIndex: 10001,
    marginTop: -5,
  },
  visitorContainerStyle: {
    flexGrow: 1,
    marginRight: 15,
  },
  noEntryAlign: {
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
  },
  noVisitText: {
    fontFamily: fonts.medium,
    fontSize: ms(12),
    color: themes["light"]["textColor"],
    marginVertical: 15,
  },
  block4: {
    marginHorizontal: 20,

    // marginLeft: 25,
  },
  block5: {
    // marginTop: 20,
    marginBottom: ms(20),
    marginHorizontal: ms(25),
    marginTop: Platform.OS === "android" ? 20 : 0,
  },
  blockHead: {
    fontFamily: fonts.semiBold,
    fontSize: ms(16),
    marginBottom: 20,
    marginTop: 10,
    marginLeft: 5,
  },
  emerTextBlock: {
    marginHorizontal: 20,
    // justifyContent: 'center',
    // alignItems: 'center',
    marginLeft: 80,
    marginTop: 10,
  },
  sosBox: {
    width: "100%",
    height: ms(141),
    borderRadius: 15,

    elevation: 3,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    marginTop: 25,
  },
  sosManIcon: { position: "absolute", left: -10, top: -30 },
  sosIcon: { position: "absolute", right: 0, bottom: 0 },
  emerText1: {
    fontFamily: fonts.bold,
    fontSize: screenSize.width < 400 ? 30 : 36,
    lineHeight: 44,
    // alignSelf: 'center',
  },
  emerText2: {
    fontFamily: fonts.bold,
    fontSize: ms(14),
    marginVertical: ms(5),
    letterSpacing: ms(0.5),
  },
  emerText3: {
    fontFamily: fonts.light,
    fontSize: ms(14),
    lineHeight: ms(18),
    letterSpacing: ms(0.5),
    minWidth: ms(200),
    maxWidth: "80%",
    marginRight: 10,
  },
  unit: {
    fontFamily: fonts.medium,
    fontSize:ms(14),
    lineHeight: ms(18),
    textTransform: "capitalize",
  },
  notifyIcon: {
    width: ms(40),
    height: ms(20),
    alignItems: "center",
  },
  announment: {
    height: 220,
    borderRadius: 20,
    elevation: 2,
    margin: 5,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    marginRight: 15,

    borderWidth: 1,
    borderColor: "transparent",
  },
  yellowBlock: {
    height: 150,
    borderRadius: 20,
    margin: 5,
    paddingHorizontal: 15,
    paddingVertical: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  announmentHead: {
    fontFamily: fonts.bold,
    fontSize:ms(18),
    lineHeight: ms(23),
    color: "#fff",
    flexGrow: 1,
    letterSpacing: 0.2,
  },

  announcementText: {
    fontFamily: fonts.regular,
    fontSize:ms(12),
    lineHeight: ms(18),
    marginVertical: 3,
    marginLeft: 20,
    borderWidth: 1,
  },
  expireTime: {
    fontFamily: fonts.medium,
    fontSize: 12,
    letterSpacing: 0.2,
  },
  prevent: {
    fontFamily: fonts.bold,
    fontSize: ms(18),
    // marginHorizontal: 10,
    marginLeft: 15,
  },
  img: { width: 120, height: 120 },

  covid: {
    fontFamily: fonts.regular,
    fontSize: ms(16),
    marginLeft: 14,
  },
});
