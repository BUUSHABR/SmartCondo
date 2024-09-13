import React from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  Appearance,
} from 'react-native';
import * as RootNavigation from '../navigation/RootNavigation';

import {BackIcon, LeftCorner, RightCorner} from '../../assets/img/svgs';
import {FocusAwareStatusBar} from '../navigation/RootNavigation';
import {themes, fonts} from '../themes';
import {detectTheme} from '../helpers';
import { ms, vs } from '../helpers/scaling';

export const LoginHeader = props => {
  const {onPress, image, showLeftIcon} = props;
  return (
    <View style={{...styles.width}}>
      <FocusAwareStatusBar />
      {showLeftIcon && (
        <TouchableOpacity
          style={{...styles.loginBack,    marginTop: 20,          }}
          onPress={() => {
            onPress ? onPress : RootNavigation.goBack();
          }}>
          <BackIcon />
        </TouchableOpacity>
      )}
      <View style={styles.width}>
        <View style={styles.loginLeftWave}>
          <LeftCorner />
        </View>
        <View style={styles.img}>{image}</View>
        <View style={styles.loginRightWave}>
          <RightCorner />
        </View>
      </View>
    </View>
  );
};

export const HeaderOnly = props => {
  const mode = detectTheme();

  const {
    showLeftIcon,
    showRightIcon,
    title,
    onPressLeft,
    onPressRight,
    rightIcon,
    rightText,
    rightTextStyle,
    iconColor,
  } = props;
  const onPressLeftIcon = () => {
    onPressLeft ? onPressLeft() : showLeftIcon && RootNavigation.goBack();
  };

  return (
    <View style={{...styles.onlyContainer}}>
      <FocusAwareStatusBar />

      <TouchableOpacity
        onPress={onPressLeftIcon}
        disabled={!showLeftIcon}
        style={[
          {
            ...styles.iconLeft,
            ...styles.onPressBlock,
            paddingVertical: 10,
            paddingHorizontal: 10,
          },
        ]}>
        {showLeftIcon && (
          <BackIcon color={iconColor || themes[mode]['headingColor']} />
        )}
      </TouchableOpacity>
      <Text
        style={{
          ...styles.onlyTitle,
          color: themes[mode]['headingColor'],
          marginLeft: rightText ? '4%' : 0,
        }}>
        {title}
      </Text>
      {onPressRight && (
        <TouchableOpacity onPress={onPressRight} style={[{...styles.iconLeft}]}>
          {rightIcon}
          {rightText && (
            <Text style={[{...styles.rightIconText}, rightTextStyle]}>
              {rightText ? rightText : 'Add +'}
            </Text>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

export const Header = props => {
  const mode = detectTheme();

  const {
    showLeftIcon,
    showRightIcon,
    leftIcon,
    leftText,
    title,
    onPressLeft,
    onPressRight,
    rightIcon,
    includeFont,
    rightText,
    rightTextStyle,
  } = props;
  const onPressLeftIcon = () => {
    onPressLeft ? onPressLeft() : showLeftIcon && RootNavigation.goBack();
  };
  return (
    <View style={{...styles.container}}>
      <LeftCorner />
      <FocusAwareStatusBar />
      <View style={{...styles.iconWrap}}>
        <View
          style={{
            ...styles.alignItem,
          }}>
          <TouchableOpacity
            style={[{...styles.iconLeft}, {...styles.onPressBlock}]}
            onPress={onPressLeftIcon}
            disabled={leftText}>
            {showLeftIcon && leftIcon ? (
              <View style={{marginVertical: ms (10),}}>
                <BackIcon />
              </View>
            ) : (
              <Text
                style={{
                  ...styles.textLeft,
                  marginVertical: 10,

                  color: themes[mode]['headingColor'],
                }}>
                {leftText}
              </Text>
            )}
          </TouchableOpacity>
          <Text
            style={{
              ...styles.title,
              fontSize: includeFont ? 24 : 20,
              color: themes[mode]['headingColor'],
              marginVertical: 10,
              marginLeft: 10,
            }}>
            {title}
          </Text>
          {onPressRight && (
            <TouchableOpacity
              onPress={onPressRight}
              style={[
                {paddingHorizontal: 10, paddingVertical: 10},
                {...styles.onPressBlock},
              ]}>
              {rightIcon ? (
                <View style={{marginVertical: 10}}>{rightIcon}</View>
              ) : (
                <Text
                  style={[
                    {
                      ...styles.rightIconText,
                      marginBottom: 10,
                      marginTop: Platform.OS === 'android' ? 0 : 10,
                    },
                    rightTextStyle,
                  ]}>
                  {rightText || 'Add'}
                </Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>
      <View style={styles.rightWave}>
        <RightCorner />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  iconWrap: {
    marginTop: -110,
    justifyContent: 'center',
  },
  alignItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rightIconText: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: themes['light']['primaryColor'],
  },
  iconLeft: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  onPressBlock: {
    paddingHorizontal: 20,
  },
  rightWave: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    top: '60%',
  },
  title: {
    fontFamily: fonts.semiBold,
    fontSize: 20,
    textTransform: 'capitalize',
  },
  textLeft: {
    fontFamily: fonts.semiBold,
    fontSize: 24,
    marginLeft: '4%',
  },
  onlyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  onlyTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 24,
  },
  loginBack: {
    width: 50,
    height: 50,
    position: 'absolute',
    zIndex: 101,
    marginTop: 35,
  },
  width: {
    width: '100%',
  },
  loginLeftWave: {
    marginLeft: '-10%',
    top: '-5%',
  },
  img: {
    alignSelf: 'center',
    marginTop: '-20%',
  },
  loginRightWave: {
    position: 'absolute',
    right: '-10%',
    top: '60%',
  },
});
