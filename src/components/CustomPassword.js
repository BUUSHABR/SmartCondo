import React, {Component} from 'react';
import {StyleSheet, Platform, View, Text} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {FloatingLabelInput} from 'react-native-floating-label-input';

import {themes, fonts} from '../themes';
import {ShowEye, Lock, HideEye, ErrorIcon} from '../../assets/img/svgs';
import {detectTheme} from '../helpers';
import { ms } from '../helpers/scaling';

class CustomPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clear: false,
      focus: false,
      new_pass: false,
      show: false,
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
    this.props.onChange(name, value);
  };

  onFocus = () => {
    this.setState({focus: true});
  };
  onBlur = () => {
    this.setState({focus: false});
  };

  showPassword = () => {
    const {show} = this.state;
    this.setState({show: !show});
  };

  render() {
    const mode = detectTheme();
    const {
      value,
      error,
      label,
      onSubmitEditing,
      name,
      editable,
      returnKeyType,
      minLength,
      maxLength,
      defaultValue,
    } = this.props;
    const {handleChange, onBlur, onFocus, showPassword} = this;
    const showError = error?.length > 5;
    const {clear, focus, show} = this.state;

    return (
      <View style={styles.topView}>
        <FloatingLabelInput
          selectionColor={themes[mode]['primaryColor']}
          ref={input => (this.textInput = input)}
          isPassword
          togglePassword={show}
          name={name}
          editable={editable}
          label={label}
          isFocused={focus}
          value={clear ? '' : value}
          maxDecimalPlaces={6}
          onSubmit={onSubmitEditing}
          onChangeText={val => handleChange(name, val)}
          onFocus={onFocus}
          onBlur={onBlur}
          keyboardType="default"
          autoCapitalize="none"
          allowFontScaling={false}
          returnKeyType={returnKeyType || 'next'}
          blurOnSubmit={false}
          containerStyles={{
            ...styles.container,
            borderColor: themes[mode][showError ? 'error' : 'lineColor'],
          }}
          customLabelStyles={{
            ...styles.customLabel,
            colorFocused: themes[mode]['lightAsh'],
            color: themes[mode]['lightAsh'],
            colorBlurred: themes[mode]['lightAsh'],
            fontSizeFocused: 10,
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
              <Lock />
            </View>
          }
          customShowPasswordComponent={
            <TouchableOpacity onPress={showPassword} style={{zIndex: 10001}}>
              <HideEye />
            </TouchableOpacity>
          }
          customHidePasswordComponent={
            <TouchableOpacity onPress={showPassword} style={{zIndex: 10001}}>
              <ShowEye />
            </TouchableOpacity>
          }
        />

        <View style={{margin: 3, height: 15}}>
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

export default CustomPassword;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: ms(58),
    borderBottomWidth: 1,
    paddingLeft: Platform.OS === 'ios' ? 7 : 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customLabel: {
    fontSize:ms(14),
  },
  label: {
    fontFamily: fonts.regular,
  },
  input: {
    fontFamily: fonts.semiBold,
    fontSize: ms(16),
    marginTop: 8,
    marginLeft: 10,
    letterSpacing: 1,
  },
  error: {
    fontFamily: fonts.regular,
    fontSize: ms(12),
    alignSelf: 'flex-start',
    marginLeft: 7,
  },
});
