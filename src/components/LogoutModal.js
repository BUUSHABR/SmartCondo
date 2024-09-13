import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';

import {detectTheme} from '../helpers';
import {themes, fonts} from '../themes';

const LogoutModal = props => {
  const {onClose, onRequestClose, show, logout} = props;
  const mode = detectTheme();
  const items = [
    {
      label: 'Cancel',
      textColor: '#282828',
      bgColor: '#fff',
      onPress: onRequestClose,
    },
    {
      label: 'Logout',
      textColor: themes[mode]['error'],
      bgColor: themes[mode]['error'],
      onPress: logout,
    },
  ];
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={show}
      onRequestClose={onRequestClose}
      style={{}}>
      <TouchableWithoutFeedback onPressOut={onRequestClose}>
        <View
          style={{
            width: '85%',
            borderRadius: 10,
            alignSelf: 'center',
            marginHorizontal: 10,
            // paddingVertical: 30,
            paddingTop:50,
            elevation: 2,
            alignSelf: 'center',
            top: '38%',
            shadowOffset: {},
            shadowOpacity: 0.5,
            shadowRadius: 0.5,
            backgroundColor: '#fff',
          }}>
          <View style={{paddingHorizontal: 0}}>
            {/* <Text
              style={{
                fontFamily: fonts.medium,
                fontSize: 20,
                color: '#282828',
                textAlign: 'center',
              }}>
              Logout
            </Text> */}
            <Text
              style={{
                fontFamily: fonts.medium,
                fontSize: 15,
                color: "#282828",
                textAlign: 'center',
                // marginVertical: 25,
                paddingHorizontal:20,
                paddingBottom:15,
                }}>
              {`Are you sure you want to  logout?`}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                marginTop: '5%',
                // justifyContent: 'space-between',
                borderColor:"transparent",
                borderTopColor:themes[mode]["lightAsh"],
                borderWidth: 0.5,
              }}>
              {items?.map((ele, i) => {
                const {label, textColor, bgColor, onPress} = ele;
                console.log(label, 'labbee');
                return (
                  <TouchableOpacity
                    style={{
                      // borderColor:"red",
                      width:"50%",
                      paddingVertical: 15,
                      paddingHorizontal: 30,
                      // justifyContent:"center",
                      // borderColor:"transparent",
                      alignItems:"center",
                      borderRightColor:i==0?themes[mode]['lightAsh']:"transparent",
                      borderTopColor:"transparent",
                      borderLeftColor:"transparent",
                      borderBottomColor:"transparent",
                      borderWidth:0.5
                      // backgroundColor: bgColor,
                      // borderRadius: 3,
                      
                    }}
                    onPress={onPress}>
                    <Text
                      style={{
                        fontFamily: fonts.medium,
                        fontSize: 14,
                        color: textColor,
                      }}>
                      {label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default LogoutModal;
