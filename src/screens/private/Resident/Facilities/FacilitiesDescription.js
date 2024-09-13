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
  Alert,
} from "react-native";
import { connect } from "react-redux";

import { themes, fonts, commonColors } from "../../../../themes";
import {
  detectTheme,
  MyVisitorArrData,
  renderFacilityList,
  ShowMore,
  showMore,
  timeAgo,
  tailedString,
  windowSize,
  titleize,
} from "../../../../helpers";
import SafeAreaView from "react-native-safe-area-view";
import { Header, HeaderOnly } from "../../../../components/Header";
import FacilityData from "./facilities_data.json";
import { facility } from "../../../../redux/actions";
import {
  FocusAwareStatusBar,
  navigate,
} from "../../../../navigation/RootNavigation";
import {
  ArrowRight,
  FunctionHallIcon,
  GolfIcon,
  TennisIcon,
  IconNext,
} from "../../../../../assets/img/svgs";
import {
  BannerImageLoader,
  ShowFacilityDescription,
  SOSLoader,
} from "../../../../../assets/img/loader";
import {
  CustomButton,
  PaginationComponent,
  WithBgHeader,
} from "../../../../components";
import BannerImage from "../../../../components/BannerImage";
import commonStyles from "../../../../styles/commonStyles";
import RenderHtml from "react-native-render-html";
import { quickLinksAndServicesApi } from "../../../../api/localhelp";
import { ms } from "../../../../helpers/scaling";

