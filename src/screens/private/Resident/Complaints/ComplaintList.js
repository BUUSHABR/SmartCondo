import React, { Component } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  RefreshControl,
  StyleSheet,
  BackHandler,
} from "react-native";
import { themes, fonts } from "../../../../themes";
import { HeaderOnly } from "../../../../components/Header";
import SafeAreaView from "react-native-safe-area-view";

import { connect } from "react-redux";
import { FocusAwareStatusBar } from "../../../../navigation/RootNavigation";
import * as RootNavigation from "../../../../navigation/RootNavigation";

import {
  TextInput,
  FlatList,
  TouchableOpacity,
} from "react-native-gesture-handler";
import {
  NoDataComp,
  CustomSearch,
  NoDataCompSearch,
  WithBgHeader,
} from "../../../../components";
import {
  NoComplaints,
  DataConnection,
  NoSearchData,
  ChatIcon,
} from "../../../../../assets/img/svgs";
import { complaint } from "../../../../redux/actions";
import { NotificationLoader } from "../../../../../assets/img/loader";
import {
  imageExtractor,
  statusComplaintExtractor,
  timeAgo,
  tailedString,
  complaintStatusExtractor,
  highlightText,
  customTimeFunction,
} from "../../../../helpers";
import { NoVisitorData } from "../../../../../assets/img/svgs";
import moment from "moment";
import commonStyles from "../../../../styles/commonStyles";
import { CustomModal } from "../../../../components";
import { SvgUri } from "react-native-svg";
import Animated from "react-native-reanimated";
import { customAnimation } from "../../../../animation/CommonAnimation";
import PulltoRefersh from "../../../../animation/Hoc/pullToRefresh";
import { ms } from "../../../../helpers/scaling";
import { Keyboard } from "react-native";
class ComplaintList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchInput: "",
      refresh: false,
    };
  }
  fetchData = () => {
    this.props.listComplaints();
  };
  componentDidMount() {
    const {
      listComplaints,
      complaintValidation,
      complaintsChange,
      onComplaintsChange,
      complaintSearch,
      navigation,
      loadRefresh,
    } = this.props;
    onComplaintsChange("complaintsLoader", true);

    this._unsubscribe = navigation.addListener("focus", async () => {
      console.log("commm focuss");
      listComplaints();
      loadRefresh(this.fetchData);
      onComplaintsChange("complaintSearch", "");
      ["subject", "description", "complaint_type", "file"]?.map((item) => {
        complaintsChange({ name: item, value: "" });
        complaintValidation({ name: item, value: "", error: "" });
      });
    });

    this._unsubscribe1 = navigation.addListener("blur", async () => {
      complaintsChange({ name: "showComplaintDetail", value: "" });
      // listComplaints();
      onComplaintsChange("complaintSearch", "");
    });

    BackHandler.addEventListener("hardwareBackPress", this.handleBack);
  }
  handleBack = () => {
    const { navigation } = this.props;
    console.log("handle back presss loggibg");
    // RootNavigation.navigate("ComplaintCategory");
    navigation.navigate("ComplaintCategory");
  };
  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.handleBack);
    console.log("will un mount complaint list ");
  }
  // Fetch colored status text

  // Fetch images based on service type

  handleChange = ({ name, value }) => {
    console.log(name, value, "handle change listttttt");
    const { onComplaintsChange } = this.props;
    onComplaintsChange(name, value);
    if (name === "complaintSearch") {
      this.props.listComplaints();
    }
  };

  // Each complaint
  renderItem = ({ item, index }) => {
    console.log(item, "iteemmmm");
    const {
      name,
      id,
      subject,
      status,
      description,
      complaint_type,
      created_at,
      identity_id,
      type_url,
      conversation_count,
    } = item;
    const { mode, navigation, complaintSearch } = this.props;
    const data = {
      type_id: id,
      type: complaint_type,
      subject: subject || "",
      descriptioin: description || "",
      created_time: created_at,
      complaint_id: "#ID 123456",
      status: status,
    };
    console.log(
      subject,
      status,
      description,
      name,
      complaint_type,
      complaintStatusExtractor(status),
      "typppeeee"
    );
    const showComplaintDetails = () => {
      navigation.navigate("ComplaintDetails", { data });
    };
    console.log(type_url, "mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm");

    return (
      <Animated.View {...customAnimation("FadeInRight", 700, 50, index)}>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingVertical: 15,
            width: "100%",
          }}
          onPress={showComplaintDetails}
        >
          <View style={{ flexDirection: "row", width: "70%" }}>
            <View style={{ flexDirection: "row" }}>
              <View
                style={{
                  ...commonStyles.avatar,
                }}
              >
                {console.log(type_url, "ekbfewf fhbewbefyhfy")}
                <Image
                  style={{ height: ms(20), width: ms(20) }}
                  source={{
                    uri: type_url,
                  }}
                />
              </View>
              <View
                style={{
                  marginLeft: 15,
                  // backgroundColor:"grey",
                  width:ms(200)
                }}
              >
                <Text
                  style={{
                    ...commonStyles.semiBold_16,
                    color: themes[mode]["headingColor"],
                  }}
                >
                  {tailedString(subject, 14)}
                  <View
                    style={{
                      height: ms(5),
                      width: ms(5),
                      backgroundColor: themes[mode]["lightAsh"],
                      borderRadius: 10,
                    }}
                  ></View>
                  <Text
                    style={{
                      ...commonStyles.semiBold_12,
                      color: complaintStatusExtractor(status).color,
                    }}
                  >
                    {status}
                  </Text>
                </Text>
                <Text
                  style={{
                    ...commonStyles.light_12,
                    color: themes[mode]["headingColor"],
                    marginVertical: 5,
                  }}
                >
                  {`ID #${identity_id}`}
                </Text>
                <Text
                  style={{
                    fontFamily: fonts.light,
                    fontSize: ms(14),
                    color: themes[mode]["headingColor"],
                  }}
                >
                  {tailedString(description, 40)}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              ...commonStyles.listRightSideColumnAlign,
              position: "absolute",
              top: ms(20),
              right: 0,
            }}
          >
            {/* <View
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
          </View> */}

            <Text
              style={{
                ...commonStyles.light_12,

                color: themes[mode]["headingColor"],
              }}
            >
              {/* <TimeAgo time={created_at} hideAgo interval={20000} /> */}
              {/* {timeAgo(created_at)}
               */}
              {customTimeFunction(created_at)}
            </Text>
            {conversation_count != 0 && (
              <View
                style={{
                  position: "absolute",
                  borderRadius: 15,
                  // backgroundColor: "#FFC727",
                  height: 17,
                  width: 17,
                  justifyContent: "center",
                  alignItems: "center",
                  top: 40,
                  right: 25,
                }}
              >
                <ChatIcon />
                <Text
                  style={{
                    position: "absolute",
                    fontSize: 7,
                    fontFamily: fonts.semiBold,
                    top: 2,
                  }}
                >
                  {conversation_count}
                </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </Animated.View>
      // <TouchableOpacity>
      //   <View
      //     style={{
      //       marginTop: 25,
      //       flex: 1,
      //       flexDirection: 'row',
      //     }}>
      //     <View
      //       style={{
      //         flex: 4.4,
      //         flexDirection: 'row',
      //       }}>
      //       <View
      //         style={{
      //           flex: 1,
      //           alignItems: 'flex-start',
      //           paddingTop: 3,
      //         }}>
      //         {this.imageExtractor(complaint_type)}
      //       </View>
      //       <View
      //         style={{
      //           flex: 5,
      //           flexDirection: 'column',
      //         }}>
      //         <View>
      //           <Text style={{fontFamily: fonts.semiBold}}>
      //             {complaint_type}
      //           </Text>
      //         </View>
      //         <View style={{paddingTop: 2, paddingBottom: 2}}>
      //           <Text
      //             style={{
      //               fontFamily: fonts.regular,
      //               fontSize: 12,
      //               color: themes[mode]['headingColor'],
      //             }}>
      //             ID #{id}
      //           </Text>
      //         </View>
      //         <View>
      //           <Text
      //             style={{
      //               fontFamily: fonts.regular,
      //               fontSize: 12,
      //               color: themes[mode]['headingColor'],
      //             }}
      //             numberOfLines={1}>
      //             {subject}
      //           </Text>
      //         </View>
      //       </View>
      //     </View>

      //     <View
      //       style={{
      //         flex: 1.6,
      //         alignItems: 'flex-end',
      //         flexDirection: 'column',
      //         paddingTop: 3,
      //       }}>
      //       <View>
      //         <Text style={this.statusExtractor(status, mode)}>{status}</Text>
      //       </View>
      //       <View style={{flex: 1}}></View>
      //       <View>
      //         <Text
      //           style={{
      //             fontFamily: fonts.regular,
      //             fontSize: 10,
      //             color: themes[mode]['headingColor'],
      //           }}>
      //           {created_at}
      //         </Text>
      //       </View>
      //     </View>
      //   </View>
      // </TouchableOpacity>
    );
  };

  render() {
    const {
      mode,
      complaintsLoader,
      complaints,
      complaintSearch,
      navigation,
    } = this.props;
    const { refresh } = this.state;
    const { handleChange } = this;
    const {
      name,
      status,
      subject,
      description,
      identity_id,
      complaint_type,
    } = complaints;

    console.log(complaintsLoader, complaints, "complainnytttss");
    const {
      GestureHandler,
      RefreshHeader,
      handleOnScroll,
      flatlistRef,
    } = this.props;
    return (
      <View
        style={{
          flex: 1,
          height: "100%",
          backgroundColor: themes[mode]["bgColor"],
          // paddingBottom: 120,
          // paddingHorizontal: 20,
        }}
      >
        {/* <FocusAwareStatusBar /> */}
        <SafeAreaView style={styles.safeArea} forceInset={{ top: "never" }} >
          {!complaintSearch && !complaintsLoader && complaints?.length === 0 ? (
            <NoDataComp
              leftTextStyle={{ minWidth: 70 }}
              includeFont
              showLeftIcon={false}
              leftIcon={true}
              title="Help Desk"
              showRightIcon
              // rightText={"Add New"}
              // onPressRight={() => {
              //   navigation.navigate("ComplaintCategory");
              // }}
              noDataVector={<NoComplaints />}
              text="No Submission "
              msgComp={
                <Text>
                  Tap on{" "}
                  <Text style={{ fontFamily: fonts.semiBold }}>ADD NEW</Text>{" "}
                  button to log your first request
                </Text>
              }
              bottomButtonText="OK"
              contentBlockStyle={{ marginTop: "-10%", borderWidth: 1 }}
            />
          ) : (
            <View>
              {/* <View
                style={{
                  marginTop: '8%',
                  marginBottom: '2%',
                  paddingHorizontal: 20,
                }}>

                 <HeaderOnly
                  includeFont
                  title="Complaints"
                  rightText="Add New"
                  showRightIcon
                  showLeftIcon={false}
                  onPressRight={() => {
                    navigation.navigate('AddComplaint');
                  }}
                /> 
              </View> */}
              <WithBgHeader
                // includeFont
                leftIcon={true}
                leftTextStyle={{ minWidth: ms(70) }}
                headerTitle="Help Desk"
                containerStyle={{
                  ...commonStyles.headerSpacing,
                }}
                // rightText="history"

                onPressLeftIcon={() => {
                  navigation.navigate("ComplaintCategory");
                }}
                >
                {complaintsLoader ? (
                  <View
                  style={{
                    paddingHorizontal: 20,
                    ...styles.container,
                  }}
                  >
                    {[1, 2, 3, 4, 5, 6, 7]?.map((item) => {
                      return <NotificationLoader />;
                    })}
                  </View>
                ) : (
                  <View>
                    <View
                      style={{
                        marginHorizontal: ms(20),
                        marginVertical: ms(20),
                      }}
                      >
                      <CustomSearch
                        name="complaintSearch"
                        placeholder="Search your requests"
                        value={complaintSearch}
                        handleSearchChange={handleChange}
                        />
                    </View>
                    {/* <View style={{height:40,width:"100%",position:"relative",backgroundColor:"red"}}> */}
                        {RefreshHeader}
                    {/* </View> */}

                    {complaints.length > 0 ? (
                      <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                          flexGrow: 1,
                          minHeight: "100%",
                        }}
                        nestedScrollEnabled
                        // refreshControl={
                        //   <RefreshControl
                        //     enabled
                        //     colors={[
                        //       themes[mode]["primaryColor"],
                        //       themes[mode]["primaryColor"],
                        //     ]}
                        //     refreshing={refresh}
                        //     onRefresh={() => {
                        //       this.setState({ refresh: true });
                        //       this.props.listComplaints();
                        //       this.setState({ refresh: false });
                        //     }}
                        //   />
                        // }
                      >
                        {/* <View> */}

                        {/* </View> */}

                        <FlatList
                          ref={flatlistRef}
                          onScroll={handleOnScroll}
                          showsVerticalScrollIndicator={false}
                          keyExtractor={(item) => item.id}
                          data={complaints}
                          legacyImplementation={false}
                          renderItem={this.renderItem}
                          style={styles.flatListContainer}
                          contentContainerStyle={{
                            flexGrow: 1,
                            paddingBottom: "40%",
                          }}
                          />
                      </ScrollView>
                    ) : (
                      <NoDataCompSearch
                      icon={<NoVisitorData />}
                      text="No Item Found"
                      message="We can’t find any item matching to  your search"
                      />
                      )}
                    {GestureHandler && GestureHandler}
                  </View>
                )}
              </WithBgHeader>
            </View>
          )}
        </SafeAreaView>
      </View>
    );
  }
}

