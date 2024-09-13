import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  useEffect,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  Button,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  TextInput,
  TouchableNativeFeedback,
} from "react-native-gesture-handler";
import { themes, fonts, commonColors } from "../themes";
import { detectTheme } from "../helpers";
// import {
//   ArrowDown,
//   CloseSwitch,
//   CloseVCBottom,
//   ContractorType,
//   DropDownNotify,
//   ErrorIcon,
//   NoNotify,
//   SearchIcon,
//   SwitchTick,
//   SwitchTick1,
//   TickIcon,
// } from "../../assets/img/svgs";
import { useDispatch } from "react-redux";
import { onComplaintsChange } from "../redux/actions/complaint";
import { ServerContainer } from "@react-navigation/native";
import ActionSheet, {
  useScrollHandlers,
  ActionSheetRef,
  SheetProps,
} from "react-native-actions-sheet";
import { notification } from "../redux/actions";
// import { switchUnit, listUnits } from "../redux/actions/switch_unit";
import { listUnits, switchUnit } from "../redux/actions/switch_unit";
import { connect } from "react-redux";
// import { ApartmentIcon } from "../../assets/img/svgs";
import { navigate } from "../navigation/RootNavigation";
import { ApartmentIcon, CloseSwitch, SwitchTick1 } from "../../assets/img/svgs";
import CustomButton from "./CustomButton";
import Animated from "react-native-reanimated";
import { customAnimation } from "../animation/CommonAnimation";

const InviteBottomView = (props) => {
  useEffect(() => {
    if (props.smsShow) {
      handleClose(0, true);
    } else {
      handleClose(0, false);
    }
  }, [props.smsShow]);
  const actionSheetRef = useRef(null);
  const bottomSheetRef = useRef(null);
  const scrollHandlers = useScrollHandlers("scrollview-1", actionSheetRef);

  const snapPoints = useMemo(() => ["50%"], []);
  // const mode = detectTheme();

  const handleClose = useCallback((index, decide) => {
    if (decide) {
      actionSheetRef.current?.show();
    } else {
      actionSheetRef.current?.hide();
    }
  }, []);
  const handleSubmit = (isSms) => {
    if (isSms) {
      props.createInvite(false);
      props.handleChange(false);
    } else {
      // props.createInvite()
      props.createInvite(true,false,props.qrloader);
      props.handleChange(false);
    }
  };
  return (
    <View style={[styles.container]}>
      <ActionSheet
        ref={actionSheetRef}
        gestureEnabled={true}
        onClose={() => {
          props.handleChange(false);
        }}
      >
        <ScrollView {...scrollHandlers} nestedScrollEnabled={true}>
          <View>
            <Text
              style={{
                alignSelf: "center",
                // marginRight: "13%",
                color: "black",
                fontFamily: fonts.semiBold,
                fontSize: 19,
                fontWeight: "700",
              }}
            >
              Send SMS
            </Text>

            <View
              style={{
                flexDirection: "row",
                width: "100%",
                justifyContent: "space-evenly",
              }}
            >
              <View>
                <CustomButton
                  buttonStyle={{
                    width: 110,
                  }}
                  title={"No"}
                  handleSubmit={() => handleSubmit(false)}
                />
              </View>
              <View>
                <CustomButton
                  buttonStyle={{
                    borderColor: commonColors.yellowColor,
                    backgroundColor: commonColors.yellowColor,
                    width: 110,
                  }}
                  textStyle={{
                    color: "#fff",
                  }}
                  title={"Yes"}
                  handleSubmit={() => handleSubmit(true)}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </ActionSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 24,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
  searchSection: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f6f6f6",
    borderRadius: 10,
    paddingHorizontal: 20,
    marginHorizontal: 20,
  },
  searchIcon: {
    padding: 10,
  },
  input: {
    flex: 1,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 0,
    backgroundColor: "#f6f6f6",
    color: "#424242",
    borderRadius: 10,
    marginLeft: 15,
  },
  error: {
    fontFamily: fonts.regular,
    fontSize: 12,
    alignSelf: "flex-start",
    marginLeft: 7,
  },
  modalContainer: {
    width: "100%",
    // position: "absolute",
    // height: 500,
    bottom: 0,
    // borderTopLeftRadius: 30,
    // borderTopRightRadius: 30,
    // borderBottomLeftRadius: 8,
    // borderBottomRightRadius: 8,
    elevation: 30,
    zIndex: 12,
  },
  align: {
    width: 80,
    alignSelf: "flex-end",
    marginHorizontal: 20,
    marginVertical: 15,
  },
  filterWrap: {
    marginVertical: 20,
    marginHorizontal: 25,
  },
  filterText: {
    fontFamily: fonts.bold,
    fontSize: 16,
    letterSpacing: 0.5,
    marginBottom: 15,
  },
  section1: { marginVertical: 10 },
  flexAlign: { flexDirection: "row", alignItems: "center" },
  checkBox: {
    width: 19,
    height: 19,
    borderRadius: 7,
    borderWidth: 1.5,
    justifyContent: "center",
    alignItems: "center",
  },
  checkBoxSmall: {
    width: 15,
    height: 15,
    borderRadius: 6,
    borderWidth: 1.5,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontFamily: fonts.medium,
    fontSize: 14,
    letterSpacing: 0.3,
  },
  dateAlign: {
    marginVertical: 20,
    marginHorizontal: 15,
    flexDirection: "row",
  },
  dateBox: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginLeft: 10,
  },
  dateText: {
    fontFamily: fonts.light,
    fontSize: 12,
    letterSpacing: 0.4,
    marginLeft: 10,
  },
  buttonStyle: {
    borderRadius: 5,
    alignSelf: "flex-end",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 15,
    borderWidth: 1,
  },
  buttonTextStyle: {
    fontFamily: fonts.medium,
    fontSize: 14,
    marginVertical: 5,
    marginBottom: 7,
    marginHorizontal: 20,
  },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: themes["light"]["harp"],
    justifyContent: "center",
    alignItems: "center",
  },
});
const mapStateToProps = ({
  profile: { mode, userData },

  switchUnit: { units, current_condo, current_unit, switchLoader },
}) => {
  return {
    mode,
    userData,
    units,

    switchLoader,
  };
};
const { listNotification } = notification;

const mapDispatchToProps = {
  listUnits,
  switchUnit,
  listNotification,
};

export default connect(mapStateToProps, mapDispatchToProps)(InviteBottomView);
