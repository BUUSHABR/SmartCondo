import React, {Component} from 'react';
import {StyleSheet, View, TouchableOpacity, Animated} from 'react-native';
import {themes} from '../themes';
import {
  SettingIconAdd,
  BluetoothIconAdd,
  MessageIconAdd,
  AddIcon,
} from '../../assets/img/svgs';

class AddButton extends Component {
  constructor(props) {
    super(props);
    this.buttonSize = new Animated.Value(1);
    this.mode = new Animated.Value(0);
  }
  handlePress = () => {
    const {buttonSize, mode} = this;
    Animated.sequence([
      Animated.timing(buttonSize, {
        toValue: 0.95,
        duration: 50,
        useNativeDriver: false,
      }),
      Animated.timing(buttonSize, {
        toValue: 1,
        useNativeDriver: false,
      }),
      Animated.timing(mode, {
        toValue: mode._value === 0 ? 1 : 0,
        useNativeDriver: false,
      }),
    ]).start();
  };

  onPressIcon = screen => {
    const {navigation} = this.props;
    navigation.navigate(screen);
  };

  render() {
    const {handlePress, buttonSize, mode, onPressIcon} = this;

    const sizeStyle = {
      transform: [{scale: buttonSize}],
    };
    const rotation = mode.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '45deg'],
    });
    const messageX = mode.interpolate({
      inputRange: [0, 1],
      outputRange: [-24, -100],
    });
    const messageY = mode.interpolate({
      inputRange: [0, 1],
      outputRange: [-50, -100],
    });
    const bleX = mode.interpolate({
      inputRange: [0, 1],
      outputRange: [-24, -24],
    });
    const bleY = mode.interpolate({
      inputRange: [0, 1],
      outputRange: [-50, -150],
    });
    const settingX = mode.interpolate({
      inputRange: [0, 1],
      outputRange: [-24, 50],
    });
    const settingY = mode.interpolate({
      inputRange: [0, 1],
      outputRange: [-50, -100],
    });
    const sosX = mode.interpolate({
      inputRange: [0, 1],
      outputRange: [-50, 25],
    });
    const sosY = mode.interpolate({
      inputRange: [0, 1],
      outputRange: [-50, -50],
    });
    return (
      <View style={{position: 'absolute', alignItems: 'center'}}>
        <Animated.View
          style={{position: 'absolute', left: messageX, top: messageY}}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => onPressIcon('ComplaintScreen')}>
            <MessageIconAdd />
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={{position: 'absolute', left: bleX, top: bleY}}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => onPressIcon('BleScreen')}>
            <BluetoothIconAdd />
          </TouchableOpacity>
        </Animated.View>
        <Animated.View
          style={{position: 'absolute', left: settingX, top: settingY}}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => onPressIcon('ProfileScreen')}>
            <SettingIconAdd />
          </TouchableOpacity>
        </Animated.View>
        <Animated.View style={[styles.button, sizeStyle]}>
          <TouchableOpacity onPress={this.handlePress}>
            <Animated.View style={{transform: [{rotate: rotation}]}}>
              <AddIcon />
            </Animated.View>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  }
}
export default AddButton;

const styles = StyleSheet.create({
  button: {
    backgroundColor: themes['light']['primaryColor'],
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
    borderRadius: 25,
    position: 'absolute',
    top: -50,
    shadowColor: '#777',
    shadowRadius: 5,
    shadowOffset: {height: 10},
    shadowOpacity: 0.3,
    borderWidth: 3,
    borderColor: 'transparent',
    elevation: 4,
  },
  secondaryButton: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: themes['light']['primaryColor'],
  },
});
