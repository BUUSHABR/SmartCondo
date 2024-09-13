import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Keyboard,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableHighlight,
  // ScrollView,
  RefreshControl,
  Modal,
  TouchableWithoutFeedback,
  BackHandler,
  Image,
} from "react-native";
import { connect } from "react-redux";
import * as RootNavigation from "../../../../navigation/RootNavigation";
import { SafeAreaView } from "react-native-safe-area-context";
import { themes, fonts } from "../../../../themes";
import Share from "react-native-share";
import { login, notification, home } from "../../../../redux/actions";
import VisitorTypes from "../../../../components/VisitorsType";
import {
  BannerImage,
  CustomModal,
  NoDataCompSearch,
  WithBgHeader,
} from "../../../../components";
import {
  NotificationLoader,
  ShowComplaintLoader,
  ShowAnnouncementDetailLoader,
} from "../../../../../assets/img/loader";
import moment from "moment";
import { Header } from "../../../../components/Header";

import {
  defaultAnnounce,
  handleBackPage,
  SliceName,
  windowSize,
} from "../../../../helpers";
import { customAnimation } from "../../../../animation/CommonAnimation";
import Animated from "react-native-reanimated";
import { PdfIcon, ShareIcon } from "../../../../../assets/img/svgs";
import commonStyles from "../../../../styles/commonStyles";
import { ms } from "../../../../helpers/scaling";
class AnnouncementDetail extends Component {
  componentDidMount() {
    const {
      navigation,
      showAnnouncement,
      announcementDetails,
      homePageLoader,
      homePageData,
    } = this.props;
    console.log(this.props, "ppppppp");
    const {
      data: { type_id },
    } = this.props?.route?.params;

    this._unsubscribe = navigation.addListener("focus", async () => {
      console.log(this.props.route, "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF");
      console.log(type_id, "iddddd");
      // homePageLoader('announcementLoader', true);

      this.props?.route?.params?.data?.type_id
        ? showAnnouncement(type_id)
        : homePageData({
            name: "announcementDetails",
            data: defaultAnnounce[0],
          });
    });
    this._unsubscribe1 = navigation.addListener("blur", async () => {
      console.log("BLURRR INVITE");

      homePageData({ name: "announcementDetails", data: {} });
    });
    // BackHandler.addEventListener('hardwareBackPress', () => {
    //   console.log(handleBackPage('Visitor'));
    //   RootNavigation.navigate('MyVisitorsList');
    // });
  }

