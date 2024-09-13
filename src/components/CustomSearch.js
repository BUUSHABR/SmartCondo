import React from 'react';
import {View, TextInput} from 'react-native';

import {themes, fonts} from '../themes';
import {detectTheme} from '../helpers';
import {SearchIcon} from '../../assets/img/svgs';

const CustomSearch = props => {
  const {name, value, handleSearchChange, placeholder} = props;
  const mode = detectTheme();
  return (
    <View
      style={{
        height: 45,
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 10,
        justifyContent: 'center',
        backgroundColor:
          themes[mode][mode === 'light' ? 'lightAsh2' : 'modalWrap'],
      }}>
      <TextInput
        onChangeText={val => {
          handleSearchChange({name, value: val});
        }}
        value={value}
        allowFontScaling={false}
        style={{
          height: 40,
          borderRadius: 10,
          paddingHorizontal: 15,
          paddingVertical: 10,
          justifyContent: 'center',
          backgroundColor:
            themes[mode][mode === 'light' ? 'lightAsh2' : 'modalWrap'],
          flexDirection: 'row',
          justifyContent: 'center',
          fontFamily: fonts.semiBold,
          fontSize: 14,
          color: themes[mode]['headingColor'],
          letterSpacing: 1,
          marginLeft: 15,
          
        }}
        placeholderTextColor={themes[mode]['lightAsh']}
        placeholder={placeholder}></TextInput>
      <View style={{position: 'absolute', left: 10}}>
        <SearchIcon />
      </View>
    </View>
  );
};

export default CustomSearch;
