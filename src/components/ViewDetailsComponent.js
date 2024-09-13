import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ScrollView,
  Alert,
  TouchableOpacity,
  Linking,
} from "react-native";
import SafeAreaView from "react-native-safe-area-view";
import { useDispatch, useSelector } from "react-redux";

import { themes, fonts } from "../themes";
import {
  detectTheme,
  visitorStatus,
  viewDetailsIcon,
  titleize,
  vehicleDetailsActionProps,
} from "../helpers";
import { CustomButton, ToastMessage, WithBgHeader } from ".";
import commonStyles from "../styles/commonStyles";
import {
  DownloadPdf,
  EditVehicleIcon,
  SettingIcon,
  ShareIcon,
} from "../../assets/img/svgs";
import DeleteIcon from "../../assets/img/delete-user.svg"
import Share from "react-native-share";
import { ResendInvite } from "../api/invite";
import { ms } from "../helpers/scaling";
import { DeleteResident, SwapResidentPostion, SwapVehiclePostion } from "../api/registration";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { navigate } from "../navigation/RootNavigation";
import InviteDetailBottomView from "./InviteDetailBottomView";
import { facilitygenerateStripeToken } from "../api/facility_booking";
import { Dimensions } from "react-native";
import { fetchConfigs } from "../api/home";

