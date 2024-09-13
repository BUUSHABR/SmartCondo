import React, { Component, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Platform,
  Image,
  useWindowDimensions,
} from "react-native";
import SafeAreaView from "react-native-safe-area-view";
import { connect } from "react-redux";
import { home } from "../../../../redux/actions";
import * as RootNavigation from "../../../../navigation/RootNavigation";
import { themes } from "../../../../themes";
import { fetchAnnouncement } from "../../../../api/home";
import moment from "moment";
import {
  detectTheme,
  tailedString,
  customTimeFunction,
  imageExtractor,
  complaintStatusExtractor,
  filterMenus,
} from "../../../../helpers";
import VisitorTypes from "../../../../components/VisitorsType";
import { invite, myVisitor } from "../../../../redux/actions";
import {
  CustomModal,
  NoDataCompSearch,
  WithBgHeader,
} from "../../../../components";

import { FilterIcon, NoRecordIcon } from "../../../../../assets/img/svgs";
import { NotificationLoader } from "../../../../../assets/img/loader";
import commonStyles from "../../../../styles/commonStyles";
import { SceneMap, TabView, TabBar } from "react-native-tab-view";
import { ms } from "../../../../helpers/scaling";

showInvite = (item) => {
  RootNavigation.navigate("MyInvitationsDetails", {
    data: {
      type_id: item.id,
    },
  });
};

