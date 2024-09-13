import {StyleSheet} from 'react-native';
import {commonColors, fonts} from '../themes';
import {screenSize, windowSize} from '../helpers';
import commonStyles from './commonStyles';

export default StyleSheet.create({
  containerStyle: {
    ...commonStyles.scrollContainer,
  },
  scrollStyle: {
    ...commonStyles.safeAreaAlign,
  },
  safeArea: {
    width: '100%',
  },
  scrollStyle1: {
    height: '100%',
  },
  containerStyle1: {
    flexGrow: 1,
    paddingBottom: 200,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: commonColors.yellowColor,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  info: {
    ...commonStyles.regular_15,
    marginHorizontal: '4%',
    textAlign: 'center',
    marginVertical: '3%',
  },
});
