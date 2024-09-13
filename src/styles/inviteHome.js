import {StyleSheet, Appearance,Platform} from 'react-native';
import {fonts, themes} from '../themes';
import {detectTheme, windowSize} from '../helpers';
import { ms } from '../helpers/scaling';

export default StyleSheet.create({
  cardStyle: {
    elevation: 1,
    shadowOffset: {width: 2, height: 1},
    shadowOpacity: 0.15,
    shadowRadius: 2,
    marginRight: 15,
    shadowColor: '#bbb',
    borderRadius: 2,
    borderWidth: Platform.OS==="ios"?1:0,
    // borderWidth: 1,

    // backgroundColor: 'red',
  },
  cardWrap: {
    flexDirection: 'row',
    marginHorizontal: 10,
    marginVertical: 15,
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 5,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize:ms(17),
    lineHeight: ms(24),
  },
  subTitle: {
    fontFamily: fonts.bold,
    fontSize: ms(19),
    lineHeight:ms(24),
  },
  message: {
    fontFamily: fonts.light,
    fontSize: ms(12),
    lineHeight: ms(16),
    marginTop: ms(10),
    minWidth: ms(150),
    maxWidth: ms(220),

    letterSpacing: 0.2,
  },
  // invite tile instruction
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // paddingHorizontal: 20,
    marginTop: 30,
    // maxWidth: '%',
    // paddingHorizontal: 15,
    // minWidth: '90%',
    // width: '90%',
    // borderWidth: 1,
    // minWidth: '40%',

    // height: '25%',
    width:"80%"
  },
  row1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width:"80%"

  },
  card1: {
    borderRadius: 14,
    paddingLeft: 15,
    paddingRight: 10,
    paddingBottom: '10%',
    // minHeight: '30%',
    // minWidth: '40%',
    // marginRight: 20,
    // maxWidth: '130%',

    // minHeight: '60%',

    // height: 152,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  cardAlign1: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
  },
  card1Col1: {
    // marginTop: '10%',
    marginRight: '10%',
    minHeight: 50,
    maxHeight: 80,
  },
  card2: {
    borderRadius: 14,
    paddingLeft: 15,
    paddingRight: 10,
    paddingBottom: '12%',
  },
  cardAlign2: {
    flexDirection: 'row',
  },
  card2Col1: {
    // marginTop: '12%',
    marginRight: '10%',
    minHeight: 50,
    maxHeight: 150,
  },
  text1: {
    fontFamily: fonts.medium,
    fontSize: ms(13),
    marginTop: 20,
    minWidth: 100,
    maxWidth: 120,
  },
  card1Col2: {
    position: 'absolute',
    right: 0,
    flexDirection: 'row',
  },
  icon1: {
    maxHeight: 60,
  },
  icon2: {
    maxHeight: 50,
    // minHeight: 50,
  },

  // covid instruction
  instruction: {
    // marginTop: '-1%',
  },
  covid: {
    fontFamily: fonts.regular,
    fontSize: 16,
    // marginHorizontal: 25,
    marginLeft:15
  },
  prevent: {
    fontFamily: fonts.bold,
    fontSize: 18,
    // marginHorizontal: 10,
    marginLeft:15
  },
  scroll: {
    // width: '100%',
    marginLeft: 30,
  },
  container: {
    paddingRight: 20,
    // flexGrow: 1,
    marginTop: 20,
  },
  seperatorLine: {
    borderBottomWidth: 1,
    marginBottom: 5,
    marginTop: -10,
  },
});
