import {StyleSheet, Appearance} from 'react-native';
import {fonts, themes} from '../themes';
import {detectTheme} from '../helpers';

const mode = detectTheme();
export default StyleSheet.create({
  container: {flexGrow: 1, justifyContent: 'space-between'},
  scrollContainer: {
    height: '100%',
  },
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
    height: '100%',
    },
  row1: {marginVertical: 20},
  leftCorner: {position: 'absolute', top: -30},
  centerAlign: {
    alignItems: 'center',
  },
  rightCorner: {position: 'absolute', right: -10, top: 150},
  row2: {
    marginHorizontal: 20,
    marginBottom: 60,
    marginTop: -30,
  },
  welcome: {
    fontFamily: fonts.regular,
    fontSize: 31,
    letterSpacing: 0.5,
    marginVertical: 3,
  },
  name: {
    fontFamily: fonts.bold,
    fontSize: 31,
    letterSpacing: 0.5,
  },
  textField: {marginVertical: 10},
  forgot: {margin: 20, width: '40%'},
  forgotText: {
    fontFamily: fonts.regular,
    fontSize: 16,
  },
});
