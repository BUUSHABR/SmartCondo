import React from 'react';
import {Text} from 'react-native';
import {TouchableOpacity, ScrollView} from 'react-native-gesture-handler';

import {fonts, themes} from '../themes';
import {detectTheme} from '../helpers';

const FacilityTypes = props => {
  const {court, arrData, name} = props;
  const mode = detectTheme();
  const handleChange = val => {
    props.onChange(name, val);
  };
  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        backgroundColor: themes[mode]['bgColor'],
        borderWidth: 1,
        marginTop: 20,
      }}
      horizontal
      showsHorizontalScrollIndicator={false}>
      {arrData?.map((item, index) => {
        const {label, value} = item;
        return (
          <TouchableOpacity
            style={{
              borderRadius: 22,
              backgroundColor:
                value === court ? '#FFF4D4' : themes[mode]['lightAsh'],
              paddingHorizontal: 20,
              paddingVertical: 12,
              marginRight: 12,
            }}
            onPress={() => handleChange(value)}>
            <Text
              style={{
                fontFamily: item === court ? fonts.semiBold : fonts.regular,
                fontSize: 14,
                color:
                  value === court
                    ? themes[mode]['primaryColor']
                    : themes[mode]['headingColor'],
              }}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

export default FacilityTypes;
