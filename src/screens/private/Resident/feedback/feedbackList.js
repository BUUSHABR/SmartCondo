import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  TextInput,
  Alert,
} from "react-native";

import { FlatList } from "react-native-gesture-handler";

import SafeAreaView from "react-native-safe-area-view";
import { connect } from "react-redux";

import * as RootNavigation from "../../../../navigation/RootNavigation";
import { fonts, themes } from "../../../../themes";
import {
  detectTheme,
  tailedString,
  customTimeFunction,
  imageExtractor,
  complaintStatusExtractor,
  filterMenus,
} from "../../../../helpers";
import VisitorTypes from "../../../../components/VisitorsType";
import { invite } from "../../../../redux/actions";
import {
  CustomModal,
  NoDataCompSearch,
  ToastMessage,
  WithBgHeader,
} from "../../../../components";

import {
  FilterIcon,
  NoRecordIcon,
  SearchIcon,
} from "../../../../../assets/img/svgs";
import { NotificationLoader } from "../../../../../assets/img/loader";
import commonStyles from "../../../../styles/commonStyles";
import Animated from "react-native-reanimated";
import { customAnimation } from "../../../../animation/CommonAnimation";
import PulltoRefersh from "../../../../animation/Hoc/pullToRefresh";
import {
  onClickTicket,
  setTicketLoader,
  ticketChange,
  TicketList,
  onResetFilter,
} from "../../../../redux/actions/feedback";
import { ticketDelete } from "../../../../api/feedback";

