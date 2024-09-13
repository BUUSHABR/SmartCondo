import React, { useState } from "react";

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
  Dimensions,
  Button,
  Keyboard,
  TouchableHighlight,
  Alert,
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
  WithBgHeader,
} from "../../../../components";
import commonStyles from "../../../../styles/commonStyles";
import {
  CloseSwitch,
  DeleteBorderIcon,
  HeartIcon,
  HeartRedIcon,
  NoDocument,
  ReportCommuIcon,
  SearchIcon,
  SendIcon,
  ThreeDotIcon,
} from "../../../../../assets/img/svgs";
import { connect } from "react-redux";
import { community } from "../../../../redux/actions";
import { CommunityListLoader } from "../../../../../assets/img/loader";
import { navigate } from "../../../../navigation/RootNavigation";
import ReportBottomView from "../../../../components/ReportBottomView";
import {
  commentDelete,
  communityComment,
  communityDelete,
  communityShow,
} from "../../../../api/community";
import PopupMenu from "../../../../components/PopupMenu";
import { useEffect } from "react";
import { styles } from "react-native-floating-label-input/src/styles";
import { ms } from "../../../../helpers/scaling";
import { KeyboardAvoidingView } from "react-native";
global.commentId = "";
const CommunityShow = (props) => {
  const [pollshow, setpollshow] = useState(false);
  const [content, setcontent] = useState("");
  const [error, seterror] = useState("");
  const [report_id, setreportid] = useState("");
  const [show, setshow] = useState(false);
  const [comment, setcomment] = useState("");
  const [profile_image, set_profile_image] = useState("");
  const [comunity_data, set_comunity_data] = useState({});
  const [likeEnable, set_likeEnable] = useState(false);
  const [isLoading, set_isLoading] = useState(false);

  const mode = detectTheme();

  useEffect(() => {
    // console.log(props?.route?.params, "934279232232");
    communityfetch(true);
  }, [props?.route?.params?.id]);
  const communityfetch = (load) => {
    load && set_isLoading(true);
    communityShow(props?.route?.params?.id)
      .then(({ data }) => {
        console.log(data, "datw;dkw9383974");
        set_comunity_data(data);
        set_isLoading(false);
      })
      .catch((err) => {
        console.log(err, "kejhe");
      });
  };
  const modalClose = () => {
    setshow(false);
  };
  const handleChange = (name, val) => {
    setcontent(val);
    seterror("");
  };
  const handleSubmit = () => {
    if (content.length > 0) {
      props.communityreport({ content: content }, report_id);
      setshow(false);
      setcontent("");
      setreportid("");
    } else {
      seterror("This field is required");
    }
  };
  const ReportOff = () => {
    setshow(false);
  };

  const onSubmit = () => {
    Keyboard.dismiss();
    communityComment(comunity_data?.id, {
      comments: {
        comment: comment,
      },
    })
      .then((data) => {
        setTimeout(() => {
          communityfetch();
        }, 1000);
      })
      .catch((err) => {
        console.log(err, "ded");
      });
    setcomment("");
  };
  const DeletePost = (id) => {
    console.log(id, "ytu3io");
    communityDelete(id)
      .then((data) => {
        console.log("ieuueeu", props.communitylist);
        // this.setState({ total_entries: 5 });
        props.communitylist(5);
        navigate("CommunityList");
      })
      .catch((err) => {
        ToastMessage(err[0], err[1]?.message);
      });
  };
  const CommentDelete = (id) => {
    Alert.alert(
      "Delete Comment",
      "Are you sure you want to delete the comment?",
      [
        {
          text: "No",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => {
            commentDelete(id)
              .then((data) => {
                console.log(data, "coe");
                setTimeout(() => {
                  communityfetch();
                }, 1000);
              })
              .catch((err) => {
                console.log(err, "ekjfie");
              });
            // const dispatch = useDispatch();

            // console.log(
            //   dispatch(cancelMyInvite(id)),
            //   'cancel in alert',
            // );
            // cancelMyInvite(id);
            // onClickInvite({
            //   name: 'showCancelButton',
            //   value: false,
            // });
          },
        },
      ]
    );
  };
  const menu = {
    Menu_name: ThreeDotIcon,
    menu_name_style: {},
    menu_name_type: "svg",
    menu_options: [
      {
        onSelect: DeletePost,
        onSelectParams: comunity_data?.id,
        isIcon: true,
        Icon: DeleteBorderIcon,
        menu_name: "Delete",
        menu_name_style_option: { color: "red" },
      },
    ],
  };
  console.log(props?.user_image, "8723987329097328");
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
              color: themes[mode]["headingColor"],
              fontFamily: fonts.semiBold,
              fontSize: ms(16),
              marginBottom: 5,
            }}
          >
            Content
          </Text>
          <CustomTextArea
            value={content}
            handleChange={handleChange}
            placeholder="Add your content here
            "
            error={error}
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
        position: "relative",
      }}
      forceInset={{ top: "never" }}
    >
      <KeyboardAvoidingView behavior="padding">
      <WithBgHeader
        leftIcon={true}
        headerTitle={"Community"}
        containerStyle={{
          ...commonStyles.headerSpacing,
        }}
        headerStyle={
          {
            // backgroundColor: show
            //   ? Platform.OS === "android"
            //     ? "#eee"
            //     : mode === "light"
            //     ? "rgba(0, 0, 0, 0.3)"
            //     : themes[mode]["bgColor"]
            //   : "transparent",
            // opacity: show ? (mode === "light" ? 0.2 : 1) : 1,
          }
        }
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            minHeight: "100%",
            paddingBottom: 100,
          }}
        >
          <View
            style={{
              marginHorizontal: 20,
            }}
          >
            {!isLoading ? (
              <>
                {comunity_data?.content ? (
                  // const {resident:{name,phone,profile_image ,unit:{unit_number,likes_count},community_images},}=data

                  <View style={{ marginBottom: 20 }}>
                    <View style={{ flexDirection: "row" }}>
                      <View>
                        <Image
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: 30,
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: "black",
                          }}
                          source={{
                            uri: comunity_data?.resident.profile_image,
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
                            {comunity_data?.resident.name}
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
                            {comunity_data?.unit.unit_number}
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
                            comunity_data?.created_at,
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
                        {comunity_data?.posted_by_you && (
                          <PopupMenu menu={menu} />
                        )}
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
                      {/* <TouchableWithoutFeedback onPress={this.communityShowPost}> */}
                      <>
                        {comunity_data?.community_images[0]?.s3_image_path && (
                          <Image
                            style={{
                              width: "100%",
                              height: Math.round(
                                Dimensions.get("window").width
                              ),
                              borderRadius: 10,
                              justifyContent: "center",
                              alignItems: "center",
                              backgroundColor: "black",
                            }}
                            source={{
                              uri:
                                comunity_data?.community_images[0]
                                  .s3_image_path,
                            }}
                          />
                        )}
                        {true && (
                          <Text
                            style={{
                              paddingHorizontal: ms(10),
                              marginTop: ms(10),
                              fontFamily: fonts.regular,
                              color: themes[mode]["headingColor"],
                              fontSize: ms(15),
                              textAlign: "justify",
                            }}
                          >
                            {comunity_data?.content}
                          </Text>
                        )}
                      </>
                      {/* </TouchableWithoutFeedback> */}
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
                              Lorem ipsum dolor sit amet, jkjj fjek consectetur
                              adipiscing elit?
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
                                            color: themes[mode]["headingColor"],
                                            fontFamily: fonts.medium,
                                            fontSize: ms(12),
                                          }}
                                        >
                                          Lorem ipsum dolor sit amet,
                                          consectetur adipiscing elit adipiscing
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
                                          color: themes[mode]["headingColor"],
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
                                        borderColor: themes[mode]["lightAsh"],
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
                                            color: themes[mode]["headingColor"],
                                            fontFamily: fonts.medium,
                                            fontSize: ms(12),
                                          }}
                                        >
                                          Lorem ipsum dolor sit amet,
                                          consectetur adipiscing elit adipiscing
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
                            height: 30,
                            width: 30,
                            justifyContent: "center",
                            alignItems: "center",
                            marginRight: 5,
                          }}
                          onPress={async () => {
                            await props.communitylike(
                              {
                                status: !comunity_data?.liked,
                              },
                              comunity_data?.id,
                              false,
                              communityfetch,
                              set_likeEnable
                            );
                            // setTimeout(() => {
                            //   communityfetch();
                            // }, 200);
                          }}
                          disabled={likeEnable}
                        >
                          {comunity_data?.liked ? (
                            <HeartRedIcon />
                          ) : (
                            <HeartIcon />
                          )}

                          {console.log(
                            comunity_data?.liked,
                            "liked shoe post "
                          )}
                        </TouchableOpacity>
                        <View style={{ marginLeft: 0 }}>
                          <TouchableOpacity
                            style={{ flexDirection: "row" }}
                            onPress={() => {
                              navigate("CommunityLikeList");
                              props.communitylikelist(comunity_data?.id);
                            }}
                          >
                            {/* {[1, 2, 3]?.map((datas, index) => {
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
                                          left:23,
                                          backgroundColor:themes[mode]['bgColor']
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
                                // marginLeft:48,
                                fontFamily: fonts.regular,
                                color: themes[mode]["lightAsh"],
                                fontSize: ms(12),
                              }}
                            >
                              {comunity_data.likes_count != 0 &&
                                `${comunity_data.likes_count} Likes`}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>

                      {console.log(comunity_data, "IJBCGEHJEHJEHEKJEKD")}
                      {!comunity_data?.posted_by_you && (
                        <TouchableOpacity
                          style={{
                            justifyContent: "center",
                            alignItems: "center",
                            flexDirection: "row",
                            marginTop: 0,
                          }}
                          onPress={() => {
                            setshow(true);
                            setreportid(comunity_data?.id);
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
                    <View style={{ paddingHorizontal: 10, marginTop: 15 }}>
                      {comunity_data?.comments.length > 0 && (
                        <Text
                          style={{
                            fontFamily: fonts.semiBold,
                            color: themes[mode]["headingColor"],
                            fontSize: ms(13),
                            letterSpacing: ms(5),
                            paddingBottom: ms(10),
                          }}
                        >
                          Comments({comunity_data?.comments_count})
                        </Text>
                      )}
                      {comunity_data?.comments?.map((Data) => {
                        return (
                          <TouchableOpacity
                            onLongPress={() =>
                              Data?.commented_by_you && CommentDelete(Data?.id)
                            }
                            underlayColor="white"
                          >
                            <View
                              style={{
                                flexDirection: "row",
                                borderBottomWidth: 1,
                                borderLeftColor: "transparent",
                                borderTopColor: "transparent",
                                borderRightColor: "transparent",
                                borderColor: themes[mode]["bottom"],
                                paddingBottom: ms(10),
                                paddingTop: ms(10),
                              }}
                            >
                              <View>
                                <Image
                                  style={{
                                    width: ms(25),
                                    height: ms(25),
                                    borderRadius:ms(30),
                                    justifyContent: "center",
                                    alignItems: "center",
                                    backgroundColor: "black",
                                    marginTop: ms(5),
                                  }}
                                  source={{
                                    uri: Data?.commented_by?.profile_image,
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
                                      fontFamily: fonts.semiBold,
                                      color: themes[mode]["headingColor"],
                                      fontSize: ms(13),
                                    }}
                                  >
                                    {Data?.commented_by.name}
                                  </Text>

                                  {/* <View
                                  style={{
                                    marginTop: 3,
                                    marginLeft: 5,
                                    marginRight: 5,
                                    height: 5,
                                    width: 5,
                                    backgroundColor: themes[mode]["lightAsh"],
                                    borderRadius: 10,
                                  }}
                                ></View> */}
                                  {/* <Text
                                  style={{
                                    marginTop: 3,
                                    fontFamily: fonts.regular,
                                    color: themes[mode]["lightAsh"],
                                    fontSize: 12,
                                  }}
                                >
                                  {data?.unit.unit_number}
                                </Text> */}
                                </View>
                                <Text
                                  style={{
                                    fontFamily: fonts.regular,
                                    color: themes[mode]["lightAsh"],
                                    fontSize: ms(12),
                                  }}
                                >
                                  {customTimeFunction(
                                    Data?.created_at,
                                    new Date()
                                  )}
                                </Text>

                                <Text
                                  style={{
                                    fontFamily: fonts.regular,
                                    color: themes[mode]["headingColor"],
                                    fontSize: ms(13),
                                    marginTop: 7,
                                  }}
                                >
                                  {Data?.comment}
                                </Text>
                              </View>
                            </View>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                ) : (
                  <NoDataComp
                    noDataVector={<NoDocument />}
                    text="No Post Found"
                    message="No post found here"
                    bottomButtonText="OK"
                  />
                )}
              </>
            ) : (
              <View style={{ ...commonStyles.headerSpacing, marginTop: 15 }}>
                {[1]?.map((item) => {
                  return (
                    <View style={{ marginBottom: 20 }}>
                      <CommunityListLoader expand={true} />
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        </ScrollView>
        <View
          style={{
            height: ms(70),
            width: "100%",
            position: "absolute",
            bottom: 0,
            backgroundColor: themes[mode]["bgColor"],
            flexDirection: "row",
            // zIndex: 100,
            justifyContent: "center",
            alignItems: "center",
            elevation: 10,
            paddingBottom: ms(20),
            paddingTop: 20,
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.2,
            shadowRadius: 5,

          }}
        >
          <View>
            <View>
              <Image
                style={{
                  width: ms(30),
                  height: ms(30),
                  borderRadius: ms(30),
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "black",
                }}
                source={{
                  uri: props?.user_image,
                }}
              />
            </View>
          </View>
          <View>
            <View
              style={{
                height: ms(40),
                // width: "100%",
                borderRadius: ms(10),
                paddingHorizontal: ms(15),
                paddingVertical: ms(10),
                justifyContent: "center",
                marginLeft: ms(20),
                backgroundColor:
                  themes[mode][mode === "light" ? "lightAsh2" : "modalWrap"],
              }}
            >
              <TextInput
                multiline={true}
                name="comment"
                onChangeText={(value) => {
                  setcomment(value);
                }}
                value={comment}
                style={{
                  height: ms(40),
                  borderRadius: ms(10),
                  paddingHorizontal: ms(15),
                  paddingVertical: ms(10),
                  justifyContent: "center",
                  backgroundColor:
                    themes[mode][mode === "light" ? "lightAsh2" : "modalWrap"],
                  flexDirection: "row",
                  justifyContent: "center",
                  fontFamily: fonts.semiBold,
                  fontSize: ms(16),
                  color: themes[mode]["headingColor"],
                  letterSpacing: 1,
                  marginLeft: ms(5),
                  width: ms(200),
                }}
                placeholder={"comment here..."}
                placeholderTextColor={"#c1c1c1"}
              ></TextInput>
              {/* <View style={{ position: "absolute", left: 10 }}>
                <SearchIcon />
              </View> */}
            </View>
          </View>
          <View>
            {/* <CustomButton
              title="Send"
              buttonStyle={{
                ...styles.buttonStyle,
                backgroundColor: themes[mode]["primaryColor"],
                width: 55,
                borderRadius: 50,
              }}
              textStyle={{
                color: commonColors.darkWhite,
              }}
              handleSubmit={onSubmit}
            /> */}
            <TouchableOpacity onPress={onSubmit} style={{ marginLeft: 20 }}>
              <SendIcon />
            </TouchableOpacity>
          </View>
        </View>
      </WithBgHeader>
      </KeyboardAvoidingView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={false}
        onRequestClose={modalClose}
        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      >
        <TouchableWithoutFeedback onPressOut={modalClose}>
          <View
            style={{
              width: "85%",
              borderRadius: 10,
              alignSelf: "center",
              marginHorizontal: ms(10),
              // paddingVertical: 30,
              paddingTop: ms(15),
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
              {/* <Text
              style={{
                fontFamily: fonts.medium,
                fontSize: 20,
                color: '#282828',
                textAlign: 'center',
              }}>
              Logout
            </Text> */}
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
                    value={content}
                    handleChange={handleChange}
                    placeholder="Add your content here"
                    error={error}
                  />
                </View>
                <View style={{ marginTop: 0, paddingHorizontal: 20 }}>
                  <CustomButton
                    title={"Sumbit"}
                    buttonStyle={{
                      borderColor: commonColors.yellowColor,
                      backgroundColor: commonColors.yellowColor,
                    }}
                    textStyle={{
                      color: "#fff",
                    }}
                    handleSubmit={handleSubmit}
                    disableBtn={false}
                  />
                </View>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <ReportBottomView
        show={show}
        reportForm={reportForm}
        handleSubmit={handleSubmit}
        reportOff={ReportOff}
      />
    </SafeAreaView>
  );
};

const mapStateToProps = ({
  community: { showLoader, communityShowData, communityListData, likeEnable },
  profile: { user_image },
}) => {
  return {
    showLoader,
    communityShowData,
    communityListData,
    likeEnable,
    user_image,
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
export default connect(mapStateToProps, mapDispatchToProps)(CommunityShow);
