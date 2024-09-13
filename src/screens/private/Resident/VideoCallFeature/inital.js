import React, {Component} from 'react';
import {connect} from 'react-redux';
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
} from 'react-native';
// import LottieView from 'lottie-react-native';
import {ComplaintSuccess} from '../../../assets/img/svgs';

import {
  TwilioVideoLocalView,
  TwilioVideoParticipantView,
  TwilioVideo,
} from 'react-native-twilio-video-webrtc';
import {
  CameraFlipIcon,
  VideoDisableIcon,
  AudioDisableIcon,
  RejectVisitorIcon,
  ApproveVisitorIcon,
  AudioActiveIcon,
  VideoActiveIcon,
} from '../../../../../assets/img/video-call-icons';
import {themes, fonts} from '../../../../themes';
import * as RootNavigation from '../../../../navigation/RootNavigation';
import {ToastMessage} from '../../../../components';
import {gateOpenClose, joinRoom} from '../../../../api/video_call';
import Cancel from '../../../../../assets/img/cancel.svg';
import { ms } from '../../../../helpers/scaling';

class ActiveVideoCall extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAudioEnabled: true,
      isVideoEnabled: true,
      status: 'disconnected',
      videoTracks: new Map(),
      seconds: 30,
      timerEnabled: false,

      participantContent: '',
      isParticipantAudioEnabled: true,
      isParticipantVideoEnabled: true,
      currentParticipant: false,
      enableApprovalBlock: false,
      gateStatus: false,
    };
  }

  componentDidMount() {
    const {navigation} = this.props;
    const {enableApprovalBlock, roomName, participant} =
      this.props?.route?.params?.data;
    this.setState({
      enableApprovalBlock,
      roomName: roomName,
      participant: participant,
    });
    this._onConnectButtonPress();
  }

  componentWillUnmount() {
    const {navigation} = this.props;
    this.focusListener = navigation.addListener('blur', () => {
      BackHandler.addEventListener('hardwareBackPress', () => {
        this.twilioRef?.disconnect();
      });
    });
  }

  _onConnectButtonPress = async () => {
    if (Platform.OS === 'android') {
      await this._requestAudioPermission();
      await this._requestCameraPermission();
    }
    this.checkPermissions();
    // twilioVideo.current.connect({ accessToken: token, enableNetworkQualityReporting: true, dominantSpeakerEnabled: true});
    // setStatus("connecting");
  };

  enableAnswerReject() {
    this.answerRejectTimer = setTimeout(() => {
      this._controlVisitor('reject', true);
    }, 30000);
  }

  checkPermissions = async () => {
    let id = this.props?.route?.params?.data?.roomName;

    // this.twilioRef.connect({
    //   accessToken:
    //     'eyJjdHkiOiJ0d2lsaW8tZnBhO3Y9MSIsInR3ciI6bnVsbCwidHlwIjoiSldUIiwiYWxnIjoiSFMyNTYifQ.eyJqdGkiOiJTSzg1NTVmZTU4NmYxM2ZmYTc2MGVmZTQ4MzkzMmFkZTEwLTE2NDA2ODYxOTUiLCJncmFudHMiOnsiaWRlbnRpdHkiOiJHdWVzdCIsInZpZGVvIjp7InJvb20iOiI2OWY4YWRlNC1hNmY0LTRlYzktOWMwMi0xNmU5NmEyNjI2OWYifX0sImlzcyI6IlNLODU1NWZlNTg2ZjEzZmZhNzYwZWZlNDgzOTMyYWRlMTAiLCJuYmYiOjE2NDA2ODYxOTUsImV4cCI6MTY0MDY4OTc5NSwic3ViIjoiQUM3NjgxMzRkYzM3YWE5ODNmNmU2NmQzZGU1Y2E4MzRiNSJ9.7tcLS37EKh3g4qmgP29oRzAQKRpJ2DTgClla05wIkos',
    //   roomName: '8c3c1811-8fd0-4751-aa95-1ad4abe76fe8',
    //   enableNetworkQualityReporting: true,
    //   dominantSpeakerEnabled: true,
    // });
    // this.callEndedTimer = setTimeout(() => {
    //   this.setState({seconds: 30, timerEnabled: true});
    //   this.autoRejectInterval = setInterval(() => {
    //     this.setState({seconds: this.state.seconds - 1});
    //   }, 1000);
    //   this.enableAnswerReject();
    // }, 2000);
    // setTimeout(() => {
    //   this.setState({seconds: 30 - 1});
    // }, 270000);
    joinRoom(id)
      .then(({data}) => {
        console.log(data, this.twilioRef.current, 'join call succ');
        const {id, token} = data;
        const connectCheck = this.twilioRef.connect({
          accessToken: token,
          roomName: id,
          enableNetworkQualityReporting: true,
          dominantSpeakerEnabled: true,
        });

        this.setState({status: 'connecting'});
        this.callEndedTimer = setTimeout(() => {
          this.setState({seconds: 30, timerEnabled: true});
          this.autoRejectInterval = setInterval(() => {
            this.setState({seconds: this.state.seconds - 1});
          }, 1000);
          this.enableAnswerReject();
        }, 270000);

        return true;
      })
      .catch(err => {
        console.log(err, 'video call err++');
        ToastMessage(err[0], err[1]?.message, err);
      });
  };

  _onEndButtonPress = () => {
    this.twilioRef?.disconnect();
  };

  _controlVisitor = (action, lastMinuteWithoutAction = false) => {
    let id = this.props?.route?.params?.data?.roomName;

    let params = {
      gate_open: action === 'approve' ? 'accepted' : 'declined',
      status: lastMinuteWithoutAction ? 'answered' : 'success',
    };

    setTimeout(() => {
      action === 'approve'
        ? gateOpenClose(id, params)
            .then(data => {
              RootNavigation.navigate('OpenSuccessReject', {
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
                  title: 'Accepted',
                  text: 'Visitor will reach the unit in minutes.',
                },
              });
              this.setState({gateStatus: false, timerEnabled: false});

              clearTimeout(this.callEndedTimer);
              clearInterval(this.autoRejectInterval);
              if (lastMinuteWithoutAction) {
                clearTimeout(this.answerRejectTimer);
              }
            })
            .catch(err => {
              ToastMessage(err[0], err[1]?.message, err);
            })
        : gateOpenClose(id, params)
            .then(data => {
              RootNavigation.navigate('OpenSuccessReject', {
                data: {
                  imgComp: "Cancel",
                  title: 'Rejected',
                  text: 'You have rejected the visitor entry.',
                },
              });
              this.setState({gateStatus: false, timerEnabled: false});
              clearTimeout(this.callEndedTimer);
              clearInterval(this.autoRejectInterval);

              if (lastMinuteWithoutAction) {
                clearTimeout(this.answerRejectTimer);
              }
            })
            .catch(err => {
              ToastMessage(err[0], err[1]?.message, err);
            });

      this._onEndButtonPress();

      // TODO: onEndButtonPress for twillio disconnect, based on we need disconnect or api call
    }, 2000);
  };

  _onMuteButtonPress = () => {
    this.twilioRef
      .setLocalAudioEnabled(!this.state.isAudioEnabled)
      .then(isEnabled => this.setState({isAudioEnabled: isEnabled}));
  };

  _onMuteVideoPress = () => {
    this.twilioRef
      .setLocalVideoEnabled(!this.state.isVideoEnabled)
      .then(isEnabled => this.setState({isVideoEnabled: isEnabled}));
  };

  _onFlipButtonPress = () => {
    this.twilioRef.flipCamera();
  };

  _onRoomDidConnect = ({roomName, roomSid, error}) => {
    this.setState({status: 'connected'});
  };

  _onRoomDidDisconnect = ({roomName, error}) => {
    this.setState({status: 'disconnected'});
  };

  _onRoomDidFailToConnect = error => {
    this.setState({status: 'disconnected'});
  };
  _participantStateReset = () => {
    this.setState({
      participantContent: '',
      isParticipantVideoEnabled: true,
      isParticipantAudioEnabled: true,
    });
  };

  _onParticipantAddedVideoTrack = ({participant, track}) => {
    console.log('onParticipantAddedVideoTrack: ', participant, track);
    if (!track.enabled && !this.state.isParticipantAudioEnabled) {
      console.log('Audio and Video is muted');
      this.setState({
        isParticipantVideoEnabled: track.enabled,
        participantContent: `${participant.identity} Audio and Video is muted`,
      });
    } else if (!track.enabled) {
      console.log('Video is muted');
      this.setState({
        isParticipantVideoEnabled: track.enabled,
        participantContent: `${participant.identity} Video is muted`,
      });
    } else if (!this.state.isParticipantAudioEnabled) {
      console.log('Audio is muted');
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
          {participantSid: participant.sid, videoTrackSid: track.trackSid},
        ],
      ]),
    });
  };

  _onParticipantRemovedVideoTrack = ({participant, track}) => {
    const {videoTracks} = this.state;
    console.log(participant, track, 'participant removed video track');
    // this._onEndButtonPress();
    console.log('onParticipantRemovedVideoTrack: ', participant, track);
    if (!track.enabled && !this.state.isParticipantAudioEnabled) {
      console.log('Audio and Video is muted');

      this.setState({
        isParticipantVideoEnabled: track.enabled,
        participantContent: `${participant.identity} Audio and Video is muted`,
      });
    } else if (!track.enabled) {
      console.log('Video is muted');

      this.setState({
        isParticipantVideoEnabled: track.enabled,
        participantContent: `${participant.identity} Video is muted`,
      });
    } else if (!this.state.isParticipantAudioEnabled) {
      console.log('Audio  is muted');

      this.setState({
        isParticipantVideoEnabled: track.enabled,
        participantContent: `${participant.identity} Audio is muted`,
      });
    } else {
      this._participantStateReset();
    }
    this.state.videoTracks.delete(track.trackSid);

    this.setState({videoTracks: new Map([...this.state.videoTracks])});
  };

  _onParticipantEnabledAudioTrack = ({participant, track}) => {
    console.log('_onParticipantEnabledAudioTrack', track);
    if (!track.enabled && !this.state.isParticipantVideoEnabled) {
      console.log('Audio and Video is muted');

      this.setState({
        isParticipantAudioEnabled: track.enabled,
        participantContent: `${participant.identity} Audio and Video is muted`,
      });
    } else if (!track.enabled) {
      console.log('Audio  is muted');

      this.setState({
        isParticipantAudioEnabled: track.enabled,
        participantContent: `${participant.identity} Audio is muted`,
      });
    } else if (!this.state.isParticipantVideoEnabled) {
      console.log('Video is muted');

      this.setState({
        isParticipantAudioEnabled: track.enabled,
        participantContent: `${participant.identity} Video is muted`,
      });
    } else {
      this._participantStateReset();
    }
    // this.setState({
    //   isParticipantAudioEnabled: track.enabled,
    //   participantContent: '',
    // });
  };

  _onParticipantDisabledAudioTrack = ({participant, track}) => {
    console.log('_onParticipantDisabledAudioTrack', track);
    if (!track.enabled && !this.state.isParticipantVideoEnabled) {
      console.log('Audio and Video is muted');

      this.setState({
        isParticipantAudioEnabled: track.enabled,
        participantContent: `${participant.identity} Audio and Video is muted`,
      });
    } else if (!track.enabled) {
      console.log('Audio is muted');

      this.setState({
        isParticipantAudioEnabled: track.enabled,
        participantContent: `${participant.identity} Audio is muted`,
      });
    } else if (!this.state.isParticipantVideoEnabled) {
      console.log('Video is muted');

      this.setState({
        isParticipantAudioEnabled: track.enabled,
        participantContent: `${participant.identity} Video is muted`,
      });
    } else {
      this._participantStateReset();
    }
    // this.setState({
    //   isParticipantAudioEnabled: track.enabled,
    //   participantContent: `${participant.identity} is Muted`,
    // });
  };

  _onParticipantEnabledVideoTrack = ({participant, track}) => {
    // console.log(track, participant, '_onParticipantEnabledVideoTrack');
    // this.setState({isParticipantVideoEnabled: track.enabled});
  };

  _onParticipantDisabledVideoTrack = ({participant, track}) => {
    // console.log(track, participant, '_onParticipantDisabledVideoTrack');
    // this.setState({
    //   isParticipantVideoEnabled: track.enabled,
    //   participantContent: `${participant.identity} is Muted`,
    // });
    // this.setState({isParticipantVideoEnabled: track.enabled});
  };

  _onRoomParticipantDidConnect = ({participant, track}) => {
    // console.log('_onRoomParticipantDidConnect');
    console.log(
      'Participant _onRoomParticipantDidConnect ',
      participant,
      'track',
      track,
    );
  };

  _onRoomParticipantDidDisconnect = ({participant, track}) => {
    // console.log('onRoomParticipantDidDisconnect');
    // console.log('Participant', participant, 'track', track);
    this._onEndButtonPress();
  };

  _onNetworkLevelChanged = ({participant, isLocalUser, quality}) => {
    // console.log(
    //   'Participant',
    //   participant,
    //   'isLocalUser',
    //   isLocalUser,
    //   'quality',
    //   quality,
    // );
  };

  _onDominantSpeakerDidChange = ({roomName, roomSid, participant}) => {
    // console.log(
    //   'onDominantSpeakerDidChange',
    //   `roomName: ${roomName}`,
    //   `roomSid: ${roomSid}`,
    //   'participant:',
    //   participant,
    // );
  };

  setTwilioRef = ref => {
    console.log(ref, 'set reffff');
    this.twilioRef = ref;
  };

  _requestAudioPermission = () => {
    return PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      {
        title: 'Need permission to access microphone',
        message:
          'To run this demo we need permission to access your microphone',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
  };

  _requestCameraPermission = () => {
    return PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, {
      title: 'Need permission to access camera',
      message: 'To run this demo we need permission to access your camera',
      buttonNegative: 'Cancel',
      buttonPositive: 'OK',
    });
  };

  render() {
    const {mode} = this.props;
    console.log(this.props?.route?.params, 'active video call props');
    const {status, gateStatus, seconds} = this.state;
    return (
      <View
        style={{
          ...styles.container,
          backgroundColor: '#000',
          opacity: this.state.gateStatus ? 0.7 : 1,
        }}>
        {this.state.status === 'connecting' ||
        this.state.status === 'disconnected' ? (
          <View
            style={{
              backgroundColor: '#000',
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={styles.connectText}>Connecting</Text>
          </View>
        ) : null}
        {this.state.status === 'connected' ? (
          <View
            style={{
              ...styles.callContainer,
            }}>
            {this.state.gateStatus ? (
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  flex: 1,
                  marginTop: '20%',
                }}>
                <ActivityIndicator size="large" color="#fff" />
              </View>
            ) : null}
            {this.state.status === 'connected' && (
              <View style={styles.remoteGrid}>
                {Array.from(
                  this.state.videoTracks,
                  ([trackSid, trackIdentifier]) => {
                    console.log(trackSid, trackIdentifier, 'particpant blockk');
                    return (
                      <TwilioVideoParticipantView
                        key={trackSid}
                        style={styles.remoteVideo}
                        trackIdentifier={trackIdentifier}
                      />
                    );
                  },
                )}

                <View
                  style={{
                    position: 'absolute',
                    top: 50,
                    left: 0,
                    right: 0,
                    bottom: 50,
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingHorizontal: 20,
                  }}>
                  <Text
                    style={{
                      color: '#e5e5e5',
                      fontFamily: fonts.semiBold,
                      fontSize:ms(14),
                      lineHeight:ms(16),
                      textAlign: 'center',
                    }}>
                    {this.state.participantContent}
                  </Text>
                </View>
              </View>
            )}
            <View style={styles.optionsContainer}>
              <TouchableOpacity onPress={this._onFlipButtonPress}>
                <CameraFlipIcon />
              </TouchableOpacity>
              <TouchableOpacity onPress={this._onMuteVideoPress}>
                {!this.state.isVideoEnabled ? (
                  <VideoDisableIcon />
                ) : (
                  <VideoActiveIcon />
                )}
              </TouchableOpacity>
              <TouchableOpacity onPress={this._onMuteButtonPress}>
                {!this.state.isAudioEnabled ? (
                  <AudioDisableIcon />
                ) : (
                  <AudioActiveIcon />
                )}
              </TouchableOpacity>
            </View>
            {this.state.enableApprovalBlock ? (
              <View style={styles.receiverOptions}>
                <Text style={{color: 'red'}}>
                  {this?.props?.route?.params?.data?.roomName ||
                    'Show Room nAME'}
                </Text>
                <TouchableOpacity
                  style={{
                    ...styles.receiverApprove,
                    backgroundColor: themes[mode]['seaGreen'],
                  }}
                  onPress={() => this._controlVisitor('approve')}>
                  <ApproveVisitorIcon />
                  <Text
                    style={{
                      ...styles.receiverApproveText,
                      color: themes[mode]['bgColor'],
                    }}>
                    Approve visitor Request
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    ...styles.receiverReject,
                    backgroundColor: themes[mode]['error'],
                  }}
                  onPress={() => this._controlVisitor('reject')}>
                  <RejectVisitorIcon />
                  <Text
                    style={{
                      ...styles.receiverRejectText,
                      color: themes[mode]['bgColor'],
                    }}>
                    Reject visitor Request
                  </Text>
                </TouchableOpacity>
              </View>
            ) : null}
            <View style={styles.localViewBlock}>
              <View
                style={{
                  flexDirection: 'row',
                }}>
                {this.state.timerEnabled ? (
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      // marginTop: '2%',
                      marginRight: '10%',
                    }}>
                    <Text
                      style={{
                        fontFamily: fonts.regular,
                        fontSize: 12,
                        color: '#fff',
                      }}>
                      Call Ending In
                    </Text>
                    <Text
                      style={{
                        color: '#fff',
                        fontFamily: fonts.semiBold,
                        fontSize: 14,
                        textAlign: 'center',
                      }}>
                      {seconds < 10
                        ? `00:0` + (seconds < 0 ? '0' : seconds)
                        : `00:${seconds}`}
                    </Text>
                  </View>
                ) : null}

                <View style={styles.localVideoContainer}>
                  <TwilioVideoLocalView enabled style={styles.localVideo} />
                  {!this.state.isAudioEnabled || !this.state.isVideoEnabled ? (
                    <View style={styles.remoteOptionsContainer}>
                      {!this.state.isVideoEnabled ? (
                        <TouchableOpacity
                          style={{paddingLeft: 4, paddingRight: 4}}>
                          <VideoDisableIcon />
                        </TouchableOpacity>
                      ) : null}
                      {!this.state.isAudioEnabled ? (
                        <TouchableOpacity
                          style={{paddingLeft: 4, paddingRight: 4}}>
                          <AudioDisableIcon />
                        </TouchableOpacity>
                      ) : null}
                    </View>
                  ) : null}
                </View>
              </View>
            </View>
          </View>
        ) : null}

        <TwilioVideo
          ref={this.setTwilioRef}
          onRoomDidConnect={this._onRoomDidConnect}
          onRoomDidDisconnect={this._onRoomDidDisconnect}
          onRoomDidFailToConnect={this._onRoomDidFailToConnect}
          onParticipantAddedVideoTrack={this._onParticipantAddedVideoTrack}
          onParticipantRemovedVideoTrack={this._onParticipantRemovedVideoTrack}
          onParticipantEnabledVideoTrack={this._onParticipantEnabledVideoTrack}
          onParticipantDisabledVideoTrack={
            this._onParticipantDisabledVideoTrack
          }
          onParticipantEnabledAudioTrack={this._onParticipantEnabledAudioTrack}
          onParticipantDisabledAudioTrack={
            this._onParticipantDisabledAudioTrack
          }
          onRoomParticipantDidConnect={this._onRoomParticipantDidConnect}
          onRoomParticipantDidDisconnect={this._onRoomParticipantDidDisconnect}
          onParticipantAddedDataTrack={() => {}}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  callContainer: {
    position: 'absolute',
    bottom: 0,
    top: 0,
    left: 0,
    right: 0,
  },
  welcome: {
    fontSize: 30,
    textAlign: 'center',
    paddingTop: 40,
  },
  input: {
    height: 50,
    borderWidth: 1,
    marginRight: 70,
    marginLeft: 70,
    marginTop: 50,
    textAlign: 'center',
    backgroundColor: 'white',
  },
  button: {
    marginTop: 100,
  },
  receiverOptions: {
    position: 'absolute',
    left: 30,
    bottom: 100,
    right: 30,
    // backgroundColor: "blue",
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  receiverApprove: {
    width: '100%',
    justifyContent: 'center',
    height: 50,
    marginBottom: 15,
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 32,
  },
  receiverApproveText: {
    fontWeight: '600',
    fontSize:ms(16),
    lineHeight:ms(20),
    paddingLeft: 10,
  },
  receiverRejectText: {
    fontWeight: '600',
    fontSize: ms(16),
    lineHeight: ms(20),
    paddingLeft: 10,
  },
  receiverReject: {
    width: '100%',
    justifyContent: 'center',
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 32,
  },

  localVideoContainer: {
    // flex: 1,
    // width: 115,
    // height: 140,
    // position: 'absolute',
    // right: 10,
    // bottom: 470,
    borderRadius: 2,
    width: 150,
    height: 150,
    backgroundColor: 'red',
  },
  localVideo: {
    width: 115,
    height: 140,
    borderRadius: 2,
    borderColor: '#4e4e4e',
    borderWidth: 1,
  },
  remoteGrid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  remoteVideo: {
    width: '100%',
    height: '100%',
  },
  remoteContainer: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    right: 0,
    height: 100,
    // backgroundColor: "blue",
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  localViewBlock: {
    position: 'absolute',
    // left: 0,
    top: '10%',
    right: '3%',
    // backgroundColor: "blue",
  },
  optionsContainer: {
    position: 'absolute',
    left: 30,
    bottom: 0,
    right: 30,
    height: 100,
    // backgroundColor: "blue",
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionButton: {
    width: 60,
    height: 60,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 100 / 2,
    backgroundColor: 'grey',
    justifyContent: 'center',
    alignItems: 'center',
  },
  remoteOptionsContainer: {
    position: 'absolute',
    left: 0,
    bottom: 10,
    right: 0,
    // backgroundColor: "blue",
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
  },
  connectText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: '#fff',
    marginVertical: '5%',
  },
});

const mapStateToProps = ({profile: {mode, userData}}) => {
  return {
    mode,
    userData,
  };
};

export default connect(mapStateToProps)(ActiveVideoCall);
