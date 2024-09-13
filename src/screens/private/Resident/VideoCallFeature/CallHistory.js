import {
  Text,
  SafeAreaView,
  StyleSheet,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { FlatList } from "react-native-gesture-handler";
import Card from "./Card";
import PulltoRefersh from "../../../../animation/Hoc/pullToRefresh";
import commonStyles from "../../../../styles/commonStyles";
import { connect } from "react-redux";
import { fonts, themes } from "../../../../themes";
import { NoDataCompSearch, WithBgHeader } from "../../../../components";
import { video } from "../../../../redux/actions";
import {
  complaintStatusExtractor,
  tailedString,
  titleize,
} from "../../../../helpers";
import {
  Calling,
  NoRecordIcon,
  PriResident,
  SecondaryCrownIcon,
  SecResident,
  VCalling,
} from "../../../../../assets/img/svgs";
import moment from "moment";
import { NotificationLoader } from "../../../../../assets/img/loader";
import { navigate } from "../../../../navigation/RootNavigation";
import { ms } from "../../../../helpers/scaling";
let onEndReachedCalledDuringMomentum;
let stopFetchMore = true;
function CallHistory(props) {
  const [entries, setEntries] = useState({
    isLoad: false,
    // total_entries: 1,
  });
  const [loadingMore, setLoadingMore] = useState(false);
  const {
    GestureHandler,
    RefreshHeader,
    handleOnScroll,
    flatlistRef,
    loadRefresh,
    total_entries,
  } = props;
  const { isLoad } = entries;
  useEffect(() => {
    console.log(total_entries, "qwertttyuiop[");
  }, [total_entries]);
  useEffect(() => {
    loadRefresh(fetchData);
  }, []);
  useEffect(() => {
    console.log("hi");
    props.callLogs(total_entries, false, true);
    return () => {
      props.reset();
    };
  }, []);
  const fetchData = () => {
    props.callLogs(total_entries, false, true);
  };
  const isLoader = (value) => {
    setLoadingMore(value);
  };
  const handleOnEndReached = () => {
    console.log(stopFetchMore, "ddddd");
    if (!stopFetchMore) {
      props.entries(total_entries);
      console.log(total_entries, "dddkdjed");
      props.callLogs(total_entries + 1, isLoader);
      stopFetchMore = true;
    }
  };
  const { mode, call_logs, loader } = props;
  console.log(call_logs?.length, "popdiwuyw", loader);
  return (
    <>
      <SafeAreaView
        style={{
          ...styles.safeArea,
          backgroundColor: themes[mode]["bgColor"],
        }}
        forceInset={{ top: "never" }}
      >
        <WithBgHeader
          headerTitle="Call History"
          leftIcon
          containerStyle={{ ...commonStyles.headerSpacing }}
        >
          <View style={styles.contentContainer}>
            {/* Pull to Refresh Section */}
            {RefreshHeader}
            {/* Blog Post Section */}
            {!loader ? (
              <View>
                {call_logs?.length > 0 ? (
                  <FlatList
                    data={call_logs}
                    ref={flatlistRef}
                    onScroll={handleOnScroll}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item) => item.id}
                    onEndReached={handleOnEndReached}
                    onEndReachedThreshold={0.01}
                    initialNumToRender={10}
                    maxToRenderPerBatch={10}
                    windowSize={7}
                    updateCellsBatchingPeriod={10}
                    scrollEventThrottle={1}
                    onScrollBeginDrag={() => {
                      console.log("fjehfekfefef", stopFetchMore);
                      stopFetchMore = false;
                    }}
                    renderItem={({ item, index }) => {
                      const {
                        forwarded_call,
                        status,
                        gate_open,
                        device_data: { name },
                        created_at,
                        resident,
                      } = item;

                      console.log(
                        `status - ${status}  indexCall - ${index + 1}`
                      );
                      console.log(
                        `gateOpen - ${gate_open} indexCall - ${index + 1}`
                      );
                      console.log(
                        `forwareded call - ${forwarded_call} indexCall - ${index +
                          1}`
                      );
                      console.log(
                        `device name - ${name} indexCall - ${index + 1}`
                      );
                      console.log(
                        `created at - ${created_at} indexCall - ${index + 1}`
                      );

                      let callStatus;
                      let permission = "Denied";
                      switch (status) {
                        case "busy":
                          if (gate_open === "accepted") {
                            callStatus = "Answered";
                            permission = "Accepted";
                          } else {
                            callStatus = "Forwarded";
                          }
                          break;
                        case "canceled":
                          callStatus = "Declined";
                          break;

                        case "declined":
                          callStatus = "Declined";
                          break;

                        case "forwarded":
                          callStatus = "Forwarded";
                          break;

                        case "failed":
                          if (
                            gate_open == "declined" ||
                            gate_open == "requested"
                          ) {
                            callStatus = "Declined";
                          } else {
                            callStatus = "Forwarded";
                          }
                          break;

                        case "answered":
                        case "success":
                          callStatus = "Answered";
                          permission =
                            gate_open == "accepted" ? "Accepted" : "Denied";
                          break;
                        case "created":
                          callStatus = "Busy";
                          break;
                      }

                     
                      console.log(
                        `callStatus - ${callStatus} permission - ${permission}  gateStatus - ${
                          permission == "accepted" ? "Granted" : "Denied"
                        } indexCall - ${index + 1}`
                      );
                      return (
                        <>
                          <TouchableOpacity
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                              paddingVertical: 15,
                              width: "100%",
                            }}
                            // onPress={showComplaintDetails}
                            onPress={() => {
                              navigate("CallDetails", {
                                data: {
                                  device_name: name,
                                  resident_name: resident.name,

                                  call_status: callStatus,
                                  gate_open:
                                    permission == "Accepted"
                                      ? "Granted"
                                      : "Denied",
                                  call_type: item.call_type,
                                  resident_variant: !forwarded_call
                                    ? "Primary"
                                    : "Secondary",
                                },
                              });
                            }}
                          >
                            <View
                              style={{ flexDirection: "row", width: "70%" }}
                            >
                              <View style={{ flexDirection: "row" }}>
                                <View
                                  style={{
                                    ...commonStyles.avatar,
                                  }}
                                >
                                  {item.call_type == "video_call" ? (
                                    <VCalling />
                                  ) : (
                                    <Calling />
                                  )}
                                </View>
                                <View
                                  style={{
                                    marginLeft: 15,
                                  }}
                                >
                                  <Text
                                    style={{
                                      ...commonStyles.semiBold_16,
                                      color: themes[mode]["headingColor"],
                                    }}
                                  >
                                    {tailedString(resident.name, 8)}{" "}
                                    <View
                                      style={{
                                        height: 5,
                                        width: 5,
                                        backgroundColor:
                                          themes[mode]["lightAsh"],
                                        borderRadius: 10,
                                      }}
                                    ></View>{" "}
                                    <Text
                                      style={{
                                        ...commonStyles.semiBold_12,
                                        color: complaintStatusExtractor(
                                          callStatus
                                        ).color,
                                      }}
                                    >
                                      {titleize(callStatus)}
                                    </Text>
                                  </Text>
                                  <Text
                                    style={{
                                      ...commonStyles.light_12,
                                      color: themes[mode]["headingColor"],
                                      marginVertical: 5,
                                    }}
                                  >
                                    {permission == "Accepted"
                                      ? "Permission Granted"
                                      : "Permission Denied"}{" "}
                                  </Text>
                                </View>
                              </View>
                            </View>
                            <View
                              style={{
                                ...commonStyles.listRightSideColumnAlign,
                                position: "absolute",
                                top: 19,
                                right: 0,
                              }}
                            >
                              <Text
                                style={{
                                   ...commonStyles.medium_16,
                            
                                  color: themes[mode]["headingColor"],
                                  fontSize:ms(10),
                                }}
                              >
                                {moment(created_at).format("MMM DD YY, h:mm a")}
                              </Text>
                              <View style={{ marginTop: 5 }}>
                                {!forwarded_call ? (
                                  <PriResident />
                                ) : (
                                  <Image
                                    source={require("../../../../../assets/img/sec_crown.png")}
                                    style={{ height: ms(15), width: ms(20) }}
                                  />
                                )}
                              </View>
                            </View>
                          </TouchableOpacity>
                        </>
                      );
                    }}
                    ListFooterComponent={() => {
                      return (
                        <View
                          style={{
                            padding: 10,
                            justifyContent: "center",
                            alignItems: "center",
                            flexDirection: "row",
                          }}
                        >
                          {loadingMore && (
                            <ActivityIndicator
                              color="#FFC727"
                              style={{ margin: 15 }}
                            />
                          )}
                        </View>
                      );
                    }}
                  />
                ) : (
                  <NoDataCompSearch
                    icon={<NoRecordIcon />}
                    text="No Record Found"
                    message="We couldn't find any call record "
                  />
                )}
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

            {GestureHandler && GestureHandler}
          </View>
        </WithBgHeader>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  catagory: {
    marginRight: 20,
    fontWeight: "bold",
  },
  active: {
    width: 70,
    height: 2,
    backgroundColor: "black",
    marginBottom: 20,
  },
  catagoryContainer: { flexDirection: "row", marginBottom: 5, marginTop: 30 },
  lottieAnim: {
    width: 100,
    height: 100,
    backgroundColor: "white",
    position: "absolute",
    left: -8,
    top: -8,
  },
  gesture: {
    position: "absolute",
    top: 0,
    left: 0,
    height: 200,
    width: "100%",
    // backgroundColor: 'green',
    zIndex: 99999,
  },
  lottieView: {
    width: 80,
    height: 80,
    backgroundColor: "transparent",
    marginTop: -15,
  },
  pullToRefreshArea: {
    height: 140,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    overflow: "hidden",
  },
  customStatusBar: { height: 40, backgroundColor: "#E0144C" },
  contentContainer: { flex: 1, marginHorizontal: 15, marginVertical: 15 },
  center: { justifyContent: "center", alignItems: "center" },
});

const mapStateToProps = ({
  profile: { mode },
  video: { call_logs, total_entries, loader },
}) => {
  return {
    mode,
    call_logs,
    total_entries,
    loader,
  };
};
const { callLogs, entries, reset } = video;
const mapDispatchToProps = {
  callLogs,
  entries,
  reset,
};
export default PulltoRefersh(
  connect(mapStateToProps, mapDispatchToProps)(CallHistory)
);
