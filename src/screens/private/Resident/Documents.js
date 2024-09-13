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
import Animated, {
  Layout,
  ZoomIn,
  ZoomInUp,
  ZoomInDown,
  Transition,
  LightSpeedInRight,
} from "react-native-reanimated";
import {
  FocusAwareStatusBar,
  navigate,
} from "../../../navigation/RootNavigation";
import RenderHTML from "react-native-render-html";
import { complaint, profile } from "../../../redux/actions";
import SafeAreaView from "react-native-safe-area-view";
// import { HeaderOnly } from "../../../../components/Header";
import { ScrollView } from "react-native-gesture-handler";

import {
  CustomTextArea,
  CustomButton,
  WithBgHeader,
  NoDataComp,
} from "../../../components";
import commonStyles from "../../../styles/commonStyles";
import { detectTheme } from "../../../helpers";
import {
  DocumentFolderIcon,
  NoDocument,
  NoNotify,
  SettingIcon,
} from "../../../../assets/img/svgs";
import { SubscribeLoader } from "../../../../assets/img/loader";
import { customAnimation } from "../../../animation/CommonAnimation";
import { ms } from "../../../helpers/scaling";
const Documents = (props) => {
  const mode = detectTheme();
  const { FolderList, folderList, DocumentList, documentloader } = props;
  const filteredFolders = folderList?.filter((folder) => folder.doc_count > 0);
  useEffect(() => {
    FolderList();
  }, []);
  const ViewFolder = (id) => {
    DocumentList(id);
    // navigate("DocumentView");
  };
  console.log(folderList, "eoufheifiewff");
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
        {!documentloader ? (
          <>
            {filteredFolders.length > 0 ? (
              <WithBgHeader
                leftIcon
                headerTitle="Documents"
                containerStyle={{
                  ...commonStyles.headerSpacing,
                  // marginTop:0,
                }}
              >
                <View
                  style={{
                    ...commonStyles.headerSpacing,
                    marginTop: "0%",
                  }}
                >
                  {filteredFolders?.map((data, index) => {
                    return (
                      <Animated.View
                      
                      {...customAnimation("FadeInRight", 700, 50, index)}
                      >
                        <TouchableOpacity
                          style={{ marginBottom: 10 }}
                          onPress={() => ViewFolder(data.id)}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              paddingVertical: ms(10),
                              paddingHorizontal: ms(10),
                            }}
                          >
                            <View>
                              <DocumentFolderIcon />
                            </View>
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
                                    color: themes[mode]["headingColor"],
                                    fontSize:ms(14)

                                  }}
                                >
                                  {data.name}
                                </Text>
                              </View>
                              <View>
                                <Text
                                  style={{
                                    color: themes[mode]["lightAsh"],
                                    fontFamily: fonts.medium,
                                    fontSize:ms(12)
                                  }}
                                >
                                  {data.doc_active_count} Items
                                </Text>
                              </View>
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
                text="No Documents "
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
              // marginTop:0,
            }}
          >
            <View style={{ ...commonStyles.headerSpacing, marginTop: 15 }}>
              {[1, 2, 3, 4, 5, 6, 7]?.map((item) => {
                return <SubscribeLoader />;
              })}
            </View>
          </WithBgHeader>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const mapStateToProps = ({
  profile: { mode, folderList, documentloader },
  complaint: { reply },
  login: { submitted },
}) => {
  return {
    mode,
    reply,
    submitted,
    folderList,
    documentloader,
  };
};

const {
  submitReply,
  onComplaintsChange,
  complaintReply,
  complaintValidation,
  complaintsChange,
} = complaint;
const { FolderList, DocumentList } = profile;

const mapDispatchToProps = {
  submitReply,
  onComplaintsChange,
  complaintReply,
  complaintValidation,
  complaintsChange,
  FolderList,
  DocumentList,
};

export default connect(mapStateToProps, mapDispatchToProps)(Documents);
