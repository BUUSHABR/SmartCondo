import React, { Component } from "react";
import { Text, ScrollView, View, TouchableOpacity } from "react-native";
import { myInviteList } from "../../../../api/invite";
import moment from "moment";
import { connect } from "react-redux";
import SafeAreaView from "react-native-safe-area-view";
// import { renderItem } from '../MyVisitors/MyVisitorsList';
import { NoVisitor } from "../../../../../assets/img/svgs";
import { themes, fonts, commonColors } from "../../../../themes";
import { invite } from "../../../../redux/actions";
import { InviteType, CovidInstructions } from "../Invite/InviteType";
import { WithBgHeader } from "../../../../components";
import styles from "../../../../styles/home";
import commonStyles from "../../../../styles/commonStyles";
import { NotificationLoader } from "../../../../../assets/img/loader";
import { home } from "../../../../redux/actions";
import {
  complaintStatusExtractor,
  detectTheme,
  tailedString,
  customTimeFunction,
  imageExtractor,
  filterMenus,
  findMinMaxDateFromSelectedFilter,
  dateCalculate,
  capitalize,
} from "../../../../helpers";
import {
  TourGuideProvider, // Main provider
  TourGuideZone, // Main wrapper of highlight component
  TourGuideZoneByPosition, // Component to use mask on overlay (ie, position absolute)
  useTourGuideController, // hook to start, etc.
} from "rn-tourguide";
// import RootNavigation from "../../../../navigation/RootNavigation";
// import * as RootNavigation from "../../navigation/RootNavigation";

import { customAnimation } from "../../../../animation/CommonAnimation";
import Animated from "react-native-reanimated";
import { navigate } from "../../../../navigation/RootNavigation";
import { ms } from "../../../../helpers/scaling";
import Share from "react-native-share";
import { Platform } from "react-native";

