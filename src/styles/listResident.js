import {StyleSheet, Platform} from 'react-native';
import commonStyles from './commonStyles';
import {commonColors, fonts} from '../themes';
import { ms } from '../helpers/scaling';

export default StyleSheet.create({
  containerStyle: {
    flexGrow: 1,
  },
  scrollStyle: {
    ...commonStyles.safeAreaAlign,
  },
  blockHeader: {
    ...commonStyles.spaceBtwnAlign,
    marginHorizontal: 15,
  },
  boxShadow: {
    width: ms(110),
    minHeight: ms(100),
    borderRadius: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Platform.OS === 'android' ? ms(10) : ms(15),
    paddingBottom: ms(20),
    // shadowColor: '#bbb',
    borderColor:'transparent',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 1,
    shadowRadius: 2.5,
    marginRight: ms(20),
    marginTop: ms(30),
    marginLeft: ms(5),
    borderWidth: 0.7,
    paddingHorizontal: ms(5),
    overflow:"hidden"
  },
  listStyle: {
    width: '100%',
    paddingLeft: '5%',
    paddingRight: 30,
    height: 190,
  },
  avatar: {
    width: ms(35),
    height: ms(35),
    borderRadius: ms(17),
    backgroundColor: commonColors.lightViolet1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    ...commonStyles.semiBold_14,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  centerAlign: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text1: {
    ...commonStyles.regular_16,
    marginVertical: 7,
    // textAlign: 'center',
  },
  text2: {
    ...commonStyles.regular_14,
    textTransform: 'capitalize',
    textAlign: 'center',
  },
  noDataAlign: {
    paddingLeft: '5%',
    height: 190,
  },
  noDataBoxShadow: {
    width: '90%',
    alignItems: 'center',
    paddingVertical: 25,
  },
  noData: {
    fontFamily: fonts.regular,
    fontSize: 16,
    marginVertical: 10,
  },
});
