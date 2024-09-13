import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {themes, fonts} from '../themes';
import {detectTheme} from '../helpers';
import {CrossIcon} from '../../assets/img/svgs';

const CustomToast = props => {
  const mode = detectTheme();
  const {message, shown} = props;
  const [show, setShow] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setShow(false);
    }, 6000);
  }, [shown]);
  return (
    <View>
      {shown ? (
        <View
          style={{
            ...styles.toastContainer,
            backgroundColor: themes[mode]['bgColor'],
            borderColor: themes[mode]['lineColor'],
          }}>
          <View style={styles.align}>
            <View
              style={{
                ...styles.closeBox,
                backgroundColor: themes[mode]['error'],
              }}>
              <CrossIcon color={'#fff'} />
            </View>
            <Text
              style={{
                ...styles.message,
                color: themes['light']['headingColor'],
              }}>
              {message}
            </Text>
          </View>
        </View>
      ) : null}
    </View>
  );
};

export default CustomToast;
const styles = StyleSheet.create({
  toastContainer: {
    height: 40,
    paddingHorizontal: 20,
    bottom: 0,
    left: 0,
    justifyContent: 'center',
    marginHorizontal: 20,
    borderRadius: 8,
    borderWidth: 0.7,
  },
  align: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  closeBox: {
    width: 13,
    height: 13,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    fontFamily: fonts.regular,
    fontSize: 12,
    letterSpacing: 0.3,
    marginLeft: 10,
  },
  action: {
    fontFamily: fonts.medium,
    fontSize: 14,
    letterSpacing: 0.3,
  },
});
