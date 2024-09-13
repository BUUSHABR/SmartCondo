import { Platform, StyleSheet } from "react-native";
import { commonColors, fonts, themes } from "../themes";
import { ms } from "../helpers/scaling";

const commonStyles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    height: "100%",
  },
  spaceBtwnAlign: {
    flexDirection: "row",
    justifyContent: "space-between",
    // alignItems: 'center',
  },
  centerAlign: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  whiteBtnStyle: {
    height: 45,
    borderRadius: 5,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    borderColor: commonColors.yellowColor,
  },
  whiteBtnTxtStyle: {
    fontFamily: fonts.medium,
    fontSize: ms(16),
    textAlign: "center",
  },
  yellowBtnStyle: {
    height: 40,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: commonColors.yellowColor,
  },
  yellowBtnTxtStyle: {
    fontFamily: fonts.medium,
    fontSize: ms(16),
    textAlign: "center",
  },
  semiBold_16: {
    fontFamily: fonts.semiBold,
    fontSize:ms(16),
    lineHeight: ms(20),
    textTransform: "capitalize",
  },
  semiBold_12: {
    fontFamily: fonts.semiBold,
    fontSize: ms(12),
    textTransform: "capitalize",
  },
  semiBold_small: {
    fontFamily: fonts.semiBold,
    fontSize: ms(10),
    textTransform: "capitalize",
  },
  semiBold_14: {
    fontFamily: fonts.semiBold,
    fontSize: ms(14),
    textTransform: "capitalize",
  },
  semiBold_22: {
    fontFamily: fonts.semiBold,
    fontSize: ms(22),
  },
  light_14: {
    fontFamily: fonts.light,
    fontSize: ms(14),
    lineHeight: ms(15),
  },
  light_12: {
    fontFamily: fonts.light,
    fontSize: ms(12),
  },
  light_15: {
    fontFamily: fonts.light,
    fontSize: ms(15),
  },
  medium_12: {
    fontFamily: fonts.medium,
    fontSize: ms(12),
  },
  medium_18: {
    fontFamily: fonts.medium,
    fontSize: ms(18),
  },
  medium_16: {
    fontFamily: fonts.medium,
    fontSize: ms(16),
  },
  bold_18: {
    fontFamily: fonts.bold,
    fontSize: ms(18),
  },
  bold_20: {
    fontFamily: fonts.bold,
    fontSize: ms(20),
  },
  regular_16: {
    fontFamily: fonts.regular,
    fontSize: ms(16),
    lineHeight: ms(17),
  },
  regular_15: {
    fontFamily: fonts.regular,
    fontSize: ms(15),
    lineHeight: ms(20),
  },
  regular_14: {
    fontFamily: fonts.regular,
    fontSize: ms(14),
  },
  avatar: {
    width: ms(30),
    height: ms(30),
    borderRadius: ms(15),
    backgroundColor: "#FFC727",
    justifyContent: "center",
    alignItems: "center",
  },
  listRightSideColumnAlign: {
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  statusWrapper: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 5,
    marginLeft: 0,
  },
  centerAlignOnly: {
    justifyContent: "center",
    alignItems: "center",
  },

  headerSpacing: {
    marginVertical: 15,
    marginHorizontal: 15,
    marginTop: Platform.OS == "android" ? 55 : 0,
  },
  safeAreaAlign: {
    flex: 1,
  },
});

export default commonStyles;
