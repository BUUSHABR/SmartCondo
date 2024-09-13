import React, { Component, useEffect, useState, PureComponent } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  Platform,
  Image,
  ScrollView,
  TouchableWithoutFeedback,
  Modal,
  ActivityIndicator,
} from "react-native";
import SafeAreaView from "react-native-safe-area-view";
import { themes, fonts, commonColors } from "../../../../themes";
import {
  customTimeFunction,
  detectTheme,
  SliceName,
} from "../../../../helpers";
import {
  CustomButton,
  CustomTextArea,
  NoDataComp,
  ToastMessage,
  WithBgHeader,
} from "../../../../components";
import commonStyles from "../../../../styles/commonStyles";
import {
  CloseSwitch,
  CommentIconCommunity,
  CommunityAddIcon,
  DeleteBorderIcon,
  HeartIcon,
  HeartRedIcon,
  NoDocument,
  ReportCommuIcon,
  SwitchTick,
  ThreeDotIcon,
  TickIcon,
} from "../../../../../assets/img/svgs";
import CircularProgress from "react-native-circular-progress-indicator";
import { connect } from "react-redux";
import { community } from "../../../../redux/actions";
import {
  CommunityListLoader,
  SubscribeLoader,
} from "../../../../../assets/img/loader";
import { navigate } from "../../../../navigation/RootNavigation";
import ReportBottomView from "../../../../components/ReportBottomView";
import Animated, { SequencedTransition, Layout } from "react-native-reanimated";
import { customAnimation } from "../../../../animation/CommonAnimation";
import PopupMenu from "../../../../components/PopupMenu";
import { communityDelete } from "../../../../api/community";
import { ms } from "../../../../helpers/scaling";
class CommunityList extends PureComponent {
  // const [pollshow, setpollshow] = useState(false);
  // useEffect(() => {
  //   // props.communitylist();
  // console.log("deje");

