import React, { Component } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  ImageStore,
} from "react-native";
import { themes, fonts, commonColors } from "../../../../themes";
import { Header } from "../../../../components/Header";
import moment from "moment";
import SafeAreaView from "react-native-safe-area-view";

import { connect } from "react-redux";
import { FocusAwareStatusBar } from "../../../../navigation/RootNavigation";
import {
  TextInput,
  FlatList,
  TouchableOpacity,
} from "react-native-gesture-handler";
import {
  complaintStatusExtractor,
  capitalizeTwoLetter,
  capitalize,
  capsConverter,
} from "../../../../helpers";
import { SvgUri, SvgXml } from "react-native-svg";
import { ShowComplaintLoader } from "../../../../../assets/img/loader";
import { CustomButton, WithBgHeader } from "../../../../components";
import { complaint } from "../../../../redux/actions";
import { showComplaints } from "../../../../api/complaint";
import commonStyles from "../../../../styles/commonStyles";
import { color } from "react-native-reanimated";
import Animated from "react-native-reanimated";
import { customAnimation } from "../../../../animation/CommonAnimation";
import { ms } from "../../../../helpers/scaling";

class ComplaintDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      composeText: "",
    };
  }

  componentDidMount() {
    const {
      showComplaint,
      navigation,
      onComplaintsChange,
      complaintsChange,
    } = this.props;
    const id = this.props?.route?.params?.data.type_id;

    this._unsubscribe = navigation.addListener("focus", async () => {
      console.log(id, this.props.route, "complaint details  idddd");
      showComplaint(id);
      onComplaintsChange({ name: "reply", value: "" });
    });
  }

  handleChangeText = (text) => {
    this.setState({ composeText: text });
  };

  onPressReply = () => {
    const { navigation } = this.props;
    navigation.navigate("ReplyComplaint");
  };

  renderItem = ({ item, index }) => {
    console.log(item, "iteeemmcomplanttss");
    const {
      id,
      identity_id,
      // s3_image_path,
      status,
      content,
      // complaint_type,
      catergory_name,
      help_desk_conversations,
      created_at,
      author_name,
      author_type,
    } = item;
    const even = index % 2 === 0 ? true : false;
    const { mode } = this.props;
    console.log("desscriptionnnnn");
    return (
      <Animated.View
        {...customAnimation("FadeInDown", 500, 200, index)}
        style={{ flexDirection: "row", marginBottom: 25 }}
      >
        <View
          style={{
            ...styles.iconStyle,
            backgroundColor:
              themes[mode][
                author_type === "Resident" ? "primaryColor" : "darkAsh"
              ],
          }}
        >
          <Text
            style={{
              fontFamily: fonts.bold,
              color: author_type === "Resident" ? "#292929" : "#fff",
            }}
          >
            {author_name &&
              capitalizeTwoLetter(
                author_type !== "Resident" ? "Admin" : author_name
              )}
          </Text>
        </View>

        <View
          style={{
            backgroundColor: themes[mode]["chatBg"],
            borderRadius: 8,
            paddingTop: 15,
            paddingLeft: 13,
            paddingRight: 18,
            paddingBottom: 10,
            maxWidth: "85%",
            minWidth: "40%",
            marginLeft: 15,
          }}
        >
          <Text
            style={{
              position: "absolute",
              top: 3,
              left: 5,
              fontFamily: fonts.semiBold,
              fontSize: 9,
              color: themes[mode]["headingColor"],
            }}
          >
            {author_type !== "Resident" ? "Admin" : "You"}
          </Text>
          <Text
            style={{
              fontFamily: fonts.light,
              fontSize:ms(15),
              lineHeight:ms(20),
              color: themes[mode]["headingColor"],
            }}
          >
            {content}
          </Text>
          <Text
            style={{
              fontFamily: fonts.medium,
              fontSize: ms(10),
              marginTop: 8,
              color: mode === "light" ? "#000" : "#fff",
              alignSelf: "flex-end",
            }}
          >
            {moment(created_at).format(
              moment(created_at).isSame(moment(), "day")
                ? "HH:mm"
                : "D MMM, HH:mm"
            )}
          </Text>
        </View>
      </Animated.View>
    );
  };

  render() {
    const { mode, showComplaintDetail, name } = this.props;
    const {
      id,
      identity_id,
      // s3_image_path,
      status,
      subject,
      description,
      // complaint_type,
      catergory_name,
      help_desk_conversations,
      questions,
    } = showComplaintDetail?.value;

    const { onPressReply } = this;
    console.log(questions, "propssssss detailss");

    return (
      <SafeAreaView
        style={{ backgroundColor: themes[mode]["bgClolor"] }}
        forceInset={{ top: "never" }}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            backgroundColor: themes[mode]["bgColor"],
            // paddingBottom: 50,
            marginBottom: 120,
            // paddingHorizontal: 20,

            // backgroundColor: '#FAFAFA',
          }}
          showsVerticalScrollIndicator={false}
          style={{
            height: "100%",
            // flex: 1,
            backgroundColor: themes[mode]["bgColor"],
            // backgroundColor: '#FAFAFA',
          }}
        >
          {/* <View style={{marginTop: '-5%'}}>
            <Header showLeftIcon leftIcon />
          </View> */}
          <WithBgHeader
            leftIcon
            containerStyle={{
              ...commonStyles.headerSpacing,
            }}
          >
            {Object.keys(showComplaintDetail.value).length === 0 ? (
              <View
                style={{
                  ...commonStyles.headerSpacing,
                }}
              >
                <ShowComplaintLoader />
              </View>
            ) : (
              <View
                style={{
                  ...commonStyles.headerSpacing,
                  marginTop: 10,
                }}
              >
                <Animated.View
                  {...customAnimation("FadeInDown", 700, 50, 0)}
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    // width: '100%',
                  }}
                >
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      justifyContent: "space-between",
                      // minWidth: '80%',
                      // maxWidth: '80%',
                    }}
                  >
                    {/* <View style={{marginLeft: 20}}> */}
                    <Text
                      style={{
                        fontFamily: fonts.semiBold,
                        fontSize:ms(16),
                        lineHeight: ms(20),
                        color: themes[mode]["headingColor"],
                        textTransform: "capitalize",
                        maxWidth: "85%",
                      }}
                    >
                      {subject}
                    </Text>
                    <View
                      style={{
                        paddingHorizontal: 10,
                        borderRadius: 20,
                        height: ms(20),
                        backgroundColor: complaintStatusExtractor(status)
                          .bgColor,
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: fonts.semiBold,
                          fontSize:ms(12),
                          marginVertical: 2,
                          color: complaintStatusExtractor(status).color,
                          textTransform: "capitalize",
                        }}
                      >
                        {status}
                      </Text>
                    </View>
                    {/* </View> */}
                  </View>
                </Animated.View>
                <Animated.View
                  {...customAnimation("FadeInDown", 700, 50, 0)}
                  style={{ flexDirection: "row" }}
                >
                  <Text
                    style={{
                      ...styles.complaintID,
                      color: themes[mode]["textColor"],
                      textTransform: "uppercase",
                    }}
                  >
                    {`ID #${identity_id}  \u2B24  `}
                  </Text>
                  <Text
                    style={{
                      ...styles.complaintID,
                      color: themes[mode]["textColor"],
                      textTransform: "capitalize",
                    }}
                  >
                    {catergory_name.replace(/[^a-zA-Z ]/g, " ")}
                  </Text>
                </Animated.View>
                <Animated.Text
                  {...customAnimation("FadeInDown", 700, 50, 0)}
                  style={{
                    ...styles.description,
                    color: themes[mode]["textColor"],
                    paddingVertical: 10,
                  }}
                >
                  {description}
                </Animated.Text>
                <Animated.View
                  {...customAnimation("FadeInDown", 700, 50, 0)}
                  style={{ paddingHorizontal: 0, paddingBottom: 0 }}
                >
                  {questions?.map((data) => {
                    return (
                      <>
                        {data.name != "Description" &&
                          data.name != "Subject" &&
                          data.name != "description" &&
                          data.name != "subject" &&
                          data.type != "image_picker" && (
                            <View
                              style={{
                                borderBottomWidth: 1,
                                borderLeftColor: "transparent",
                                borderTopColor: "transparent",
                                borderRightColor: "transparent",
                                borderColor: themes[mode]["bottom"],
                                paddingBottom: 5,
                                paddingTop: 10,
                              }}
                            >
                              <Text
                                style={{
                                  ...styles.description,
                                  color: themes[mode]["headingColor"],
                                  fontFamily: fonts.semiBold,
                                  paddingBottom: 10,
                                }}
                              >
                                {data.name}
                              </Text>
                              <Text
                                style={{
                                  ...styles.description,
                                  color: themes[mode]["textColor"],
                                  paddingBottom: 10,
                                }}
                              >
                                {console.log(data.answer, "wofjwhjwldwnhdw")}
                                {Array.isArray(data.answer)
                                  ? data.answer?.map((data) => data + " , ")
                                  : data.type == "date_time_picker"
                                  ? moment(data.answer).format(
                                      "DD/MMM/YYYY hh:mm"
                                    )
                                  : data.answer}
                              </Text>
                            </View>
                          )}
                      </>
                    );
                  })}

                  {questions?.map((data) => {
                    return (
                      data?.type == "image_picker" && (
                        <View
                          style={{
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Image
                            source={{
                              uri: data?.answer,
                            }}
                            style={{
                              width: 250,
                              height: 250,
                              marginBottom: "10%",
                              marginTop: 20,
                            }}
                          />
                        </View>
                      )
                    );
                  })}
                </Animated.View>
                {/* {s3_image_path && (
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginHorizontal: 30,
                    }}>
                    <Image
                      style={{width: '90%', height: 130}}
                      source={{
                        uri: s3_image_path,
                      }}
                    />
                  </View>
                )} */}
                {help_desk_conversations?.length > 0 && (
                  <View style={{ marginBottom: 50 }}>
                    <Animated.View
                      {...customAnimation("FadeInDown", 700, 50, 0)}
                      style={{
                        borderTopWidth: 1,
                        borderBottomWidth: 1,

                        borderLeftColor: "transparent",
                        borderRightColor: "transparent",
                        borderColor: themes[mode]["bottom"],
                        marginVertical: 15,
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: fonts.bold,
                          fontSize: 14,
                          color: themes[mode]["headingColor"],
                          marginVertical: 12,
                        }}
                      >
                        Reply
                      </Text>
                    </Animated.View>
                    <View style={{}}>
                      <FlatList
                        vertical
                        showsVerticalScrollIndicator={false}
                        keyExtractor={(item) => item.id}
                        data={help_desk_conversations || []}
                        legacyImplementation={false}
                        renderItem={this.renderItem}
                        style={styles.flatListContainer}
                        contentContainerStyle={{
                          flexGrow: 1,
                          paddingBottom: 120,
                        }}
                      />
                    </View>
                  </View>
                )}
              </View>
            )}
          </WithBgHeader>
        </ScrollView>
        {Object.keys(showComplaintDetail.value).length !== 0 && (
          <View
            style={{
              position: "absolute",
              width: "100%",
              bottom: 0,
              marginTop: 60,
              paddingHorizontal: 40,
              alignSelf: "center",
              backgroundColor: themes[mode]["bgColor"],
              height: 100,
            }}
          >
            <CustomButton
              title="Reply"
              buttonStyle={{
                width: "100%",
                height: 40,
                borderRadius: 5,
                backgroundColor: themes[mode]["primaryColor"],
                marginTop: 35,
              }}
              handleSubmit={onPressReply}
              textStyle={{
                color: commonColors.darkWhite,
              }}
            />
          </View>
        )}
      </SafeAreaView>
    );
  }
}

