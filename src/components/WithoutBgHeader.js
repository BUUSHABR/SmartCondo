import React from 'react';
import {Text, StyleSheet, TouchableOpacity, View} from 'react-native';

import * as RootNavigation from '../navigation/RootNavigation';
import {FocusAwareStatusBar} from '../navigation/RootNavigation';
import {detectTheme} from '../helpers';

import {BackIcon} from '../../assets/img/svgs';
import {themes, fonts, commonColors} from '../themes';

const WithoutBgHeader = props => {
  const mode = detectTheme();
  const {
    leftIcon,
    leftText,
    leftTextStyle,
    onPressLeftIcon,
    rightIcon,
    rightText,
    rightTextStyle,
    onPressRightIcon,
    disabledLeftIcon,
    disabledRightIcon,
    headerTitle,
    includeFont,
  } = props;
  return (
    <View>
      <FocusAwareStatusBar />

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          style={[{borderWidth: 1, paddingHorizontal: 10, paddingVertical: 10}]}
          onPress={() =>
            onPressLeftIcon ? onPressLeftIcon : RootNavigation.goBack()
          }
          disabled={disabledLeftIcon}>
          {leftIcon ? (
            <View style={{}}>
              <BackIcon
                color={
                  themes[mode][
                    mode === 'light' ? 'headingColor' : 'primaryColor'
                  ]
                }
              />
            </View>
          ) : (
            <Text
              style={
                ([
                  {
                    ...styles.textLeft,

                    color: themes[mode]['headingColor'],
                  },
                ],
                leftTextStyle)
              }>
              {leftText}
            </Text>
          )}
        </TouchableOpacity>
        <Text
          style={{
            ...styles.title,
            fontSize: includeFont ? 24 : 20,
            color: themes[mode]['headingColor'],
          }}>
          {headerTitle}
        </Text>
        <TouchableOpacity
          onPress={onPressRightIcon}
          style={[{borderWidth: 1, paddingHorizontal: 10, paddingVertical: 10}]}
          disabled={disabledRightIcon}>
          {rightIcon ? (
            <View>{rightIcon}</View>
          ) : (
            <Text
              style={[
                {
                  ...styles.rightText,
                },
                rightTextStyle,
              ]}>
              {rightText}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default WithoutBgHeader;

const styles = StyleSheet.create({
  headerAlign: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  spacing: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  leftText: {
    fontFamily: fonts.semiBold,
    fontSize: 22,
  },
  rightText: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: commonColors.yellowColor,
  },
  title: {
    fontFamily: fonts.semiBold,
  },
});
