import {StyleSheet} from 'react-native';
import commonStyles from './commonStyles';

export default StyleSheet.create({
  safeArea: {
    ...commonStyles.safeAreaAlign,
    height: '100%',
  },
  buttonAlign: {
    height: 100,
    position: 'absolute',
    width: '100%',
    bottom: Platform.OS === 'android' ? 0 : 20,
    marginTop: 60,
    paddingHorizontal: 40,
    alignSelf: 'center',
  },
  buttonStyle: {
    width: '100%',
    height: 40,
    borderRadius: 5,
    marginTop: 30,
  },
});
