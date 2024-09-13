import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  useWindowDimensions,
} from "react-native";

import { themes, fonts, commonColors } from "../../../themes";
import { connect } from "react-redux";
import {
  FocusAwareStatusBar,
  navigate,
} from "../../../navigation/RootNavigation";
import RenderHTML from "react-native-render-html";
import { complaint } from "../../../redux/actions";
import SafeAreaView from "react-native-safe-area-view";
// import { HeaderOnly } from "../../../../components/Header";
import { ScrollView } from "react-native-gesture-handler";
import Share from "react-native-share";
import {
  CustomTextArea,
  CustomButton,
  WithBgHeader,
  NoDataComp,
} from "../../../components";
import commonStyles from "../../../styles/commonStyles";
import { detectTheme, tailedString } from "../../../helpers";
import {
  DocumentFolderIcon,
  DocumentImageIcon,
  NoDocument,
  NoNotify,
  PdfIcon,
  SettingIcon,
  ShareIcon,
} from "../../../../assets/img/svgs";
import moment from "moment";
import { SubscribeLoader } from "../../../../assets/img/loader";
import Animated from "react-native-reanimated";
import { customAnimation } from "../../../animation/CommonAnimation";

const DocumentView = (props) => {
  const mode = detectTheme();
  const { documentList, listLoader } = props;
  console.log(documentList, "ekjdbenkkejgdedbh");

  const ViewDocument = (ext, data) => {
    if (ext == "pdf") {
      navigate("PdfView", { data: { uri: data.s3_image_path, cache: true } });
    } else {
      navigate("ImageViewer", { data: [{ uri: data.s3_image_path }] });
    }
  };
  const ShareData = (data) => {
    // let shareImage = {
    //   title: "", //string
    //   message: "", //string
    //   url: data.s3_image_path, // eg.'http://img.gemejo.com/product/8c/099/cf53b3a6008136ef0882197d5f5.jpg',
    // };
    const shareOptions = {
      url: data.s3_image_path,
    }; // country code + phone number    filename: 'test' , // only for base64 file in Android  };
    Share.open(shareOptions)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        err && console.log(err);
      });
  };
  return (
    <SafeAreaView
      style={{
        backgroundColor: themes[mode]["bgColor"],
        flex: 1,
        height: "100%",
      }}
      forceInset={{ top: "never" }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        style={{
          backgroundColor: themes[mode]["bgColor"],
          flex: 1,
          // marginTop: '8%',
        }}
      >
        {!listLoader ? (
          <>
            {documentList.length > 0 ? (
              <WithBgHeader
                leftIcon
                headerTitle="Documents"
                containerStyle={{
                  ...commonStyles.headerSpacing,
                  // marginTop: 0,
                }}
              >
                <View
                  style={{
                    ...commonStyles.headerSpacing,
                    marginTop: "5%",
                  }}
                >
                  {documentList?.map((data, index) => {
                    var ext = data.s3_image_path.substr(
                      data.s3_image_path.lastIndexOf(".") + 1
                    );
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
                        <TouchableOpacity
                          onPress={() => ViewDocument(ext, data)}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              paddingVertical: 14,
                              paddingHorizontal: 10,
                              alignItems: "center",
                            }}
                          >
                            <View>
                              {ext == "pdf" ? (
                                <PdfIcon />
                              ) : (
                                <DocumentImageIcon />
                              )}
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
                                    {tailedString(data.name, 27)}
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
                              <TouchableOpacity onPress={() => ShareData(data)}>
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
              </WithBgHeader>
            ) : (
              <NoDataComp
                showLeftIcon
                leftIcon
                includeFont
                title="Documents"
                showRightIcon
                // rightIcon={<SettingIcon color={themes[mode]['primaryColor']} />}
                onPressRight={() => {
                  // navigation.navigate('NotificationSubscription');
                }}
                noDataVector={<NoDocument />}
                text="No Documents"
                message="No Document found here"
                bottomButtonText="OK"
              />
            )}
          </>
        ) : (
          <WithBgHeader
            leftIcon
            headerTitle="Documents"
            containerStyle={{
              ...commonStyles.headerSpacing,
            }}
          >
            <View style={{ ...commonStyles.headerSpacing, marginTop: 15 }}>
              {[1, 2, 3, 4, 5, 6, 7]?.map((item) => {
                return <SubscribeLoader />;
              })}
            </View>
          </WithBgHeader>
        )}
        {/* <NoDataComp
            showLeftIcon
            leftIcon
            includeFont
            title="Documents"
            showRightIcon
            // rightIcon={<SettingIcon color={themes[mode]['primaryColor']} />}
            onPressRight={() => {
              // navigation.navigate('NotificationSubscription');
            }}
            noDataVector={<NoDocument />}
            text="Empty Folder "
            message="No Document found if document found here is a place:)"
            bottomButtonText="OK"
            /> */}
      </ScrollView>
    </SafeAreaView>
  );
};

const mapStateToProps = ({
  profile: { mode, documentList, listLoader },
  complaint: { reply },
  login: { submitted },
}) => {
  return {
    mode,
    reply,
    submitted,
    documentList,
    listLoader,
  };
};

const {
  submitReply,
  onComplaintsChange,
  complaintReply,
  complaintValidation,
  complaintsChange,
} = complaint;
const mapDispatchToProps = {
  submitReply,
  onComplaintsChange,
  complaintReply,
  complaintValidation,
  complaintsChange,
};

export default connect(mapStateToProps, mapDispatchToProps)(DocumentView);
