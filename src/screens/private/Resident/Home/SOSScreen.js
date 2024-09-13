import React, { Component, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
  Linking,
  Platform,
  ScrollView,
  StatusBar,
} from "react-native";
import { connect } from "react-redux";
import Animated from "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as RootNavigation from "../../../../navigation/RootNavigation";

import { profile, notification, home } from "../../../../redux/actions";
import SafeAreaView from "react-native-safe-area-view";
import { detectTheme, sosComp } from "./../../../../helpers";
import { themes, fonts } from "../../../../themes";
import {
  ScanIcon,
  BellWithNotify,
  Bell,
  AnnouncementIcon,
  SosManIcon,
  SOSCallIcon,
  SOSPolice,
  NoEmergencyContact,
  BleInfoIcon,
} from "../../../../../assets/img/svgs";
import { renderItem } from "../MyVisitors/MyVisitorsList";
import { SOSLoader } from "../../../../../assets/img/loader";
import { Header } from "../../../../components/Header";
import SOSCall from "../../../../../assets/img/home/sos_call.svg";
import commonStyles from "../../../../styles/commonStyles";
import { WithBgHeader } from "../../../../components";
import { customAnimation } from "../../../../animation/CommonAnimation";
import { ms } from "../../../../helpers/scaling";

class SOSScreen extends Component {
  constructor(){
    super();
    this.state={
      DiasblePressable:false,
    }
  }
  componentDidMount() {
    const { getSosNumbers } = this.props;

    getSosNumbers();
  }

  openDialPad = (number) => {
    let num = "";
    this.setState({ DiasblePressable: true });
    if (Platform.OS === "android") {
      num = `tel:${number}`;
    } else {
      num = `telprompt:${number}`;
    }
    Linking.openURL(num);
    setTimeout(() => this.setState({ DiasblePressable: false }), 500);

  };
  render() {
    const {
      mode,
      sosData,
      userData: { name },
      sosLoader,
    } = this.props;
    const valuePresentCheck = sosData?.map((item) => {
      Object.keys(item) && Object.values(item) === "";
    });
    const isEmpty = sosData?.map((item) => {
      console.log(item, "oiiii");
      return Object.values(item) == "";
    });
    let SosData=[...sosData,{"call_support":"9092042198"}]
    console.log(SosData,sosData, valuePresentCheck, isEmpty, "sos screen");
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: themes[mode]["bgColor"],
        }}
        forceInset={{ top: "never" }}
      >
        <WithBgHeader
          headerTitle=""
          leftIcon
          containerStyle={{
            ...commonStyles.headerSpacing,
          }}
        // rightIcon={Platform.OS === 'android' ? <BleInfoIcon /> : null}
        // onPressRightIcon={Platform.OS === 'android' ? onPressRight : null}
        >
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              paddingBottom: 50,
              paddingHorizontal: 25,
            }}
          >
            <View style={{}}>
              <Animated.Text
                {...customAnimation("FadeInUp", 700, 50, 1)}
                style={{
                  fontFamily: fonts.semiBold,
                  fontSize: ms(20),
                  lineHeight: ms(30),
                  color: themes[mode]["headingColor"],
                  alignSelf: "flex-end",
                  textAlign: "right",
                  textTransform: "capitalize",
                }}
              >
                {`Hey ${name || "  "}, \n We’re here for you`}
              </Animated.Text>
              <Animated.Text
                {...customAnimation("FadeInUp", 700, 50, 1)}
                style={{
                  fontFamily: fonts.semiBold,
                  fontSize: ms(14),
                  lineHeight: ms(17),
                  color: themes[mode]["textColor"],
                  textAlign: "right",
                  marginVertical: 20,
                }}
              >
                One click emergency assistance
              </Animated.Text>
              {console.log(sosData, "================")}
              {sosLoader || sosData?.length > 0 ? (
                
                  <FlatList
                    columnWrapperStyle={{
                      justifyContent: "center",
                      marginTop: "5%",
                    }}
                    data={sosData.length > 0 ? sosData : [1, 2, 3, 4]}
                    numColumns={2}
                    contentContainerStyle={{
                      minHeight: 300,
                      flexGrow: 1,
                    }}
                    showsVerticalScrollIndicator
                    renderItem={({ item, index }) => {
                      return (
                        <Animated.View
                          {...customAnimation("FadeInDown", 700, 50, 1)}
                        >
                          {sosData?.length > 0 ? (
                            <TouchableOpacity
                              style={{
                                width: ms(125),
                                height: ms(129),
                                borderRadius: 10,
                                backgroundColor: themes[mode]["dimWhite"],
                                marginHorizontal: ms(15),
                                marginVertical: ms(20),
                              }}
                              onPress={() =>
                                this.openDialPad(Object.values(item)[0])
                              }
                              disabled={this.state.DiasblePressable}
                            >
                              <View
                                style={{
                                  justifyContent: "center",
                                  alignItems: "center",
                                  flexGrow: 1,
                                }}
                              >
                                {sosComp(Object.keys(item)[0])?.icon}
                              </View>
                              <View
                                style={{
                                  height: ms(32),
                                  backgroundColor: themes[mode]["peachColor"],
                                  justifyContent: "center",
                                  alignItems: "center",
                                  flexDirection: "row",
                                }}
                              >
                                <SOSCall />
                                <Text
                                  style={{
                                    fontFamily: fonts.semiBold,
                                    fontSize: ms(14),
                                    color: themes[mode]["headingColor"],
                                    marginHorizontal: 10,
                                  }}
                                >
                                  {sosComp(Object.keys(item)[0]).label}
                                </Text>
                              </View>
                            </TouchableOpacity>
                          ) : (
                            <SOSLoader />
                          )}

                        </Animated.View>
                      );
                    }}
                  />
                 
               
              ) : (
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "17%",
                  }}
                >
                  <View style={{}}>
                    <NoEmergencyContact />
                  </View>
                  <Text
                    style={{
                      fontFamily: fonts.bold,
                      fontSize: ms(14),
                      lineHeight: ms(30),
                      color: themes[mode]["headingColor"],
                      textAlign: "center",
                      marginVertical: 35,
                    }}
                  >
                    No Contact Numbers {"\n"} Configured.
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>
        </WithBgHeader>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = ({
  profile: { mode, userData },
  home: { sosData, sosLoader },
}) => {
  return {
    mode,
    sosData,
    sosLoader,
    userData,
  };
};
const { getSosNumbers } = home;
const mapDispatchToProps = {
  getSosNumbers,
};

export default connect(mapStateToProps, mapDispatchToProps)(SOSScreen);
