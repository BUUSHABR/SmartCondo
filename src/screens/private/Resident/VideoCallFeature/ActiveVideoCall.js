import React, { Component } from "react";
import { connect } from "react-redux";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
  Alert,
  ActivityIndicator,
  ToastAndroid,
  Toast,
  BackHandler,
  Linking,
  ScrollView,
} from "react-native";
// import LottieView from 'lottie-react-native';

import {
  ComplaintSuccess,
  VideoCallOverlay,
  VideoCallSettingIcon,
} from "../../../../../assets/img/svgs";

import {
  TwilioVideoLocalView,
  TwilioVideoParticipantView,
  TwilioVideo,
} from "react-native-twilio-video-webrtc";
import {
  CameraFlipIcon,
  VideoDisableIcon,
  AudioDisableIcon,
  RejectVisitorIcon,
  ApproveVisitorIcon,
  AudioActiveIcon,
  VideoActiveIcon,
} from "../../../../../assets/img/video-call-icons";
import { themes, fonts, commonColors } from "../../../../themes";
import * as RootNavigation from "../../../../navigation/RootNavigation";
import { CustomButton, ToastMessage } from "../../../../components";
import {
  gateOpenClose,
  IsRoomActive,
  joinRoom,
  VideoCallReceived,
} from "../../../../api/video_call";
import Cancel from "../../../../../assets/img/cancel.svg";
// import IncomingCall from "@bob.hardcoder/react-native-incoming-call";
import RNCallKeep from "react-native-callkeep";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { check, request, PERMISSIONS, RESULTS } from "react-native-permissions";
import { requestMultiplePermissions } from "../../../../helpers";
import { ms } from "../../../../helpers/scaling";
class ActiveVideoCall extends Component {
  constructor(props) {
    super(props);
    this.permissionInterval = null;
    (this.token = ""),
      (this.room_id = ""),
      (this.state = {
        isAudioEnabled: true,
        isVideoEnabled: true,
        status: "disconnected",
        videoTracks: new Map(),
        seconds: 30,
        timerEnabled: false,
        buttonClick: false,
        participantContent: "",
        isParticipantAudioEnabled: true,
        isParticipantVideoEnabled: true,
        currentParticipant: false,
        enableApprovalBlock: false,
        gateStatus: false,
        unit_number: "",
        condo_name: "",
        isHavePermission: null,
        token: "",
        room_id: "",
        retry: false,
        isFinised: false,
      });
  }
  componentDidMount() {
    const { navigation } = this.props;
    console.log(
      "###################*11111111*************@@@@@@@@@@@@@@@@@@@@",
      global.videoCallProp?.data
    );
    if (global.videoCallProp?.data?.ver == "v2" && Platform.OS != "android") {
      VideoCallReceived(global.videoCallProp?.data?.roomName, {
        status: "answered",
      }).then(async (data) => {
        console.log("data", data);
      });
    }
    if (global.videoCallProp?.data.roomName) {
      const {
        enableApprovalBlock,
        roomName,
        participant,
        current_tenant,
        unit_number,
      } = global.videoCallProp?.data;
      // console.log("kdkkdkkdkkkdefefnjef", this.props?.route?.params?.data);
      this.setState({
        enableApprovalBlock,
        roomName: roomName,
        participant: participant,
        unit_number: unit_number,
        condo_name: current_tenant,
      });
      console.log(
        "###################*2222222222*************@@@@@@@@@@@@@@@@@@@@",

        global.videoCallProp?.data
      );
      this._onConnectButtonPress(global.videoCallProp?.data);
      BackHandler.addEventListener("hardwareBackPress", this.handleBack);

      BackHandler.removeEventListener("hardwareBackPress", this.handleBack);
    }

    this.permissionInterval = setInterval(async () => {
      console.log(
        this.state.isHavePermission,
        "is haeve permission from interval",
        this.state.status
      );
      this.permissioncheck();

      if (!this.state.isFinised && this.state.isHavePermission) {
        this.setState({ isFinised: true });

        console.log(
          "entered connect attemp for video call",
          this.token,
          this.room_id
        );

        console.log("twilio connect init", this.state.token);
        this.checkPermissions(global.videoCallProp?.data);
        clearInterval(this.permissionInterval);
      }
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.permissionInterval);
  }

  async checkBothPermissions() {
    const cameraPermission =
      Platform.OS === "android"
        ? PERMISSIONS.ANDROID.CAMERA
        : PERMISSIONS.IOS.CAMERA;

    const microphonePermission =
      Platform.OS === "android"
        ? PERMISSIONS.ANDROID.RECORD_AUDIO
        : PERMISSIONS.IOS.MICROPHONE;

    const cameraStatus = await check(cameraPermission);
    const microphoneStatus = await check(microphonePermission);

    return (
      cameraStatus === RESULTS.GRANTED && microphoneStatus === RESULTS.GRANTED
    );
  }
  async permissioncheck() {
    const areBothPermissionsGranted = await this.checkBothPermissions();
    this.setState({ isHavePermission: areBothPermissionsGranted });
  }

  handleBack = () => {
    // console.log("backpress");
    // console.log(this.twilioRef?.disconnect(), "disconnect checkkk");
    this.twilioRef?.disconnect();
    this._controlVisitor("reject", true);
  };

  // componentWillUnmount() {
  //   const { navigation } = this.props;

  //   this.focusListener = navigation.addListener('blur', () => {
  //     BackHandler.removeEventListener('hardwareBackPress', this.handleBack);
  //   });
  // }

  _onConnectButtonPress = async (data) => {
    requestMultiplePermissions();
    console.log(
      "###################*3333333333333333*************@@@@@@@@@@@@@@@@@@@@",
      data
    );
    // this.checkPermissions(data);
    // twilioVideo.current.connect({ accessToken: token, enableNetworkQualityReporting: true, dominantSpeakerEnabled: true});
    // setStatus("connecting");
  };

  enableAnswerReject() {
    this.answerRejectTimer = setTimeout(() => {
      this._controlVisitor("reject", true);
      this.twilioRef?.disconnect();
    }, 30000);
  }

  checkPermissions = async (data) => {
    // console.log("cjheck");

    this.setState({ status: "connecting" });

    let id = data?.roomName;

    joinRoom(id, data?.ver)
      .then(({ data }) => {
        console.log(data, this.twilioRef.current, "join call succ");
        const { id, token, room_id } = data;
        console.log(
          "###################44444444444444444444*************@@@@@@@@@@@@@@@@@@@@",
          data
        );
        // this.setState({ token: token, room_id: room_id });
        this.token = token;
        this.room_id = room_id;
        const connectCheck = this.twilioRef.connect({
          accessToken: token,
          roomName: room_id,
          enableNetworkQualityReporting: true,
          dominantSpeakerEnabled: true,
        });
        // console.log(connectCheck, "checkkkkkkkkkkkkkkkkk");

        this.callEndedTimer = setTimeout(() => {
          // console.log("call settime out");
          this.setState({ seconds: 30, timerEnabled: true });
          this.autoRejectInterval = setInterval(() => {
            this.setState({ seconds: this.state.seconds - 1 });
          }, 1000);
          this.enableAnswerReject();
        }, 270000);
        return true;
      })
      .catch(async (err) => {
        console.log(err, "video call err-- join token");
        global.navigate = false;
        this.twilioRef?.disconnect();
        RootNavigation.navigate("Private");
        clearInterval(this.permissionInterval);

        await RNCallKeep.endCall(id);
        console.log("sswat1")
        ToastMessage(err[0], err[1].data[0], err);
      });
  };

  _onEndButtonPress = () => {
    this.twilioRef?.disconnect();
    // IncomingCall.dismiss();
  };

  _controlVisitor = async (action, lastMinuteWithoutAction = false) => {
    // console.log("controll visitor,", action, lastMinuteWithoutAction);
    // const { id } = this.props?.route?.params?.data?.data;
    let id = global.videoCallProp?.data?.roomName;
    // console.log(id, "############################################");
    this.setState({ buttonClick: true });
    let params = {
      gate_open: action === "approve" ? "accepted" : "declined",
      status: lastMinuteWithoutAction ? "declined" : "success",
    };
    await AsyncStorage.setItem("callStatus", "true");
    // console.log("llllllllllllll", await AsyncStorage.getItem("callStatus"));
    global.callStatus = true;

    // action === "approve" ? await AsyncStorage.setItem(callStatus, true) : await AsyncStorage.setItem(callStatus, false);
    // console.log(
    //   params,
    //   action,
    //   "params",
    //   id,
    //   "$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$"
    // );
    // setTimeout(() => {
    global.navigate = false;

    action === "approve"
      ? gateOpenClose(id, params, global.videoCallProp?.data?.ver)
          .then(async (data) => {
            console.log(data, "gate approved 0000000");
            await RNCallKeep.endAllCalls();
            RootNavigation.navigate("OpenSuccessReject", {
              data: {
                imgComp: "ComplaintSuccess",
                // (
                //   <ComplaintSuccess />
                  // <LottieView
                  //   source={require('../../../../../assets/gif/video_success.json')}
                  //   autoPlay
                  //   loop
                  //   duration={5000}
                  // />
                // ),
                title: "Accepted",
                text: "Visitor will reach the unit in minutes.",
                exit: global.videoCallProp?.data?.exit,
              },
            })
            console.log("trwefrw3",id)
            global.callStatus = "true";
            // console.log("afterset call status in accept");
            // console.log("lastMinuteWithoutAction", lastMinuteWithoutAction);


            delete global["callStatus"];
            console.log("trwefrw366",global);
            try {
              await RNCallKeep.reportEndCallWithUUID(
                id,
                22022
              );
              console.log("RNCallKeep.reportEndCallWithUUID() succeeded");
            } catch (error) {
              console.error("RNCallKeep.reportEndCallWithUUID() failed:", error);
            }
            
          })
          .catch((err) => {
            global.appState == "active";
            this.setState({ buttonClick: false });
            console.log("sswat2",err[0],id, params, global.videoCallProp?.data?.ver)

            ToastMessage(err[0], err[1]?.message, err);
          })
      : gateOpenClose(id, params, global.videoCallProp?.data?.ver)
          .then(async (data) => {
            // console.log(data, "gate res 0000000");
            RootNavigation.navigate("OpenSuccessReject", {
              data: {
                imgComp: "Cancel",
                title: "Rejected",
                text: "You have rejected the visitor entry.",
                exit: global.videoCallProp?.data?.exit,
              },
            });
            global.callStatus = false;

            await RNCallKeep.endAllCalls();

            delete global["callStatus"];
          })
          .catch((err) => {
            this.setState({ buttonClick: false });
            console.log("sswat3")

            ToastMessage(err[0], err[1]?.message, err);
          });
    clearTimeout(this.callEndedTimer);
    if (lastMinuteWithoutAction) {
      clearTimeout(this.answerRejectTimer);
    }
    this._onEndButtonPress();
  };

  _onMuteButtonPress = () => {
    this.twilioRef
      .setLocalAudioEnabled(!this.state.isAudioEnabled)
      .then((isEnabled) => this.setState({ isAudioEnabled: isEnabled }));
  };

  _onMuteVideoPress = () => {
    this.twilioRef
      .setLocalVideoEnabled(!this.state.isVideoEnabled)
      .then((isEnabled) => this.setState({ isVideoEnabled: isEnabled }));
  };

  _onFlipButtonPress = () => {
    this.twilioRef.flipCamera();
  };

  _onRoomDidConnect = ({ roomName, roomSid, error }) => {
    console.log("_onRoomDidConnect", error, roomName, roomSid);
    this.setState({ status: "connected" });
  };

  _onRoomDidDisconnect = ({ roomName, error }) => {
    this.setState({ status: "disconnected" });
    // RootNavigation.navigate("Private");
    // RNCallKeep.endAllCalls();
    // ToastMessage(200, "unable to connect");
    // clearInterval(this.permissionInterval);
  };

  _onRoomDidFailToConnect = (error) => {
    console.log("ERROR did fail connect: ", error);

    this.setState({ status: "disconnected" });
    RootNavigation.navigate("Private");
    RNCallKeep.endAllCalls();
    ToastMessage(200, "Call is answered by another resident");
    clearInterval(this.permissionInterval);
  };
  _participantStateReset = () => {
    this.setState({
      participantContent: "",
      isParticipantVideoEnabled: true,
      isParticipantAudioEnabled: true,
    });
  };

  _onParticipantAddedVideoTrack = ({ participant, track }) => {
    console.log(
      "onParticipantAddedVideoTrack:jjdjjdjjjjdjjjdjdj ",
      participant,
      track
    );
    if (!track.enabled && !this.state.isParticipantAudioEnabled) {
      this.setState({
        isParticipantVideoEnabled: track.enabled,
        participantContent: `${participant.identity} Audio and Video is muted`,
      });
    } else if (!track.enabled) {
      this.setState({
        isParticipantVideoEnabled: track.enabled,
        participantContent: `${participant.identity} Video is muted`,
      });
    } else if (!this.state.isParticipantAudioEnabled) {
      this.setState({
        isParticipantVideoEnabled: track.enabled,
        participantContent: `${participant.identity} Audio is muted`,
      });
    } else {
      this._participantStateReset();
    }

    this.setState({
      videoTracks: new Map([
        ...this.state.videoTracks,
        [
          track.trackSid,
          { participantSid: participant.sid, videoTrackSid: track.trackSid },
        ],
      ]),
    });
  };

  _onParticipantRemovedVideoTrack = ({ participant, track }) => {
    const { videoTracks } = this.state;
    console.log(participant, track, "participant removed video track");
    if (!track.enabled && !this.state.isParticipantAudioEnabled) {
      this.setState({
        isParticipantVideoEnabled: track.enabled,
        participantContent: `${participant.identity} Audio and Video is muted`,
      });
    } else if (!track.enabled) {
      this.setState({
        isParticipantVideoEnabled: track.enabled,
        participantContent: `${participant.identity} Video is muted`,
      });
    } else if (!this.state.isParticipantAudioEnabled) {
      this.setState({
        isParticipantVideoEnabled: track.enabled,
        participantContent: `${participant.identity} Audio is muted`,
      });
    } else {
      this._participantStateReset();
    }
  };

  _onParticipantEnabledAudioTrack = ({ participant, track }) => {
    if (!track.enabled && !this.state.isParticipantVideoEnabled) {
      this.setState({
        isParticipantAudioEnabled: track.enabled,
        participantContent: `${participant.identity} Audio and Video is muted`,
      });
    } else if (!track.enabled) {
      this.setState({
        isParticipantAudioEnabled: track.enabled,
        participantContent: `${participant.identity} Audio is muted`,
      });
    } else if (!this.state.isParticipantVideoEnabled) {
      this.setState({
        isParticipantAudioEnabled: track.enabled,
        participantContent: `${participant.identity} Video is muted`,
      });
    } else {
      this._participantStateReset();
    }
  };

  _onParticipantDisabledAudioTrack = ({ participant, track }) => {
    if (!track.enabled && !this.state.isParticipantVideoEnabled) {
      this.setState({
        isParticipantAudioEnabled: track.enabled,
        participantContent: `${participant.identity} Audio and Video is muted`,
      });
    } else if (!track.enabled) {
      this.setState({
        isParticipantAudioEnabled: track.enabled,
        participantContent: `${participant.identity} Audio is muted`,
      });
    } else if (!this.state.isParticipantVideoEnabled) {
      this.setState({
        isParticipantAudioEnabled: track.enabled,
        participantContent: `${participant.identity} Video is muted`,
      });
    } else {
      this._participantStateReset();
    }
  };

  _onParticipantEnabledVideoTrack = ({ participant, track }) => {};

  _onParticipantDisabledVideoTrack = ({ participant, track }) => {};

  _onRoomParticipantDidConnect = ({ participant, track }) => {};

  _onRoomParticipantDidDisconnect = async ({ participant, track }) => {
    RootNavigation.navigate("OpenSuccessReject", {
      data: {
        imgComp: "Cancel",
        title: "Rejected",
        text: "You have rejected the visitor entry.",
        exit: global.videoCallProp?.data?.exit,
      },
    });
    global.callStatus = false;

    await RNCallKeep.endCall(global.videoCallProp?.data?.roomName);

    delete global["callStatus"];
    clearInterval(this.permissionInterval);

    this._onEndButtonPress();
  };

  _onNetworkLevelChanged = ({ participant, isLocalUser, quality }) => {};

  _onDominantSpeakerDidChange = ({ roomName, roomSid, participant }) => {};

  setTwilioRef = (ref) => {
    console.log(ref, "set reffff");
    this.twilioRef = ref;
  };

  _requestAudioPermission = () => {
    return PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      {
        title: "Need permission to access microphone",
        message:
          "To run this demo we need permission to access your microphone",
        buttonNegative: "Cancel",
        buttonPositive: "OK",
      }
    ).then((data) => {
      console.log(data, "_requestAudioPermission success block");
      this.permissioncheck();
    });
  };

