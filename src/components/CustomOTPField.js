import React, {useRef} from 'react';
import {StyleSheet} from 'react-native';
import OTPTextInput from 'react-native-otp-textinput';

import {themes, fonts} from '../themes';
import {detectTheme} from '../helpers';

const CustomOTPField = props => {
  const {value, loading, onSubmitEditing, handleChange} = props;
  const mode = detectTheme();
  const otpRef = useRef(null);

  return (
    <OTPTextInput
      selectionColor={themes[mode]['primaryColor']}
      ref={otpRef}
      defaultValue={value}
      editable={!loading}
      containerStyle={styles.otpContainer}
      tintColor={themes[mode]['borderColor']}
      handleTextChange={e => handleChange('otp_token', e)}
      inputCount={4}
      keyboardType="numeric"
      returnKeyType={'done'}
      allowFontScaling={false}
      onSubmitEditing={onSubmitEditing}
      style={{
        ...styles.otpText,
        borderColor:
          themes[mode][mode === 'light' ? 'lineColor' : 'borderColor'],
        color: themes[mode]['headingColor'],
      }}
    />
  );
};

export default CustomOTPField;

const styles = StyleSheet.create({
  otpContainer: {},
  otpText: {
    width: 55,
    height: 60,
    fontFamily: fonts.medium,
    fontSize: 32,
    borderBottomWidth: 1,
    margin: '3%',
    textAlign: 'center',
  },
});
