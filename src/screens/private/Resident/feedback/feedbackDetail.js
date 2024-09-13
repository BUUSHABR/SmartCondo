import React, { Component } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  ImageStore,
  TouchableHighlight,
  Alert,
} from "react-native";
import { themes, fonts, commonColors } from "../../../../themes";
import { Header } from "../../../../components/Header";
import moment from "moment";
import SafeAreaView from "react-native-safe-area-view";

import { connect } from "react-redux";
import {
  FocusAwareStatusBar,
  navigate,
} from "../../../../navigation/RootNavigation";
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
  detectTheme,
} from "../../../../helpers";
import { SvgUri, SvgXml } from "react-native-svg";
import { ShowComplaintLoader } from "../../../../../assets/img/loader";
import {
  CustomButton,
  ToastMessage,
  WithBgHeader,
} from "../../../../components";
import { complaint } from "../../../../redux/actions";
import { showComplaints } from "../../../../api/complaint";
import commonStyles from "../../../../styles/commonStyles";
import { color } from "react-native-reanimated";
import Animated from "react-native-reanimated";
import { customAnimation } from "../../../../animation/CommonAnimation";
import { onClickTicket, showTicket } from "../../../../redux/actions/feedback";
import { deleteTicketComment } from "../../../../api/feedback";
import { TicketEdit } from "../../../../../assets/img/svgs";
import { ModalContainer } from "../LocalHelp/Components/ModalContainer";
import { FeedBackRating } from "./feedbackRating";
import { ms } from "../../../../helpers/scaling";

class FeedbackDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      composeText: "",
      showRating: false,
    };
  }

  componentDidMount() {
    const { showTicket, navigation, onClickTicket } = this.props;
    const id = this.props?.route?.params?.data.type_id;

    this._unsubscribe = navigation.addListener("focus", async () => {
      console.log(id, this.props.route, "complaint details  idddd");
      showTicket(id);
    });
    this._unsubscribe = navigation.addListener("blur", async () => {
      console.log(id, this.props.route, "complaint details  idddd");
      onClickTicket({ name: "showTicketDetail", value: {} });
    });
  }

  handleChangeText = (text) => {
    this.setState({ composeText: text });
  };

  onPressReply = () => {
    const { navigation } = this.props;
    navigate("FeedbackRply", {
      data: {
        type_id: this.props?.route?.params?.data.type_id,
      },
    });
  };
  deleteComment = (id) => {
    const { showTicket } = this.props;

    Alert.alert(
      "Delete Comment",
      "Are you sure you want to delete this comment ?",
      [
        {
          text: "No",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => {
            deleteTicketComment(id)
              .then((data) => {
                const id = this.props?.route?.params?.data.type_id;
                showTicket(id);
                ToastMessage(200, data.message);
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

  renderItemImage = ({ item, index }) => {
    console.log(item, "nciebiweiwdddkkdbiwe", index);
    const mode = detectTheme();
    return (
      <View style={{ marginHorizontal: 10, paddingVertical: 20 }}>
        <Image
          style={{
            resizeMode: "cover",
            width: 70,
            height: 60,
            // marginTop: -10,
            borderRadius: 10,
            backgroundColor: themes[mode]["lightAsh"],
          }}
          source={{ uri: item?.s3_path }}
          // source={{
          //   uri: 'https://bms-assets.katomaran.in/ci/images/facilities/InShot_20220111_223540691.jpg',
          // }}
          // source={{
          //    item?.path,
          // }}
        />
      </View>
    );
  };
  renderItem = ({ item, index }) => {
    console.log(item, "iteeecomment ticket");
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
      commented_by_you,
      message,
      attachments,
    } = item;
    const even = index % 2 === 0 ? true : false;
    const { mode } = this.props;
    console.log("desscriptionnnnn");
    return (
      <TouchableHighlight
        onLongPress={() => commented_by_you && this.deleteComment(id)}
      >
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
              {commented_by_you &&
                capitalizeTwoLetter(!commented_by_you ? "Admin" : "U")}
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
              {!commented_by_you ? "Admin" : "You"}
            </Text>
            <Text
              style={{
                fontFamily: fonts.light,
                fontSize:ms(15),
                lineHeight: ms(20),
                color: themes[mode]["headingColor"],
              }}
            >
              {message}
            </Text>

            <FlatList
              // initialScrollIndex={value.length > 5 ? value.length - 1 : 0}
              // removeClippedSubviews={true}
              horizontal
              data={attachments}
              renderItem={this.renderItemImage}
              keyExtractor={(item) => item.created_at}
              showsHorizontalScrollIndicator={false}
              extraData={attachments}
              // nestedScrollEnabled={true}
            />
            <Text
              style={{
                fontFamily: fonts.medium,
                fontSize: 10,
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
      </TouchableHighlight>
    );
  };

  render() {
    const { mode, showComplaintDetail, name, showTicketDetail } = this.props;
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
    console.log("propssssss showTicketDetail", showTicketDetail);

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
            {Object.keys(showTicketDetail).length === 0 ? (
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
                    <View style={{ flexDirection: "row" }}>
                      <Text
                        style={{
                          fontFamily: fonts.semiBold,
                          fontSize: ms(16),
                          lineHeight: ms(20),
                          color: themes[mode]["headingColor"],
                          textTransform: "capitalize",
                          maxWidth: "85%",
                        }}
                      >
                        {/* {subject} */}
                        {showTicketDetail?.title}
                      </Text>
                      <View
                        style={{
                          marginLeft: 10,
                          paddingHorizontal: 10,
                          borderRadius: 20,
                          height: 20,
                          backgroundColor: complaintStatusExtractor(
                            showTicketDetail?.status
                          ).bgColor,
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: fonts.semiBold,
                            fontSize: 12,
                            marginVertical: 2,
                            color: complaintStatusExtractor(
                              showTicketDetail?.status
                            ).color,
                            textTransform: "capitalize",
                          }}
                        >
                          {showTicketDetail?.status}
                        </Text>
                      </View>
                    </View>
                    <TouchableHighlight
                      style={{
                        padding: 5,

                        borderRadius: 5,

                        backgroundColor: themes[mode]["primaryColor"],
                      }}
                    >
                      <TicketEdit />
                    </TouchableHighlight>
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
                    {`ID #${showTicketDetail?.identity_id}  \u2B24  `}
                  </Text>
                  <Text
                    style={{
                      ...styles.complaintID,
                      color: themes[mode]["textColor"],
                      textTransform: "capitalize",
                    }}
                  >
                    {showTicketDetail?.ticket_category?.name?.replace(
                      /[^a-zA-Z ]/g,
                      " "
                    )}
                  </Text>
                </Animated.View>
                <TouchableHighlight
                  onPress={() =>
                    this.setState({ showRating: !this.state.showRating })
                  }
                >
                  <Text
                    style={{ color: "#2D9CDB", fontSize: 17, fontWeight: "700",textDecorationLine:"underline" }}
                  >
                    Rate Us
                  </Text>
                </TouchableHighlight>
                <Animated.Text
                  {...customAnimation("FadeInDown", 700, 50, 0)}
                  style={{
                    ...styles.description,
                    color: themes[mode]["textColor"],
                    paddingVertical: 10,
                  }}
                >
                  {showTicketDetail?.description}
                </Animated.Text>

                <View>
                  <FlatList
                    // initialScrollIndex={value.length > 5 ? value.length - 1 : 0}
                    // removeClippedSubviews={true}
                    horizontal
                    data={showTicketDetail?.attachments}
                    renderItem={this.renderItemImage}
                    keyExtractor={(item) => item.created_at}
                    showsHorizontalScrollIndicator={false}
                    extraData={showTicketDetail?.attachments}
                    // nestedScrollEnabled={true})
                  />
                </View>

                {showTicketDetail?.ticket_comments?.length > 0 && (
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
                        data={showTicketDetail?.ticket_comments || []}
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
            {this.state.showRating && (
              <ModalContainer>
                <FeedBackRating id ={this.props?.route?.params?.data.type_id} showTicket={showTicket} />
              </ModalContainer>
            )}
          </WithBgHeader>
        </ScrollView>
        {showTicketDetail?.ticket_category?.enable_comment_section && (
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
  feedback: { showTicketDetail },
  complaint: { showComplaintDetail },
}) => {
  return {
    mode,
    name,
    showComplaintDetail,
    showTicketDetail,
  };
};

const { showComplaint, onComplaintsChange, complaintsChange } = complaint;
const mapDispatchToProps = {
  showTicket,
  showComplaint,
  onComplaintsChange,
  complaintsChange,
  onClickTicket,
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

export default connect(mapStateToProps, mapDispatchToProps)(FeedbackDetail);
