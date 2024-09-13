import React, {Component, useEffect} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import {connect} from 'react-redux';

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as RootNavigation from '../../../navigation/RootNavigation';

import {profile, notification} from '../../../redux/actions';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ScrollView} from 'react-native-gesture-handler';
import {detectTheme} from './../../../helpers';
import {themes, fonts} from '../../../themes';
import {Bell} from '../../../../assets/img/svgs';

class HomeScreen extends Component {
  componentDidMount() {
    const {getProfile, navigation, listNotification} = this.props;
    this.focusListener = navigation.addListener('focus', () => {});
    listNotification();
    getProfile();
  }

  componentWillUnmount() {
    this.focusListener();
  }
  render() {
    // const mode = detectTheme();
    const {navigation, mode} = this.props;
    return (
      <SafeAreaView style={{...styles.safeArea}}>
        <ScrollView
          contentContainerStyle={{
            ...styles.container,
            backgroundColor: themes[mode]['bgColor'],
          }}
          style={{flex: 1}}>
          <TouchableOpacity
            style={{...styles.bell}}
            onPress={() => navigation.navigate('NotificationList')}>
            <Bell />
          </TouchableOpacity>
          <Text style={{...styles.text}}>HomeScreen</Text>
        </ScrollView>
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
const {getProfile} = profile;
const {listNotification} = notification;
const mapDispatchToProps = {
  getProfile,
  listNotification,
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    height: '100%',
  },
  container: {
    paddingBottom: 60,
    flexGrow: 1,
  },
  bell: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginHorizontal: 25,
    marginVertical: 25,
  },
  text: {textAlign: 'center', justifyContent: 'center', alignItems: 'center'},
});
