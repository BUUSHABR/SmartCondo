import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {themes, fonts} from '../themes';
import {detectTheme} from '../helpers';
import {TouchableOpacity} from 'react-native-gesture-handler';

const BottomToast = props => {
  const mode = detectTheme();
  const {message, action, shown, onPressAction} = props;
  const [show, setShow] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setShow(false);
    }, 700000);
  }, [shown]);

  return (
    <View>
      {shown && show ? (
        <View
          style={{
            ...styles.toastContainer,
            backgroundColor: themes[mode]['headingColor'],
          }}>
          <View style={styles.align}>
            <Text
              style={{...styles.message, color: themes['light']['bgColor']}}>
              {message}
            </Text>
            <TouchableOpacity onPress={onPressAction}>
              <Text
                style={{
                  ...styles.action,
                  color: themes['light']['primaryColor'],
                }}>
                {action}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : null}
    </View>
  );
};

export default BottomToast;
const styles = StyleSheet.create({
  toastContainer: {
    width: '100%',
    height: 55,
    paddingHorizontal: 20,
    bottom: 0,
    left: 0,
    justifyContent: 'center',
  },
  align: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  message: {
    fontFamily: fonts.regular,
    fontSize: 12,
    letterSpacing: 0.3,
  },
  action: {
    fontFamily: fonts.medium,
    fontSize: 14,
    letterSpacing: 0.3,
  },
});