const mapStateToProps = ({
  profile: { mode },
  complaint: { complaintsLoader, complaints, complaintSearch },
}) => {
  return {
    mode,
    complaintsLoader,
    complaints,
    complaintSearch,
  };
};

const {
  listComplaints,
  onComplaintsChange,
  complaintValidation,
  complaintsChange,
} = complaint;
const mapDispatchToProps = {
  listComplaints,
  onComplaintsChange,
  complaintValidation,
  complaintsChange,
};

export default PulltoRefersh(
  connect(mapStateToProps, mapDispatchToProps)(ComplaintList)
);

const styles = StyleSheet.create({
  flatListContainer: {
    // paddingRight: 28,
    // paddingLeft: 28,
    // marginTop: 10,
    // paddingHorizontal: 20,
    // paddingTop: 25,
    ...commonStyles.headerSpacing,
    marginTop: 0,
  },
  searchInput: {
    backgroundColor: "#F6F6F6",
    borderRadius: 7,
    paddingLeft: 45,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 10,
    height: 41,
    fontSize: 14,
    fontFamily: fonts.regular,
  },
  searchIcon: { position: "absolute", top: 11, left: 45, zIndex: 1 },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  statusStyle: {
    paddingTop: 1,
    paddingBottom: 1,
    paddingLeft: 12,
    paddingRight: 12,
    fontFamily: fonts.semiBold,
    fontSize: 10,
    borderRadius: 10,
  },
  container: {
    flexGrow: 1,
    paddingBottom: 30,
    marginTop: "7%",
  },
  safeArea: {
    flex: 1,
    justifyContent: "flex-start",
    paddingBottom: 60,
    // paddingHorizontal: 20,
  },
});