export const renderItem = ({ item, submitted, navigation }) => {
  const mode = detectTheme();
  const { title } = item;
  console.log(item, "announcementlist");
  const data = {
    type_id: item.id,
  };
  var time = moment(item.created_at).format("MMM YY");
  return (
    <TouchableOpacity
      style={{
        ...commonStyles.spaceBtwnAlign,
        marginVertical: Platform.OS === "android" ? 5 : 12,
        paddingRight: 10,
        // marginTop:15,
        paddingHorizontal: 10,
      }}
      onPress={() => navigation.navigate("AnnouncementDetail", { data })}
    >
      <View
        style={{
          flexDirection: "row",

          // maxWidth: '85%',
          marginTop: 10,
          // paddingHorizontal:10
        }}
      >
        <View
          style={
            {
              // marginTop:4,
            }
          }
        >
          <Image
            style={{
              height: ms(35),
              width: ms(35),
            }}
            source={require("../../../../../assets/img/megaphone.png")}
          ></Image>
        </View>
        <View
          style={{
            marginLeft: 15,
            // maxWidth: '50%',
            width: "80%",
            // maxWidth: '60%',
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <View style={{ width: "80%" }}>
              <Text
                style={{
                  ...commonStyles.semiBold_14,
                  color: themes[mode]["headingColor"],
                }}
              >
                {item.title}
              </Text>
            </View>
            <View
              style={{
                ...commonStyles.listRightSideColumnAlign,
              }}
            >
              <View
                style={{
                  ...commonStyles.statusWrapper,
                  // backgroundColor:"#C5E7F4",
                }}
              >
                <Text
                  style={{
                    color: "#989898",
                    fontSize:ms(13)
                  }}
                >
                  {time}
                </Text>
              </View>
              {/* <Text
          style={{
            ...commonStyles.light_12,
            marginVertical: 10,
            color: themes[mode]['headingColor'],
          }}>
          {customTimeFunction(visiting_time)}
        </Text> */}
            </View>
          </View>
          <View style={{ width: "85%" }}>
            <Text
              style={{
                ...commonStyles.light_14,
                color: themes[mode]["headingColor"],
                // marginVertical: 10,
                lineHeight: ms(23),
              }}
            >
              {tailedString(item.message, 40)}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
const FirstRoute = React.memo(({ announcementlist, submitted, navigation }) => (
  <View>
    {announcementlist?.loader ? (
      <View
        style={{
          ...commonStyles.headerSpacing,
          marginTop: "2%",
        }}
      >
        {[1, 2, 3, 4, 5, 6]?.map((item) => {
          return <NotificationLoader />;
        })}
      </View>
    ) : (
      <View>
        {announcementlist?.announceData?.length > 0 ? (
          <FlatList
            onStartShouldSetResponder={() => {}}
            showsVerticalScrollIndicator={false}
            // legacyImplementation={true}
            data={announcementlist?.announceData}
            renderItem={({ item }) => {
              console.log(item, "renderitrme");
              return renderItem({
                item: item,
                submitted: submitted,
                navigation: navigation,
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
              width: "100%",
              // marginRight: 20,
            }}
            onEndReachedThreshold={0.5}
          />
        ) : (
          <NoDataCompSearch
            icon={<NoRecordIcon />}
            text="No Record Found"
            message="We couldn't find any announcement record "
          />
        )}
      </View>
    )}
  </View>
));

const SecondRoute = React.memo(
  ({ announcementlist, submitted, navigation }) => (
    <View>
      {announcementlist?.loader ? (
        <View
          style={{
            ...commonStyles.headerSpacing,
            marginTop: "2%",
          }}
        >
          {[1, 2, 3, 4, 5, 6]?.map((item) => {
            return <NotificationLoader />;
          })}
        </View>
      ) : (
        <View>
          {announcementlist?.announceData?.length > 0 ? (
            <FlatList
              onStartShouldSetResponder={() => {}}
              showsVerticalScrollIndicator={false}
              // legacyImplementation={true}
              data={announcementlist?.announceData}
              renderItem={({ item }) => {
                console.log(item, "renderitrme");
                return renderItem({
                  item: item,
                  submitted: submitted,
                  navigation: navigation,
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
                width: "100%",
                // marginRight: 20,
              }}
              onEndReachedThreshold={0.5}
            />
          ) : (
            <NoDataCompSearch
              icon={<NoRecordIcon />}
              text="No Record Found"
              message="We couldn't find any announcement record "
            />
          )}
        </View>
      )}
    </View>
  )
);

function MyAnnouncementList(props) {
  const mode = detectTheme();
  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "first", title: "Live" },
    { key: "second", title: "Expired" },
  ]);
  const [announcementlist, setAnnouncementList] = useState({
    modalVisible: false,
    filterState: false,
    announceData: [],
    loader: true,
  });
  const [announcementlist2, setAnnouncementList2] = useState({
    modalVisible: false,
    filterState: false,
    announceData: [],
    loader: true,
  });

  useEffect(() => {
    fetchAnnouncement("delivered").then((data) => {
      setHomeLoader(true);
      setAnnouncementList({
        ...announcementlist,
        announceData: data.data,
        loader: false,
      });
    });
    fetchAnnouncement("expired").then((data) => {
      setHomeLoader(true);
      setAnnouncementList2({
        ...announcementlist2,
        announceData: data.data,
        loader: false,
      });
    });
  }, []);

  const {
    announcementLoader,

    navigation,
    visitor_type,
    submitted,
  } = props;
  const { modalVisible, filterState } = announcementlist;
  const { onPressRight } = this;
  console.log(announcementLoader, "announcementLoader");
  //   alert(JSON.stringify(this.state.announceData))

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
        headerTitle="Announcements"
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
        <TabView
          lazy
          navigationState={{ index, routes }}
          renderScene={({ route }) => {
            switch (route.key) {
              case "first":
                return (
                  <FirstRoute
                    announcementlist={announcementlist}
                    submitted={submitted}
                    navigation={navigation}
                  />
                );
              case "second":
                return (
                  <SecondRoute
                    announcementlist={announcementlist2}
                    submitted={submitted}
                    navigation={navigation}
                  />
                );
              default:
                return null;
            }
          }}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
          renderTabBar={(props) => (
            <TabBar
              {...props}
              activeColor={themes[mode]["primaryColor"]}
              indicatorStyle={{ backgroundColor: themes[mode]["primaryColor"] }} // Change indicator (the line beneath the active tab) color
              style={{ backgroundColor: themes[mode]["bgColor"] }} // Change background color of the tab bar
              labelStyle={{
                ...commonStyles.semiBold_16,
                color: themes[mode]["headingColor"],
              }}
            />
          )}
        />

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

const mapStateToProps = ({
  profile: { mode },
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
  },
  login: { submitted },
  home: { announcements, announcementLoader },
}) => {
  return {
    mode,
    allInviteData,
    upcomingInviteData,
    expiredInviteData,
    inviteStatus,
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
    announcements,
    announcementLoader,
  };
};
const { listHomeFunction, setHomeLoader } = home;
const {
  listMyInvitationsData,
  setInviteLoader,
  inviteChange,
  onClickInvite,
  onResetFilter,

  cancelMyInvite,
} = invite;
const {
  onVisitorChange,
  listMyVisitorsData,
  setVisitorLoader,
  setPhoneAggr,
} = myVisitor;
const mapDispatchToProps = {
  listMyInvitationsData,
  setInviteLoader,
  inviteChange,
  onClickInvite,
  onResetFilter,
  cancelMyInvite,
  listHomeFunction,
  listMyVisitorsData,
  setHomeLoader,
};

export default connect(mapStateToProps, mapDispatchToProps)(MyAnnouncementList);
