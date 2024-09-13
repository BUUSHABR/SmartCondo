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
  Image,
} from 'react-native';
// import LottieView from 'lottie-react-native';

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
import {SafeAreaView} from 'react-native-safe-area-context';

class VideoCall extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAudioEnabled: true,
      isVideoEnabled: true,
      status: 'connected',
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
  render() {
    const {mode} = this.props;
    const {onFlipCamera, onMuteVideo, onMuteAudio} = this;
    const {videoTracks, status} = this.state;
    const videoActivityIcon = [
      //   {
      //     icon: <CameraFlipIcon />,
      //     onPress: onFlipCamera,
      //   },
      {
        icon: <VideoActiveIcon />,
        onPress: onMuteVideo,
      },
      {
        icon: <AudioActiveIcon />,
        onPress: onMuteAudio,
      },
    ];
    return (
      <SafeAreaView
        style={{
          flex: 1,
          // backgroundColor: 'green',
        }}
        forceInset={{top: 'never'}}
        edges={['top']}>
        <View
          style={{
            justifyContent: 'space-between',
            height: '100%',
            width: '100%',
          }}>
          {this.state.status === 'connected' && (
            <View style={styles.remoteContainer}>
              <View>
                {Array.from(
                  this.state.videoTracks,
                  ([trackSid, trackIdentifier]) => {
                    return (
                      <TwilioVideoParticipantView
                        key={trackSid}
                        style={styles.remoteVideo}
                        trackIdentifier={trackIdentifier}
                      />
                    );
                  },
                )}
              </View>
              <Text style={{}}></Text>
            </View>
          )}
          <View
            style={{
              borderWidth: 1,
              flexDirection: 'row',
              // alignItems: 'center',
              justifyContent: 'space-between',
              position: status === 'connected' ? 'absolute' : 'relative',
              width: '100%',
            }}>
            <Text
              style={{
                ...styles.callEndText,
                color: '#000',
                textAlign: 'center',
              }}>
              Call Ending In {`\n`}
              <Text style={{...styles.callEndText, color: '#000'}}>00:00</Text>
            </Text>
            <View
              style={{
                ...styles.localVideoContainer,
              }}>
              <TwilioVideoLocalView enabled style={styles.localVideo} />
              {/* <Image
                style={{...styles.localVideo, borderWidth: 1}}
                source={{
                  uri: 'https://reactnative.dev/img/tiny_logo.png',
                }}
              /> */}
              <View style={{top: -40}}>
                <Text
                  style={{
                    color: 'red',
                  }}>
                  Muted
                </Text>
              </View>
            </View>
          </View>

          <View
            style={{
              //   flexGrow: 1,
              width: '100%',
              position: status === 'connected' ? 'absolute' : 'relative',
              bottom: 10,
            }}>
            <View
              style={{
                marginHorizontal: 30,
              }}>
              <TouchableOpacity
                style={{
                  ...styles.buttonStyle,
                  backgroundColor: '#58B266',
                }}>
                <ApproveVisitorIcon />
                <Text
                  style={{
                    ...styles.buttonText,
                  }}>
                  Approve Visitor Request
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  ...styles.buttonStyle,
                  backgroundColor: '#EB5757',
                }}>
                <RejectVisitorIcon />
                <Text style={{...styles.buttonText}}>
                  Reject Visitor Request
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                ...styles.actionButtonsWrap,
              }}>
              {videoActivityIcon?.map(item => {
                const {icon, onPress} = item;
                return (
                  <TouchableOpacity
                    style={{
                      ...styles.actionButtons,
                      backgroundColor: themes[mode]['primaryColor'],
                    }}>
                    {icon}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
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
      </SafeAreaView>
    );
  }
}

const mapStateToProps = ({profile: {mode, userData}}) => {
  return {
    mode,
    userData,
  };
};

export default connect(mapStateToProps)(VideoCall);

const styles = StyleSheet.create({
  buttonStyle: {
    borderRadius: 38,
    backgroundColor: '#58B266',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 10,
    marginVertical: 7,
  },
  buttonText: {
    marginLeft: 5,
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: '#fff',
  },
  actionButtonsWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 50,
    marginVertical: 30,
  },
  actionButtons: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  localVideo: {
    width: 100,
    height: 100,
  },
  localVideoContainer: {
    borderWidth: 1,
    width: 130,
    height: 150,
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
    marginHorizontal: 20,
    marginTop: 35,
  },
  callEndText: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: '#fff',
    marginLeft: 30,
    alignSelf: 'center',
  },
  remoteContainer: {
    // height: '98%',
    // backgroundColor: 'red',
  },
  remoteVideo: {
    backgroundColor: 'yellow',
  },
});
