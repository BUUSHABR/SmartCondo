import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {fonts, themes} from '../themes';
import {detectTheme} from '../helpers';

export const searchItem = (item, index) => {
  const mode = detectTheme();
  const {phone} = item;
  return (
    <TouchableOpacity style={{borderBottomWidth: 1}} onPress={() => {}}>
      <View style={{margin: 5}}>
        <Text
          style={{
            fontFamily: fonts.medium,
            fontSize: 14,
            color: themes[mode]['textColor'],
          }}>
          {phone}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
