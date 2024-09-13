import {View, Text, Appearance, StyleSheet, Keyboard} from 'react-native';
import {themes, fonts} from '../themes';
import { ms } from '../helpers/scaling';

export default StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  safeArea: {
    height: '100%',
    flex: 1,
    justifyContent: 'space-between',
  },
  wrapper: {
    position: 'absolute',
    width: '100%',
    marginTop: '30%',
    paddingHorizontal: 20,
  },
  title: {
    fontFamily: fonts.regular,
    fontSize: ms(24),
    letterSpacing: 1,
    marginVertical: 10,
  },
  msg: {
    fontFamily: fonts.regular,
    fontSize: ms(16),
    lineHeight: ms(26),
    letterSpacing: 0.2,
    maxWidth: '95%',
  },
});