showInvite = (item) => {
  navigate;
  navigate("MyInvitationsDetails", {
    data: {
      type_id: item.id,
    },
  });
};
export const renderItem = ({
  item,
  submitted,
  cancelMyInvite,
  showCancelButton,
  index,
}) => {
  // alert("redercal");

  const mode = detectTheme();
  const {
    invitees,
    invitor,
    purpose,
    remarks,
    state,
    visiting_time,
    phone,
  } = item;
  console.log(item, "invite list state");
  var time = customTimeFunction(visiting_time);
  return (
    <Animated.View {...customAnimation("FadeInRight", 700, 50, index)}>
      <TouchableOpacity
        style={{
          ...commonStyles.spaceBtwnAlign,
          marginVertical: Platform.OS === "android" ? 10 : 12,
          paddingRight: 10,
        }}
        onPress={() =>
          showInvite(item, submitted, cancelMyInvite, showCancelButton)
        }
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
            {imageExtractor(purpose)}
          </View>
          <View
            style={{
              marginLeft: 10,
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
              {tailedString(invitees?.[0].name, 30)}
            </Text>
            <Text
              style={{
                ...commonStyles.light_14,
                color: themes[mode]["headingColor"],
                marginVertical: 10,
              }}
            >
              {tailedString(invitees?.[0].phone, 30)}
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
              backgroundColor: complaintStatusExtractor(state).bgColor,
            }}
          >
            <Text
              style={{
                ...commonStyles.semiBold_12,
                color: complaintStatusExtractor(state).color,
              }}
            >
              {state}
            </Text>
          </View>
          <Text
            style={{
              fontFamily: fonts.light,
              color: themes[mode]["headingColor"],
              fontSize: 10,
            }}
          >
           {time}
          </Text>
          {/* <Text
          style={{
            ...commonStyles.light_12,
            marginVertical: 10,
            color: themes[mode]['headingColor'],
          }}>
          {customTimeFunction(visiting_time)}
        </Text> */}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

class InviteHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scrollX: new Animated.Value(0),
      flatData: {},
      flatstatus: true,
    };
  }
  componentDidMount() {
    const { navigation, initialVisitorInvite, recentVisitor,inviteResetData } = this.props;
    recentVisitor();

    this.focusListener = navigation.addListener("focus", () => {
      recentVisitor();
      inviteResetData();
      initialVisitorInvite();
      Promise.resolve(this.loadData())
      .then(() => {
        const { share } = this.props.route.params || {};
        console.log('Screen focused with share:', share, this.props.route.params);
        if (share && Platform.OS == "ios") {
          this.handleShare(share);
        }
      })
      .catch((error) => {
        console.error('Error loading data:', error);
        // Handle error gracefully
      });
    });
    this.focusListener = navigation.addListener("blur", () => {
      this.setState({ flatData: [], flatstatus: true });
      navigation.setParams({ share: null });
    });
  }
  handleShare=async(share)=>{
    try{
      console.log("tryuinghbijh")
    Share.open({ message: share })
    .then((res) => {
      console.log("lsdksd",res);
    })
    .catch((err) => {
      err && console.log("llop",err);
    });
  }catch{
    console.log("not able to do it")
  }
  }
  loadData = (blur) => {
    let page = 1;
    let per_page = 30;
    const params = {
      page,
      per_page,
      purpose: ["All"],
      state: "Upcoming",
      from_time: dateCalculate(
        findMinMaxDateFromSelectedFilter(["this_month"]).from_date
      ).from_time,
      to_time: dateCalculate(
        findMinMaxDateFromSelectedFilter(["this_month"]).to_date
      ).to_time,
    };
    // alert(JSON.stringify(params))
    console.log(params, "sljkjkjskjskj");
    myInviteList({ params })
      .then((data) => {
        console.log(data, "sljkjkjsddddkjskj");
        if (blur != "blur") {
          if (data.data.length == 0) {
            console.log(data.data.length, "akiiakkiikaiiikaiiii");

            this.setState({ flatstatus: false });
          }
          //  alert(JSON.stringify(data.data))
          let fdata = [];
          data.data?.map((item) => {
            fdata.push(item);
            // alert(JSON.stringify(item))
            this.setState({ flatData: fdata, flatstatus: false });
            // alert(JSON.stringify(this.state.flatData))
          });

          console.log(data, "jdgyjad");
        } else {
          this.setState({ flatData: [], flatstatus: true });
        }
      })
      .catch((err) => {
        console.log(err, "list myvisitor data");
      });
  };
  handleChange = ({ name, value }) => {
    const { inviteChange, navigation, setSubvisitorList } = this.props;
    inviteChange({ name, value });
    navigation.navigate("VisitorForm");
    setSubvisitorList();
  };
  render() {
    const {
      mode,
      invite,
      navigation,
      upcomingInvites,
      upcomingLoader,
      upcomingInviteData,
      inviteStatus,
      submitted,
      showCancelButton,
      allInviteData,
      expiredInviteData,
      inviteLoader,
    } = this.props;
    console.log(upcomingLoader, "upcomingLoader");
    const { covidData, inviteeData } = invite;
    const { purpose } = inviteeData;
    console.log(purpose, "dkkkjdkjkjd");
    const { handleChange } = this;
    const { scrollX } = this.state;
    let data = this.state.flatData;
    console.log(data, "dkkkjdkjkjddddddddddd");

    return (
      <SafeAreaView
        style={{
          flex: 1,
          height: "100%",
          backgroundColor: themes[mode]["bgColor"],
        }}
        forceInset={{ top: "never" }}
      >
        <WithBgHeader
          marginRight={60}
          headerTitle="Invitation"
          // rightText="?"
          onPressRightIcon={() => {
            RootNavigation.navigate("MyInvitationsList");
          }}
          containerStyle={{
            ...commonStyles.headerSpacing,
          }}
          leftTextStyle={{
            minWidth: 60,
          }}
        >
          <Text
            style={{
              fontFamily: fonts.light,
              fontSize: ms(18),
              color: themes[mode]["textColor"],
              textAlign: "center",
            }}
          >
            Select your type of visitor
          </Text>
          <ScrollView
            contentContainerStyle={{
              paddingBottom: 50,
            }}
            style={{
              flex: 1,
              height: "100%",
            }}
            showsVerticalScrollIndicator={false}
          >
            {/* <TourGuideZone
              zone={5}
              text={"A# ldlldll dldlldld dlldlld 🎉"}
              borderRadius={16}
              style={{ padding: 10,height:300 }}
              > */}
            <InviteType purpose={purpose.value} onChange={handleChange} />
            {/* </TourGuideZone> */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 10,
                paddingHorizontal: 20,
                marginLeft: 5,
              }}
            >
              <View>
                <Text
                  style={{
                    ...styles.covid,
                    color: commonColors.yellowColor,
                  }}
                >
                  Upcoming
                </Text>
                <Text
                  style={{
                    ...styles.prevent,
                    color: themes[mode]["headingColor"],
                  }}
                >
                  Invite
                </Text>
              </View>
              <TouchableOpacity
                style={{ marginRight: 7 }}
                onPress={() => {
                  navigation.navigate("MyInvitationsList");
                }}
              >
                <Text
                  style={{
                    ...styles.covid,
                    color: "#989898",
                  }}
                >
                  View All
                </Text>
              </TouchableOpacity>
            </View>
            {this.state.flatstatus ? (
              <View style={{ marginBottom: 10, paddingHorizontal: 25 }}>
                {[1, 2, 3]?.map((item) => {
                  return <NotificationLoader />;
                })}
              </View>
            ) : (
              <View style={{ ...styles.block4 }}>
                {data?.length > 0 ? (
                  <CovidInstructions
                    renderItemData={({ item, index }) => {
                      // console.log(item, "flatitem");
                      return renderItem({
                        item: item,
                        submitted: submitted,
                        cancelMyInvite: cancelMyInvite,
                        showCancelButton: showCancelButton,
                        index,
                      });
                      // return <Text>hhhhhhhhhhhhhhhhh</Text>;
                    }}
                    features={data.slice(0, 5)}
                  />
                ) : (
                  // <FlatList
                  //   onStartShouldSetResponder={() => {}}
                  //   showsVerticalScrollIndicator={false}
                  //   data={upcomingInvites}
                  //   ItemSeparatorComponent={() => {
                  //     return (
                  //       <View
                  //         style={{
                  //           ...styles.seperatorLine,
                  //           borderColor: themes[mode]["bottom"],
                  //         }}
                  //       />
                  //     );
                  //   }}
                  //   renderItem={({ item, index }) => {
                  //     return renderItem({
                  //       item: item,
                  //       navigation: navigation,
                  //       index,
                  //     });
                  //   }}
                  //   keyExtractor={(item) => item.id}
                  //   style={styles.visitorStyle}
                  //   contentContainerStyle={styles.visitorContainerStyle}
                  // />
                  <View style={styles.noEntryAlign}>
                    <NoVisitor opacity={0.8}   />
                    <Text style={styles.noVisitText}>
                      You don’t have any upcoming invites
                    </Text>
                  </View>
                  // </TourGuideZone>
                )}
              </View>
            )}
          </ScrollView>
        </WithBgHeader>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = ({
  profile: { mode },
  invite,
  invite: {
    allInviteData,
    upcomingInviteData,
    expiredInviteData,
    inviteStatus,
    invitesFilter,
    from_time,
    to_time,
    inviteLoader,
    date,
    phone,
    days,
    per_page,
    totalEntries,
    page,
    visitor_type,
    showCancelButton,
    submitted,
    inviteDetails,
  },
  home: { upcomingInvites, announcements, announcementLoader, upcomingLoader },
}) => {
  return {
    mode,
    invite,
    upcomingInvites,
    upcomingLoader,
    upcomingInviteData,
    inviteStatus,
    allInviteData,
    expiredInviteData,
    invitesFilter,
    from_time,
    to_time,
    inviteLoader,
    phone,
    date,
    days,
    per_page,
    totalEntries,
    page,
    visitor_type,
    submitted,
    showCancelButton,
  };
};

const { listHomeFunction, recentVisitor } = home;
const {
  inviteChange,
  initialVisitorInvite,
  setSubvisitorList,
  listMyInvitationsData,
  setInviteLoader,
  onClickInvite,
  onResetFilter,
  cancelMyInvite,
  inviteResetData
} = invite;

const mapDispatchToProps = {
  inviteChange,
  initialVisitorInvite,
  setSubvisitorList,
  listMyInvitationsData,
  setInviteLoader,
  onClickInvite,
  onResetFilter,
  cancelMyInvite,
  listHomeFunction,
  recentVisitor,
  inviteResetData
};
export default connect(mapStateToProps, mapDispatchToProps)(InviteHome);
