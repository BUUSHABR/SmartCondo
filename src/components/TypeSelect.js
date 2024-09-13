import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';

import {fonts, themes} from '../themes';
import {ErrorIcon} from '../../assets/img/svgs';
import {detectTheme} from '../helpers';
import { ms } from '../helpers/scaling';

const TypeSelect = props => {
  const mode = detectTheme();
  const {leftIcon, rightIcon, value, label, error, name, onPress} = props;
  const showError = error?.length > 5;
  return (
    <View
      style={{
        marginBottom: '6%',
      }}>
      <TouchableOpacity
        style={{
          height: ms(58),
          borderBottomWidth:ms(1),
          borderColor: themes[mode]['lightAsh'],
        }}
        onPress={onPress}>
        <Text style={{...styles.label, color: themes[mode]['lightAsh']}}>
          {value ? label : ''}
        </Text>
        <View style={styles.flex}>
          <View style={{flexDirection: 'row'}}>
            <View>{leftIcon}</View>
            <Text
              style={{
                ...styles.value,
                fontFamily: value ? fonts.semiBold : fonts.regular,
                color: themes[mode][value ? 'headingColor' : 'lightAsh'],
              }}>
              {value ? value : label}
            </Text>
          </View>

          <View>{rightIcon}</View>
        </View>
      </TouchableOpacity>
      <View style={{margin: ms(3)}}>
        {showError && (
          <View style={{flexDirection: 'row', marginVertical: 5}}>
            <ErrorIcon />
            <Text
              style={{
                ...styles.error,
                color: themes[mode]['error'],
              }}>
              {error}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default TypeSelect;

const styles = StyleSheet.create({
  label: {
    fontFamily: fonts.regular,
    fontSize: ms(10),
    marginLeft: ms(5),
    // marginTop: 5,
  },
  flex: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft:ms(5),
    marginRight: ms(15),
    // backgroundColor: 'red',
    marginTop: Platform.OS === 'android' ? ms(10) : '5%',
  },
  value: {
    fontFamily: fonts.semiBold,
    fontSize: ms(14),
    // letterSpacing: 0.7,
    marginLeft: ms(5),
  },
  error: {
    fontFamily: fonts.regular,
    fontSize: ms(14),
    alignSelf: 'flex-start',
    marginLeft: ms(7),
  },
});
