import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import {ScalingDot} from 'react-native-animated-pagination-dots';

import {detectTheme} from '../helpers';
import {themes} from '../themes';

const BottomDotSwipe = props => {
  const {data, scrollX, activeDotColor, inActiveDotColor} = props;
  const mode = detectTheme();
  return (
    <ScalingDot
      data={data}
      expandingDotWidth={30}
      scrollX={scrollX}
      inActiveDotOpacity={0}
      dotStyle={{
        ...styles.dot,
      }}
      containerStyle={{
        ...styles.container,
      }}
      activeDotColor={activeDotColor || themes[mode]['primaryColor']}
      inActiveDotColor={inActiveDotColor || themes[mode]['lineColor']}
    />
  );
};

export default BottomDotSwipe;

const styles = StyleSheet.create({
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 5,
    top: 30,
  },
  container: {
    bottom: 0,
    position: 'absolute',
  },
});
