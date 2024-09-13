import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Platform, Dimensions} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

import {themes, fonts, commonColors} from '../themes';
import {detectTheme} from '../helpers';
import {GenderIcon, DropdownIcon, ErrorIcon} from '../../assets/img/svgs';
import {SvgXml} from 'react-native-svg';

const CustomSelect = props => {
  const mode = detectTheme();

  const {
    placeholder,
    name,
    value,
    onValueChange,
    items,
    label,
    error,
    disabled,
    borderBottomWidth,
    borderColor,
    arrowColor,
    labelColor,
    labelFontSize,
    leftIcon,
  } = props;
  const showError = error && error.length > 5;
  const [selected, setValue] = useState(value);
  useEffect(() => {
    setValue(value);
  }, [value, selected]);

  const handleAddValue = val => {
    setValue(val);
    onValueChange(name, val);
  };
  return (
    <View
      style={{
        width: '100%',
        height: 58,
        borderBottomWidth: borderBottomWidth ? borderBottomWidth : 1,
        borderRadius: 4,
        paddingLeft: 5,
        borderColor: borderColor ? borderColor : themes[mode]['lineColor'],
        marginBottom: '6%',
        zIndex: 100001,
      }}>
      <View style={{flexDirection: 'row'}}>
        <View style={{marginTop: 28, marginLeft: 3}}>
          {leftIcon || (
            <SvgXml
              xml={GenderIcon(commonColors.yellowColor)}
              width={20}
              height={21}
            />
          )}
        </View>
        <RNPickerSelect
          key={selected}
          items={items}
          placeholder={placeholder}
          name={name}
          value={selected || value}
          defaultValue={selected}
          selectedValue={selected}
          onValueChange={handleAddValue}
          disabled={disabled}
          useNativeAndroidPickerStyle={false}
          allowFontScaling={false}
          style={{
            placeholder: {
              ...styles.placeholder,
            },
            inputAndroid: {
              width: Dimensions.get('window').width,
            },
            inputIOS: {
              ...styles.pickerIOS,
              color:
                themes[mode][
                  disabled || value === null ? 'lightAsh3' : 'textColor'
                ],
            },
          }}
          textInputProps={{
            fontFamily: value === null ? fonts.regular : fonts.semiBold,
            fontSize: labelFontSize ? labelFontSize : 14,
            paddingBottom: 0,
            paddingTop: Platform.OS === 'android' ? 8 : '3%',
            color:
              themes[mode][
                disabled || value === null
                  ? 'lightAsh3'
                  : labelColor
                  ? labelColor
                  : 'headingColor'
              ],
            height: 69,
            width: Dimensions.get('window').width,
            marginLeft: 10,
            letterSpacing: 0.7,
          }}
        />
        <View style={{position: 'absolute', right: 15, bottom: 26}}>
          <DropdownIcon color={arrowColor} />
        </View>
      </View>
      <View style={styles.errorBlock}>
        {error ? (
          <View style={{flexDirection: 'row'}}>
            <ErrorIcon />
            <Text
              style={{
                ...styles.error,
                color: themes[mode]['error'],
              }}>
              {error}
            </Text>
          </View>
        ) : null}
      </View>
      <Text style={{...styles.label, color: themes[mode]['lightAsh']}}>
        {label}
      </Text>
    </View>
  );
};
export default CustomSelect;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderBottomWidth: 1,
  },
  label: {
    fontFamily: fonts.regular,
    fontSize: 10,
    position: 'absolute',
    top: 3,
    left: 3,
  },
  pickerWrap: {
    alignItems: 'flex-start',
    marginLeft: Platform.OS === 'android' ? -3 : 0,
    paddingVertical: Platform.OS === 'android' ? 3 : 4,
    flexDirection: 'row',
  },
  error: {
    fontFamily: fonts.regular,
    fontSize: 12,
    marginLeft: 7,
  },
  pickerAndroid: {
    fontFamily: fonts.medium,
    fontSize: 14,
  },
  pickerIOS: {
    fontFamily: fonts.medium,
    fontSize: 14,
  },
  placeholder: {
    fontFamily: fonts.regular,
    fontSize: 14,
  },
  topView: {
    marginVertical: 10,
  },
  errorBlock: {marginTop: -3},
});
