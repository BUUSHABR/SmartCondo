import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Keyboard,
  StyleSheet,
  ScrollView,
  TouchableHighlight,
  // ScrollView,
  RefreshControl,
  Modal,
  TouchableWithoutFeedback,
  Image,
  TextInput,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";

import { connect } from "react-redux";
import * as RootNavigation from "../../../../navigation/RootNavigation";

import { themes, fonts } from "../../../../themes";
import {
  detectTheme,
  timeAgo,
  capitalize,
  tailedString,
  customTimeFunction,
  filterMenus,
  getTimeDifference,
} from "../../../../helpers";
import SafeAreaView from "react-native-safe-area-view";
import { Header } from "../../../../components/Header";
import {
  FilterIcon,
  MyVisitorUserIcon,
  VisitsContractorIcon,
  VisitsGuestIcon,
  VisitsDeliveryIcon,
  VisitsPickupIcon,
  TickIcon,
  NoVisitorData,
  NoRecordIcon,
  SearchIcon,
} from "../../../../../assets/img/svgs";

import { login, notification, myVisitor } from "../../../../redux/actions";
import VisitorTypes from "../../../../components/VisitorsType";
import {
  CustomModal,
  NoDataCompSearch,
  WithBgHeader,
} from "../../../../components";
import { NotificationLoader } from "../../../../../assets/img/loader";
import commonStyles from "../../../../styles/commonStyles";
import {
  TourGuideProvider, // Main provider
  TourGuideZone, // Main wrapper of highlight component
  TourGuideZoneByPosition, // Component to use mask on overlay (ie, position absolute)
  useTourGuideController, // hook to start, etc.
} from "rn-tourguide";
import { BookingsFilter } from "../../../../api/facility_booking";
import Animated from "react-native-reanimated";
import { customAnimation } from "../../../../animation/CommonAnimation";
import PulltoRefersh from "../../../../animation/Hoc/pullToRefresh";
import { ms } from "../../../../helpers/scaling";
export const renderItem = ({ item, navigation, index }) => {
  const image = require("../../../../../assets/img/man2.png");
  console.log(item, "phoneitem");
  const {
    id,
    entity_type,
    visitors,
    visitor_type,
    visitor_type_name,
    visit_time,
    sub_visitor_type,
    phone,
    block,
    in_time,
    out_time,
  } = item;
  const type = capitalize(visitor_type ? visitor_type : visitor_type_name);
  const data = {
    type_id: id,
    type: type,
    title: item.subject || "",
    message: item.description || "",
    block: block,
    members: visitors,
    in_time: in_time,
    out_time: out_time,
    visit_time: visit_time,
  };
  console.log(type, "vistyhcc");
  const mode = detectTheme();
  const MyVisitorArrData = {
    Guest: {
      icon: require("../../../../../assets/img/manHome.png"),
      bgColor: mode === "light" ? "#FFF" : "#292929",
    },
    Contractor: {
      icon: require("../../../../../assets/img/constructionHome.png"),
      bgColor: mode === "light" ? "#FFF" : "#292929",
    },
    Delivery: {
      icon: require("../../../../../assets/img/foodHome.png"),
      bgColor: mode === "light" ? "#FFF" : "#292929",
    },
    "Pickup/Drop": {
      icon: require("../../../../../assets/img/drop.png"),
      bgColor: mode === "light" ? "#FFF" : "#292929",
    },
  };

  const showVisitorDetails = () => {
    RootNavigation.navigate("MyVisitorDetails", { data });
  };

  // console.log(
  //   entity_type,
  //   MyVisitorArrData[entity_type]['bgColor'],
  //   MyVisitorArrData.Visitor,
  //   item,
  //   'iteemmmmmmmmmmmmmmmmm',
  // );
  const bgColor = MyVisitorArrData[type]["bgColor"];
  const icon = MyVisitorArrData[type]["icon"];
  const VisitorList = (
    <View style={{ marginVertical: "3%", paddingHorizontal: 7 }}>
      <Animated.View {...customAnimation("FadeInRight", 700, 50, index)}>
        <TouchableOpacity
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            // backgroundColor:"pink",
            // marginHorizontal: 20,
          }}
          onPress={showVisitorDetails}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              maxWidth: "110%",
            }}
          >
            <View
              style={{
                width:ms(40),
                height:ms(40),
                borderRadius: 19,
                backgroundColor: bgColor,
                justifyContent: "center",
                alignItems: "center",
                marginTop: 6,
                elevation: 0.8,
                // elevation: 1,
              }}
            >
              <Image style={{ height: ms(20), width: ms(20) }} source={icon} />
            </View>
            <View style={{ marginLeft: 20, marginTop: 8 }}>
              <Text
                style={{
                  fontFamily: fonts.bold,
                  fontSize: ms(14),
                  color: themes[mode]["headingColor"],
                  textTransform: "capitalize",
                }}
              >
                {visitors.length > 0 ? tailedString(visitors[0]?.name, 25) : ""}
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  marginVertical: 5,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontFamily: fonts.regular,
                    fontSize: ms(14),
                    color: themes[mode]["headingColor"],
                    textTransform: "capitalize",
                  }}
                >
                  {type === "Pickup/Drop" ? "Pickup / Drop" : type}
                </Text>
              </View>
            </View>
          </View>
          <View style={{}}>
            {/* <MyVisitorUserIcon /> */}
            <Text
              style={{
                fontFamily: fonts.regular,
                fontSize: ms(11),
                color: themes[mode]["headingColor"],
                marginVertical: 5,
                marginLeft: 5,
                textAlign: "center",
              }}
            >
              {/* {timeAgo(visit_time)} */}
              {customTimeFunction(visit_time)}
            </Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
      {/* </TourGuideZone> */}
    </View>
  );
  if (index == 0) {
    return (
      // <TourGuideZone
      //   zone={4}
      //   text={"Know the details of your recent visitors"}
      //   borderRadius={16}
      //   name1={"jdwkjdakilan akailaka  ajajkhbdkwdhb"}
      //   // style={{ paddingLeft: 10 }}
      // >
      VisitorList
      // </TourGuideZone>
    );
  }
  return VisitorList;
};

class MyVisitorsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      search: false,
    };
  }
  onPressRight = () => {
    console.log("onPressRight");
    const { onVisitorChange } = this.props;
    this.setState({ modalVisible: !this.state.modalVisible });
  };
  handleChangeType = (name, value) => {
    console.log(name, value, "handlechangetypeeeee");

    this.handleSearch("");
    const {
      onLoginInputChange,
      onVisitorChange,
      listMyVisitorsData,
      setVisitorLoader,
    } = this.props;
    onVisitorChange({ name, value });

    onVisitorChange({ name: "page", value: 1 });
    onVisitorChange({ name: "totalEntries", value: 0 });
    // onVisitorChange({name: 'myVisitorData', value: []});

    listMyVisitorsData();
    this.props.setPhoneAggr();
  };

  handleChange = (name, value) => {
    console.log(name, value, "handle changeee");
    const {
      navigation,
      onVisitorChange,
      visitorsFilter,
      myVisitorData,
      phone,
      filteredData,
      visitor_type,
      listMyVisitorsData,
      GuestArr,
      ContractorArr,
      DeliveryArr,
      PickupDropArr,
    } = this.props;
    let arrData =
      visitor_type === "All"
        ? myVisitorData
        : visitor_type === "Visitor"
        ? GuestArr
        : visitor_type === "Contractor"
        ? ContractorArr
        : visitor_type === "Delivery"
        ? DeliveryArr
        : PickupDropArr;
    let filterProps = {
      showLeftIcon: true,
      leftIcon: true,
      showRightIcon: true,
      title: "Phone Number",
      onPressRight: () => {},
      onPressLeftIcon: () => {},
      data: arrData,
      searchData: filteredData,
      navigation: navigation,
      // handleChange: this.handleSearchChange,
      phone: phone,
      updateAction: onVisitorChange,
      listAction: listMyVisitorsData,
    };
    onVisitorChange({ name, value });

    if (name === "phone") {
      // onVisitorChange({name: 'modalVisible', value: false});
      this.setState({ modalVisible: false });
      console.log(visitorsFilter, "visitosssfilterrrr");
      navigation.navigate("FilterList", { filterProps });
    }
    if (name === "date") {
      onVisitorChange({ name, value });
      // BookingsFilter()
    }
    if (name === "days") {
      onVisitorChange({ name, value });
    }
    // if (name === 'from_time' || name === 'to_time') {
    //   onVisitorChange({name, value});
    //   name === 'to_time' && this.setState({modalVisible: false});
    // }
  };
  onResetFilter = () => {
    console.log("reset filterrr");
    const { onVisitorChange, listMyVisitorsData, phoneArr } = this.props;
    this.setState({ modalVisible: false });
    // onVisitorChange({name: 'modalVisible', value: false});
   

    onVisitorChange({ name: "phone", value: "" });
    onVisitorChange({ name: "days", value: 30 });
    onVisitorChange({ name: "date", value: "last_30" });
    listMyVisitorsData();
  };

  onSubmitFilter = () => {
    console.log("onSubmitt  filterrrr");
    const {
      navigation,
      onVisitorChange,
      visitorsFilter,
      myVisitorData,
      phone,
      filteredData,
      visitor_type,
      GuestArr,
      ContractorArr,
      DeliveryArr,
      PickupDropArr,
    } = this.props;
    let arrData =
      visitor_type === "All"
        ? myVisitorData
        : visitor_type === "Visitor"
        ? GuestArr
        : visitor_type === "Contractor"
        ? ContractorArr
        : visitor_type === "Delivery"
        ? DeliveryArr
        : PickupDropArr;
    let filterProps = {
      showLeftIcon: true,
      leftIcon: true,
      showRightIcon: true,
      title: "Phone Number",
      onPressRight: () => {},
      onPressLeftIcon: () => {},
      data: arrData || [],
      searchData: filteredData,
      navigation: navigation,
      // handleChange: this.handleSearchChange,
      phone: phone,
    };
    // onVisitorChange({name: 'modalVisible', value: false});
    this.setState({ modalVisible: false });
    this.loadData();
    // visitorsFilter.includes('phone') &&
    //   navigation.navigate('FilterList', {filterProps});
  };
  fetchData = () => {
    this.loadData();
  };
  componentDidMount() {
    /*  */
    const {
      navigation,
      onVisitorChange,
      visitorLoader,
      setVisitorLoader,
      loadRefresh,
    } = this.props;
    const { modalVisible } = this.state;
    this.focusListener = navigation.addListener("focus", () => {
      setVisitorLoader(true);

      console.log(this.props.route, "focusssssss777777777777777777777sss");

      // onVisitorChange({name: 'modalVisible', value: true});
      this.setState(
        {
          modalVisible: this.props?.route?.params?.showModal ? true : false,
        },
        () => {
          console.log(this.state, "stttate updtee");
        }
      );
      console.log(this.state.modalVisible, "state modal visibleee");
      console.log(
        modalVisible,
        "MODDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD"
      );
      !modalVisible && this.loadData();
      loadRefresh(this.fetchData);
      console.log(
        "MODDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD11111111111111111111"
      );
      this.props.setPhoneAggr();

      // !modalVisible && this.props.setPhoneAggr();
    });
    this.focusListener = navigation.addListener("blur", () => {
      this.setState({ modalVisible: false });
      // onVisitorChange({name: 'modalVisible', value: false});
      // !modalVisible && this.handleChangeType('visitor_type', 'All');
    });
  }

  loadData = () => {
    console.log("load data");
    const {
      listMyVisitorsData,
      per_page,
      myVisitorData,
      totalEntries,
    } = this.props;
    listMyVisitorsData();
  };
  handleSearch = (value) => {
    this.setState({ search: value });
    console.log(this.state.search, "87549302984302");
  };

  render() {
    const {
      mode,
      myVisitorData,
      GuestArr,
      ContractorArr,
      DeliveryArr,
      PickupDropArr,
      visitor_type,
      visitorsFilter,
      from_time,
      to_time,
      date,
      days,
      phone,
      per_page,
      page,
      totalEntries,
      visitorLoader,
      navigation,
      onVisitorChange,
    } = this.props;
    const {
      onPressRight,
      myVisitorArray,
      handleChangeType,
      handleChange,
      onSubmitFilter,
      onResetFilter,
    } = this;
    const { modalVisible } = this.state;
    let showDuration = ["last_30", "last_60", "last_90"];
    let arrData =
      visitor_type === "All"
        ? myVisitorData
        : visitor_type === "Visitor"
        ? GuestArr
        : visitor_type === "Contractor"
        ? ContractorArr
        : visitor_type === "Delivery"
        ? DeliveryArr
        : PickupDropArr;
    // arrData=[...new Set(arrData)]
    console.log(visitor_type, "arrrdat55555555", arrData, "++++++");
    // let loader=true
    //     if(data?.length > 0){
    //       loader=false
    //     }
    const {
      GestureHandler,
      RefreshHeader,
      handleOnScroll,
      flatlistRef,
    } = this.props;
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor:
            Platform.OS === "ios"
              ? modalVisible
                ? "#ddd"
                : themes[mode]["bgColor"]
              : themes[mode]["bgColor"],
          opacity: modalVisible ? (mode === "light" ? 0.5 : 0.5) : 1,
        }}
        forceInset={{ top: "never" }}
      >
        {/* <View style={{marginTop: '-7%'}}>
          <Header
            includeFont
            showLeftIcon
            leftIcon
            showRightIcon
            title="My Visitors"
            rightIcon={
              <FilterIcon
                color={
                  themes[mode][
                    days == 30 && !phone ? 'headingColor' : 'primaryColor'
                  ]
                }
              />
            }
            onPressRight={onPressRight}
            onPressLeftIcon
          />
        </View> */}
        <WithBgHeader
          leftIcon
          headerTitle="My Visitors"
          rightIcon={
            <FilterIcon
              color={
                themes[mode][
                  days == 30 && !phone ? "headingColor" : "primaryColor"
                ]
              }
            />
          }
          containerStyle={{
            ...commonStyles.headerSpacing,
          }}
          onPressRightIcon={onPressRight}
          headerStyle={{
            backgroundColor:
              Platform.OS === "ios"
                ? modalVisible && "#ddd"
                : themes[mode]["bgColor"],
            opacity: modalVisible ? (mode === "light" ? 0.5 : 0.5) : 1,
          }}
        >
          <View
            style={{
              ...commonStyles.headerSpacing,
              marginTop: 10,
              marginRight: 0,
            }}
          >
            <VisitorTypes
              name="visitor_type"
              visitorType={visitor_type}
              onChange={handleChangeType}
              tabArr={[
                {
                  label: "All",
                },
                {
                  label: "Visitor",
                },
                {
                  label: "Contractor",
                },
                {
                  label: "Delivery",
                },
                {
                  label: "Pickup / Drop",
                },
              ]}
            />
          </View>
          <View style={{ paddingHorizontal: 25 }}>
            <Text
              style={{
                fontFamily: fonts.light,
                fontSize: ms(15),
                lineHeight: ms(25),
                textAlign: "center",
                color: themes[mode]["textColor"],
              }}
            >
              These are visitor entries recorded in the entrance gate's visitor
              management system
            </Text>
          </View>
          <View
            style={{
              height: ms(40),
              borderRadius: 10,
              paddingHorizontal: 15,
              paddingVertical: 10,
              justifyContent: "center",
              backgroundColor:
                themes[mode][mode === "light" ? "lightAsh2" : "modalWrap"],
              marginHorizontal: 35,
              marginBottom: 4,
              marginTop: 20,
            }}
          >
            <TextInput
              name={"search"}
              onChangeText={this.handleSearch}
              value={this.state.search}
              style={{
                height: ms(40),
                borderRadius: 10,
                paddingHorizontal: ms(15),
                paddingVertical: 10,
                justifyContent: "center",
                backgroundColor:
                  themes[mode][mode === "light" ? "lightAsh2" : "modalWrap"],
                flexDirection: "row",
                justifyContent: "center",
                fontFamily: fonts.semiBold,
                fontSize:ms(16),
                color: themes[mode]["headingColor"],
                letterSpacing: 1,
                marginLeft: ms(15),
              }}
              placeholder={"Search here ..."}
              placeholderTextColor={"#c1c1c1"}
            ></TextInput>
            <View style={{ position: "absolute", left: 10 }}>
              <SearchIcon />
            </View>
          </View>

          <View>
            {!visitorLoader ? (
              <View>
                {RefreshHeader}

                {arrData?.length > 0 ? (
                  <FlatList
                    ref={flatlistRef}
                    onScroll={handleOnScroll}
                    onStartShouldSetResponder={() => {}}
                    showsVerticalScrollIndicator={false}
                    // legacyImplementation={true}visitors[0].name
                    data={
                      this.state.search.length > 0
                        ? arrData.filter((Data) =>
                            Data?.visitors[0]?.name
                              ?.toLowerCase()
                              .includes(this.state.search?.toLowerCase())
                          )
                        : arrData
                    }
                    renderItem={({ item, index }) => {
                      return renderItem({
                        item: item,
                        navigation: navigation,
                        index,
                      });
                      // return <Text>hhhhhhhhhhhhhhhhh</Text>;
                    }}
                    keyExtractor={(item, index) => item.id + index}
                    style={{
                      marginTop: "3%",
                      // zIndex: 10001,
                      marginHorizontal: 20,
                    }}
                    contentContainerStyle={{
                      flexGrow: 1,
                      paddingBottom: "70%",
                      // marginRight: 20,
                    }}
                    onEndReached={(end) => {
                      console.log(
                        page,
                        arrData.length,
                        page * arrData.length < totalEntries,
                        totalEntries,
                        end,
                        "onend reachded"
                      );
                      onVisitorChange({
                        name: "page",
                        // value:
                        //   myVisitorData.length > 0 &&
                        //   page * myVisitorData.length < totalEntries &&
                        //   totalEntries / 30 < page
                        //     ? page + 1
                        //     : page,
                        value:
                          page * arrData.length < totalEntries &&
                          arrData.length > 0
                            ? page + 1
                            : page,
                      });
                      // !modalVisible && this.loadData();
                      // per_page < totalEntries && this.loadData;
                    }}
                    onEndReachedThreshold={0.5}
                  />
                ) : (
                  <NoDataCompSearch
                    icon={<NoRecordIcon />}
                    text="No Record Found"
                    message="We couldn't find any visitor record "
                  />
                )}
                {GestureHandler && GestureHandler}
              </View>
            ) : (
              <View
                style={{
                  margin: 15,
                  marginTop: "10%",
                }}
              >
                {[1, 2, 3, 4, 5, 6]?.map((item) => {
                  return <NotificationLoader />;
                })}
              </View>
            )}

            <CustomModal
              onRequestClose={() => {
                console.log("onReq closeeeeeeeeeeeeeeeeeeeee");
                // onVisitorChange({name: 'modalVisible', value: false});
                this.setState({ modalVisible: false });
              }}
              modalVisible={this.state.modalVisible}
              dateFilterShow={["phone", "from_date", "to_date"]}
              filteredList={visitorsFilter}
              onResetFilter={this.onResetFilter}
              onSubmitFilter={this.onSubmitFilter}
              dateFilterSelect
              handleChange={this.handleChange}
              modalParams={{
                date: date,
                phone: phone,
                days: days,
                visitor_type: visitor_type,
              }}
              filterArr2={["phone", "date"]?.map((item) => {
                return filterMenus(showDuration)[item];
              })}
            />
            {/* <View style={{}}>
            <TouchableWithoutFeedback
              onPress={() => this.setState({modalVisible: true})}>
              <View
                style={{width: '100%', height: '20%', backgroundColor: 'red'}}>
                <View
                  onStartShouldSetResponder={() => true}
                  style={{
                    width: '100%',
                    height: '30%',
                    backgroundColor: 'green',
                  }}>
                  <View
                    style={{
                      width: '100%',
                      height: '30%',
                      backgroundColor: 'green',
                    }}>
                    <Text>hhhhhhhhhhh</Text>
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback> */}
            {/* <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => this.setState({modalVisible: false})}>
              <TouchableOpacity
                style={{
                  justifyContent: 'flex-end',
                  height: '30%',
                  backgroundColor: themes[mode]['bgColor'],
                  position: 'absolute',
                  bottom: 0,
                  backgroundColor: 'red',
                  width: '100%',
                }}
                activeOpacity={1}
                onPressOut={() => {
                  this.setState({modalVisible: false});
                }}>
                <Text>hello world</Text>
              </TouchableOpacity>
            </Modal> */}
            {/* </View> */}

            {/* </ScrollView> */}
          </View>
        </WithBgHeader>
      </SafeAreaView>
      // <View
      //   style={{
      //     flex: 1,
      //     backgroundColor: themes[mode]['bgColor'],
      //     justifyContent: 'center',
      //     alignItems: 'center',
      //   }}>
      //   <Text
      //     style={{
      //       color: themes[mode]['primaryColor'],
      //       textAlign: 'center',
      //     }}></Text>
      //   <Text style={{color: themes[mode]['headingColor']}}></Text>
      //   <Text style={{color: themes[mode]['lightAsh']}}>MyVisitorsList</Text>
      // </View>
    );
  }
}

const mapStateToProps = ({
  profile: { mode },
  myVisitor: {
    myVisitorData,
    GuestArr,
    ContractorArr,
    DeliveryArr,
    PickupDropArr,
    visitor_type,
    visitorsFilter,
    from_time,
    to_time,
    visitorLoader,
    filteredData,
    date,
    phone,
    days,
    per_page,
    totalEntries,
    page,
    phoneArr,
  },
}) => {
  return {
    mode,
    filteredData,
    myVisitorData,
    GuestArr,
    ContractorArr,
    DeliveryArr,
    PickupDropArr,
    visitor_type,
    visitorsFilter,
    from_time,
    to_time,
    visitorLoader,
    phone,
    date,
    days,
    per_page,
    totalEntries,
    page,
    phoneArr,
  };
};

const {
  onVisitorChange,
  listMyVisitorsData,
  setVisitorLoader,
  setPhoneAggr,
} = myVisitor;

const mapDispatchToProps = {
  listMyVisitorsData,
  onVisitorChange,
  setVisitorLoader,
  setPhoneAggr,
};

export default PulltoRefersh(
  connect(mapStateToProps, mapDispatchToProps)(MyVisitorsList)
);
