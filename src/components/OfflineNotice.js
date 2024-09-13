import React, {PureComponent} from 'react';
import {View, Text, Dimensions, Platform, StyleSheet} from 'react-native';
import NetInfo from '@react-native-community/netinfo';

const {width} = Dimensions.get('window');

function MiniOfflineSign() {
  return (
    <View style={styles.offlineContainer}>
      <Text style={styles.offlineText}>No Internet Connection</Text>
    </View>
  );
}
function MiniOnlineSign() {
  return (
    <View style={{...styles.offlineContainer, backgroundColor: '#61c92c'}}>
      <Text style={{...styles.offlineText, backgroundColor: '#61c92c'}}>
        Back Online
      </Text>
    </View>
  );
}

class OfflineNotice extends PureComponent {
  state = {
    isConnected: true,
    isInternetReachable: true,
    bothReachable: false,
    focus: false,
  };

  componentDidMount() {
    this._unsubscribe = NetInfo.addEventListener(state => {
      const {isConnected, isInternetReachable} = state;
      this.setState({
        isConnected,
        isInternetReachable,
        bothReachable: isConnected && isInternetReachable ? true : false,
      });
      setTimeout(() => {
        this.setState({focus: true});
      }, 1000);
      if (isConnected && isInternetReachable) {
        setTimeout(() => {
          this.setState({
            bothReachable: false,
            focus: false,
          });
        }, 1000);
      }
    });
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  handleConnectivityChange = isConnected => {
    this.setState({isConnected});
  };

  render() {
    const {isConnected, isInternetReachable, bothReachable, focus} = this.state;
    if (!isConnected || !isInternetReachable) {
      return <MiniOfflineSign />;
    } else if (bothReachable && focus) {
      return <MiniOnlineSign />;
    } else return null;
  }
}

const styles = StyleSheet.create({
  offlineContainer: {
    backgroundColor: '#b52424',
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width,
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 12 : 0,
  },
  offlineText: {color: '#fff'},
});

export default OfflineNotice;
