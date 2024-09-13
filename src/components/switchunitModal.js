import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  NativeModules,
  Linking,
  Keyboard,
  ScrollView,
  ActivityIndicator,
  Platform,
} from "react-native";
import { connect } from "react-redux";
import { themes, fonts } from "../themes";
import { ApartmentIcon, SwitchTick } from "../../assets/img/svgs";
import { useSelector } from "react-redux";
import { HeaderOnly } from "./Header";
import { detectTheme } from "../helpers";
import { deviceDetails } from "../helpers/deviceSupport";
import { CloseVCBottom } from "../../assets/img/svgs";
import { switchUnit, listUnits } from "../redux/actions/switch_unit";
import SubmitButton from "./SubmitButton";
import LottieAnimation from "../screens/private/Resident/Lottie";
import { navigate } from "../navigation/RootNavigation";
import { notification } from "../redux/actions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ms } from "../helpers/scaling";

const SwitchunitModal = (props) => {
  const [count, setcout] = useState(0);
  const {
    switchLoader,
    units,
    userData: { current_unit },
    mode,
  } = props;
  useEffect(() => {
    fetchList();
  }, [current_unit]);
  const fetchList = async () => {
    console.log("logging switch");
    let isAuth = await AsyncStorage.getItem("auth_token");
    isAuth && props.listUnits();
    isAuth && props.listNotification();
    setcout(count + 1);
  };
  console.log(units, "elfijefieyfief7", current_unit, count);
  const [condo, setCondo] = useState(
    current_unit != undefined ? current_unit?.condo_name : ""
  );
  const [unit, setunit] = useState(
    current_unit != undefined ? current_unit?.unit_number : ""
  );
  const [unit_id, setunit_id] = useState(
    current_unit != undefined ? current_unit?.id : ""
  );
  const handleChange = ({ condos, units, unit_ids, checkMatch }) => {
    const { switchUnit } = props;

    console.log(condo, unit, "changeee");
    if (!checkMatch) {
      // this.setState({ condo, unit, unit_id });
      setCondo(condos);
      setunit(units);
      setunit_id(unit_ids);
      setTimeout(() => {
        switchUnit("switch_id", unit_ids, unit_ids, true);
        switchUnit("switchLoader", true);
        navigate("Lottie");
      }, 500);

      props.onRequestClose();
    }
  };
  const handleSubmit = () => {
    const { switchUnit } = props;

    switchUnit("switch_id", unit_id, unit_id, true);
    switchUnit("switchLoader", true);
    navigate("Lottie");
  };
  // const [modalVisible, setmodalVisible] = useState(false);
  const {
    onRequestClose,
    // handleChange,
    onResetFilter,
    modalParams,
    onSubmitFilter,
    filterArr2,
    modalVisible,
  } = props;
  // useEffect(async()=>{
  //   let auto_Start = await AsyncStorage.getItem("auto_start")
  // autoStartParse = JSON.parse(auto_Start)
  // console.log(autoStartParse,"hey");
  // setTimeout(()=>{
  //   autoStartParse === null && setmodalVisible(true)
  // },2000)
  // },[modalVisible])
  // const onRequestClose = () => {
  //   setmodalVisible(false);
  // };

  return (
    <View style={{}}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={onRequestClose}
        style={{}}
        backdropOpacity={0.3}
        statusBarTranslucent={true}
        hardwareAccelerated={true}
      >
        <View
          style={{
            position: "absolute",
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            width: "100%",
            height: "100%",
          }}
        ></View>
        <TouchableWithoutFeedback style={{ height: "60%" }}>
          <View
            style={{
              ...styles.modalContainer,
              backgroundColor: themes[mode]["modalWrap"],
            }}
          >
            <View
              style={{
                paddingTop: 6,
                paddingBottom: 0,
                flexDirection: "row-reverse",
              }}
            >
              <TouchableOpacity
                style={{
                  ...styles.align,
                  width: 50,
                  alignItems: "center",
                }}
                onPress={onRequestClose}
              >
                <Text
                  style={{
                    fontFamily: fonts.medium,
                    fontSize: 14,
                    color: themes[mode]["headingColor"],
                  }}
                >
                  <CloseVCBottom />
                </Text>
              </TouchableOpacity>
              <Text
                style={{
                  alignSelf: "center",
                  marginRight: "15%",
                  color:
                    themes[mode][mode === "light" ? "tagLine" : "lineColor"],
                  fontFamily: fonts.semiBold,
                  fontSize: 17,
                  fontWeight: "700",
                }}
              >
                Switch Unit
              </Text>
            </View>
            <View style={{ paddingHorizontal: 40 }}>
              <Text
                style={{
                  textAlign: "center",
                  color: themes[mode]["textColor"],
                  fontSize: ms(15),
                  lineHeight: ms(22),
                  fontFamily: fonts.light,
                }}
              >
                Choose here to visit your {"\n"}condominium
              </Text>
            </View>
            <View
              style={{
                // flexDirection: "row",
                // justifyContent: "center",
                // borderTopWidth: 0.7,
                // borderTopColor: themes[mode]["lightAsh"],
                paddingHorizontal: 20,
                marginBottom: 30,
                marginTop: 10,
              }}
            >
              <ScrollView
                // contentContainerStyle={{
                //   flexGrow: 1,
                //   paddingBottom: 50,
                //   minHeight: "100%",
                //   paddingHorizontal: 20,
                //   opacity: switchLoader ? 0.3 : 1,
                // }}
                style={
                  {
                    // flexGrow: 1,
                    // opacity: !switchLoader ? 1 : mode === 'light' ? 1 : 0.5,
                  }
                }
              >
                <View>
                  {/* {!switchLoader ? ( */}
                  <View style={{ ...styles.unitListing }}>
                    {units?.length > 0 &&
                      current_unit &&
                      units?.map((item, index) => {
                        const { condo_name, condo_id, id, unit_number } = item;
                        const checkMatch =
                          condo_name === current_unit["condo_name"] &&
                          unit_number === current_unit["unit_number"];
                        const localState =
                          condo === condo_name && unit === unit_number;
                        console.log(
                          checkMatch,
                          localState,
                          condo,
                          condo_name,
                          unit,
                          unit_number,
                          current_unit["condo_name"],
                          current_unit["unit_number"],
                          "check stateee"
                        );

                        return (
                          <TouchableOpacity
                            style={{
                              height: 60,
                              borderRadius: 7,
                              flexDirection: "row",
                              alignItems: "center",
                              paddingVertical: 15,
                              marginVertical: 7,
                              marginBottom: 10,
                              paddingHorizontal: 10,
                              // backgroundColor: checkMatch
                              //   ? themes[mode]["darkAsh"]
                              //   : themes[mode][
                              //       !switchLoader
                              //         ? mode === "light"
                              //           ? "bgColor"
                              //           : "shadowColor"
                              //         : "#ccc"
                              //     ],
                              // elevation: checkMatch || switchLoader ? 0 : 3,
                              shadowColor: "#eee",
                              // borderWidth: switchLoader ? 1 : 0.2,
                              // borderColor: themes[mode]['headingColor'],
                              borderColor: "#909090",
                              shadowOffset: { width: 1, height: 1 },
                              shadowOpacity: 0.55,
                              shadowRadius: 0.5,
                            }}
                            onPress={() =>
                              handleChange({
                                condos: condo_name,
                                units: unit_number,
                                unit_ids: id,
                                checkMatch: checkMatch,
                              })
                            }
                          >
                            <View style={{ ...styles.circle }}>
                              <ApartmentIcon />
                            </View>
                            <View style={{ marginLeft: 15 }}>
                              <Text
                                style={{
                                  ...styles.condoName,
                                  color: themes[mode]["headingColor"],
                                }}
                              >
                                {condo_name}
                              </Text>
                              <Text
                                style={{
                                  ...styles.unitNo,
                                  color: themes[mode]["textColor"],
                                }}
                              >
                                {unit_number}
                              </Text>
                            </View>
                            <View
                              style={{
                                position: "absolute",
                                right: 25,
                                alignItems: "center",
                              }}
                            >
                              {checkMatch && <SwitchTick />}
                            </View>
                          </TouchableOpacity>
                        );
                      })}
                  </View>
                </View>
              </ScrollView>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};
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
export default connect(mapStateToProps, mapDispatchToProps)(SwitchunitModal);

const styles = StyleSheet.create({
  modalContainer: {
    width: "100%",
    position: "absolute",
    height: "50%",
    bottom: 0,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
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
