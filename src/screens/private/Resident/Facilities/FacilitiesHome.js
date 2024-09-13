import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Keyboard,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableHighlight,
  RefreshControl,
  Image,
} from "react-native";
import { connect } from "react-redux";
import { SvgUri, SvgXml } from "react-native-svg";

import { themes, fonts, commonColors } from "../../../../themes";
import {
  detectTheme,
  MyVisitorArrData,
  renderFacilityList,
  timeAgo,
  windowSize,
} from "../../../../helpers";
import SafeAreaView from "react-native-safe-area-view";
import { Header, HeaderOnly } from "../../../../components/Header";
import FacilityData from "./facilities_data.json";
import { facility } from "../../../../redux/actions";
import { FocusAwareStatusBar } from "../../../../navigation/RootNavigation";
import {
  ArrowRight,
  DollarIcon,
  FacilitySuccess,
  FunctionHallIcon,
  GolfIcon,
  MAFacilityIcon,
  NoFacilities,
  TennisIcon,
} from "../../../../../assets/img/svgs";
import { SOSLoader } from "../../../../../assets/img/loader";
// import {NoData} from '../../../../../assets/img/svgs';
import NoData from "../../../../../assets/img/no_data";
import commonStyles from "../../../../styles/commonStyles";
import { WithBgHeader } from "../../../../components";
import Animated from "react-native-reanimated";
import { customAnimation } from "../../../../animation/CommonAnimation";
import { ms } from "../../../../helpers/scaling";
class FacilitiesHome extends Component {
  componentDidMount() {
    const {
      navigation,
      listFacilityTypesAction,
      facilityChange,
      facilityResetData,
    } = this.props;

    facilityChange({ name: "facilitiesLoader", value: true });

    listFacilityTypesAction();
    // facilityResetData();
  }
  render() {
    const {
      navigation,
      mode,
      facilitiesList,
      onFacilityDataChange,
      facilitiesLoader,
      facilitiesTypesList,
    } = this.props;
    let facilitiesFilter = facilitiesTypesList;
    console.log(facilitiesFilter, "12345");
    return (
      <SafeAreaView
        style={{
          flex: 1,
          height: "100%",
          backgroundColor: themes[mode]["bgColor"],
        }}
        forceInset={{ top: "never" }}
      >
        {/* <FocusAwareStatusBar />
        <View style={{marginTop: '-5%'}}>
          <Header
            showLeftIcon
            leftIcon
            title={'Facility Booking'}
            rightText="History"
            onPressRight={() => {
              navigation.navigate('MyBookingsList');
            }}
          />
        </View> */}
        <WithBgHeader
          leftIcon
          headerTitle="Facility Booking"
          headerTitleStyle={{
            marginLeft: 40,
          }}
          rightText={facilitiesFilter?.length > 0 ? "History" : " "}
          onPressRightIcon={() => {
            facilitiesFilter?.length > 0 &&
              navigation.navigate("MyBookingsList");
          }}
          containerStyle={{
            ...commonStyles.headerSpacing,
          }}
        >
          <View>
            {!facilitiesLoader ? (
              <View style={{}}>
                {console.log(facilitiesTypesList, "list types ")}
                {facilitiesFilter.length > 0 ? (
                  <FlatList
                    columnWrapperStyle={{
                      justifyContent: "center",
                    }}
                    style={{ height: "96%" }}
                    data={
                      facilitiesFilter.length > 0
                        ? facilitiesFilter
                        : [1, 2, 3, 4, 5]
                    }
                    numColumns={2}
                    contentContainerStyle={{
                      flexGrow: 1,
                      paddingBottom: 50,
                    }}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item, index }) => {
                      const {
                        alias_name,
                        id,
                        banner_images,
                        title_image,
                        name,
                        booking_type,
                        payment_method,
                      } = item;
                      console.log(booking_type, "000");

                      return (
                        <>
                          <View
                            style={{
                              // flex: 1,
                              // backgroundColor: themes[mode]['bgColor'],
                              // backgroundColor: 'red',
                              marginTop: "0%",
                              marginHorizontal: ms(16),
                              marginVertical: ms(25),

                              // elevation: 1,
                              borderRadius: ms(14),
                              position: "relative",
                            }}
                          >
                            {facilitiesFilter?.length > 0 ? (
                              <>
                                <Animated.View
                                  {...customAnimation("ZoomIn", 400, 50, index)}
                                >
                                  <TouchableOpacity
                                    style={{
                                      elevation: 3,
                                      shadowOpacity: 0.5,
                                      shadowRadius: 3,
                                      shadowOffset: { width: 2, height: 1 },

                                      shadowColor: "#bbb",
                                      width: ms(130),
                                      height: ms(127),
                                      borderRadius: ms(17),
                                      backgroundColor: themes[mode]["bgColor"],
                                      // backgroundColor: 'green',
                                      // height: 120,
                                      borderWidth: 1,
                                      borderColor: themes[mode]["lightAsh2"],
                                    }}
                                    onPress={() => {
                                      console.log(item, "before onpredsss");
                                      navigation.navigate(
                                        "FacilitiesDescription",
                                        {
                                          item,
                                        }
                                      );
                                      // navigation.navigate('FacilityMaApproval', {
                                      //   title: ` `,
                                      //   message: `  Your request is pending. Please wait for MA approval or contact the MA office.`,
                                      //   image: <MAFacilityIcon />,
                                      //   navigateTo: 'FacilitiesHome',
                                      // });
                                    }}
                                  >
                                    {/* {payment_method == "paid" && <View style={{ position: "absolute", zIndex: 2, right: -5, top: -5 }}>
                                <DollarIcon />
                              </View>} */}
                                    <View
                                      style={{
                                        width: ms(128),
                                        height: ms(100),
                                        borderColor: commonColors.lightAsh2,
                                        borderBottomWidth: 1,
                                        backgroundColor:
                                          themes[mode]["lightAsh"],
                                        borderTopLeftRadius: ms(14),
                                        borderTopRightRadius:ms(14),
                                      }}
                                    >
                                      <Image
                                        style={{
                                          resizeMode: "cover",
                                          width: ms(128),
                                          height: ms(100),
                                          // marginTop: -10,
                                          borderTopLeftRadius: ms(14),
                                          borderTopRightRadius: ms(14),

                                          backgroundColor:
                                            themes[mode]["lightAsh"],
                                        }}
                                        // source={{
                                        //   uri: 'https://bms-assets.katomaran.in/ci/images/facilities/InShot_20220111_223540691.jpg',
                                        // }}
                                        source={
                                          title_image?.s3_image_path
                                            ? {
                                                uri: title_image?.s3_image_path,
                                              }
                                            : null
                                        }
                                      />
                                    </View>

                                    {/* </View> */}
                                    <View
                                      style={{
                                        minWidth: ms(128),
                                        maxWidth: ms(128),
                                        height: ms(24.5),
                                        // marginTop: -10,
                                        // marginVertical: 8,
                                        // paddingVertical: 5,
                                        borderBottomLeftRadius: ms(14),
                                        borderBottomRightRadius: ms(14),
                                        backgroundColor:
                                          themes[mode][
                                            mode === "light"
                                              ? "bgColor"
                                              : "otpColor"
                                          ],
                                        justifyContent: "center",
                                        alignItems: "center",

                                        //                       shadowColor: themes[mode]['otpColor'],
                                        //                       shadowOpacity: 3,
                                        //                       shadowRadius: 6,
                                        // shadowOffset: {width: 2, height: 1},

                                        //                       shadowColor:"#bbb",
                                      }}
                                    >
                                      <Text
                                        style={{
                                          fontFamily: fonts.medium,
                                          fontSize: ms(14),
                                          textAlign: "center",
                                          textTransform: "capitalize",
                                          color: themes[mode]["headingColor"],
                                          marginVertical: 2,
                                        }}
                                      >
                                        {name}
                                      </Text>
                                    </View>
                                  </TouchableOpacity>
                                </Animated.View>
                              </>
                            ) : (
                              <View>
                                <Text> here</Text>
                              </View>
                            )}
                          </View>
                        </>
                      );
                    }}
                  />
                ) : (
                  <View>
                    <View
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: "35%",
                      }}
                    >
                      <NoFacilities />
                      <Text
                        style={{
                          ...commonStyles.medium_18,
                          color: themes[mode]["headingColor"],
                          marginVertical: 30,
                        }}
                      >
                        No Facilities Found
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            ) : (
              <View
                style={{
                  marginTop: "5%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {[1, 2, 3, 4, 5]?.map((item) => {
                  return (
                    <View key={item} style={{ flexDirection: "row" }}>
                      <SOSLoader />
                      <SOSLoader />
                      {/* <SOSLoader /> */}
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        </WithBgHeader>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = ({
  profile: { mode },
  facility: { facilitiesList, facilitiesTypesList, facilitiesLoader },
}) => {
  return {
    mode,
    facility,
    facilitiesList,
    facilitiesLoader,
    facilitiesTypesList,
  };
};
// const {} = myvisitor;
const {
  onFacilityDataChange,
  facilityValidation,
  listFacilityTypesAction,
  facilityChange,
  facilityResetData,
} = facility;

const mapDispatchToProps = {
  onFacilityDataChange,
  facilityValidation,
  listFacilityTypesAction,
  facilityChange,
  facilityResetData,
};
export default connect(mapStateToProps, mapDispatchToProps)(FacilitiesHome);