  ShareData = (data) => {
    // let shareImage = {
    //   title: "", //string
    //   message: "", //string
    //   url: data.s3_image_path, // eg.'http://img.gemejo.com/product/8c/099/cf53b3a6008136ef0882197d5f5.jpg',
    // };
    const shareOptions = {
      url: data.url,
    }; // country code + phone number    filename: 'test' , // only for base64 file in Android  };
    Share.open(shareOptions)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        err && console.log(err);
      });
  };
  ViewDocument = (data) => {
    RootNavigation.navigate("PdfView", {
      data: {
        uri: data.uri,
        cache: true,
        name: SliceName(data.name, 10)
          .replace(/\n/g, " ")
          .trim(),
      },
    });
  };
  // componentWillUnmount() {
  //   BackHandler.addEventListener('hardwareBackPress', () => {
  //     RootNavigation.navigate(handleBackPage('MyVisitorsList'));
  //   });
  // }
  render() {
    const { mode, announcementDetails } = this.props;
    const { title, message, expire_at } = announcementDetails;
    console.log(
      announcementDetails,
      // title,
      // message,
      // Object.keys(announcementDetails).length,
      // [announcementDetails].length > 0 ? true : false,
      "announdce detailsss"
    );
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: themes[mode]["bgColor"],
          paddingHorizontal: 10,
        }}
        forceInset={{ top: "never" }}
      >
        <WithBgHeader
          includeFont
          leftIcon
          containerStyle={{
            marginTop: 20,
            // ...commonStyles.headerSpacing,
            // marginTop: 0,
          }}
        >
          {/* <View style={{ marginTop: "-7%" }}>
          <Header
            includeFont
            showLeftIcon
            leftIcon
            showRightIcon
            title=""
            onPressLeftIcon
          />
        </View> */}
          <Animated.View
            {...customAnimation("FadeInDown", 700, 500, 1)}
            style={{ height: "100%", paddingBottom: 30 }}
          >
            <ScrollView
              contentContainerStyle={{
                flexGrow: 1,
                minHeight: "100%",
                paddingBottom: 150,
              }}
              style={{
                // marginTop: "-60%",
                // marginHorizontal: 20,
                flex: 1,
              }}
              showsVerticalScrollIndicator={false}
            >
              <View style={{ marginTop: 15 }}>
                {announcementDetails?.announcement_banners?.length > 1 ? (
                  <BannerImage
                    image_url={announcementDetails?.announcement_banners}
                    itemWidth={windowSize.width}
                    itemHeight={200}
                    dotStyle1={
                      // ...commonStyles.spaceBtwnAlign,
                      {
                        position: "absolute",
                        bottom: 0,
                        width: "100%",
                        alignItems: "center",
                      }
                    }
                    header={false}
                    // leftText={name}
                  />
                ) : announcementDetails?.announcement_banners ? (
                  announcementDetails?.announcement_banners[0]
                    ?.s3_image_path && (
                    <Image
                      style={{ height: 250, width: "100%" }}
                      source={{
                        uri:
                          announcementDetails?.announcement_banners[0]
                            ?.s3_image_path,
                      }}
                    />
                  )
                ) : null}
              </View>
              <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
                {Object.keys(announcementDetails).length > 0 ? (
                  <View>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          maxWidth: "75%",
                          fontFamily: fonts.bold,
                          fontSize: ms(19),
                          lineHeight: ms(29),
                          color: themes[mode]["headingColor"],
                          textTransform: "capitalize",
                          marginRight: 5,
                          marginBottom: expire_at ? 0 : 10,
                        }}
                      >
                        {title}
                      </Text>
                    </View>
                    {/* <View>
                      {expire_at ? (
                        <Text
                          style={{
                            fontFamily: fonts.regular,
                            fontSize: 12,
                            marginTop: 15,
                            marginBottom: 8,
                            color: themes[mode]["headingColor"],
                            letterSpacing: 0.4,
                          }}
                        >
                          {moment(expire_at).format("DD MMM, hh:mm a")}
                        </Text>
                      ) : null}
                    </View> */}
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <View
                        style={{
                          width: 40,
                          height: 6,
                          borderRadius: 19,
                          backgroundColor: themes[mode]["primaryColor"],
                        }}
                      />
                      <View
                        style={{
                          width: 4,
                          height: 4,
                          borderRadius: 2,
                          backgroundColor: themes[mode]["primaryColor"],
                          marginHorizontal: 5,
                        }}
                      />
                    </View>
                    <Text
                      style={{
                        fontFamily: fonts.light,
                        fontSize:ms(14),
                        lineHeight: ms(26),
                        color: themes[mode]["headingColor"],
                        marginTop: "10%",
                        // textTransform: 'capitalize',
                        letterSpacing: 0.5,
                      }}
                    >
                      {message.charAt(0).toUpperCase() + message.slice(1)}
                    </Text>
                  </View>
                ) : (
                  <ShowAnnouncementDetailLoader />
                )}
              </View>
              <View style={{ paddingHorizontal: 20, marginTop: 10 }}>
                {announcementDetails?.announcement_pdf?.map((data, index) => {
                  return (
                    <Animated.View
                      {...customAnimation("FadeInRight", 700, 50, index)}
                      style={{
                        backgroundColor: "white",
                        borderRadius: 10,
                        elevation: 15,
                        marginBottom: 15,
                        paddingLeft: 10,
                        paddingRight: 25,
                        shadowOffset: { width: 0, height: 3 },
                        shadowOpacity: 0.2,
                        shadowRadius: 5,
                      }}
                    >
                      <TouchableOpacity onPress={() => this.ViewDocument(data)}>
                        <View
                          style={{
                            flexDirection: "row",
                            paddingVertical: 14,
                            paddingHorizontal: 10,
                            alignItems: "center",
                          }}
                        >
                          <View>
                            <PdfIcon />
                          </View>
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                              width: "100%",
                              alignItems: "center",
                            }}
                          >
                            <View
                              style={{
                                flexDirection: "column",
                                marginLeft: 20,
                                justifyContent: "space-between",
                              }}
                            >
                              <View>
                                <Text
                                  style={{
                                    fontFamily: fonts.semiBold,
                                    color: themes["light"]["headingColor"],
                                  }}
                                >
                                  {SliceName(data.name, 20)
                                    .replace(/\n/g, " ")
                                    .trim()}
                                </Text>
                              </View>
                              <View>
                                <Text
                                  style={{
                                    color: themes[mode]["lightAsh"],
                                    fontFamily: fonts.medium,
                                  }}
                                >
                                  {moment(data.created_at).format(
                                    "DD-MM-YYYY, hh:mm A"
                                  )}
                                </Text>
                              </View>
                            </View>
                            <TouchableOpacity
                              onPress={() => this.ShareData(data)}
                            >
                              <View style={{ marginRight: 15 }}>
                                <ShareIcon />
                              </View>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </TouchableOpacity>
                    </Animated.View>
                  );
                })}
              </View>
            </ScrollView>
          </Animated.View>
        </WithBgHeader>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = ({
  profile: { mode },
  home: { announcementDetails },
}) => {
  return {
    mode,
    announcementDetails,
  };
};

const { showAnnouncement, homePageData, homePageLoader } = home;

const mapDispatchToProps = {
  showAnnouncement,
  homePageData,
  homePageLoader,
};

export default connect(mapStateToProps, mapDispatchToProps)(AnnouncementDetail);