class FacilitiesDescription extends Component {
  constructor(props) {
    super(props);
    this.state = {
      more: this.props?.route?.params?.item?.length > 200 ? true : false,
    };
  }
  componentDidMount() {
    const {
      navigation,
      facilityDescription,
      onFacilityDataChange,
      facilityValidation,
    } = this.props;
    const { questions } = this.props?.route?.params?.item;
    console.log(questions, "questions123");
    this._unsubscribe = navigation.addListener("focus", async () => {
      let questionary = questions?.map((data) => ({
        facility_question_id: data.id,
        answer: data.question_type == "text" ? "" : { yes: false, no: false },
      }));
      console.log(questionary, "questionary");
      onFacilityDataChange({ name: "questions", value: questionary });
      const resetBooking = () => {
        ["start_date", "start_time", "end_time", "comment", "accompanied"]?.map(
          (item) => {
            console.log("event listner logging 1");
            facilityValidation({
              name: item,
              value: item === "start_date" ? new Date() : "",
              error: "",
              stateChange: false,
            });
          }
        );
        facilityValidation({
          name: "fixed_amount",
          value: 0,
        });
        facilityValidation({
          name: "amount",
          value: 0,
        });
        facilityValidation({
          name: "deposit_amount",
          value: 0,
        });
        facilityValidation({
          name: "rule_ids",
          value: [],
        });
        facilityValidation({
          name: "SlotStore",
          value: [],
        });
        facilityValidation({
          name: "remarks",
          value: "",
        });
        facilityValidation({
          name: "payment_type",
          value: "",
        });
      };
      resetBooking();
      facilityDescription();
    });
  }
 convertMinutesToTime = (inputMinutes) => {
  const days = Math.floor(inputMinutes / (60 * 24));
  const hours = Math.floor((inputMinutes % (60 * 24)) / 60);
  const remainingMinutes = inputMinutes % 60;

  const formattedDays = days > 0 ? `${days} day${days > 1 ? 's' : ''}` : '';
  const formattedHours = hours > 0 ? `${hours} hr` : '';
  const formattedMinutes = remainingMinutes > 0 ? `${remainingMinutes} min` : '';

  const timeArray = [formattedDays, formattedHours, formattedMinutes];

  // Filter out empty strings and join the result
  return timeArray.filter((timePart) => timePart !== '').join(' ');
};
  render() {
    const { facilitiesDetails, mode, navigation } = this.props;
    const {
      name,
      alias_name,
      title_image,
      banner_images,
      about,
      id,
      description,
      open_time,
      close_time,
      booking_type,
      payment_method,
      time_slot,
      approval,
      amount,
      occupancy,
      max_duration,
      splited_hours,
      slot,
      deposit_amount,
      deposit_mode,
      payment_mode,
      slots,
      facility_settings,
      max_booking_quota,
      non_peak_slots_quota_num,
      peak_slots_quota_num,
      enable_non_peak_quota,
      enable_peak_quota,
      enable_questions,
      questions,
      advance_booking_period_num,
      no_quota_booking,
      last_minute_booking,
      last_minute_grace_time,
      last_minute_booking_type,
      enable_auto_cancellation,
      auto_cancel_time,
      cancel_after_approval,
      last_minute_cancellation_duration,
      daily_release_of_new_slots,
      daily_release_of_new_slot_time,
      auto_cancel_num,
      deposit_refund_type,
      deposit_auto_refund_days,
      deposit_auto_refund_time,
    } = this.props?.route?.params?.item;
    console.log(
      daily_release_of_new_slots,
      daily_release_of_new_slot_time,
      "desccriptt advance_booking_period_num"
    );
    const { route } = this.props;
    const { more } = this.state;

    console.log(banner_images, "facility route checkk");
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
          headerTitle={name}
          containerStyle={{
            ...commonStyles.headerSpacing,
          }}
          onPressLeftIcon={() => {
            navigation.goBack();
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
            {Object.entries(this.props?.route?.params?.item).length > 0 ? (
              <View>
                <View style={{}}>
                  <BannerImage
                    image_url={banner_images}
                    itemWidth={windowSize.width}
                    itemHeight={300}
                    dotStyle1={{
                      ...styles.dotAlign,
                    }}
                  />
                </View>
                <View>
                  <View
                    style={{
                      marginHorizontal: 20,
                      marginVertical: 30,
                    }}
                  >
                    <Text
                      style={{
                        ...commonStyles.bold_18,
                        color: commonColors.yellowColor,
                      }}
                    >
                      Rules
                    </Text>
                    <View style={{ paddingHorizontal: 10 }}>
                      <View
                        style={{
                          flexDirection: "row",
                          gap: 10,
                          marginVertical: 10,
                        }}
                      >
                        <Text
                          style={{
                            ...commonStyles.medium_16,
                            color: themes[mode]["lightAsh"],
                          }}
                        >
                          {`\u25CF`}{" "}
                        </Text>
                        <Text
                          style={{
                            ...commonStyles.medium_16,
                            color: themes[mode]["lightAsh"],
                          }}
                        >
                          {" "}
                          Approval type :{" "}
                          <Text
                            style={{
                              fontWeight: "700",
                              color: themes[mode]["headingColor"],
                            }}
                          >
                            {titleize(approval)}{" "}
                          </Text>
                        </Text>
                      </View>
                      {payment_method == "paid" && (
                        <View
                          style={{
                            flexDirection: "row",
                            gap: 10,
                            marginVertical: 10,
                          }}
                        >
                          <Text
                            style={{
                              ...commonStyles.medium_16,
                              color: themes[mode]["lightAsh"],
                            }}
                          >
                            {`\u25CF`}{" "}
                          </Text>
                          <Text
                            style={{
                              ...commonStyles.medium_16,
                              color: themes[mode]["lightAsh"],
                            }}
                          >
                            {" "}
                            <Text
                              style={{
                                ...commonStyles.medium_16,
                                color: themes[mode]["lightAsh"],
                              }}
                            >
                              {facility_settings?.[0]?.refund_type ==
                                "conditional_refund" &&
                                `The payment will be refunded only if the booking is cancelled before ${this.convertMinutesToTime(
                                  facility_settings?.[0]
                                    ?.last_minute_refund_duration
                                )}`}
                              {facility_settings?.[0]?.refund_type ==
                                "refund_always" &&
                                "The payment will be refunded always"}
                              {facility_settings?.[0]?.refund_type ==
                                "forfeit_always" &&
                                "The payment will be forfeited always"}
                            </Text>
                          </Text>
                        </View>
                      )}

                      {payment_method == "paid" && (
                        <View
                          style={{
                            flexDirection: "row",
                            gap: 10,
                            marginVertical: 10,
                          }}
                        >
                          <Text
                            style={{
                              ...commonStyles.medium_16,
                              color: themes[mode]["lightAsh"],
                            }}
                          >
                            {`\u25CF`}{" "}
                          </Text>
                          <Text
                            style={{
                              ...commonStyles.medium_16,
                              color: themes[mode]["lightAsh"],
                            }}
                          >
                            {" "}
                            Deposite Refund type :{" "}
                            <Text
                              style={{
                                fontWeight: "700",
                                color: themes[mode]["headingColor"],
                              }}
                            >
                              {titleize(deposit_refund_type)}{" "}
                              {deposit_refund_type == "auto_refund" &&
                                `( ${deposit_auto_refund_days > 0 &&
                                  `${deposit_auto_refund_days} days ${deposit_auto_refund_time}`} )`}
                            </Text>
                          </Text>
                        </View>
                      )}
                      <View
                        style={{
                          flexDirection: "row",
                          gap: 10,
                          marginVertical: 10,
                        }}
                      >
                        <Text
                          style={{
                            ...commonStyles.medium_16,
                            color: themes[mode]["lightAsh"],
                          }}
                        >
                          {`\u25CF`}{" "}
                        </Text>
                        <Text
                          style={{
                            ...commonStyles.medium_16,
                            color: themes[mode]["lightAsh"],
                          }}
                        >
                          You can book this facility only{" "}
                          <Text
                            style={{
                              fontWeight: "700",
                              color: themes[mode]["headingColor"],
                            }}
                          >
                            {" "}
                            {advance_booking_period_num} days
                          </Text>{" "}
                          prior to the booking day
                        </Text>
                      </View>

                      {enable_auto_cancellation && (
                        <View
                          style={{
                            flexDirection: "row",
                            gap: 10,
                            marginVertical: 10,
                          }}
                        >
                          <Text
                            style={{
                              ...commonStyles.medium_16,
                              color: themes[mode]["lightAsh"],
                            }}
                          >
                            {`\u25CF`}{" "}
                          </Text>
                          <Text
                            style={{
                              ...commonStyles.medium_16,
                              color: themes[mode]["lightAsh"],
                            }}
                          >
                            If the booking is not approved by management for{" "}
                            <Text
                              style={{
                                fontWeight: "700",
                                color: themes[mode]["headingColor"],
                              }}
                            >
                              {auto_cancel_num > 0 && `${auto_cancel_num} days`}{" "}
                              {auto_cancel_time}{" "}
                            </Text>
                            the booking will be cancelled automatically
                          </Text>
                        </View>
                      )}
                      {cancel_after_approval && (
                        <View
                          style={{
                            flexDirection: "row",
                            gap: 10,
                            marginVertical: 10,
                          }}
                        >
                          <Text
                            style={{
                              ...commonStyles.medium_16,
                              color: themes[mode]["lightAsh"],
                            }}
                          >
                            {`\u25CF`}{" "}
                          </Text>
                          <Text
                            style={{
                              ...commonStyles.medium_16,
                              color: themes[mode]["lightAsh"],
                            }}
                          >
                            Till{" "}
                            <Text
                              style={{
                                fontWeight: "700",
                                color: themes[mode]["headingColor"],
                              }}
                            >
                              {this.convertMinutesToTime(
                                last_minute_cancellation_duration
                              )}{" "}
                            </Text>{" "}
                            before the slot time the booking can be cancelled
                          </Text>
                        </View>
                      )}

                      {last_minute_booking && (
                        <View
                          style={{
                            flexDirection: "row",
                            gap: 10,
                            marginVertical: 10,
                          }}
                        >
                          <Text
                            style={{
                              ...commonStyles.medium_16,
                              color: themes[mode]["lightAsh"],
                            }}
                          >
                            {`\u25CF`}{" "}
                          </Text>
                          <Text
                            style={{
                              ...commonStyles.medium_16,
                              color: themes[mode]["lightAsh"],
                            }}
                          >
                            Till{" "}
                            <Text
                              style={{
                                fontWeight: "700",
                                color: themes[mode]["headingColor"],
                              }}
                            >
                              {this.convertMinutesToTime(
                                last_minute_grace_time
                              )}
                            </Text>{" "}
                            {last_minute_booking_type} the slot time the booking
                            can be done for this facility
                          </Text>
                        </View>
                      )}
                      {daily_release_of_new_slots && (
                        <View
                          style={{
                            flexDirection: "row",
                            gap: 10,
                            marginVertical: 10,
                          }}
                        >
                          <Text
                            style={{
                              ...commonStyles.medium_16,
                              color: themes[mode]["lightAsh"],
                            }}
                          >
                            {`\u25CF`}{" "}
                          </Text>
                          <Text
                            style={{
                              ...commonStyles.medium_16,
                              color: themes[mode]["lightAsh"],
                            }}
                          >
                            Everyday At{" "}
                            <Text
                              style={{
                                fontWeight: "700",
                                color: themes[mode]["headingColor"],
                              }}
                            >
                              {daily_release_of_new_slot_time}
                            </Text>{" "}
                            the new slots for this facility will be available
                            for you to book
                          </Text>
                        </View>
                      )}
                    </View>

                    <View style={{ marginBottom: 20 }}>
                      <Text
                        style={{
                          ...commonStyles.bold_18,
                          color: commonColors.yellowColor,
                        }}
                      >
                        Description
                      </Text>
                      <View
                        style={{
                          flexDirection: "row",
                          marginVertical: 10,
                        }}
                      >
                        <Text
                          style={{
                            ...commonStyles.regular_16,
                            lineHeight:ms(24),
                            textTransform: "capitalize",
                            color: commonColors.textColor,
                          }}
                        >
                          {more ? tailedString(description, 200) : description}
                          <View>
                            {more && (
                              <ShowMore
                                onPress={() => {
                                  this.setState({ more: false });
                                }}
                              />
                            )}
                          </View>
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            ) : (
              <View>
                <BannerImageLoader />
              </View>
            )}
          </ScrollView>
          <View
            style={{
              marginHorizontal: 40,
              marginVertical: 20,
            }}
          >
            <CustomButton
              title={"Book Now"}
              handleSubmit={() =>
                navigation.navigate("FacilitiesForm", {
                  id,
                  name,
                  open_time,
                  close_time,
                  time_slot,
                  booking_type,
                  payment_method,
                  approval,
                  amount,
                  occupancy,
                  max_duration,
                  splited_hours,
                  slot,
                  deposit_amount,
                  payment_mode,
                  deposit_mode,
                  slots,
                  facility_settings: facility_settings[0],
                  max_booking: max_booking_quota,
                  no_non_peak: non_peak_slots_quota_num,
                  no_peak: peak_slots_quota_num,
                  isPeak: enable_peak_quota,
                  isNonPeak: enable_non_peak_quota,
                  isQuota: no_quota_booking,
                  advanceBookingDate: advance_booking_period_num,
                  isDefaultTime: last_minute_booking,
                  minutes: last_minute_grace_time,
                  minutesType: last_minute_booking_type,
                  enable_questions,
                  questions,
                })
              }
              buttonStyle={{
                backgroundColor: commonColors.yellowColor,
              }}
              textStyle={{
                color: commonColors.darkWhite,
              }}
            />
          </View>
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
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FacilitiesDescription);

const styles = StyleSheet.create({
  dotAlign: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    alignItems: "center",
  },
});