  _requestCameraPermission = () => {
    return PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, {
      title: "Need permission to access camera",
      message: "To run this demo we need permission to access your camera",
      buttonNegative: "Cancel",
      buttonPositive: "OK",
    }).then((data) => {
      console.log(data, "_requestCameraPermission success block");
      this.permissioncheck();
    });
  };

  render() {
    const { mode } = this.props;
    const { status, gateStatus, seconds, buttonClick } = this.state;
    console.log(this.state.isHavePermission, "isHave Permision");
    return (
      <View
        style={{
          ...styles.container,
          opacity: this.state.gateStatus ? 0.7 : 1,
        }}
      >
        {!this.state.isHavePermission && this.state.isHavePermission != null && (
          <View style={{ flex: 1, backgroundColor: themes[mode]["bgColor"] }}>
            <View
              style={{
                paddingVertical: "15%",
                paddingHorizontal: 20,
                flex: 1,
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  marginVertical: "6%",
                  marginTop: "30%",
                }}
              >
                <VideoCallSettingIcon />
              </View>
              <View>
                <Text
                  style={{
                    fontFamily: fonts.medium,
                    fontSize: ms(14) ,
                    lineHeight: ms(25),
                    color: themes[mode]["headingColor"],
                    marginVertical: "5%",
                    textAlign: "center",
                    marginHorizontal: "5%",
                  }}
                >
                  Kindly grant the essential permissions for video calling
                  usage.
                </Text>
              </View>
              <View style={{ width: "100%", marginTop: "20%" }}>
                <CustomButton
                  title={"Go to Settings"}
                  handleSubmit={() => {
                    Linking.openSettings()
                      .then(() => {
                        console.log("Opened Android settings");
                      })
                      .catch((err) => {
                        console.error("Error opening Android settings", err);
                      });
                  }}
                />
              </View>
            </View>
          </View>
        )}
        {(this.state.status === "connecting" ||
          this.state.status === "disconnected") &&
        this.state.isHavePermission ? (
          <View
            style={{
              backgroundColor: "#000",
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ActivityIndicator size="large" color="#fff" />
            <Text style={styles.connectText}>Connecting</Text>
          </View>
        ) : null}
        {this.state.status === "connected" ? (
          <View
            style={{
              ...styles.callContainer,
            }}
          >
            {this.state.gateStatus ? (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  flex: 1,
                  marginTop: "20%",
                }}
              >
                <ActivityIndicator size="large" color="#fff" />
              </View>
            ) : null}
            {this.state.status === "connected" ? (
              <View style={styles.remoteGrid}>
                {Array.from(
                  this.state.videoTracks,
                  ([trackSid, trackIdentifier]) => {
                    console.log(trackSid, trackIdentifier, "particpant blockk");

                    return (
                      <TwilioVideoParticipantView
                        enabled={true}
                        key={trackSid}
                        style={styles.remoteVideo}
                        trackIdentifier={trackIdentifier}
                      />
                    );
                  }
                )}
                <View
                  style={{
                    top: 50,
                    justifyContent: "center",
                    width: "100%",
                    alignItems: "center",
                    position: "absolute",
                    zIndex: 100005,
                  }}
                >
                  <Text
                    style={{
                      color: "#FFFFFF",
                      fontFamily: fonts.bold,
                      marginTop: 7,
                      fontSize: 20,
                    }}
                  >
                    {global.videoCallProp?.data?.current_tenant}
                  </Text>
                  <Text
                    style={{
                      color: "#FFFFFF",
                      fontFamily: fonts.medium,
                      fontSize: 15,
                    }}
                  >
                    {global.videoCallProp?.data?.unit_number}
                  </Text>
                </View>
                <View
                  style={{
                    top: -20,
                    width: "100%",
                    height: "40%",

                    position: "absolute",
                    zIndex: 10003,
                  }}
                >
                  <VideoCallOverlay />
                </View>
                <View
                  style={{
                    position: "absolute",
                    top: 50,
                    height: "100%",
                    width: "100%",
                    zIndex: 100001,
                  }}
                >
                  <View
                    style={{
                      justifyContent: "space-between",
                      alignItems: "center",
                      height: "100%",
                      alignSelf: "center",
                      width: "100%",
                    }}
                  >
                    <View style={{}}>
                      <Text
                        style={{
                          color: "#9c9c9c",
                          fontFamily: fonts.semiBold,
                          fontSize: ms(16),
                          lineHeight: ms(16),
                          textAlign: "center",
                          marginVertical: "30%",
                        }}
                      >
                        {this.state.participantContent}
                      </Text>
                    </View>

                    <View
                      style={{
                        bottom: 50,
                      }}
                    >
                      {this.state.enableApprovalBlock ? (
                        <View style={styles.receiverOptions}>
                          <TouchableOpacity
                            style={{
                              ...styles.receiverApprove,
                              backgroundColor: themes[mode]["seaGreen"],
                            }}
                            disabled={buttonClick}
                            onPress={() => this._controlVisitor("approve")}
                          >
                            <ApproveVisitorIcon />
                            <Text
                              style={{
                                ...styles.receiverApproveText,
                                color: "#fff",
                              }}
                            >
                              Approve visitor Request
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            disabled={buttonClick}
                            style={{
                              ...styles.receiverReject,
                              backgroundColor: themes[mode]["error"],
                            }}
                            onPress={() => this._controlVisitor("reject")}
                          >
                            <RejectVisitorIcon />
                            <Text
                              style={{
                                ...styles.receiverRejectText,
                                color: "#fff",
                              }}
                            >
                              Reject visitor Request
                            </Text>
                          </TouchableOpacity>
                        </View>
                      ) : null}

                      <View style={styles.optionsContainer}>
                        <TouchableOpacity
                          onPress={this._onMuteVideoPress}
                          style={{
                            ...styles.muteAction,
                            backgroundColor: !this.state.isVideoEnabled
                              ? "#fff"
                              : commonColors.yellowColor,
                          }}
                        >
                          {!this.state.isVideoEnabled ? (
                            <VideoDisableIcon />
                          ) : (
                            <VideoActiveIcon />
                          )}
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={this._onMuteButtonPress}
                          style={{
                            ...styles.muteAction,
                            backgroundColor: !this.state.isAudioEnabled
                              ? "#fff"
                              : commonColors.yellowColor,
                          }}
                        >
                          {!this.state.isAudioEnabled ? (
                            <AudioDisableIcon />
                          ) : (
                            <AudioActiveIcon />
                          )}
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            ) : null}
          </View>
        ) : null}

        {true && (
          <TwilioVideo
            ref={this.setTwilioRef}
            onRoomDidConnect={this._onRoomDidConnect}
            onRoomDidDisconnect={this._onRoomDidDisconnect}
            onRoomDidFailToConnect={this._onRoomDidFailToConnect}
            onParticipantAddedVideoTrack={this._onParticipantAddedVideoTrack}
            onParticipantRemovedVideoTrack={
              this._onParticipantRemovedVideoTrack
            }
            onParticipantEnabledVideoTrack={
              this._onParticipantEnabledVideoTrack
            }
            onParticipantDisabledVideoTrack={
              this._onParticipantDisabledVideoTrack
            }
            onParticipantEnabledAudioTrack={
              this._onParticipantEnabledAudioTrack
            }
            onParticipantDisabledAudioTrack={
              this._onParticipantDisabledAudioTrack
            }
            onRoomParticipantDidConnect={this._onRoomParticipantDidConnect}
            onRoomParticipantDidDisconnect={
              this._onRoomParticipantDidDisconnect
            }
            onResponderStart={(a, b, c) => {}}
            onDataTrackMessageReceived={(a, b, c) => {}}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  callContainer: {},
  welcome: {
    fontSize: 30,
    textAlign: "center",
    paddingTop: 40,
  },
  input: {
    height: 50,
    borderWidth: 1,
    marginRight: 70,
    marginLeft: 70,
    marginTop: 50,
    textAlign: "center",
    backgroundColor: "white",
  },
  button: {
    marginTop: 100,
  },
  receiverOptions: {},
  receiverApprove: {
    width: "100%",
    justifyContent: "center",
    height: 50,
    marginBottom: 15,
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 32,
  },
  receiverApproveText: {
    fontWeight: "600",
    fontSize: ms(16),
    lineHeight: ms(20),
    paddingLeft: 10,
  },
  receiverRejectText: {
    fontWeight: "600",
    fontSize: ms(16),
    lineHeight: ms(20),
    paddingLeft: 10,
  },
  receiverReject: {
    width: "100%",
    justifyContent: "center",
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 32,
  },

  localVideoContainer: {
    borderRadius: 2,
    width: 150,
    height: 150,
    zIndex: 10001,
    position: "absolute",
    right: 20,
    backgroundColor: "red",
  },
  localVideo: {
    height: 140,
    borderRadius: 2,
    borderColor: "#4e4e4e",
    zIndex: 10001,
  },
  remoteGrid: {
    height: "100%",
  },
  remoteVideo: {
    width: "100%",
    height: "100%",
    zIndex: 1001,
  },
  remoteContainer: {
    left: 0,
    bottom: 0,
    right: 0,
    height: 100,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  localViewBlock: {
    position: "absolute",
    top: "10%",
    right: "3%",
  },
  optionsContainer: {
    bottom: 0,
    height: 100,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  optionButton: {
    width: 60,
    height: 60,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 100 / 2,
    backgroundColor: "grey",
    justifyContent: "center",
    alignItems: "center",
  },
  remoteOptionsContainer: {
    position: "absolute",
    left: 0,
    bottom: 10,
    right: 0,
    // backgroundColor: "blue",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 10,
    paddingRight: 10,
  },
  connectText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: "#fff",
    marginVertical: "5%",
  },
  muteAction: {
    width: 45,
    height: 45,
    borderRadius: 23,
    justifyContent: "center",
    alignItems: "center",
  },
});

const mapStateToProps = ({ profile: { mode, userData } }) => {
  return {
    mode,
    userData,
  };
};

export default connect(mapStateToProps)(ActiveVideoCall);