const ViewDetailsComponent = ({ details }) => {
  const userData = useSelector(state => state.profile.userData);
  const [VehiclePositionChangeAccess, setVehiclePositionChangeAccess] = useState(false);
  const [ResidentDeleteAccess, setResidentDeleteAccess] = useState(false);

  const [modal, setModal] = useState(false);
  const mode = detectTheme();
  // Get the width of the screen
  const screenWidth = Dimensions.get('window').width;
  const {
    headerProp,
    detailsProp,
    detailsActionButton,
    descriptionProp,
    buttonStyle,
    buttonWrapperStyle,
    showCancelButton,
    sendSms,
    inviteUrl,
    inviteid,
    facility_answers,
    remarks,
    swapPositionProp,
    residentId,
    getProfile,
    status,
    stripe_call_back_url,
    payment,
    payment_type,
    payment_mode,
    share,
    web_ui,
    id,
    isInvite,
    invitesId,
    refetch,
    vehicleId
  } = details;
  console.log("uytu", vehicleId, details)
  console.log(isInvite, "[View Details Component Details ]");
  const { title } = headerProp;
  const dispatch = useDispatch();

  useEffect(() => {
    fetchConfigs().then((data) => {
      console.log("lopao", data?.data?.resident_config?.allow_vehicle_position_change);
      setVehiclePositionChangeAccess(data?.data?.resident_config?.allow_vehicle_position_change);
      const res_delete = data?.data?.resident_config?.allow_resident_delete_from_sc && ["primary", "secondary"].includes(userData?.current_unit?.resident_position);
      setResidentDeleteAccess(res_delete);
    }).catch((err) => {
      console.log(err, "log err");
    });
  }, []);


  const invitationHandler = () => {
    console.log("inurl", inviteUrl)
    const shareOptions = {
      message: inviteUrl,
    }; // country code + phone number    filename: 'test' , // only for base64 file in Android  };
    Share.open(shareOptions)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        err && console.log(err);
      });
  };
  const facilityHandler = async () => {
    if (isInvite) {
      Alert.alert(
        "Update Vehicle",
        "Are you sure you want to update a vehicle number ?",
        [
          {
            text: "No",
            onPress: () => { },
            style: "cancel",
          },
          {
            text: "Yes",
            onPress: () => {
              setModal(true);
            },
          },
        ]
      );
    } else if (residentId) {

      Alert.alert("Delete Resident?", "Are you sure you want to Delete this Resident , you will lose all his/her details  ?",
        [
          {
            text: "No",
            onPress: () => { },
            style: "cancel"
          },
          {
            text: "Yes",
            onPress: async () => {
              await DeleteResident(residentId).then((res) =>{
                console.log(res);
                if(res.status) {
                navigate("ListResident"),
                ToastMessage(200, "Resident Deleted Successfully")
                }
              }
              ).catch((err) => {
                ToastMessage(400, "Deletion Failed")
              })
            }

          }
        ])
      // ;
    } else {
      const shareOptions = {
        message: `${web_ui}/bookings/${id}`,
      }; // country code + phone number    filename: 'test' , // only for base64 file in Android  };
      Alert.alert(
        "Visitor Access",
        "Are you sure you want to share a facility access for visitors ?",
        [
          {
            text: "No",
            onPress: () => { },
            style: "cancel",
          },
          {
            text: "Yes",
            onPress: () => {
              Share.open(shareOptions)
                .then((res) => {
                  console.log(res);
                })
                .catch((err) => {
                  err && console.log(err);
                });
            },
          },
        ]
      );
    }
  };
  let arrOfObj = Object.keys(detailsProp)?.map((key) => {
    return { [key]: detailsProp[key] };
  });
  console.log("viewdetails comp invite123", showCancelButton);
  const SendInvite = () => {
    Alert.alert("Send SMS", "Are you sure you want to send the SMS ?", [
      {
        text: "No",
        onPress: () => { },
        style: "cancel",
      },
      {
        text: "Yes",
        onPress: () => {
          ResendInvite(inviteid)
            .then((data) => {
              ToastMessage(200, data.message);
            })
            .catch((err) => {
              let message = err[1].data ? err[1].data[0] : err[1]?.message;
              ToastMessage(err[0], message);
            });
        },
      },
    ]);
  };

  const handleSwapPostion = async (type) => {
    let user = await AsyncStorage.getItem("user");
    console.log(
      JSON.parse(user)?.data?.current_unit.id,
      "hanldeSwapPosition onclick",
      type
    );

    Alert.alert(
      "Resident Position",
      "Are you sure you want to change resident position ?",
      [
        {
          text: "No",
          onPress: () => { },
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => {
            SwapResidentPostion(JSON.parse(user)?.data?.current_unit.id, {
              resident_id: residentId,
              type:
                type == "UnAssign Secondary"
                  ? "remove_secondary"
                  : type?.toLowerCase(),
            })
              .then((data) => {
                console.log("Recr");
                // getProfile();
                console.log("Recr2");

                navigate("ListResident");
                console.log("Recr3");

                ToastMessage(200, data.message);
                console.log("Recr4");

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

  const handleSwapVehiclePosition = async (type) => {
    console.log("type", type)
    let user = await AsyncStorage.getItem("user");

    Alert.alert(
      "Vehicle Position",
      "Are you sure you want to change vehicle position ?",
      [
        {
          text: "No",
          onPress: () => { },
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => {
            const bodyMap = {
              "First": { first_vehicle: vehicleId },
              "Second": { second_vehicle: vehicleId },
              "Third": { third_vehicle: vehicleId },
              "other": { other: vehicleId },
            };
            console.log("polk", bodyMap[type])
            SwapVehiclePostion(JSON.parse(user)?.data?.current_unit.id, bodyMap[type]).then((data) => {
              console.log("ediie", data);
              ToastMessage(200, data.message);
              navigate("ListResident");

            }).catch((err) => {
              console.log("update Err", err);
              let message = err[1].data ? err[1].data[0] : err[1]?.message;
              ToastMessage(err[0], message);
            })
            // navigate("ProfileScreen");
            // SwapVehiclePostion(JSON.parse(user)?.data?.current_unit.id,{type:detailsProp.id} )
          },
        },
      ]
    );
  }

  handleCompletePayment = () => {
    if (status === "Reserved") {
      navigate("FacilityStripeWebView", {
        webViewUrl: stripe_call_back_url,
      });
    } else if (payment) {
      navigate("FacilityStripeWebView", {
        webViewUrl: stripe_call_back_url,
      });
    } else {
      facilitygenerateStripeToken(id)
        .then((data) => {
          console.log("facilitygenerateStripeToken", data);
          navigate("FacilityStripeWebView", {
            webViewUrl: data?.data,
          });
        })
        .catch((err) => {
          let message = err[1].data ? err[1].data[0] : err[1]?.message;
          ToastMessage(err[0], message);
        });
    }
  };



  // console.log(status, "status viewDetails compo");
  // conditions to payment & vehicele positioning 
  const second =
    ["cash", "card", "cheque", "others", "attachment_with_bill"].includes(
      payment_type
    ) && status == "Payment Initiated";
  const first = status == "Reserved";
  const third = payment && status == "Payment Initiated";
  const paymentcondition = payment_mode !== "unpaid" && payment_mode !== "offline"
  const VehicleDetailsButton = vehicleDetailsActionProps(detailsProp?.vehicle_position?.value);

  return (
    <SafeAreaView
      style={{
        backgroundColor: themes[mode]["bgColor"],
        height: "100%",
      }}
      forceInset={{ top: "never" }}
    >
      <WithBgHeader
        animation={true}
        leftIcon
        headerTitle={title}
        containerStyle={{
          ...commonStyles.headerSpacing,
        }}
        rightIcon={
          share && status === "Confirmed" ? (
            <ShareIcon color={themes[mode]["primaryColor"]} />
          ) : isInvite && status === "Upcoming" ? (
            <EditVehicleIcon color={themes[mode]["primaryColor"]} />
          ) : ResidentDeleteAccess && residentId  &&
            (userData?.current_unit?.resident_position == "primary" ? (swapPositionProp === "primary" ? false : true) : userData?.current_unit?.resident_position == "secondary" ? (["primary", "secondary"].includes(swapPositionProp) ? false : true) : false)

            ? (
              <DeleteIcon width={30} height={30} fill="none" color={themes[mode]["primaryColor"]} />
            ) : false
        }

        onPressRightIcon={facilityHandler}
      >
        <ScrollView
          contentContainerStyle={{
            // marginHorizontal: 20,
            // flexGrow: 1,
            paddingBottom: 200,
            // ...commonStyles.headerSpacing,
            marginHorizontal: 15,
            // height: "100%",
          }}
          style={{
            height: "100%",
            // marginTop: '-58%',
          }}
          showsVerticalScrollIndicator={false}
        // keyboardShouldPersistTaps="handled"
        >
          <View
            style={{
              ...commonStyles.headerSpacing,
              marginTop: 0,
            }}
          >
            <View style={{}}>
              <View
                style={{
                  ...styles.row1,
                }}
              >
                {Object.values(detailsProp).length > 0 ? (
                  <FlatList
                    nestedScrollEnabled
                    columnWrapperStyle={{
                      flex: 1,
                      justifyContent: "space-between",
                    }}
                    numColumns={2}
                    data={arrOfObj}
                    renderItem={({ item, index }) => {
                      const { val } = item;

                      let key1 = Object.keys(item)[0];
                      let val1 = Object.values(item)[0];
                      console.log(key1, val1, "dwkjdwdkjwdkjwdkj");
                      return (
                        <View
                          style={{
                            ...styles.col1,
                            paddingLeft: Math.abs(index % 2) == 1 ? 10 : 0,
                          }}
                        >
                          <View
                            style={{
                              ...styles.ele1,
                            }}
                          >
                            {viewDetailsIcon(key1, val1).icon}
                            <Text
                              style={{
                                ...styles.label,
                                color: themes[mode]["textColor"],
                              }}
                            >
                              {viewDetailsIcon(key1, val1).label}
                            </Text>
                          </View>
                          <Text
                            style={{
                              ...styles.value,
                              color:
                                key1 === "status"
                                  ? visitorStatus(val).color
                                  : themes[mode]["headingColor"],
                              textTransform:
                                key1 === "time" ||
                                  key1 === "in_time" ||
                                  key1 === "start_time" ||
                                  key1 === "end_time" ||
                                  key1 === "accompanied"
                                  ? "none"
                                  : key1 === "vehicle_number"
                                    ? "uppercase"
                                    : "capitalize"
                              ,
                            }}
                          >
                            {viewDetailsIcon(key1, val1).val ==
                              "Payment Initiated"
                              ? "Payment Pending"
                              : viewDetailsIcon(key1, val1).val}
                          </Text>
                        </View>
                      );
                    }}
                  />
                ) : null}
              </View>

              {!details.notes &&
                detailsProp?.visitor_type_name?.value != "pickup/drop" && (
                  <View>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <View>
                        {viewDetailsIcon("notes", descriptionProp.notes).icon}
                      </View>
                      <Text
                        style={{
                          ...styles.label,
                          color: themes[mode]["textColor"],
                        }}
                      >
                        {viewDetailsIcon("notes", descriptionProp.notes).label}
                      </Text>
                    </View>

                    <Text
                      style={{
                        ...styles.value,
                        color: themes[mode]["headingColor"],
                        textTransform: "capitalize",
                      }}
                    >
                      {viewDetailsIcon("notes", descriptionProp.notes).val}
                    </Text>
                  </View>
                )}
              {console.log(
                details?.facility_answers,
                "details?.facility_answers"
              )}
              {details?.facility_answers?.length > 0 && (
                <View>
                  <View>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginTop: ms(10),
                      }}
                    >
                      <View>
                        {viewDetailsIcon("notes", descriptionProp.notes).icon}
                      </View>
                      <Text
                        style={{
                          ...styles.label,
                          color: themes[mode]["textColor"],
                        }}
                      >
                        Questions
                      </Text>
                    </View>
                    <View style={{ marginLeft: ms(23), marginTop: ms(5) }}>
                      {details?.facility_answers?.map((data, index) => {
                        return (
                          <View style={{ paddingVertical: ms(10) }}>
                            <Text
                              style={{
                                color: themes[mode]["headingColor"],
                                fontFamily: fonts.semiBold,
                                fontSize: 14,
                              }}
                            >
                              {index + 1} . {data?.question}
                            </Text>
                            <Text
                              style={{
                                color: themes[mode]["lightAsh"],
                                fontFamily: fonts.semiBold,
                                fontSize: 14,
                                marginLeft: ms(15),
                              }}
                            >
                              Ans : {""}
                              {data?.question_type == "text"
                                ? data?.answer
                                : data?.answer == "true"
                                  ? "Yes"
                                  : "No"}
                            </Text>
                          </View>
                        );
                      })}
                    </View>
                  </View>
                </View>
              )}
              {details?.paidProps?.paid?.value && (
                <View>
                  <View>
                    <View style={{ flexDirection: "row" }}>
                      <View>
                        {viewDetailsIcon("notes", descriptionProp.notes).icon}
                      </View>
                      <Text
                        style={{
                          ...styles.label,
                          color: themes[mode]["textColor"],
                        }}
                      >
                        Booking Recipt
                      </Text>
                    </View>
                    <View
                      style={{ alignItems: "center", justifyContent: "center" }}
                    >
                      <Image
                        source={{
                          uri: details?.paidProps?.paid?.value.s3_image_path,
                        }}
                        style={{
                          width: 250,
                          height: 250,
                          marginBottom: "10%",
                          marginTop: 20,
                        }}
                      />
                    </View>
                  </View>
                </View>
              )}
              {details?.depositeProps?.paid?.value && (
                <View>
                  <View>
                    <View style={{ flexDirection: "row" }}>
                      <View style={{width:ms(10),height:ms(10)}}>
                        {viewDetailsIcon("notes", descriptionProp.notes).icon}
                      </View>
                      <Text
                        style={{
                          ...styles.label,
                          color: themes[mode]["textColor"],
                        }}
                      >
                        Deposite Receipt
                      </Text>
                    </View>
                    <View
                      style={{ alignItems: "center", justifyContent: "center" }}
                    >
                      <Image
                        source={{
                          uri:
                            details?.depositeProps?.paid?.value.s3_image_path,
                        }}
                        style={{
                          width: 250,
                          height: 250,
                          marginBottom: "10%",
                          marginTop: 20,
                        }}
                      />
                    </View>
                  </View>
                </View>
              )}
              {details?.downloadedProps?.dowloadpdf?.value && (
                <View>
                  <View>
                    <View style={{ flexDirection: "row" }}>
                      <View>
                        {viewDetailsIcon("notes", descriptionProp.notes).icon}
                      </View>
                      <Text
                        style={{
                          ...styles.label,
                          color: themes[mode]["textColor"],
                        }}
                      >
                        Download Receipt
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => {
                        Linking.openURL(
                          details?.downloadedProps?.dowloadpdf?.value
                        ).catch((err) => {
                          console.log(err, "[Invoice url] error");
                        });
                      }}
                      style={{
                        alignItems: "center",
                        justifyContent: "center",
                        height: 100,
                        width: 100,
                        backgroundColor: "white",
                        alignSelf: "center",
                        marginTop: 30,
                        borderRadius: 20,
                        borderColor: "#FFC727",
                        borderWidth: 1,
                      }}
                    >
                      <DownloadPdf />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              {/* {descriptionProp?.notes ? (
              <View>
                <View style={{flexDirection: 'row'}}>
                  <View>
                    {viewDetailsIcon('notes', descriptionProp.notes).icon}
                  </View>
                  <Text
                    style={{
                      ...styles.label,
                      color: themes[mode]['textColor'],
                    }}>
                    {viewDetailsIcon('notes', descriptionProp.notes).label}
                  </Text>
                </View>

                <Text
                  style={{
                    ...styles.value,
                    color: themes[mode]['headingColor'],
                    textTransform: 'capitalize',
                  }}>
                  {viewDetailsIcon('notes', descriptionProp.notes).val}
                </Text>
              </View>
            ) : null} */}
            </View>
          </View>
        </ScrollView>
        {console.log(detailsActionButton, "detailsActionButton")}

        {detailsActionButton?.length > 0 && (
          <>
            <View style={[buttonWrapperStyle, { ...styles.buttonsView }]}>
              {detailsActionButton?.map((item) => {
                const {
                  btnText,
                  buttonStyle,
                  textStyle,
                  action,
                  disableBtn,
                } = item;
                return (
                  <View style={{ marginTop: 50 }}>
                    {/* {showCancelButton && ( */}
                    <View
                      style={{
                        flexDirection: "row",
                        width: "100%",
                        justifyContent:
                          showCancelButton == "send + share"
                            ? "space-between"
                            : "center",
                      }}
                    >
                      {(showCancelButton == "send" ||
                        showCancelButton == "send + share") && (
                          <CustomButton
                            title={"Resend"}
                            handleSubmit={SendInvite}
                            buttonStyle={{
                              width:
                                // screenWidth *0.8,
                                showCancelButton == "send + share" ? screenWidth * 0.4 : screenWidth * 0.8,
                            }}
                          />
                        )}

                      {(showCancelButton == "share" ||
                        showCancelButton == "send + share") && (
                          <CustomButton
                            title={"Share"}
                            handleSubmit={invitationHandler}
                            buttonStyle={{
                              width:
                                showCancelButton == "send + share" ? screenWidth * 0.4 : screenWidth * 0.8,
                            }}
                          />
                        )}
                    </View>
                    {/* )} */}

                    <CustomButton
                      title={btnText}
                      buttonStyle={{ ...buttonStyle, width: screenWidth * 0.8 }}
                      textStyle={textStyle}
                      handleSubmit={() => dispatch(action)}
                      disableBtn={disableBtn}
                    />
                  </View>
                );
              })}
              {/* {isInvite && (
                <View style={[]}>
                  <View style={{}}>
                    <View
                      style={{
                        width: "100%",
                        justifyContent: "center",
                      }}
                    >
                      <CustomButton
                        title={"Update Vehicle"}
                        handleSubmit={() => setModal(true)}
                        // buttonStyle={{
                        //   width: 305,
                        // }}
                      />
                    </View>
                  </View>
                </View>
              )} */}
              {(first || second || third) && (paymentcondition) && (
                <View
                  style={[
                    buttonWrapperStyle,
                    { position: "absolute", bottom: 70 },
                  ]}
                >
                  <View style={{ marginTop: 50 }}>
                    <View
                      style={{
                        width: "100%",
                        justifyContent: "center",
                      }}
                    >
                      <CustomButton
                        title={"Complete Payment"}
                        handleSubmit={handleCompletePayment}
                        buttonStyle={{
                          width: screenWidth * 0.8,
                          backgroundColor: themes[mode]["primaryColor"],
                        }}
                      />
                    </View>
                  </View>
                </View>
              )}
            </View>
          </>
        )}

        {["primary", "secondary"].includes(userData?.current_unit?.resident_position) && ["primary", "secondary", ""].includes(swapPositionProp) && (
          <View style={[buttonWrapperStyle, { ...styles.buttonsView }]}>
            <View style={{ marginTop: 50 }}>
              <View
                style={{
                  width: "100%",
                  justifyContent: "center",
                }}
              >
                {["primary", "", "secondary"].includes(swapPositionProp) && (
                  <CustomButton
                    title={
                      swapPositionProp === "primary" ? "Secondary" : "Primary"
                    }
                    handleSubmit={() =>
                      handleSwapPostion(
                        swapPositionProp === "primary"
                          ? "Secondary"
                          : "Primary".toLowerCase()
                      )
                    }
                    buttonStyle={{
                      width: screenWidth * 0.8,
                      backgroundColor: themes[mode]["primaryColor"],
                    }}
                  />
                )}

                {["", "secondary"].includes(swapPositionProp) && (
                  <CustomButton
                    title={
                      swapPositionProp === "secondary"
                        ? "UnAssign Secondary"
                        : "Secondary"
                    }
                    handleSubmit={() =>
                      handleSwapPostion(
                        swapPositionProp === "secondary"
                          ? "UnAssign Secondary"
                          : "Secondary".toLowerCase()
                      )
                    }
                    buttonStyle={{
                      width: screenWidth * 0.8,
                    }}
                  />
                )}
              </View>
            </View>
          </View>
        )}
        {VehiclePositionChangeAccess && vehicleId && ["primary", "secondary"].includes(userData?.current_unit?.resident_position) && (
          <View style={[buttonWrapperStyle, { ...styles.buttonsView }]}>
            <View style={{ marginTop: 50 }}>
              <View
                style={{
                  width: "100%",
                  justifyContent: "center",
                }}
              >
                {VehicleDetailsButton.map((value, index) => (


                  <CustomButton
                    title={value}
                    handleSubmit={() =>
                      handleSwapVehiclePosition(["First", "Second", "Third"].includes(value) ? value : "other")
                    }
                    buttonStyle={{
                      width: screenWidth * 0.8,
                      backgroundColor: ["First", "Second", "Third"].includes(value) ? themes[mode]["primaryColor"] : undefined,
                    }}
                  />
                ))}
              </View>
            </View>
          </View>
        )}
        <InviteDetailBottomView
          refetch={refetch}
          id={invitesId}
          modal={modal}
          onClose={() => {
            setModal(false);
          }}
        />
      </WithBgHeader>
    </SafeAreaView>
  );
};

export default ViewDetailsComponent;

const styles = StyleSheet.create({
  row1: {
    flexDirection: "row",
    marginVertical: "5%",
    flexWrap: "wrap",
  },
  col1: {
    width: "50%",
    marginVertical: 15,
  },
  ele1: {
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    fontFamily: fonts.regular,
    fontSize:ms(14),
    marginLeft: 10,
  },
  value: {
    fontFamily: fonts.semiBold,
    fontSize: ms(16),
    lineHeight: ms(20),
    marginLeft: 25,
    marginVertical: 5,
  },
  buttonsView: {
    position: "absolute",
    bottom: 30,
    width: "80%",
    alignSelf: "center",
    // flexDirection: 'row',
    justifyContent: "space-between",
  },
});


