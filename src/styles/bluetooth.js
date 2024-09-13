import {StyleSheet} from 'react-native';
import {fonts, themes} from '../themes';
import commonStyles from './commonStyles';
import { ms } from '../helpers/scaling';

export default StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  headerTop: {
    marginTop: '-4%',
  },
  bodyTop: {
    ...commonStyles.headerSpacing,
    height: '100%',
    alignItems:"center",
    justifyContent:"center"
  },
  containerStyle: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  wrapper: {
    // marginVertical: '7%',
    marginHorizontal: 30,
    // marginTop:80
  },
  alignment: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: '10%',
  },
  block1: {marginVertical: '3%'},
  enableText: {
    fontFamily: fonts.bold,
    fontSize: 25,
    margin: 10,
    textAlign: 'center',
  },
  allowMsg: {
    fontFamily: fonts.regular,
    fontSize:ms(16),
    lineHeight: ms(29),
    textAlign: 'center',
    margin: 12,
  },
  enabled: {
    fontFamily: fonts.bold,
    fontSize:ms(16),
    lineHeight: ms(26),
    color: themes['light']['primaryColor'],
    textAlign: 'center',
    marginVertical: 20,
    letterSpacing: 0.5,
  },
  buttonWrap: {
    marginVertical: 15,
  },
});
