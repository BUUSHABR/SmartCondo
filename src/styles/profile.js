import {StyleSheet} from 'react-native';
import {commonColors, fonts} from '../themes';
import {screenSize, windowSize} from '../helpers';
import commonStyles from './commonStyles';
import { ms } from '../helpers/scaling';

export default StyleSheet.create({
  headerLeftText: {
    fontFamily: fonts.semiBold,
    fontSize: ms(22),
  },
  containerStyle: {
    flexGrow: 1,
  },
  wrapper: {
    width: '100%',
  },
  profileTouchBlock: {
    ...commonStyles.headerSpacing,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '7%',
    alignSelf: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: commonColors.yellowColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontFamily: fonts.semiBold,
    fontSize: ms(22),
    textAlign: 'center',
  },
  profileTextWrapper: {
    ...commonStyles.centerAlign,
    // marginTop: 5,
    alignItems:"center"
  },
  name: {
    ...commonStyles.bold_20,
    textAlign: 'center',
    marginVertical: 5,
    marginHorizontal: 7,
  },
  phone: {
    ...commonStyles.light_15,
    opacity: 0.8,
    marginVertical: '2%',
    textTransform: 'capitalize',
    textAlign: 'center',
  },
  unit: {
    ...commonStyles.light_15,
    opacity: 0.8,
    marginVertical: 6,
    textTransform: 'capitalize',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  bottomMenuWrapper: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    borderWidth: 2,
    borderBottomWidth: 0,
  },
  horizontalLine: {
    width: 60,
    height: 6,
    borderRadius: 20,
    backgroundColor: '#f1f1f1',
    alignSelf: 'center',
    top: 20,
  },
  menuWrapSpacing: {
    paddingVertical: '18%',
    paddingBottom: Platform.OS === 'ios' ? '3%' : 0,
    paddingLeft: 25,
    paddingRight: 25,
  },
  menuItem: {
    ...commonStyles.spaceBtwnAlign,
    alignItems: 'center',
  },
  iconWrap: {
    width: ms(40),
    maxHeight: ms(100),
    minHeight: ms(60),
    justifyContent: 'center',
  },
  menuItem1: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
