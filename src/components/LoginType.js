import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';

import {fonts, themes} from '../themes';
import {detectTheme} from '../helpers';

const LoginType = props => {
  const {login_type, onChange} = props;
  const mode = detectTheme();

  const loginType = [
    {
      text: 'Password',
      value: 'password',
    },
    {
      text: 'OTP',
      value: 'otp',
    },
  ];

  const handleChange = val => {
    onChange('login_type', val);
  };
  return (
    <View
      style={{
        ...styles.align,
      }}>
      {loginType?.map((item, i) => {
        const selected = item.value === login_type;
        return (
          <TouchableOpacity
            key={i}
            onPress={() => {
              handleChange(item.value);
            }}
            style={{
              ...styles.selected,
            }}>
            <View
              style={{
                borderBottomColor: selected
                  ? themes[mode][mode === 'light' ? 'headingColor' : 'lightAsh']
                  : 'transparent',
                borderBottomWidth: selected && mode === 'light' ? 0.5 : 2,
              }}>
              <Text
                style={{
                  ...styles.text,
                  fontFamily: selected ? fonts.semiBold : fonts.medium,
                  fontWeight: selected ? '500' : '400',
                  color: themes[mode][selected ? 'headingColor' : 'otpColor'],
                  margin: 10,
                }}>
                {item.text}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default LoginType;

const styles = StyleSheet.create({
  text: {
    fontSize: 14,
  },
  selected: {
    margin: 5,
  },
  align: {
    flexDirection: 'row',
    marginHorizontal: 20,
  },
});
