import * as React from 'react';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {StatusBar} from 'react-native';
import Store from '../redux/store';
import {themes} from '../themes';

export const isReadyRef = React.createRef();

export const navigationRef = React.createRef();

export function navigate(name, params) {
  if (isReadyRef.current && navigationRef.current) {
    console.log(name, 'mmmmmmmm');

    navigationRef.current.navigate(name, params);
  } else {
    navigationRef.current.navigate('home');
  }
}



export function goBack() {
  navigationRef.current.goBack();
}

export function FocusAwareStatusBar(props) {
  const isFocused = useIsFocused();
  const mode = Store.getState().profile.mode;
  // console.log(mode,"modedeeee")
  return isFocused ? (
    <StatusBar
      translucent={true}
      // backgroundColor={'transparent'}
      barStyle={mode === 'light' ? 'dark-content' : 'light-content'}
      backgroundColor={themes[mode]['bgColor']}
      {...props}
    />
  ) : null;
}
