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
  RefreshControl,
  Animated,
  Image,
} from "react-native";
import { connect } from "react-redux";
import { themes, fonts, commonColors } from "../../../themes";
import {
  detectTheme,
  MyVisitorArrData,
  renderFacilityList,
  ShowMore,
  showMore,
  timeAgo,
  tailedString,
  windowSize,
} from "../../../helpers";
import SafeAreaView from "react-native-safe-area-view";
import { Header, HeaderOnly } from "../../../components/Header";
// import FacilityData from './facilities_data.json';
import { facility } from "../../../redux/actions";
import { FocusAwareStatusBar } from "../../../navigation/RootNavigation";
import {
  ArrowRight,
  FunctionHallIcon,
  GolfIcon,
  TennisIcon,
  IconNext,
  SettingIcon,
  ShareIcon,
} from "../../../../assets/img/svgs";
import {
  BannerImageLoader,
  ShowFacilityDescription,
  SOSLoader,
} from "../../../../assets/img/loader";
import {
  CustomButton,
  PaginationComponent,
  WithBgHeader,
} from "../../../components";
import BannerImage from "../../../components/BannerImage";
import commonStyles from "../../../styles/commonStyles";
import RenderHtml, { RenderHTML } from "react-native-render-html";
import Share from "react-native-share";
import { customAnimation } from "../../../animation/CommonAnimation";

class CondoInfo extends Component {
  constructor(props) {
    super(props);
  }
  ShareLocation = (location) => {
    const shareOptions = {
      url: location,
    }; // country code + phone number    filename: 'test' , // only for base64 file in Android  };
    Share.open(shareOptions)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        err && console.log(err);
      });
  };
  render() {
    const mode = detectTheme();
    const condoinfo = this.props?.route?.params?.condoinfo;
    const condoimages = this.props?.route?.params?.condoimages;
    const html = condoinfo.content;
    // const data = [];
    // condoinfo.condo_images?.map((data, index) => {
    //   data.push({ id: index, s3_image_path: data });
    // });
    console.log(condoimages, " gfeiugfgegybf ");
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: themes[mode]["bgColor"],
          width: "100%",
        }}
        forceInset={{ top: "never" }}
      >
        <WithBgHeader
          leftIcon
          // rightIcon={<ShareIcon color={themes[mode]["primaryColor"]} />}
          onPressRightIcon={() => {
            // navigation.navigate('NotificationSubscription');
          }}
          headerTitle={condoinfo.name}
          containerStyle={{
            ...commonStyles.headerSpacing,
          }}
        >
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              minHeight: "100%",
              paddingBottom: 20,
            }}
            style={{
              flex: 1,
            }}
            showsVerticalScrollIndicator={false}
          >
            {true ? (
              <Animated.View {...customAnimation("FadeInDown", 2000, 50, 0)}>
                <View style={{}}>
                  {condoimages.length > 1 ? (
                    <BannerImage
                      image_url={condoimages}
                      itemWidth={windowSize.width}
                      itemHeight={250}
                      dotStyle1={{
                        // ...commonStyles.spaceBtwnAlign,
                        ...styles.dotAlign,
                      }}
                      header={false}
                      // leftText={name}
                    />
                  ) : (
                   condoimages[0]?.s3_image_path && <Image
                      style={{ height: 250, width: "100%" }}
                      source={{
                        uri: condoimages[0]?.s3_image_path,
                      }}
                    />
                  )}
                </View>
                <View>
                  <View
                    style={{
                      marginHorizontal: 20,
                      marginVertical: 30,
                    }}
                  >
                    {/* <Text
                      style={{
                        marginBottom: 20,
                        fontFamily: fonts.bold,
                        fontSize: 17,
                        color: themes[mode]["headingColor"],
                      }}
                    >
                      {condoinfo.name}
                    </Text> */}
                    <View style={{ marginBottom: 20 }}>
                      <View
                        style={{
                          flexDirection: "row",
                          marginVertical: 10,
                        }}
                      >
                        <RenderHTML
                          contentWidth={"100%"}
                          tagsStyles={{
                            p: { color: themes[mode]["headingColor"] },
                          }}
                          source={{ html }}
                        />

                        {/* <Text
                          style={{
                            ...commonStyles.regular_16,
                            lineHeight: 24,
                            textTransform: "capitalize",
                            color: commonColors.textColor,
                          }}
                        >
                          {condoinfo.content}
                        </Text> */}
                        {/* <RenderHtml source={source} /> */}
                      </View>
                    </View>
                    {/* <View style={{}}>
                    <Text
                      style={{
                        ...commonStyles.bold_16,
                        color: commonColors.yellowColor,
                      }}>
                      About Venue
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        marginVertical: 15,
                      }}>
                      {about ||
                        [1, 2, 3]?.map(ele => {
                          return (
                            <View
                              style={{
                                borderWidth: 0.7,
                                borderRadius: 4,
                                borderColor: commonColors.lightAsh1,
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginRight: 5,
                              }}>
                              <Text
                                style={{
                                  ...commonStyles.regular_14,
                                  paddingHorizontal: 5,
                                  paddingVertical: 10,
                                  color: themes[mode]['headingColor'],
                                  textTransform: 'capitalize',
                                }}>
                                {ele}||Drinking Water
                              </Text>
                            </View>
                          );
                        })}
                    </View>
                  </View> */}
                  </View>
                </View>
              </Animated.View>
            ) : (
              <View>
                <BannerImageLoader />
              </View>
            )}
          </ScrollView>
          {condoinfo.location.length !== 0 && (
            <View
              style={{
                marginHorizontal: 40,
                marginVertical: 10,
              }}
            >
              <CustomButton
                buttonStyle={{
                  borderColor: commonColors.yellowColor,
                  backgroundColor: commonColors.yellowColor,
                }}
                textStyle={{
                  color: "#fff",
                }}
                title={"Share Location"}
                handleSubmit={() => {
                  this.ShareLocation(condoinfo.location);
                }}
              />
            </View>
          )}
        </WithBgHeader>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = ({
  profile: { mode },
  facility: { facilitiesList, facilitiesDetails },
}) => {
  return {
    mode,
    facilitiesList,
    facilitiesDetails,
  };
};
const {
  onFacilityDataChange,
  facilityValidation,
  facilityDescription,
} = facility;

const mapDispatchToProps = {
  onFacilityDataChange,
  facilityValidation,
  facilityDescription,
};
export default connect(mapStateToProps, mapDispatchToProps)(CondoInfo);

const styles = StyleSheet.create({
  dotAlign: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    alignItems: "center",
  },
});
