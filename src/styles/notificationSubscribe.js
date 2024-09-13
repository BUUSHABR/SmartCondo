import {Platform, StyleSheet} from 'react-native';
import {detectTheme} from '../helpers';
import {themes, fonts} from '../themes';
import commonStyles from './commonStyles';
import { ms } from '../helpers/scaling';

const mode = detectTheme();
export default StyleSheet.create({
  container: {backgroundColor: themes[mode]['bgColor'], height: '100%'},
  align: {
    flex: 1,
    // paddingHorizontal: 20,
    // paddingVertical: Platform.OS === 'android' ? 35 : 25,
  },
  checkBox: {
    width: 22,
    height: 22,
  },
  subscribe_msg: {
    fontFamily: fonts.light,
    fontSize:ms(14),
    lineHeight:ms(20),
    letterSpacing: 0.5,
    marginVertical: ms(6),
  },
  subscribe_name: {
    fontFamily: fonts.medium,
    fontSize: ms(16),
    letterSpacing: 0.5,
  },
  subscribe_row: {
    flexDirection:"column",
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 7,
  },
  flatlist: {
    ...commonStyles.headerSpacing,
    marginTop: 15,
  },
});
