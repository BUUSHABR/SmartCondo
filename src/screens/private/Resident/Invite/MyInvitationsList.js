import React, { Component, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  TextInput,
  useWindowDimensions,
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
import { TabBar, TabView } from "react-native-tab-view";
import { ActivityIndicator } from "react-native";

showInvite = (item) => {
  RootNavigation.navigate("MyInvitationsDetails", {
    data: {
      type_id: item.id,
      isInvite: true,
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
  const mode = detectTheme();
  const { invitees, invitor, purpose, remarks, state, visiting_time } = item;
  console.log(invitees, "invite list state");
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
              ...commonStyles.light_12,
              marginVertical: 10,
              color: themes[mode]["headingColor"],
            }}
          >
            {customTimeFunction(visiting_time)}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const renderFooter = (isloading) => {
  return (
    // Footer View with Loader
    <View
      style={{
        padding: 10,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
      }}
    >
      {isloading && (
        <ActivityIndicator color="#FFC727" style={{ margin: 15 }} />
      )}
    </View>
  );
};

const RenderFlatList = ({
  list,
  submitted,
  showCancelButton,
  cancelMyInvite,
  fetch,
  isloading,
}) => {
  let onEndReachedCalledDuringMomentum;
  console.log(list.length, isloading, "RendertFlatlist booking list");

  return (
    <View>
      {!isloading ? (
        <View>
          <FlatList
            windowSize={7}
            updateCellsBatchingPeriod={3}
            showsVerticalScrollIndicator={false}
            data={list}
            initialNumToRender={2}
            maxToRenderPerBatch={2}
            onEndReachedThreshold={0.01}
            onMomentumScrollBegin={() => {
              onEndReachedCalledDuringMomentum = false;
            }}
            onEndReached={(info) => {
              console.log("onEndReached Booking list before route ", info);
              if (!onEndReachedCalledDuringMomentum) {
                fetch();
                onEndReachedCalledDuringMomentum = true;
              }
            }}
            scrollEventThrottle={1}
            renderItem={({ item, index }) => {
              return renderItem({
                item: item,
                submitted: submitted,
                cancelMyInvite: cancelMyInvite,
                showCancelButton: showCancelButton,
                index,
              });
            }}
            ListFooterComponent={() => renderFooter(isloading)}
            ListEmptyComponent={() => (
              <NoDataCompSearch
                icon={<NoRecordIcon />}
                text="No Record Found"
                message="We couldn't find any invite record "
              />
            )}
            keyExtractor={(item, index) => item.id + index}
            style={{
              marginTop: "10%",
              // zIndex: 10001,
              marginHorizontal: 20,
            }}
            contentContainerStyle={{
              flexGrow: 1,
              paddingBottom: "70%",
            }}
          />
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
    </View>
  );
};

const FirstRoute = React.memo((listProps) => <RenderFlatList {...listProps} />);
const SecondRoute = React.memo((listProps) => (
  <RenderFlatList {...listProps} />
));

function MyInvitationsList(props) {
  const mode = detectTheme();
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "first", title: "Upcoming" },
    { key: "second", title: "Completed" },
  ]);

  useEffect(() => {
    fetchBefore(true);
    fetchAfter(true);
  }, []);

  const fetchBefore = (isFirstFetch) => {
    props.fetchInviteList({
      name: "inviteBeforeData",
      pageName: "inviteBeforePage",
      loaderName: "inviteBeforeLoading",
      page: props.inviteBeforePage,
      isFirstFetch: isFirstFetch,
    });
  };
  const fetchAfter = (isFirstFetch) => {
    props.fetchInviteList({
      name: "inviteAfterData",
      pageName: "inviteAfterPage",
      loaderName: "inviteAfterLoading",
      page: props.inviteAfterPage,
      isFirstFetch: isFirstFetch,
    });
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: themes[mode]["bgColor"],
      }}
      forceInset={{ top: "never" }}
    >
      <WithBgHeader
        leftIcon
        headerTitle="Invitation"
        containerStyle={{
          ...commonStyles.headerSpacing,
        }}
        headerStyle={{
          backgroundColor: themes[mode]["bgColor"],
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
                    list={props.inviteAfterData}
                    submitted={props.submitted}
                    cancelMyInvite={cancelMyInvite}
                    showCancelButton={props.showCancelButton}
                    index={index}
                    fetch={fetchAfter}
                    isloading={props.loading}
                    page={props.inviteAfterPage}
                  />
                );
              case "second":
                return (
                  <SecondRoute
                    list={props.inviteBeforeData}
                    submitted={props.submitted}
                    cancelMyInvite={cancelMyInvite}
                    showCancelButton={props.showCancelButton}
                    facilitiesLoader={props?.facilitiesLoader}
                    fetch={fetchBefore}
                    isloading={props.loading}
                    page={props.inviteBeforePage}
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
    inviteBeforeData,
    inviteAfterData,
    inviteAfterPage,
    inviteBeforePage,
    inviteAfterLoading,
    inviteBeforeLoading,
    loading
  },
  login: { submitted },
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
    inviteBeforeData,
    inviteAfterData,
    inviteAfterPage,
    inviteBeforePage,
    inviteAfterLoading,
    inviteBeforeLoading,
    loading
  };
};

const {
  listMyInvitationsData,
  setInviteLoader,
  inviteChange,
  onClickInvite,
  onResetFilter,

  cancelMyInvite,
  fetchInviteList,
} = invite;

const mapDispatchToProps = {
  listMyInvitationsData,
  setInviteLoader,
  inviteChange,
  onClickInvite,
  onResetFilter,
  cancelMyInvite,
  fetchInviteList,
};

export default PulltoRefersh(
  connect(mapStateToProps, mapDispatchToProps)(MyInvitationsList)
);
