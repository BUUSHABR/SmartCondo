import React, { Component, useEffect } from "react";
import { Alert, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "react-redux";

import SafeAreaView from "react-native-safe-area-view";

import { themes, commonColors } from "../../../../themes";
import { detectTheme } from "../../../../helpers";
import ViewDetailsComponent from "../../../../components/ViewDetailsComponent";
import { invite } from "../../../../redux/actions";
import commonStyles from "../../../../styles/commonStyles";
import { WithBgHeader } from "../../../../components";
import { ShowVisitorDetailsLoader } from "../../../../../assets/img/loader";
import { navigate } from "../../../../navigation/RootNavigation";
import { fetchConfigs } from "../../../../api/home";
global.count = 0;
global.result = "";

class MyInvitationsDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isContractorShare: "",
      sendInviteVia: "",
      buttonFlow: "",
      status: "",
    };
  }
  ButtonFlow = (purpose, sendInviteVia, isContractorShare, status) => {
    console.log(
      sendInviteVia,
      "00000000000000000 invite123",
      purpose,
      isContractorShare
    );
    let result = "";
    if (purpose == "contractor") {
      console.log("22222222222222222222222 invite123");
      if (isContractorShare) {
        if (sendInviteVia == "share" || sendInviteVia == "send + share") {
          console.log("333333333333333333333333 invite123");

          result = sendInviteVia;
        } else {
          console.log("444444444444444444444 invite123");
          result = "";
        }
      } else {
        result = status == "invited" ? sendInviteVia : "";
      }
    } else {
      console.log("55555555555555555555 invite123");
      result = sendInviteVia;
    }
    console.log("6666666666666 invite123", result);
    return result;
  };

  async componentDidMount() {
    const { navigation, showInviteDetails, onClickInvite } = this.props;
    const { type_id } = this.props?.route?.params.data;
    this._unsubscribe = navigation.addListener("focus", async () => {
      global.count = 0;

      console.log(type_id, "iddddd in invite detaillssss invite123");
      await showInviteDetails(type_id);
      await fetchConfigs()
        .then(({ data }) => {
          const { inviteDetails } = this.props;
          console.log(
            data?.invite_config?.send_invite_via,
            data?.invite_config?.auto_approve_contractor,
            "0987654567890- invite123",
            inviteDetails
          );
          this.setState({
            isContractorShare: data?.invite_config?.auto_approve_contractor,
            sendInviteVia: data?.invite_config?.send_invite_via,
          });
          // let flow = this.ButtonFlow(
          //   inviteDetails?.purpose,
          //   data?.invite_config?.send_invite_via,
          //   data?.invite_config?.auto_approve_contractor,
          //   inviteDetails?.status
          // );
          // console.log(flow, "-111111111111111 invite123");
          // this.setState({
          //   buttonFlow: flow,
          // });
        })
        .catch((err) => {
          console.log(err, "kkk");
        });
    });
    this._unsubscribe1 = navigation.addListener("blur", async () => {
      global.count = 0;
      console.log("BLURRR INVITE");
      onClickInvite({ name: "showCancelButton", value: true });
      onClickInvite({ name: "inviteDetails", value: {} });
    });
  }
  refetch = () => {
    const { showInviteDetails } = this.props;
    const { type_id } = this.props?.route?.params.data;
    showInviteDetails(type_id);
  };
  ReInvite = (purpose, details, sub_visitor_type) => {
    console.log(details, "ooooo");
    purpose = purpose == "guest" ? "Visitor" : purpose;
    navigate("VisitorForm", {
      purpose,
      details,
      sub_visitor_type,
    });
  };
  onCancel = (id) => {
    this.props.cancelMyInvite(id);
    this.props.onClickInvite({
      name: "showCancelButton",
      value: false,
    });
  };
  render() {
    const { isInvite } = this.props?.route?.params.data;

    const { submitted, inviteDetails, showCancelButton, mode } = this.props;
    const {
      invitees,
      sub_visitor_type,
      purpose,
      visiting_time,
      remarks,
      state,
      id,
      reason,
      self_invite,
      send_sms,
      invite_url,
      content,
      status
    } = inviteDetails;
    console.log("herdftcyvghubinjokm,llo", inviteDetails);
    if (invitees?.[0].employer) {
      var sorted = {
        name: { label: "", value: invitees?.[0].name },
        phone: { label: "", value: invitees?.[0].phone },
        visitor_type_name: { label: "", value: purpose },
        ...type,
        date: { label: "", value: visiting_time },
        vehicle_number: {
          label: "",
          value: invitees?.[0].vehicle_number,
        },
        company: {
          label: "",
          value: invitees?.[0].employer,
        },
        reason: {
          label: "",
          value: reason,
        },
      };
    } else {
      var sorted = {
        name: { label: "", value: invitees?.[0].name },
        phone: { label: "", value: invitees?.[0].phone },
        visitor_type_name: { label: "", value: purpose },
        ...type,
        date: { label: "", value: visiting_time },
        vehicle_number: {
          label: "",
          value: invitees?.[0].vehicle_number,
        },
      };
    }
    let type = sub_visitor_type
      ? {
          type: {
            label: `Type of ${purpose}`,
            value: sub_visitor_type,
          },
        }
      : null;
    console.log(invitees?.[0].name, "dark knight");
    console.log(`[My Invitation Details ] Button Flow Before ${count}`);
    // if (global.count < 7) {
    //   global.count = global.count++;
    //   console.log(`[My Invitation Details ] Button Flow Entered ${count}`);
    //   this.setState({
    //     buttonFlow: this.ButtonFlow(
    //       inviteDetails?.purpose,
    //       this.state.sendInviteVia,
    //       this.state.isContractorShare,
    //       inviteDetails?.status
    //     ),
    //   });
    // }

    if (inviteDetails?.purpose == "contractor") {
      console.log("22222222222222222222222 invite123");
      if (this.state.isContractorShare) {
        if (
          this.state.sendInviteVia == "share" ||
          this.state.sendInviteVia == "send + share"
        ) {
          console.log("333333333333333333333333 invite123");

          global.result = this.state.sendInviteVia;
        } else {
          console.log("444444444444444444444 invite123");
          global.result = "";
        }
      } else {
        global.result =
          inviteDetails?.status == "invited" ? this.state.sendInviteVia : "";
      }
    } else {
      console.log("55555555555555555555 invite123");
      global.result = this.state.sendInviteVia;
    }
    console.log("6666666666666 invite123", global.result);

    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: themes[mode]["bgColor"],

          // height: '100%',
        }}
        // console.log(invitees?[0].name,"name")

        forceInset={{ top: "never" }}
      >
        {Object.keys(inviteDetails).length < 1 ? (
          <WithBgHeader
            animation={true}
            leftIcon
            headerTitle="Invitation"
            // containerStyle={{
            //   ...commonStyles.headerSpacing,
            // }}
            headerStyle={{
              ...commonStyles.headerSpacing,
            }}
          >
            {[1, 2, 3, 4]?.map((item) => {
              return (
                <View style={{}}>
                  <ShowVisitorDetailsLoader />
                </View>
              );
            })}
          </WithBgHeader>
        ) : (
          <ViewDetailsComponent
            details={{
              status:state,
              refetch: this.refetch,
              inviteid: id,
              notes: false,
              invitesId: invitees?.[0]?.id,
              sendSms: send_sms,
              inviteUrl: content,
              isInvite: true,
              showCancelButton:
                state === "Upcoming"
                  ? self_invite
                    ? false
                    : global.result
                  : false,
              headerProp: {
                title: `Invitation`,
                onPressRight: () => {},
                rightText: " ",
                showLeftIcon: true,
                leftIcon: true,
              },
              detailsProp: sorted,
              descriptionProp: {
                notes: { label: "", value: remarks },
              },
              detailsActionButton:
                state === "Upcoming"
                  ? showCancelButton && [
                      {
                        btnText: "Cancel Invite",
                        action: () => {
                          Alert.alert(
                            "Cancel Invite",
                            "Are you sure you want to cancel the invite?",
                            [
                              {
                                text: "No",
                                onPress: () => {},
                                style: "cancel",
                              },
                              {
                                text: "Yes",
                                onPress: () => {
                                  this.onCancel(id);
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
                        },
                        buttonStyle: {
                          borderColor: commonColors.yellowColor,
                          backgroundColor: commonColors.yellowColor,
                        },
                        textStyle: {
                          color: "#fff",
                        },
                        disableBtn: submitted,
                      },
                    ]
                  : ["Visited", "Cancelled", "Upcoming"].includes(state) &&
                    purpose != "pickup/drop" &&
                    showCancelButton && [
                      {
                        btnText: "ReInvite",
                        action: () => {
                          Alert.alert(
                            "Re-Invite Visitor",
                            "Are you sure you want to Reinvite?",
                            [
                              {
                                text: "No",
                                onPress: () => {},
                                style: "cancel",
                              },
                              {
                                text: "Yes",
                                onPress: () => {
                                  this.ReInvite(
                                    purpose,
                                    invitees,
                                    sub_visitor_type
                                  );
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
                        },
                        buttonStyle: {
                          borderColor: commonColors.yellowColor,
                          backgroundColor: commonColors.yellowColor,
                        },
                        textStyle: {
                          color: "#fff",
                        },
                        disableBtn: submitted,
                      },
                    ],
            }}
          />
        )}
      </SafeAreaView>
    );
  }
}

const mapStateToProps = ({
  profile: { mode },
  invite: { inviteDetails, showCancelButton },
  login: { submitted },
}) => {
  return {
    mode,
    inviteDetails,
    showCancelButton,
    submitted,
  };
};

const { showInviteDetails, onClickInvite, cancelMyInvite } = invite;

const mapDispatchToProps = {
  showInviteDetails,
  onClickInvite,
  cancelMyInvite,
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MyInvitationsDetails);
