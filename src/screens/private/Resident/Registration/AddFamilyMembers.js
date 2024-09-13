import React, {Component} from 'react';
import {View, Text, Keyboard} from 'react-native';
import {connect} from 'react-redux';
import SafeAreaView from 'react-native-safe-area-view';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import {themes, fonts} from '../../../../themes';
import {registration, login} from '../../../../redux/actions';
import {NameIcon, GenderIcon} from '../../../../../assets/img/svgs';
import {
  CustomTextField,
  CustomSelect,
  SubmitButton,
  WithBgHeader,
} from '../../../../components';
import commonStyles from '../../../../styles/commonStyles';
import {nameValidation, textOnlyValidation} from '../../../../helpers';
import { ms } from '../../../../helpers/scaling';

class AddFamilyMembers extends Component {
  constructor(props) {
    super(props);
    this.relationRef = React.createRef();
  }

  componentDidMount() {
    const {clearState, navigation, onRegisterInputChange, formValidation} =
      this.props;
    this.focusListener = navigation.addListener('blur', () => {
      clearState('add_family');
      ['name', 'gender', 'relation']?.map(item => {
        formValidation({
          field: item,
          message: '',
        });
        onRegisterInputChange({type: 'add_family', name: item, value: ''});
      });
    });
  }

  focusNext = () => {
    this.relationRef.current.textInput.focus();
  };

  handleInputChange = (name, value) => {
    this.props.onRegisterInputChange({type: 'add_family', name, value});
    this.props.formValidation({field: name, message: null});
  };
  onSubmit = () => {
    const {name, relation} = this.props.add_family;
    Keyboard.dismiss();

    let err = false;
    ['name']?.map(item => {
      err = nameValidation(name) || textOnlyValidation(relation);
      if (item === 'name') {
        err = nameValidation(name);
        this.props.formValidation({
          field: 'name',
          message: nameValidation(name),
        });
      }
      if (item === 'relation') {
        err = textOnlyValidation(relation);
        this.props.formValidation({
          field: 'relation',
          message: textOnlyValidation(relation),
        });
      }
    });
    if (!err) {
      this.props.familyRegistration();
    }
  };
  render() {
    const {
      add_family: {name, gender, relation},
      submitted,
      errors,
      mode,
    } = this.props;
    const {handleInputChange, onSubmit} = this;
    return (
      <KeyboardAwareScrollView
        contentContainerStyle={{
          flexGrow: 1,
          backgroundColor: themes[mode]['bgColor'],
        }}
        style={{
          flex: 1,
          backgroundColor: themes[mode]['bgColor'],
        }}
        scrollEnabled={false}
        >
        <SafeAreaView
          style={{
            width: '100%',
          }}
          forceInset={{top: 'never'}}>
          <WithBgHeader
            leftIcon
            headerTitle="Add New Child / Elder"
            containerStyle={{
              ...commonStyles.headerSpacing,
            }}>
            <View
              style={{
                ...commonStyles.headerSpacing,
                marginTop: 0,
              }}>
              <Text
                style={{
                  fontFamily: fonts.light,
                  fontSize: ms(16),
                  lineHeight:ms(26),
                  color: themes[mode]['textColor'],
                  textAlign: 'center',
                  maxWidth: '90%',
                  alignSelf: 'center',
                }}>
                Children / Elders does not have a login for the smart condo app
              </Text>
              <View style={{marginTop: '7%'}}>
                <CustomTextField
                  name="name"
                  label="Name "
                  value={name}
                  onChange={handleInputChange}
                  onSubmitEditing={() => onSubmit()}
                  keyboardType="default"
                  icon={<NameIcon />}
                  error={errors?.name}
                />
                <CustomSelect
                  placeholder={{
                    label: 'Select Relation',
                    value: null,
                  }}
                  name="relation"
                  value={relation}
                  label={'Relation'}
                  items={[
                    {label: 'Friend', value: 'friend', key: 1},
                    {label: 'Family', value: 'family', key: 2},
                  ]}
                  onValueChange={handleInputChange}
                  icon={<NameIcon />}
                />
                {/* <CustomTextField
                  ref={this.relationRef}
                  name="relation"
                  label="Relation "
                  value={relation}
                  onChange={handleInputChange}
                  onSubmitEditing={onSubmit}
                  keyboardType="default"
                  icon={<NameIcon />}
                  error={errors?.relation}
                /> */}
                <CustomSelect
                  placeholder={{
                    label: 'Select Gender',
                    value: null,
                  }}
                  name="gender"
                  value={gender}
                  label={'Gender'}
                  items={[
                    {label: 'Male', value: 'male', key: 1},
                    {label: 'Female', value: 'female', key: 2},
                    {label: 'Others', value: 'not_said', key: 3},
                  ]}
                  onValueChange={handleInputChange}
                  icon={<GenderIcon />}
                />
              </View>
            </View>
          </WithBgHeader>
        </SafeAreaView>

        <View style={{position: 'absolute', bottom: 0, width: '100%'}}>
          <SubmitButton
            buttonText="Create"
            handleSubmit={onSubmit}
            disableBtn={submitted}
          />
        </View>
      </KeyboardAwareScrollView>
    );
  }
}

const mapStateToProps = ({
  registration: {add_family},
  login: {errors, submitted},
  profile: {mode},
}) => {
  return {
    add_family,
    submitted,
    errors,
    mode,
  };
};
const {onRegisterInputChange, familyRegistration, clearState} = registration;
const {formValidation} = login;
const mapDispatchToProps = {
  onRegisterInputChange,
  familyRegistration,
  clearState,
  formValidation,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddFamilyMembers);