class FeedbackList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      filterState: false,
      search: "",
    };
  }
  fetchData = () => {
    this.loadData();
  };

  componentDidMount() {
    /*  */
    const {
      navigation,
      onVisitorChange,
      setTicketLoader,
      onClickTicket,
      loadRefresh,
    } = this.props;
    const { modalVisible } = this.state;
    setTicketLoader(true);
    this.focusListener = navigation.addListener("focus", () => {
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
    });
    this.focusListener = navigation.addListener("blur", () => {
      this.setState({ modalVisible: false });
      onClickTicket({ name: "TicketStatus", value: "All" });
      // onVisitorChange({name: 'modalVisible', value: false});
      // !modalVisible && this.handleChangeType('visitor_type', 'All');
    });
  }

  loadData = () => {
    console.log("load data");
    const { TicketList, per_page, myVisitorData, totalEntries } = this.props;
    TicketList();
  };

  onPressRight = () => {
    console.log("onPressRight");
    const { onVisitorChange, modalVisible } = this.props;
    this.setState({ modalVisible: !this.state.modalVisible });
    // openOverlay();
  };
  handleChangeType = (name, value) => {
    this.handleSearch("");
    console.log(name, value, "handlechangetypeeeee");
    const {
      onLoginInputChange,
      ticketChange,
      TicketList,
      setTicketLoader,
      onClickTicket,
    } = this.props;
    onClickTicket({ name, value });

    onClickTicket({ name: "page", value: 1 });
    onClickTicket({ name: "totalEntries", value: 0 });
    // onClickTicket({name: 'myInvitationData', value: []});
    TicketList();
  };

  handleChange = (name, value) => {
    console.log(name, value, "handle changeee");
    const {
      navigation,
      ticketChange,
      myInvitationData,
      onClickTicket,
      phone,
      filteredData,
    } = this.props;

    onClickTicket({ name, value });
  };
  onResetFilter = () => {
    console.log("reset filterrr");
    const { ticketChange, onClickTicket, onResetFilter } = this.props;
    this.setState({
      modalVisible: !this.state.modalVisible,
      filterState: false,
    });
    // onVisitorChange({name: 'modalVisible', value: false});
    onResetFilter({ name: "date", value: "this_month" });

    // closeOverlay();
  };

  onSubmitFilter = () => {
    console.log("onSubmitt  filterrrr");
    const {
      navigation,
      ticketChange,
      visitorsFilter,
      myInvitationData,
      phone,
      filteredData,
    } = this.props;

    this.loadData();
    this.setState({ modalVisible: false, filterState: true });
  };
  handleSearch = (value) => {
    this.setState({ search: value });
    console.log(this.state.search, "87549302984302");
  };

  showTicket = (item) => {
    RootNavigation.navigate("FeedbackDetail", {
      data: {
        type_id: item.id,
      },
    });
  };

  deleteTicket = (id) => {
    Alert.alert(
      "Delete Ticket",
      "Are you sure you want to delete this ticket ?",
      [
        {
          text: "No",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => {
            ticketDelete(id)
              .then((data) => {
                ToastMessage(200, data.message);
                this.loadData();
              })
              .catch((err) => {
                let message = err[1].data ? err[1].data[0] : err[1]?.message;
                ToastMessage(err[0], message);
              });
          },
        },
      ]
    );
  };

  renderItem = ({ item, index }) => {
    const mode = detectTheme();
    const {
      created_at,
      identity_id,
      ticket_category_name,
      status,
      title,
    } = item;
    console.log(item, "invite list state");
    return (
      <Animated.View {...customAnimation("FadeInRight", 700, 50, index)}>
        <TouchableOpacity
          style={{
            ...commonStyles.spaceBtwnAlign,
            marginVertical: Platform.OS === "android" ? 10 : 12,
            paddingRight: 10,
          }}
          onLongPress={() => this.deleteTicket(item?.id)}
          onPress={() => this.showTicket(item)}
        >
          <View
            style={{
              flexDirection: "row",

              maxWidth: "85%",
            }}
          >
            <View
              style={{
                ...commonStyles.avatar,
              }}
            >
              {imageExtractor(null)}
            </View>
            <View
              style={{
                marginLeft: 15,
                // maxWidth: '50%',
                width: "65%",
                // maxWidth: '60%',
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{
                  ...commonStyles.semiBold_16,
                  color: themes[mode]["headingColor"],
                }}
              >
                {tailedString(identity_id, 30)} - {tailedString(title, 30)}
              </Text>
              <Text
                style={{
                  ...commonStyles.light_14,
                  color: themes[mode]["headingColor"],
                  marginVertical: 10,
                }}
              >
                {tailedString(ticket_category_name, 30)}
              </Text>
            </View>
          </View>
          <View
            style={{
              ...commonStyles.listRightSideColumnAlign,
            }}
          >
            <View
              style={{
                ...commonStyles.statusWrapper,
                backgroundColor: complaintStatusExtractor(status).bgColor,
              }}
            >
              <Text
                style={{
                  ...commonStyles.semiBold_12,
                  color: complaintStatusExtractor(status).color,
                }}
              >
                {status}
              </Text>
            </View>
            <Text
              style={{
                ...commonStyles.light_12,
                marginVertical: 10,
                color: themes[mode]["headingColor"],
              }}
            >
              {customTimeFunction(created_at)}
            </Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  render() {
    const {
      allTicketData,
      upcomingTicketData,
      expiredTicketData,
      TicketStatus,
      TicketFilter,
      from_time,
      to_time,
      ticketLoader,
      date,
      phone,
      days,
      per_page,
      totalEntries,
      page,
      mode,
      navigation,

      submitted,
      showCancelButton,
    } = this.props;
    const { modalVisible, filterState } = this.state;
    const {
      onPressRight,
      onSubmitFilter,
      onResetFilter,
      handleChange,
      handleChangeType,
    } = this;
    let showDuration = [
      "last_30",
      "last_45",
      "last_60",
      "next_30",
      "next_45",
      "next_60",
      "this_month",
    ];
    console.log(
      allTicketData,
      "showDuration allTicketData",
      upcomingTicketData,
      expiredTicketData
    );
    let data =
      (TicketStatus === "All" && allTicketData) ||
      (TicketStatus === "Upcoming" && upcomingTicketData) ||
      (TicketStatus === "Completed" && expiredTicketData);
    console.log(data, "allTicketData11");
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
          opacity: modalVisible ? (mode === "light" ? 0.5 : 0.7) : 1,
        }}
        forceInset={{ top: "never" }}
      >
        {/* <View style={{marginTop: '-7%'}}>
          <Header
            includeFont
            showLeftIcon
            leftIcon
            showRightIcon
            title="Invite History"
            rightIcon={
              <FilterIcon
                color={
                  themes[mode][filterState ? 'primaryColor' : 'headingColor']
                }
              />
            }
            onPressRight={onPressRight}
            onPressLeftIcon
          />
        </View> */}
        <WithBgHeader
          leftIcon
          headerTitle="Feedback"
          rightIcon={
            <FilterIcon
              color={
                themes[mode][filterState ? "primaryColor" : "headingColor"]
              }
            />
          }
          onPressRightIcon={onPressRight}
          containerStyle={{
            ...commonStyles.headerSpacing,
          }}
          headerStyle={{
            backgroundColor:
              Platform.OS === "ios"
                ? modalVisible && "#ddd"
                : themes[mode]["bgColor"],
            opacity: modalVisible ? (mode === "light" ? 0.5 : 0.7) : 1,
          }}
        >
          <View
            style={{
              marginVertical: 15,
              marginLeft: 20,
            }}
          >
            <VisitorTypes
              name="TicketStatus"
              visitorType={TicketStatus}
              onChange={handleChangeType}
              tabArr={[
                {
                  label: "All",
                },
                {
                  label: "Upcoming",
                },
                {
                  label: "Completed",
                },
              ]}
              tabItemStyle={{
                borderRadius: 30,
                paddingHorizontal: 20,
                paddingVertical: 5,
                marginRight: 15,
              }}
              tabBarStyle={{
                justifyContent: "center",
              }}
            />
          </View>

          <View
            style={{
              height: 40,
              borderRadius: 10,
              paddingHorizontal: 15,
              paddingVertical: 10,
              justifyContent: "center",
              backgroundColor:
                themes[mode][mode === "light" ? "lightAsh2" : "modalWrap"],
              marginHorizontal: 35,
            }}
          >
            <TextInput
              name={"search"}
              onChangeText={this.handleSearch}
              value={this.state.search}
              style={{
                height: 40,
                borderRadius: 10,
                paddingHorizontal: 15,
                paddingVertical: 10,
                justifyContent: "center",
                backgroundColor:
                  themes[mode][mode === "light" ? "lightAsh2" : "modalWrap"],
                flexDirection: "row",
                justifyContent: "center",
                fontFamily: fonts.semiBold,
                fontSize: 16,
                color: themes[mode]["headingColor"],
                letterSpacing: 1,
                marginLeft: 15,
              }}
              placeholder={"Search here ..."}
              placeholderTextColor={"#c1c1c1"}
            ></TextInput>
            <View style={{ position: "absolute", left: 10 }}>
              <SearchIcon />
            </View>
          </View>
          <View>
            {RefreshHeader}

            {!ticketLoader ? (
              <View>
                {data?.length > 0 ? (
                  <FlatList
                    ref={flatlistRef}
                    onScroll={handleOnScroll}
                    onStartShouldSetResponder={() => {}}
                    showsVerticalScrollIndicator={false}
                    // legacyImplementation={true}
                    data={
                      this.state.search.length > 0
                        ? data.filter(
                            (Data) =>
                              Data?.name
                                ?.toLowerCase()
                                .includes(this.state.search?.toLowerCase()) ||
                              Data?.identity_id.includes(this.state.search)
                          )
                        : data
                    }
                    renderItem={({ item, index }) => {
                      console.log(item, "renderitrme");
                      return this.renderItem({
                        item: item,
                        // submitted: submitted,
                        // cancelMyInvite: cancelMyInvite,
                        // showCancelButton: showCancelButton,
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
                      paddingBottom: 250,
                      width: "100%",
                      // marginRight: 20,
                    }}
                    onEndReached={(end) => {
                      console.log(
                        page,
                        data.length,
                        page * data.length < totalEntries,
                        totalEntries,
                        end,
                        "onend reachded"
                      );
                      ticketChange({
                        name: "page",
                        // value:
                        //   myVisitorData.length > 0 &&
                        //   page * myVisitorData.length < totalEntries &&
                        //   totalEntries / 30 < page
                        //     ? page + 1
                        //     : page,
                        value:
                          page * data.length < totalEntries && data.length > 0
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
                    message="We couldn't find any invite record "
                  />
                )}
                {GestureHandler && GestureHandler}
              </View>
            ) : (
              <View
                style={{
                  ...commonStyles.headerSpacing,
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
                // closeOverlay();

                this.setState({ modalVisible: false, filterState: false });
              }}
              modalVisible={this.state.modalVisible}
              dateFilterShow={["phone", "from_date", "to_date"]}
              filteredList={TicketFilter}
              onResetFilter={this.onResetFilter}
              onSubmitFilter={this.onSubmitFilter}
              dateFilterSelect
              handleChange={this.handleChange}
              modalParams={{
                date: date,
                phone: phone,
                days: days,
              }}
              filterArr2={["date"]?.map((item) => {
                return filterMenus(showDuration)[item];
              })}
            />
          </View>
          {/* {Platform.OS === 'android' && (
            <BlurOverlay
              radius={4}
              downsampling={2}
              brightness={-255}
              onPress={() => {
                closeOverlay();
              }}
              customStyles={{alignItems: 'center', justifyContent: 'center'}}
              // blurStyle="dark"
              children={() => {
                return (
                  <View
                    style={
                      {
                        // flex: 1,
                        // justifyContent: 'center',
                        // alignItems: 'center',
                      }
                    }></View>
                );
              }}
            />
          )} */}
        </WithBgHeader>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = ({
  profile: { mode },
  feedback: {
    subTicketTypeArr,
    subTicketOrgArr,
    ticketLoader,
    allTicketData,
    upcomingTicketData,
    expiredTicketData,
    TicketStatus,
    TicketFilter,
    page,
    per_page,
    from_time,
    to_time,
    totalEntries,
    phone,
    days,
    date,
    Ticket_type,
    showCancelButton,
    TicketDetails,
  },
  login: { submitted },
}) => {
  return {
    mode,
    allTicketData,
    upcomingTicketData,
    expiredTicketData,
    TicketStatus,
    TicketFilter,
    from_time,
    to_time,
    ticketLoader,
    phone,
    date,
    days,
    per_page,
    totalEntries,
    page,
    submitted,
    showCancelButton,
  };
};

// const {
//   TicketList,
//   setTicketLoader,
//   ticketChange,
//   onClickTicket,
//   onResetFilter,

//   cancelMyInvite,
// } =feedback;

const mapDispatchToProps = {
  TicketList,
  setTicketLoader,
  ticketChange,
  onClickTicket,
  onResetFilter,
  // cancelMyInvite,
};

export default PulltoRefersh(
  connect(mapStateToProps, mapDispatchToProps)(FeedbackList)
);
