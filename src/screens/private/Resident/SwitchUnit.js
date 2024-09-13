import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Keyboard,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Platform,
} from "react-native";
import SafeAreaView from "react-native-safe-area-view";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { connect } from "react-redux";
import { fonts, themes } from "../../../themes";
import { detectTheme, FocusAwareStatusBar } from "../../../helpers";
import { SmallIconNext, ApartmentIcon } from "../../../../assets/img/svgs";
import { profile } from "../../../redux/actions";
import { HeaderOnly } from "../../../components/Header";
import { switchUnit, listUnits } from "../../../redux/actions/switch_unit";
import { CustomButton, SubmitButton, WithBgHeader } from "../../../components";
import BlurOverlay, {
  closeOverlay,
  openOverlay,
} from "react-native-blur-overlay";
import LottieAnimation from "./Lottie";
import { navigate } from "../../../navigation/RootNavigation";
import Animated from "react-native-reanimated";
import { customAnimation } from "../../../animation/CommonAnimation";
import commonStyles from "../../../styles/commonStyles";
import { ms } from "../../../helpers/scaling";

class SwitchUnit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      condo: this.props.userData.current_unit.condo_name || "",
      unit: this.props.userData.current_unit.unit_number || "",
      unit_id: this.props.userData.current_unit.id || "",
      condo_unit: "",
    };
  }
  async componentDidMount() {
    this.focusListener = this.props.navigation.addListener("focus", async () => {
    let user = await AsyncStorage.getItem("user");
    let condo_name = JSON.parse(user)?.data?.current_unit?.unit_number;
    this.setState({ condo_unit: condo_name });
  })
  }
  handleChange = ({ condo, unit, unit_id }) => {
    console.log(condo, unit, "changeee");
    this.setState({ condo, unit, unit_id });
  };

  handleSubmit = () => {
    const { switchUnit } = this.props;
    const { unit_id } = this.state;
    switchUnit("switch_id", unit_id, unit_id, true);
    switchUnit("switchLoader", true);
    navigate("Lottie");
  };
  renderBlurChilds() {
    const { switchLoader, mode } = this.props;
    return (
      <View>
        {switchLoader && (
          <View
            style={{
              ...styles.loader,
            }}
          >
            <ActivityIndicator
              size="large"
              color={themes[mode]["primaryColor"]}
            />
          </View>
        )}
      </View>
    );
  }

  render() {
    const {
      switchLoader,
      units,
      userData: { current_unit },
      mode,
    } = this.props;
    const { handleSubmit, handleChange } = this;
    const { condo, unit } = this.state;
    // let switchLoader = true;
    console.log(units, "lolokdkjdjdj");
    return (
      <SafeAreaView
        forceInset={{ top: "never" }}
        style={{
          ...styles.view,
          backgroundColor:
            Platform.OS === "ios"
              ? switchLoader
                ? "#ddd"
                : themes[mode]["bgColor"]
              : themes[mode]["bgColor"],
          // opacity: switchLoader ? (mode === 'light' ? 0.5 : 0.5) : 1,
        }}
      >
        <WithBgHeader
          // marginRight={60}
          leftIcon={true}
          headerTitle="Switch Unit"
          // rightText="?"
          // onPressRightIcon={() => {
          //   RootNavigation.navigate("MyInvitationsList");
          // }}
          containerStyle={{
            ...commonStyles.headerSpacing,
            marginTop: Platform.OS == "android" ? 20 :20,
          }}
          // leftTextStyle={{
          //   minWidth: 60,
          // }}
        >
          {/* <View
          style={{
            marginTop: "7%",
            paddingHorizontal: Platform.OS === "android" ? 20 : 15,
            opacity: switchLoader ? 0.3 : 1,
          }}
          >
          <HeaderOnly
          showLeftIcon
          showRightIcon
          title="Switch Unit"
          // rightIcon={}
          onPressRight={() => {}}
          />
        </View> */}
          <View>
            <ScrollView
              contentContainerStyle={{
                flexGrow: 1,
                paddingBottom: 170,
                minHeight: "100%",
                paddingHorizontal: 20,
                opacity: switchLoader ? 0.3 : 1,
              }}
              style={
                {
                  // flexGrow: 1,
                  // opacity: !switchLoader ? 1 : mode === 'light' ? 1 : 0.5,
                }
              }
            >
              <Text
                style={{
                  ...styles.selectText,
                  color:
                    themes[mode][switchLoader ? "headingColor" : "textColor"],
                }}
              >
                Choose here to visit your {"\n"}condominium
              </Text>
              <View>
                {/* {!switchLoader ? ( */}
                <View style={{ ...styles.unitListing }}>
                  {units?.length > 0 &&
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
                        "check stateee"
                      );

                      return (
                        <Animated.View
                          // {...customAnimation("FlipInEasyX", 500, 200, index)}
                        >
                          <TouchableOpacity
                            style={{
                              height: ms(60),
                              borderRadius: 7,
                              flexDirection: "row",
                              alignItems: "center",
                              paddingVertical: 15,
                              marginVertical: 7,
                              marginBottom: 20,
                              paddingHorizontal: 20,
                              backgroundColor: localState
                                ? themes[mode]["darkAsh"]
                                : themes[mode][
                                    !switchLoader
                                      ? mode === "light"
                                        ? "bgColor"
                                        : "shadowColor"
                                      : "#ccc"
                                  ],
                              elevation: localState || switchLoader ? 0 : 3,
                              // shadowColor: "#eee",
                              borderWidth: switchLoader ? 1 : 0.2,
                              // borderColor: themes[mode]['headingColor'],
                              borderColor: "#909090",
                              shadowOffset: { width: 1, height: 1 },
                              shadowOpacity: 0.55,
                              shadowRadius: 0.5,
                            }}
                            onPress={() =>
                              handleChange({
                                condo: condo_name,
                                unit: unit_number,
                                unit_id: id,
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
                                  color: localState
                                    ? "#fff"
                                    : themes[mode]["headingColor"],
                                }}
                              >
                                {condo_name}
                              </Text>
                              <Text
                                style={{
                                  ...styles.unitNo,
                                  color:
                                    themes[mode][
                                      localState ? "primaryColor" : "textColor"
                                    ],
                                }}
                              >
                                {unit_number}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        </Animated.View>
                      );
                    })}
                </View>
              </View>
            </ScrollView>
          </View>
         
          {/* {switchLoader && (
          <View
          style={{
            position: "absolute",
            top: "50%",
            flex: 1,
            alignSelf: "center",
          }}
          >
          {this.renderBlurChilds()}
          </View>
        )} */}

          {switchLoader && (
            // <View
            //   style={{
            //     position: "absolute",
            //     // top: '50%',
            //     flex: 1,
            //     alignSelf: "center",
            //   }}
            // >
            <LottieAnimation />
            // </View>
          )}
          {/* <BlurOverlay
          radius={1}
          downsampling={2}
          brightness={-200}
          onPress={() => {
            closeOverlay();
          }}
          customStyles={{alignItems: 'center', justifyContent: 'center'}}
          blurStyle="dark"
          children={this.renderBlurChilds()}
        /> */}
         {Platform.OS =="android" && <View
            style={{
              position: "absolute",
              bottom: 0,
              width: "100%",
              opacity: switchLoader ? 0.3 : 1,
            }}
          >
            <SubmitButton
              buttonText="Switch"
              handleSubmit={() => {
                // openOverlay();
                handleSubmit();
              }}
              disableBtn={
                this.state.condo_unit == this.state.unit ? true : false
              }
            />
          </View>}
        </WithBgHeader>
      { Platform.OS == "ios" && <View
            style={{
              position: "absolute",
              bottom: 0,
              width: "100%",
              opacity: switchLoader ? 0.3 : 2,
            }}
          >
            <SubmitButton
              buttonText="Switch"
              handleSubmit={() => {
                // openOverlay();
                handleSubmit();
              }}
              disableBtn={
                this.state.condo_unit == this.state.unit ? true : false
              }
            />
          </View>
  }
      </SafeAreaView>
    );
  }
}

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