const mapStateToProps = ({
  profile: {
    mode,
    userData: { name },
  },
  complaint: { showComplaintDetail },
}) => {
  return {
    mode,
    name,
    showComplaintDetail,
  };
};
const { showComplaint, onComplaintsChange, complaintsChange } = complaint;
const mapDispatchToProps = {
  showComplaint,
  onComplaintsChange,
  complaintsChange,
};

const styles = StyleSheet.create({
  flatListContainer: {
    // paddingRight: 28,
    // paddingLeft: 28,
    marginTop: "10%",
  },
  smileIcon: { position: "absolute", top: 15, left: 10, zIndex: 1 },
  attachmentIcon: {
    position: "absolute",
    top: 16,
    right: 15,
  },
  composeInput: {
    backgroundColor: "#F5F7FB",
    borderRadius: 20,
    paddingLeft: 45,
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: 14,
    fontFamily: fonts.regular,
  },
  replyBlock: {
    flex: 1,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    paddingTop: 11,
    paddingBottom: 11,
    paddingLeft: 10,
  },
  description: {
    fontFamily: fonts.regular,
    fontSize: ms(14),
    lineHeight: ms(18),
    letterSpacing: 0.2,
  },
  iconStyle: {
    height: 35,
    width: 35,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  complaintID: {
    fontFamily: fonts.semiBold,
    fontSize: 14,
    marginVertical: 8,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ComplaintDetail);
