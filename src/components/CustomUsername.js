import React, {Component} from 'react';
import {StyleSheet, Platform, View, Text} from 'react-native';
import {FloatingLabelInput} from 'react-native-floating-label-input';

import {themes, fonts} from '../themes';
import {MessageBox, ErrorIcon} from '../../assets/img/svgs';
import {detectTheme, numberOnlyRegex} from '../helpers';

class CustomUsername extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clear: false,
      focus: false,
    };
  }

  componentDidMount() {
    if (this.props.onRef != null) {
      this.props.onRef(this);
    }
  }
  onSubmitEditing() {
    this.props.onSubmitEditing();
  }
  handleChange = (name, value) => {
    this.setState({clear: false, focus: true});
    if (numberOnlyRegex(value)) {
      value.length < 11 && this.props.onChange(name, value);
    } else this.props.onChange(name, value);
  };

  onFocus = () => {
    this.setState({focus: true});
  };
  onBlur = () => {
    this.setState({focus: false});
  };

  render() {
    const mode = detectTheme();
    const {
      value,
      error,
      label,
      onSubmitEditing,
      editable,
      name,
      minLength,
      maxLength,
      returnKeyType,
    } = this.props;
    const showError = error?.length > 5;
    const {clear, focus} = this.state;
    const {onFocus, onBlur, handleChange} = this;
    return (
      <View style={styles.topView}>
        <FloatingLabelInput
          selectionColor={themes[mode]['primaryColor']}
          ref={input => (this.textInput = input)}
          name={name}
          editable={editable}
          label={label}
          autoFocus={false}
          isFocused={focus}
          maxDecimalPlaces={6}
          value={clear ? '' : value}
          keyboardType="numeric"
          autoCapitalize="none"
          allowFontScaling={false}
          onSubmit={onSubmitEditing}
          onChangeText={val => handleChange(name, val)}
          onFocus={onFocus}
          onBlur={onBlur}
          blurOnSubmit={false}
          returnKeyType={returnKeyType || 'next'}
          containerStyles={{
            ...styles.container,
            borderColor: themes[mode][showError ? 'error' : 'lineColor'],
          }}
          customLabelStyles={{
            ...styles.customLabel,
            colorFocused: themes[mode]['lightAsh'],
            color: themes[mode]['lightAsh'],
            colorBlurred: themes[mode]['lightAsh'],
            fontSizeFocused: 12,
            topFocused: -22,
            leftFocused: -20,
            topBlurred: 4,
            leftBlurred: 9,
          }}
          labelStyles={{
            ...styles.label,
          }}
          inputStyles={{
            ...styles.input,
            color:
              themes[mode][editable === false ? 'ashColor' : 'headingColor'],
          }}
          maxLength={maxLength}
          minLength={minLength}
          leftComponent={
            <View
              style={{
                marginTop: 8,
              }}>
              <MessageBox />
            </View>
          }
        />
        <View style={{margin: 3}}>
          {showError && (
            <View style={{flexDirection: 'row', marginVertical: 5}}>
              <ErrorIcon />
              <Text
                style={{
                  ...styles.error,
                  color: themes[mode]['error'],
                }}>
                {error}
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  }
}

export default CustomUsername;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 58,
    borderBottomWidth: 1,
    paddingLeft: Platform.OS === 'ios' ? 7 : 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customLabel: {
    fontSize: 14,
  },
  label: {
    fontFamily: fonts.regular,
  },
  input: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    marginTop: 8,
    marginLeft: 10,
  },
  error: {
    fontFamily: fonts.regular,
    fontSize: 12,
    alignSelf: 'flex-start',
    marginLeft: 7,
  },
});
