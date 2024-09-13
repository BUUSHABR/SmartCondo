import React, { useEffect } from "react";
import PulltoRefersh from "../../../../animation/Hoc/pullToRefresh";
import {
  View,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  ActivityIndicator,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { connect } from "react-redux";
import * as RootNavigation from "../../../../navigation/RootNavigation";
import { themes } from "../../../../themes";
import {
  detectTheme,
  tailedString,
  imageExtractor,
  complaintStatusExtractor,
  timeDiff,
} from "../../../../helpers";
import SafeAreaView from "react-native-safe-area-view";
import { NoRecordIcon } from "../../../../../assets/img/svgs";
import { invite, facility } from "../../../../redux/actions";
import { NoDataCompSearch, WithBgHeader } from "../../../../components";
import { NotificationLoader } from "../../../../../assets/img/loader";
import commonStyles from "../../../../styles/commonStyles";
import moment from "moment";
import Animated from "react-native-reanimated";
import { customAnimation } from "../../../../animation/CommonAnimation";
import { TabBar, TabView } from "react-native-tab-view";
import { fetchConfigs } from "../../../../api/home";

const showFacility = (
  item,
  submitted,
  cancelBooking,
  showCancelButton,
  web_ui
) => {
  console.log(item, submitted, cancelBooking, "iteemmmmmmmsssss");
  RootNavigation.navigate("MyBookingsDetails", {
    data: {
      type_id: item?.id,
      item,
      submitted,
      action: cancelBooking,
      showCancelButton,
      share: true,
      web_ui,
    },
  });
};

export const renderItem = ({
  item,
  submitted,
  cancelBooking,
  showCancelButton,
  index,
  web_ui,
}) => {
  const mode = detectTheme();
  const {
    facility: { name, open_time, close_time },
    from_time,
    to_time,
    status,
  } = item;
  let showTimeDiff = (period) => {
    return timeDiff(
      moment(from_time).format(),
      moment(to_time).format(),
      "hours"
    );
  };

  console.log(item, showTimeDiff().replace(/[^0-9]/g, ""), "listttt");
  return (
    <Animated.View {...customAnimation("FadeInRight", 700, 50, index)}>
      <TouchableOpacity
        style={{
          ...commonStyles.spaceBtwnAlign,
          marginVertical: 13,
        }}
        onPress={() =>
          showFacility(item, submitted, cancelBooking, showCancelButton, web_ui)
        }
      >
        <View style={{ flexDirection: "row" }}>
          <View
            style={{
              ...commonStyles.avatar,
            }}
          >
            {imageExtractor(name)}
          </View>
          <View style={{ marginLeft: 15 }}>
            <Text
              style={{
                ...commonStyles.semiBold_14,
                color: themes[mode]["headingColor"],
              }}
            >
              {tailedString(name, 30)}
            </Text>
            {item?.court ? (
              <Text
                style={{
                  ...commonStyles.light_14,
                  color: themes[mode]["headingColor"],
                  marginVertical: 5,
                }}
              >
                {tailedString("--")}
              </Text>
            ) : null}
            <View style={{ flexDirection: "row", marginVertical: 10 }}>
              <Text
                style={{
                  ...commonStyles.light_12,
                  color: themes[mode]["headingColor"],
                }}
              >
                {`${moment(from_time).format("hh:mm a")} - `}
              </Text>
              <Text
                style={{
                  ...commonStyles.light_12,
                  color: themes[mode]["headingColor"],
                }}
              >
                {`${moment(to_time).format("hh:mm a")} `}
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{
            ...commonStyles.listRightSideColumnAlign,
            // justifyContent: 'flex-start',
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
              {status == "Payment Initiated" ? "Payment Pending" : status}
            </Text>
          </View>
          <Text
            style={{
              ...commonStyles.light_12,
              marginVertical: 10,
              color: themes[mode]["headingColor"],
            }}
          >
            {moment(from_time).format("DD MMM YYYY")}
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
  cancelBooking,
  fetch,
  isloading,
  web_ui,
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
                cancelBooking: cancelBooking,
                showCancelButton: showCancelButton,
                index,
                web_ui,
              });
            }}
            ListFooterComponent={() => renderFooter(isloading)}
            ListEmptyComponent={() => (
              <NoDataCompSearch
                icon={<NoRecordIcon />}
                text="No Record Found"
                message="We couldn't find any bookings"
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

function MyBookingsList(props) {
  const mode = detectTheme();
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);
  const [serviceUrl, setServiceUrl] = React.useState("");
  const [routes] = React.useState([
    { key: "first", title: "Upcoming" },
    { key: "second", title: "Completed" },
  ]);

  useEffect(() => {
    fetchBefore(true);
    fetchAfter(true);
    fetchConfigs()
      .then(async ({ data }) => {
        console.log(data, "data strip ");
        setServiceUrl(data?.condo_config?.service_ui);
      })
      .catch((err) => {
        console.log(err, "kkk");
      });

    return () => {
      console.log(data, "unmount facility booking list ");
    };
  }, []);
  const fetchBefore = (isFirstFetch) => {
    props.fetchBookingsList({
      name: "bookingBeforeData",
      pageName: "bookingBeforePage",
      loaderName: "bookingBeforeLoading",
      page: props.bookingBeforePage,
      isFirstFetch: isFirstFetch,
    });
  };
  const fetchAfter = (isFirstFetch) => {
    props.fetchBookingsList({
      name: "bookingAfterData",
      pageName: "bookingAfterPage",
      loaderName: "bookingAfterLoading",
      page: props.bookingAfterPage,
      isFirstFetch: isFirstFetch,
    });
  };

  console.log(props.bookingBeforeData, "props.bookingBeforeData");
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
        headerTitle="My Booking"
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
                    list={props.bookingAfterData}
                    submitted={props.submitted}
                    cancelBooking={cancelBooking}
                    showCancelButton={props.showCancelButton}
                    index={index}
                    fetch={fetchAfter}
                    isloading={props.loading}
                    page={props.bookingAfterPage}
                    web_ui={serviceUrl}
                  />
                );
              case "second":
                return (
                  <SecondRoute
                    list={props.bookingBeforeData}
                    submitted={props.submitted}
                    cancelBooking={cancelBooking}
                    showCancelButton={props.showCancelButton}
                    facilitiesLoader={props?.facilitiesLoader}
                    fetch={fetchBefore}
                    isloading={props.loading}
                    page={props.bookingBeforePage}
                    web_ui={serviceUrl}
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
  facility: {
    loading,
    facilitiesTypesList,
    facilitiesLoader,
    date,
    days,
    facilities_type,
    facilityStatus,
    facilitiesFilterArr,
    showCancelButton,
    allFacilityList,
    upcomingFacilityList,
    completedFacilityList,
    closedFacilityList,
    from_time,
    bookingBeforeData,
    bookingAfterData,
    bookingAfterPage,
    bookingBeforePage,
    bookingAfterLoading,
    bookingBeforeLoading,
    to_time,
  },
  login: { submitted },
}) => {
  return {
    loading,
    mode,
    facilitiesTypesList,
    facilitiesLoader,
    date,
    days,
    facilities_type,
    facilityStatus,
    facilitiesFilterArr,
    showCancelButton,
    submitted,
    allFacilityList,
    upcomingFacilityList,
    completedFacilityList,
    closedFacilityList,
    from_time,
    to_time,
    bookingBeforeData,
    bookingAfterData,
    bookingAfterPage,
    bookingBeforePage,
    bookingAfterLoading,
    bookingBeforeLoading,
  };
};

const {
  fetchBookingsList,
  facilityChange,
  onClickFacilities,
  cancelBooking,
  BookingAggregation,
} = facility;
const { setInviteLoader } = invite;

const mapDispatchToProps = {
  fetchBookingsList,
  facilityChange,
  onClickFacilities,
  cancelBooking,
  setInviteLoader,
  BookingAggregation,
};

export default PulltoRefersh(
  connect(mapStateToProps, mapDispatchToProps)(MyBookingsList)
);
