import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';

import {detectTheme} from '../helpers';
import {themes, fonts} from '../themes';
import {WithBgHeader} from '.';
import commonStyles from '../styles/commonStyles';
import { ms } from '../helpers/scaling';

const NoDataComp = props => {
  const {
    title,
    rightIcon,
    onPressRight,
    noDataVector,
    text,
    message,
    leftIcon,
    includeFont,
    rightText,
    contentBlockStyle,
    msgComp,
    leftTextStyle,
  } = props;
  const mode = detectTheme();
  return (
    <ScrollView
      style={{...styles.view}}
      contentContainerStyle={{...styles.container}}>
      <WithBgHeader
        leftTextStyle={leftTextStyle}
        leftIcon={leftIcon}
        rightIcon={rightIcon}
        headerTitle={title}
        rightText={rightText}
        onPressRightIcon={onPressRight}
        containerStyle={{
          ...commonStyles.headerSpacing,
        }}
       
        >
        <View style={{...styles.wrapper}}>
          <View style={{}}>{noDataVector}</View>
          <View style={{...styles.contentBlock, contentBlockStyle}}>
            <Text
              style={{
                ...styles.title,
                color: themes[mode]['headingColor'],
              }}>
              {text}
            </Text>
            <Text
              style={{
                ...styles.content,
                color: themes[mode]['textColor'],
              }}>
              {msgComp || message}
            </Text>
          </View>
        </View>
      </WithBgHeader>
    </ScrollView>
  );
};

export default NoDataComp;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    height: '100%',
  },
  view: {flex: 1},
  container: {
    flexGrow: 1,
    minHeight: '100%',
  },
  contentBlock: {
    marginVertical: '5%',
    alignItems: 'center',
  },
  button: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 5,
    position: 'absolute',
    bottom: 0,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 22,
  },
  content: {
    fontFamily: fonts.light,
    fontSize: ms(16),
    lineHeight:ms(25),
    letterSpacing: 0.5,
    textAlign: 'center',
    marginVertical: ms(20),
  },
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: ms(20),
  },
  buttonText: {
    fontFamily: fonts.medium,
    fontSize: ms(16),
    margin: ms(10),
  },
});
