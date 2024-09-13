import React, { useCallback, useRef, useState, useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { themes, fonts, commonColors } from "../themes";
import { detectTheme, numberPlateValidation } from "../helpers";
import ActionSheet, { useScrollHandlers } from "react-native-actions-sheet";
import { facility, login, notification } from "../redux/actions";
import { listUnits, switchUnit } from "../redux/actions/switch_unit";
import { connect } from "react-redux";
import { navigate } from "../navigation/RootNavigation";
import { CountIconNew } from "../../assets/img/svgs";
import CustomButton from "./CustomButton";
import { SvgXml } from "react-native-svg";
import { ms } from "../helpers/scaling";
import CustomTextField from "./CustomTextField";
import Spinner from "react-native-loading-spinner-overlay";
import { inviteUpdateVehicle } from "../api/invite";
import { ToastMessage } from "./Toast";
const InviteDetailBottomView = (props) => {
  const { modal } = props;
  const [vehicle_number, setVehicleNumber] = useState("");
  const [vehicle_number_err, setVehicleNumberErr] = useState("");
  useEffect(() => {
    if (modal) {
      handleClose(0, true);
    } else {
      handleClose(0, false);
    }
  }, [modal]);
  const actionSheetRef = useRef(null);
  const scrollHandlers = useScrollHandlers("scrollview-1", actionSheetRef);

  const mode = detectTheme();
  const handleClose = useCallback((index, decide) => {
    if (decide) {
      actionSheetRef.current?.show();
    } else {
      actionSheetRef.current?.hide();
    }
  }, []);
  const onSubmit = () => {
    setVehicleNumberErr(numberPlateValidation(vehicle_number));
    if (!numberPlateValidation(vehicle_number)) {
    handleClose(0, false);
      inviteUpdateVehicle(props.id, vehicle_number)
        .then(() => {
          setVehicleNumber("");
          props.refetch();
        })
        .catch((err) => {
          ToastMessage(err[0], err[1]?.message, err);
        });
    }
  };
  return (
    <View style={[styles.container]}>
      <ActionSheet
        ref={actionSheetRef}
        gestureEnabled={true}
        onClose={() => {
          props.onClose();
        }}
        containerStyle={{
          backgroundColor: themes[mode]["bgColor"],
        }}
      >
        <ScrollView {...scrollHandlers} nestedScrollEnabled={true}>
          {true && (
            <View>
              <View
                style={{ paddingHorizontal: ms(20), paddingTop: ms(25) }}
              ></View>
            </View>
          )}
          <View style={{ paddingHorizontal: ms(20) }}>
            <CustomTextField
              autoCap={true}
              name="vehicle number"
              label={"Vehicle Number"}
              value={vehicle_number}
              onChange={(name, value) => {
                setVehicleNumber(value);
              }}
              keyboardType="default"
              
              icon={
                <SvgXml
                  xml={CountIconNew(commonColors.lightAsh1)}
                  width={14}
                  height={15}
                />
              }
              error={vehicle_number_err}
            />
          </View>
          <CustomButton
            title="Submit"
            buttonStyle={{
              ...styles.buttonStyle,
              backgroundColor: themes[mode]["primaryColor"],
              width: "90%",
              alignSelf: "center",
            }}
            textStyle={{
              color: commonColors.darkWhite,
            }}
            handleSubmit={onSubmit}
          />
        </ScrollView>
      </ActionSheet>
      <Spinner
        visible={props.submitted}
        textContent={"Please Wait..."}
        textStyle={{ color: "#FFF" }}
      />
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
  facility,
  switchUnit: { units, current_condo, current_unit, switchLoader },
  login: { submitted },
}) => {
  return {
    mode,
    userData,
    units,
    facility,
    switchLoader,
    submitted,
  };
};
const { listNotification } = notification;
const { facilitySubmit, facilityValidation, onFacilityDataChange } = facility;
const { submitControl } = login;

const mapDispatchToProps = {
  listUnits,
  switchUnit,
  listNotification,
  facilitySubmit,
  facilityValidation,
  onFacilityDataChange,
  submitControl,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InviteDetailBottomView);