  // },[]);
  // console.log("dejeugdedkj3d3d");
  constructor(props) {
    super(props);

    this.state = {
      show: false,
      error: "",
      content: "",
      report_id: "",
      total_entries: 5,
      load: false,
      // scrollValue: 0,
      // lastScrollValue: 0,
      // showAni:new Animated.Value(0)
    };
  }
  componentDidMount() {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener("focus", () => {
      console.log("dwkjdfwnwkjdnkwfdkwnfkwjfnkhwbfkhbwf");
      this.props.communitylist(this.state.total_entries);
    });
  }
  // componentDidUpdate(){
  //   console.log("upadating",this.state.scrollValue);
  //   if(this.state.scrollValue > 700){
  //     console.log("loggimjhd886868686868686");
  //     Animated.timing(this.state.showAni, {
  //       toValue: 1,
  //       duration: 300,
  //       useNativeDriver: true,
  //     }).start();
  //   }
  //   if(this.state.scrollValue==0){
  //     Animated.timing(this.state.showAni, {
  //       toValue: 0,
  //       duration: 300,
  //       useNativeDriver: true,
  //     }).start();
  //   }
  // }
  communityShowPost(id, data) {
    console.log("feeouifef");
    navigate("CommunityShow", { data: data, id: id });
    // this.props.communityshow(id);
  }
  modalClose = () => {
    this.setState({ show: false });
  };
  handleChange = (name, val) => {
    this.setState({ content: val, error: "" });
  };
  handleSubmit = (handleClose, reportOff) => {
    if (this.state.content.length > 0) {
      this.props.communityreport(
        { content: this.state.content },
        this.state.report_id
      );
      this.setState({ show: false, content: "", report_id: "" });
      handleClose(0, false);
      reportOff();
    } else {
      this.setState({ error: "This field is required" });
    }
  };
  ReportOff = () => {
    this.setState({ show: false });
  };
  isLoad = (value) => {
    this.setState({ load: value });
  };
  handleLoadMore = () => {
    console.log("kjefhfefieiiuei loading moire");
  };
  renderFooter = () => {
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
        {this.state.load && (
          <ActivityIndicator color="#FFC727" style={{ margin: 15 }} />
        )}
      </View>
    );
  };
  DeletePost = (id) => {
    console.log(id, "ytu3io");
    communityDelete(id)
      .then((data) => {
        console.log(
          this.state.total_entries,
          "ieuueeu",
          this.props.communitylist
        );
        // this.setState({ total_entries: 5 });
        setTimeout(() => {
          this.props.communitylist(5);
        }, 1000);
      })
      .catch((err) => {
        ToastMessage(err[0], err[1]?.message);
      });
  };
  render() {
    const { mode } = this.props;
    // const PollResult = () => {
    //   setpollshow(true);
    // };
    // let listview;

    const reportForm = (
      <View style={{ paddingHorizontal: 0 }}>
        {/* <View
          style={{
            width: "100%",
            justifyContent: "flex-end",
            alignItems: "flex-end",
          }}
        >
          <View style={{ marginRight: 20 }}>
            <CloseSwitch />
          </View>
        </View> */}
        <View style={{ marginTop: 10 }}>
          <View style={{ paddingHorizontal: 20, paddingBottom: 5 }}>
            <Text
              style={{
                color: "black",
                fontFamily: fonts.semiBold,
                fontSize: ms(16),
                marginBottom: 5,
              }}
            >
              Content
            </Text>
            <CustomTextArea
              value={this.state.content}
              handleChange={this.handleChange}
              placeholder="Add your content here"
              error={this.state.error}
              Color={true}
            />
          </View>
          {/* <View style={{ marginTop: 0, paddingHorizontal: 20 }}>
            <CustomButton
              title={"Sumbit"}
              buttonStyle={{
                borderColor: commonColors.yellowColor,
                backgroundColor: commonColors.yellowColor,
              }}
              textStyle={{
                color: "#fff",
              }}
              handleSubmit={this.handleSubmit}
              disableBtn={false}
            />
          </View> */}
        </View>
      </View>
    );
    return (
      <SafeAreaView
        style={{
          width: "100%",
          backgroundColor: themes[mode]["bgColor"],
        }}
        forceInset={{ top: "never" }}
      >
        <WithBgHeader
          leftIcon={
            !this.props.features.some((data) => data == "complaints") &&
            this.props.features.some((data) => data == "community")
              ? false
              : true
          }
          headerTitle={"Community"}
          containerStyle={{
            ...commonStyles.headerSpacing,
          }}
          headerStyle={
            {
              // backgroundColor: this.state.show
              //   ? Platform.OS === "android"
              //     ? "#eee"
              //     : mode === "light"
              //     ? "rgba(0, 0, 0, 0.3)"
              //     : themes[mode]["bgColor"]
              //   : "transparent",
              // opacity: this.state.show ? (mode === "light" ? 0.2 : 1) : 1,
            }
          }
        >
          {/* <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              flexGrow: 1,
              minHeight: "100%",
            }}
          > */}
          <View
            style={{
              paddingBottom: Platform.OS == "android" ? 100 : 40,
            }}
          >
            {console.log(this.props.communityListData.length, "dkdkkd")}
            {!this.props.listLoader ? (
              this.props.communityListData.length > 0 ? (
                <FlatList
                  // windowSize={2}
                  // disableVirtualization={true}
                  // removeClippedSubviews={true}
                  // onScroll={(e) => {
                  //   console.log("dsjdjsdjs))", e.nativeEvent.contentOffset.y);
                  //   this.setState({
                  //     scrollValue: e.nativeEvent.contentOffset.y,
                  //   });
                  //   if (this.state.lastScrollValue > this.state.scrollValue) {
                  //     console.log(
                  //       "logging djdhdkwdjkwdhjwd  kjdkjwdkjwkjdkj+++++++++++++++"
                  //     );
                  //   }
                  // }}
                  // // onScrollBeginDrag={(e)=>{
                  // //   console.log("dsjdjsdjs))",e)
                  // // }}
                  // ref={(ref) => {
                  //   listview = ref;
                  // }}
                  windowSize={7}
                  updateCellsBatchingPeriod={3}
                  onStartShouldSetResponder={() => {}}
                  showsVerticalScrollIndicator={false}
                  data={this.props.communityListData}
                  initialNumToRender={2}
                  maxToRenderPerBatch={2}
                  onEndReachedThreshold={0.01}
                  onMomentumScrollBegin={() => {
                    this.onEndReachedCalledDuringMomentum = false;
                  }}
                  onEndReached={(info) => {
                    console.log("djdjdjjdkd", info);
                    if (!this.onEndReachedCalledDuringMomentum) {
                      this.setState({
                        total_entries: this.state.total_entries + 5,
                      });
                      this.props.communitylist(
                        this.state.total_entries,
                        this.isLoad
                      );
                      this.onEndReachedCalledDuringMomentum = true;
                    }
                  }}
                  scrollEventThrottle={1}
                  ListFooterComponent={this.renderFooter}
                  renderItem={({ item, index }) => {
                    const data = item;

                    const menu = {
                      Menu_name: ThreeDotIcon,
                      menu_name_style: {},
                      menu_name_type: "svg",
                      menu_options: [
                        {
                          onSelect: this.DeletePost,
                          onSelectParams: data?.id,
                          isIcon: true,
                          Icon: DeleteBorderIcon,
                          menu_name: "Delete",
                          menu_name_style_option: { color: "red",fontSize:ms(12) },
                        },
                      ],
                    };
                    // console.log(data, "skjwugdjwdwdgwd dkwjdgwdwd");
                    // const {resident:{name,phone,profile_image ,unit:{unit_number,likes_count},community_images},}=data
                    return (
                      data.resident != null && (
                        <Animated.View
                          layout={Layout.duration(2000).delay(200)} // {...customAnimation("SlideInDown", 700, 50, index)}
                          key={index}
                          style={{ marginBottom: ms(20), paddingHorizontal: ms(20) }}
                        >
                          <View style={{ flexDirection: "row" }}>
                            <View>
                              <Image
                                style={{
                                  width:ms(40),
                                  height: ms(40),
                                  borderRadius: ms(30),
                                  justifyContent: "center",
                                  alignItems: "center",
                                  backgroundColor: "black",
                                }}
                                source={{
                                  uri: data.resident.profile_image,
                                }}
                              />
                            </View>
                            <View style={{ marginLeft: 10 }}>
                              <View
                                style={{
                                  flexDirection: "row",
                                  alignItems: "center",
                                }}
                              >
                                <Text
                                  style={{
                                    fontFamily: fonts.bold,
                                    color: themes[mode]["headingColor"],
                                    fontSize: ms(16),
                                  }}
                                >
                                  {data.resident.name}
                                </Text>
                                <View
                                  style={{
                                    marginTop: 3,
                                    marginLeft: 5,
                                    marginRight: 5,
                                    height: 5,
                                    width: 5,
                                    backgroundColor: themes[mode]["lightAsh"],
                                    borderRadius: 10,
                                  }}
                                ></View>
                                <Text
                                  style={{
                                    marginTop: 3,
                                    fontFamily: fonts.regular,
                                    color: themes[mode]["lightAsh"],
                                    fontSize: ms(12),
                                  }}
                                >
                                  {data.unit.unit_number}
                                </Text>
                              </View>
                              <Text
                                style={{
                                  fontFamily: fonts.regular,
                                  color: themes[mode]["lightAsh"],
                                  fontSize: ms(12),
                                }}
                              >
                                {customTimeFunction(
                                  data.created_at,
                                  new Date()
                                )}
                              </Text>
                            </View>
                            <View
                              style={{
                                position: "absolute",
                                top: 7,
                                width: "100%",
                                // backgroundColor: "red",
                                alignItems: "flex-end",
                              }}
                            >
                              {data?.posted_by_you && <PopupMenu menu={menu} />}
                            </View>
                          </View>

                          <View
                            style={{
                              marginTop: 20,
                              padding: 6,
                              backgroundColor: themes[mode]["bgColor"],
                              elevation: 4,
                              borderRadius: 10,
                              paddingBottom: 15,
                              shadowOffset: { width: 2, height: 1 },
                              shadowOpacity: 0.15,
                              // shadowColor: "#bbb",
                              shadowRadius: 10,
                              shadowOpacity: 0.1,
                            }}
                          >
                            <TouchableOpacity
                              onPress={() =>
                                this.communityShowPost(data.id, data)
                              }
                            >
                              <>
                                {data.community_images[0]?.s3_image_path && (
                                  <Image
                                    style={{
                                      width: "100%",
                                      // height: 200,
                                      borderRadius: 10,
                                      justifyContent: "center",
                                      alignItems: "center",
                                      backgroundColor: "black",
                                      minHeight: ms(200),
                                      maxHeight: ms(300),
                                    }}
                                    source={{
                                      uri:
                                        data.community_images[0].s3_image_path,
                                    }}
                                  />
                                )}
                                {true && (
                                  <Text
                                    style={{
                                      paddingHorizontal: 10,
                                      marginTop: 10,
                                      fontFamily: fonts.regular,
                                      color: themes[mode]["headingColor"],
                                      fontSize: ms(15),
                                      textAlign: "justify",
                                    }}
                                  >
                                    {SliceName(data.content, 70)
                                      .replace(/\n/g, " ")
                                      .trim()}
                                  </Text>
                                )}
                              </>
                            </TouchableOpacity>
                            {false && (
                              <View
                                style={{
                                  borderWidth: 0.5,
                                  borderColor: themes[mode]["headingColor"],
                                  padding: 7,
                                  borderRadius: 10,
                                  marginTop: 10,
                                  marginHorizontal: 10,
                                }}
                              >
                                <View style={{ paddingHorizontal: 10 }}>
                                  <Text
                                    style={{
                                      marginBottom: 9,
                                      color: themes[mode]["headingColor"],
                                      fontFamily: fonts.semiBold,
                                      fontSize: ms(14),
                                    }}
                                  >
                                    Lorem ipsum dolor sit amet, jkjj fjek
                                    consectetur adipiscing elit?
                                  </Text>
                                </View>
                                {pollshow &&
                                  [1, 2, 3, 4]?.map((data) => {
                                    return (
                                      <>
                                        <View
                                          style={{
                                            paddingRight: 27,
                                            paddingLeft: 10,
                                            flexDirection: "row",
                                            justifyContent: "space-between",
                                            width: "100%",
                                            alignItems: "center",
                                            marginBottom: 10,
                                            marginTop: 10,
                                          }}
                                        >
                                          <View
                                            style={{
                                              flexDirection: "row",
                                              // justifyContent: "space-between",
                                              alignItems: "center",
                                            }}
                                          >
                                            <SwitchTick />
                                            <View
                                              style={{
                                                marginLeft: 10,
                                                width: "86%",
                                                alignItems: "center",
                                              }}
                                            >
                                              <Text
                                                style={{
                                                  marginBottom: 9,
                                                  color:
                                                    themes[mode][
                                                      "headingColor"
                                                    ],
                                                  fontFamily: fonts.medium,
                                                  fontSize: ms(12),
                                                }}
                                              >
                                                Lorem ipsum dolor sit amet,
                                                consectetur adipiscing elit
                                                adipiscing
                                              </Text>
                                            </View>
                                          </View>
                                          <View>
                                            <CircularProgress
                                              value={63}
                                              radius={17}
                                              inActiveStrokeOpacity={0.5}
                                              activeStrokeWidth={4}
                                              inActiveStrokeWidth={5}
                                              progressValueStyle={{
                                                fontWeight: "400",
                                                color:
                                                  themes[mode]["headingColor"],
                                                fontSize: ms(9),
                                              }}
                                              activeStrokeColor={"#FFC727"}
                                            />
                                          </View>
                                        </View>
                                      </>
                                    );
                                  })}
                                {!pollshow &&
                                  [1, 2, 3, 4]?.map((data) => {
                                    return (
                                      <>
                                        <TouchableOpacity onPress={PollResult}>
                                          <View
                                            style={{
                                              justifyContent: "center",
                                              paddingTop: 5,
                                              flexDirection: "row",
                                              justifyContent: "space-between",
                                              // width: "100%",
                                              alignItems: "center",
                                              marginBottom: 10,
                                              marginTop: 10,
                                              borderColor:
                                                themes[mode]["lightAsh"],
                                              borderWidth: 0.5,
                                              borderRadius: 5,
                                              marginHorizontal: 7,
                                            }}
                                          >
                                            <View
                                              style={{
                                                marginLeft: 10,
                                                width: "86%",
                                                alignItems: "center",
                                              }}
                                            >
                                              <Text
                                                style={{
                                                  marginBottom: 9,
                                                  color:
                                                    themes[mode][
                                                      "headingColor"
                                                    ],
                                                  fontFamily: fonts.medium,
                                                  fontSize: ms(12),
                                                }}
                                              >
                                                Lorem ipsum dolor sit amet,
                                                consectetur adipiscing elit
                                                adipiscing
                                              </Text>
                                            </View>
                                          </View>
                                        </TouchableOpacity>
                                      </>
                                    );
                                  })}
                                <View
                                  style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                  }}
                                >
                                  <Text
                                    style={{
                                      fontFamily: fonts.regular,
                                      color: themes[mode]["lightAsh"],
                                      fontSize: ms(12),
                                    }}
                                  >
                                    9 votes
                                  </Text>
                                  <View
                                    style={{
                                      marginTop: 3,
                                      marginLeft: 5,
                                      marginRight: 5,
                                      height: 5,
                                      width: 5,
                                      backgroundColor: themes[mode]["lightAsh"],
                                      borderRadius: 10,
                                    }}
                                  ></View>
                                  <Text
                                    style={{
                                      marginTop: 3,
                                      fontFamily: fonts.regular,
                                      color: themes[mode]["lightAsh"],
                                      fontSize: ms(12),
                                    }}
                                  >
                                    33-3C#49
                                  </Text>
                                </View>
                              </View>
                            )}

                            {/* <CircularProgress
                        value={60}
                        radius={120}
                        duration={2000}
                        progressValueColor={"#ecf0f1"}
                        maxValue={200}
                        title={"KM/H"}
                        titleColor={"white"}
                        titleStyle={{ fontWeight: "bold" }}
                      /> */}
                          </View>
                          <View
                            style={{
                              marginTop: 13,
                              paddingHorizontal: 10,
                              width: "100%",
                              flexDirection: "row",
                              justifyContent: "space-between",
                            }}
                          >
                            <View
                              style={{
                                justifyContent: "center",
                                alignItems: "center",
                                flexDirection: "row",
                              }}
                            >
                              <TouchableOpacity
                                style={{
                                  height: ms(30),
                                  width: ms(30),
                                  justifyContent: "center",
                                  alignItems: "center",
                                  marginRight: ms(5),
                                }}
                                onPress={() => {
                                  this.props.communitylike(
                                    { status: !data.liked },
                                    data.id,
                                    false
                                  );
                                }}
                                disabled={this.props.likeEnable}
                              >
                                {data.liked ? <HeartRedIcon /> : <HeartIcon />}
                              </TouchableOpacity>
                              <View style={{ marginLeft: 0 }}>
                                <View
                                  style={{ flexDirection: "row" }}
                                  // onPress={() => {
                                  //   navigate("CommunityLikeList");
                                  //   this.props.communitylikelist(data.id);
                                  // }}
                                >
                                  {/* {data.recent_likes?.map((datas, index) => {
                                    return (
                                      <View
                                        style={{
                                          width: 20,
                                          height: 20,
                                          borderRadius: 30,
                                          justifyContent: "center",
                                          alignItems: "center",
                                          zIndex: index,
                                          position: "absolute",
                                          marginLeft: -index * 13,
                                          top: -2,
                                          left: 23,
                                          backgroundColor:
                                            themes[mode]["bgColor"],
                                        }}
                                      >
                                        <Image
                                          style={{
                                            width: 17,
                                            height: 17,
                                            borderRadius: 30,
                                            justifyContent: "center",
                                            alignItems: "center",
                                            backgroundColor: "black",
                                          }}
                                          source={{
                                            uri: data.resident.profile_image,
                                          }}
                                        />
                                      </View>
                                    );
                                  })} */}
                                  <Text
                                    style={{
                                      marginTop: 0,
                                      // marginLeft: 48,
                                      fontFamily: fonts.regular,
                                      color: themes[mode]["lightAsh"],
                                      fontSize: ms(12),
                                    }}
                                  >
                                    {data.likes_count != 0 &&
                                      `${data.likes_count} Likes`}
                                  </Text>
                                </View>
                              </View>
                            </View>
                            {data.comments_count > 0 && (
                              <View
                                style={{ marginTop: 5, flexDirection: "row",marginLeft:data.posted_by_you?195:23, }}
                              >
                                <CommentIconCommunity />
                                <Text
                                  style={{
                                    marginLeft: 5,
                                    fontFamily: fonts.regular,
                                    color: themes[mode]["lightAsh"],
                                    fontSize: ms(12),
                                  }}
                                >
                                  {data.comments_count}
                                </Text>
                              </View>
                            )}
                            <View>
                              {!data.posted_by_you && (
                                <TouchableOpacity
                                  style={{
                                    justifyContent: "center",
                                    alignItems: "center",
                                    flexDirection: "row",
                                    marginTop: 4,
                                  }}
                                  onPress={() => {
                                    this.setState({
                                      show: true,
                                      report_id: data.id,
                                    });
                                  }}
                                >
                                  <ReportCommuIcon />
                                  <Text
                                    style={{
                                      // marginTop: 7,
                                      marginLeft: 7,
                                      fontFamily: fonts.regular,
                                      color: themes[mode]["lightAsh"],
                                      fontSize: ms(12),
                                    }}
                                  >
                                    Report
                                  </Text>
                                </TouchableOpacity>
                              )}
                            </View>
                          </View>
                        </Animated.View>
                      )
                    );
                  }}
                  keyExtractor={(item) => item.id}
                  // style={styles.visitorStyle}
                  // contentContainerStyle={styles.visitorContainerStyle}
                />
              ) : (
                <SafeAreaView
                  style={{
                    width: "100%",
                    backgroundColor: themes[mode]["bgColor"],
                  }}
                  forceInset={{ top: "never" }}
                >
                  <View
                    style={{
                      flex: 1,
                      // backgroundColor: "red",
                      zIndex: 11,
                      position: "absolute",
                      justifyContent: "center",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <NoDataComp
                      noDataVector={<NoDocument />}
                      text="No Post Found"
                      // message="No post found here"
                      bottomButtonText="OK"
                    />
                  </View>
                </SafeAreaView>
              )
            ) : (
              <View style={{ ...commonStyles.headerSpacing, marginTop: 15 }}>
                {[1, 2, 3, 4, 5, 6, 7]?.map((item) => {
                  return (
                    <View style={{ marginBottom: 20 }}>
                      <CommunityListLoader />
                    </View>
                  );
                })}
              </View>
            )}
          </View>
          {/* </ScrollView> */}
          <View
            style={{
              position: "absolute",
              right: 20,
              bottom: 20,
              // backgroundColor:"red",
              zIndex: 3,
            }}
          >
            <TouchableOpacity onPress={() => navigate("CommunityForm")}>
              <CommunityAddIcon />
            </TouchableOpacity>
          </View>

          {/* <Animated.View
              style={{
                position: "absolute",
                right: 20,
                bottom: 150,
                // backgroundColor:"red",
                zIndex: 4,
                opacity: this.state.showAni,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  listview.scrollToOffset({ offset: 0, animated: true });
                }}
              >
                <CommunityAddIcon />
              </TouchableOpacity>
            </Animated.View> */}
        </WithBgHeader>

        <Modal
          animationType="slide"
          transparent={true}
          visible={false}
          onRequestClose={this.modalClose}
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <TouchableWithoutFeedback onPressOut={this.modalClose}>
            <View
              style={{
                width: "85%",
                borderRadius: 10,
                alignSelf: "center",
                marginHorizontal: 10,
                // paddingVertical: 30,
                paddingTop: 15,
                elevation: 2,
                alignSelf: "center",
                top: "30%",
                shadowOffset: {},
                shadowOpacity: 0.5,
                shadowRadius: 0.5,
                backgroundColor: "#fff",
              }}
            >
              <View style={{ paddingHorizontal: 0 }}>
                <View
                  style={{
                    width: "100%",
                    justifyContent: "flex-end",
                    alignItems: "flex-end",
                  }}
                >
                  <View style={{ marginRight: 20 }}>
                    <CloseSwitch />
                  </View>
                </View>
                <View style={{ marginTop: 10 }}>
                  <View style={{ paddingHorizontal: 20, paddingBottom: 5 }}>
                    <Text
                      style={{
                        color: themes[mode]["headingColor"],
                        fontFamily: fonts.semiBold,
                        fontSize: ms(16),
                        marginBottom: 5,
                      }}
                    >
                      Content
                    </Text>
                    <CustomTextArea
                      value={this.state.content}
                      handleChange={this.handleChange}
                      placeholder="Add your content here"
                      error={this.state.error}
                    />
                  </View>
                  <View style={{ marginTop: 0, paddingHorizontal: 20 }}>
                    <CustomButton
                      title={"Submit"}
                      buttonStyle={{
                        borderColor: commonColors.yellowColor,
                        backgroundColor: commonColors.yellowColor,
                      }}
                      textStyle={{
                        color: "#fff",
                      }}
                      handleSubmit={this.handleSubmit}
                      disableBtn={false}
                    />
                  </View>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
        <ReportBottomView
          show={this.state.show}
          reportForm={reportForm}
          handleSubmit={this.handleSubmit}
          reportOff={this.ReportOff}
        />
      </SafeAreaView>
    );
  }
}
const mapStateToProps = ({
  home: { features },

  community: { communityListData, listLoader, likeEnable },
  profile: { mode },
}) => {
  return {
    communityListData,
    listLoader,
    mode,
    likeEnable,
    features,
  };
};

const {
  communitylist,
  communityshow,
  communitylike,
  communitylikelist,
  communityreport,
} = community;
const mapDispatchToProps = {
  communitylist,
  communityshow,
  communitylike,
  communitylikelist,
  communityreport,
};

export default connect(mapStateToProps, mapDispatchToProps)(CommunityList);
