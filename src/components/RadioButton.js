import React, {Component} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {fonts, themes} from '../themes';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {detectTheme} from '../helpers';
import {SmallTick} from '../../assets/img/svgs';

class RadioButton extends Component {
  render() {
    const mode = detectTheme();

    const {handleChange, name, value} = this.props;
    const options = [
      {
        key: 'owner',
        text: 'Owner',
      },
      {
        key: 'tenant',
        text: 'Tenant',
      },
    ];
    return (
      <View style={styles.container}>
        <View
          style={{
            flexDirection: 'row',
            width: 200,
            justifyContent: 'space-between',
          }}>
          {options?.map((item, i) => {
            return (
              <TouchableOpacity
                activeOpacity={0.5}
                key={item.key}
                style={styles.button}
                onPress={() => handleChange(name, item.key)}>
                <TouchableOpacity
                  activeOpacity={0.5}
                  style={{
                    ...styles.circle,
                    borderColor:
                      themes[mode][
                        value === item.key ? 'headingColor' : 'lightAsh3'
                      ],
                  }}
                  onPress={() => handleChange(name, item.key)}>
                  {value === item.key && <SmallTick />}
                </TouchableOpacity>
                <Text
                  style={{
                    ...styles.text,
                    color:
                      themes[mode][
                        value === item.key ? 'headingColor' : 'lightAsh3'
                      ],
                  }}>
                  {item.text}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  }
}

export default RadioButton;

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  circle: {
    height: 19,
    width: 19,
    borderRadius: 8,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkedCircle: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  text: {
    fontFamily: fonts.regular,
    fontSize: 14,
    marginLeft: 10,
    letterSpacing: 0.5,
  },
});
