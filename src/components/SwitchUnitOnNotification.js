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
  import { ServerContainer, useNavigation } from "@react-navigation/native";
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
import { ms } from "../helpers/scaling";
  
  const SwitchUnitOnNotification = (props) => {
    // console.log(props, "11p");
    const navigation=useNavigation();
    const {
      SwitchCondo,
      onSwitchClose,
      switch_unit,
      pushnotification,
      userData: { current_unit },
    } = props;
  
    useEffect(() => {
      setCondo(current_unit != undefined ? current_unit?.condo_name : "");
      setunit(current_unit != undefined ? current_unit?.unit_number : "");
      setunit_id(current_unit != undefined ? current_unit?.id : "");
      fetchList();
      // actionSheetRef.current?.show();
      if (switch_unit) {
        console.log("true block executed");
        SwitchCondo();
        handleClose(0, true);
      } else {
        console.log("false block executed");
        onSwitchClose();
        handleClose(0, false);
      }
    }, [switch_unit, SwitchCondo, onSwitchClose]);
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
    const [count, setcout] = useState(0);
    const {
      switchLoader,
      units,
      // userData: { current_unit },
      mode,
    } = props;
    // useEffect(() => {
  
    //   setCondo(current_unit != undefined ? current_unit?.condo_name : "");
    //   setunit(current_unit != undefined ? current_unit?.unit_number : "");
    //   setunit_id(current_unit != undefined ? current_unit?.id : "");
    // }, [current_unit]);
  
    console.log(units, "elfijefieyfief7", current_unit, count,pushnotification);
    const [condo, setCondo] = useState(
      current_unit != undefined ? current_unit?.condo_name : ""
    );
    const [unit, setunit] = useState("");
    // alert(unit)
    const [unit_id, setunit_id] = useState(
      current_unit != undefined ? current_unit?.id : ""
    );
    const [unitnum, setunitnum] = useState("");
    // alert(unitnum)
    const fetchList = async () => {
      console.log("logging switch");
      // let isAuth = await AsyncStorage.getItem("auth_token");
      // isAuth && props.listUnits();
      // isAuth && props.listNotification();
      setcout(count + 1);
      let user = await AsyncStorage.getItem("user");
      let condo_name = JSON.parse(user)?.data?.current_unit?.unit_number;
      console.log(condo_name, "condo_namesss", unit);
      // alert(condo_name)
      setunitnum(condo_name);
    };
    const handleChange = ({ condos, units, unit_ids, checkMatch }) => {
      const { switchUnit } = props;
  
      console.log(condo, unit, "changeee");
      // if (!checkMatch) {
      // this.setState({ condo, unit, unit_id });
      setCondo(condos);
      setunit(units);
      setunit_id(unit_ids);
      // setTimeout(() => {
      //   switchUnit("switch_id", unit_ids, unit_ids, true);
      //   switchUnit("switchLoader", true);
      //   navigate("Lottie");
      // }, 500);
  
      // props.onRequestClose();
      // }
    };
    const handleSubmit = () => {
      const { switchUnit } = props;
  
      switchUnit("switch_id", unit_id, unit_id, true,pushnotification,navigation);
      switchUnit("switchLoader", true);
      navigate("Lottie");
      props.onRequestClose();
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
      <View style={[styles.container]}>
        <ActionSheet
          ref={actionSheetRef}
          gestureEnabled={true}
          onClose={() => {
            onSwitchClose();
            setCondo(current_unit != undefined ? current_unit?.condo_name : "");
            setunit(current_unit != undefined ? current_unit?.unit_number : "");
            setunit_id(current_unit != undefined ? current_unit?.id : "");
          }}
        >
          <ScrollView {...scrollHandlers} nestedScrollEnabled={true}>
            <View>
              <View>
                {/* <View
                style={{
                  position: "absolute",
                  flex: 1,
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  width: "100%",
                  height: "100%",
                }}
              ></View> */}
                {/* <TouchableWithoutFeedback style={{ height: "60%" }}> */}
                <View
                  style={{
                    ...styles.modalContainer,
                    backgroundColor: "white",
                  }}
                >
                  <Animated.View
                    {...customAnimation("FadeInDown", 500, 50, 1)}
                    style={{
                      paddingTop: 0,
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
                      onPress={() => {
                        onRequestClose();
                        setCondo(
                          current_unit != undefined
                            ? current_unit?.condo_name
                            : ""
                        );
                        setunit(
                          current_unit != undefined
                            ? current_unit?.unit_number
                            : ""
                        );
                        setunit_id(
                          current_unit != undefined ? current_unit?.id : ""
                        );
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: fonts.medium,
                          fontSize: 14,
                          color: themes[mode]["headingColor"],
                        }}
                      >
                        <CloseSwitch />
                      </Text>
                    </TouchableOpacity>
                    <Text
                      style={{
                        alignSelf: "center",
                        marginRight: "13%",
                        color: "black",
                        fontFamily: fonts.semiBold,
                        fontSize: 17,
                        fontWeight: "700",
                      }}
                    >
                      Switch Unit
                    </Text>
                  </Animated.View>
                  <Animated.View
                    {...customAnimation("FadeInDown", 500, 50, 1)}
                    style={{ paddingHorizontal: 40 }}
                  >
                    <Text
                      style={{
                        textAlign: "center",
                        color: themes[mode]["textColor"],
                        fontSize: ms(15),
                        lineHeight: ms(22),
                        fontFamily: fonts.light,
                      }}
                    >
                      Your Notification is on your different unit ! you need to switch to view it . {pushnotification?.preferred_unit_id}
                    </Text>
                  </Animated.View>
                  <View
                    style={{
                      // flexDirection: "row",
                      // justifyContent: "center",
                      // borderTopWidth: 0.7,
                      // borderTopColor: themes[mode]["lightAsh"],
                      paddingHorizontal: 20,
                      // marginBottom: 30,
                      // marginTop: 10,
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
                        <View style={{ paddingBottom: 40 }}>
                          {units?.length > 0 &&
                            current_unit &&
                            units?.filter((item,index)=>item.id===pushnotification?.preferred_unit_id).map((item, index) => {
                              const {
                                condo_name,
                                condo_id,
                                id,
                                unit_number,
                              } = item;
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
                        
                                <Animated.View
                                  {...customAnimation("FadeInDown", 500, 50, 1)}
                                >
                                  <TouchableOpacity
                                    style={{
                                      height: 60,
                                      // borderRadius: 7,
                                      flexDirection: "row",
                                      alignItems: "center",
                                      paddingVertical: 15,
                                      // marginVertical: 7,
                                      // marginBottom: 10,
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
                                      borderWidth: 0.5,
                                      borderBottomColor: themes[mode]["lightAsh"],
                                      borderTopColor: "transparent",
                                      borderLeftColor: "transparent",
                                      borderRightColor: "transparent",
                                      // borderColor: "#909090",
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
                                          // ...styles.condoName,
                                          color: themes[mode]["headingColor"],
                                        }}
                                      >
                                        {condo_name}
                                      </Text>
                                      <Text
                                        style={{
                                          // ...styles.unitNo,
                                          color: themes[mode]["textColor"],
                                        }}
                                      >
                                        {unit_number}
                                      </Text>
                                    </View>
                                    <View
                                      style={{
                                        position: "absolute",
                                        right: 5,
                                        alignItems: "center",
                                        top: 25,
                                      }}
                                    >
                                      {localState && <SwitchTick1 />}
                                    </View>
                                  </TouchableOpacity>
                                </Animated.View>
                              );
                            })}
                        </View>
                      </View>
                    </ScrollView>
                    <View style={{ marginTop: 10 }}>
                      <CustomButton
                        title={"Switch"}
                        buttonStyle={{
                          borderColor: commonColors.yellowColor,
                          backgroundColor: commonColors.yellowColor,
                        }}
                        textStyle={{
                          color: "#fff",
                        }}
                        handleSubmit={handleSubmit}
                        disableBtn={unitnum == unit ? true : false}
                      />
                    </View>
                  </View>
                </View>
              </View>
              {/* </TouchableWithoutFeedback> */}
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
  
  export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(SwitchUnitOnNotification);
  