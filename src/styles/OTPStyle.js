import {StyleSheet} from 'react-native';
import {fonts, themes} from '../themes';
import {detectTheme} from '../helpers';
import { ms } from '../helpers/scaling';

const mode = detectTheme();

export default StyleSheet.create({
  container: {
    flexGrow: 1,
    // backgroundColor:'red'
  },
  view: {flex: 1},
  safeArea: {
    height: '100%',
    flex: 1,
    justifyContent: "space-between",
    // marginBottom:20,
    marginTop:-10
    
    // backgroundColor:"blue"
  },
  horizontalAlign: {paddingHorizontal: 20},
  enterCode: {
    fontFamily: fonts.regular,
    fontSize: 24,
    letterSpacing: 1,
    marginVertical: 10,
  },
  msg: {
    fontFamily: fonts.regular,
    fontSize:ms(16),
    lineHeight: ms(26),
    letterSpacing: 0.2,
    maxWidth: '95%',
  },
  otpBlock: {
    marginVertical: '6%',
    alignItems: 'center',
  },
  timerBlock: {width: '90%', marginTop: 5, paddingHorizontal: '5%'},
  resend: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondsText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    letterSpacing: 1,
    marginLeft: 4,
  },
  align: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  didnt: {
    fontFamily: fonts.regular,
    fontSize: 16,
    letterSpacing: 0.5,
    marginRight: 3,
  },
  resendText: {
    fontFamily: fonts.regular,
    fontSize: 16,
    letterSpacing: 0.5,
  },
});
