import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

import {detectTheme} from '../helpers';
import {themes, fonts} from '../themes';
import { ms } from '../helpers/scaling';

const NoDataCompSearch = props => {
  const {icon, text, message} = props;
  const mode = detectTheme();
  return (
    <View style={styles.container}>
      <View>{icon}</View>
      <View style={styles.content}>
        <Text style={{...styles.text, color: themes[mode]['headingColor']}}>
          {text}
        </Text>
        <Text style={{...styles.message, color: themes[mode]['textColor']}}>
          {message}
        </Text>
      </View>
    </View>
  );
};

export default NoDataCompSearch;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: '25%',
    marginHorizontal: '8%',
  },
  text: {
    fontFamily: fonts.bold,
    fontSize: ms(16),
    textAlign: 'center',
    margin: 15,
  },
  message: {
    fontFamily: fonts.light,
    fontSize: ms(18),
    lineHeight: ms(25),
    textAlign: 'center',
  },
  content: {
    marginVertical: '15%',
  },
});
