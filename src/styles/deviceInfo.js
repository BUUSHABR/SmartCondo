import {StyleSheet} from 'react-native';
import {fonts} from '../themes';
import commonStyles from './commonStyles';
import { ms } from '../helpers/scaling';

export default StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  selectText: {
    fontFamily: fonts.light,
    fontSize:ms(16),
    lineHeight: ms(20),
    textAlign: 'center',
    marginVertical: 25,
  },
  subscribe_msg: {
    fontFamily: fonts.light,
    fontSize: ms(14),
    lineHeight: ms(20),
    letterSpacing: 0.5,
    marginVertical: 6,
  },
  label: {
    fontFamily: fonts.light,
    fontSize: ms(18),
    lineHeight: ms(20),
    letterSpacing: 0.5,
    marginVertical: 6,
  },
  description: {
    fontFamily: fonts.light,
    fontSize: ms(14),
    lineHeight: ms(20),
  },
  subscribe_row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 7,
    marginVertical: 15,
  },
  listWrapper: {
    ...commonStyles.headerSpacing,
    marginTop: 15,
  },
});