const mapDispatchToProps = {
  listUnits,
  switchUnit,
};

export default connect(mapStateToProps, mapDispatchToProps)(SwitchUnit);

const styles = StyleSheet.create({
  view: {
    // height: '100%',
    flex: 1,
    // marginTop: 30,
    paddingTop: 30,
  },
  selectText: {
    fontFamily: fonts.light,
    fontSize: ms(16),
    lineHeight: ms(20),
    textAlign: "center",
    marginVertical: 25,
  },
  unitListing: {
    marginTop: "5%",
    marginHorizontal: 5,
  },
  circle: {
    width: ms(30),
    height: ms(30),
    borderRadius: 15,
    backgroundColor: themes["light"]["harp"],
    justifyContent: "center",
    alignItems: "center",
  },
  condoName: {
    fontFamily: fonts.medium,
    fontSize: ms(16),
    textTransform: "capitalize",
  },
  unitNo: {
    fontFamily: fonts.light,
    fontSize: ms(12),
    marginTop: 5,
    textTransform: "capitalize",
  },
  loader: {
    // width: '100%',
    // marginTop: '10%',
    // height: '100%',
    // justifyContent: 'center',
    // alignItems: 'center',
    // position: 'absolute',
    // marginVertical: '60%',
    // marginTop: '20%',
  },
});
