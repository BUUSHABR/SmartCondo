import React, {Component} from 'react';
import {View, Keyboard} from 'react-native';
import {connect} from 'react-redux';
import {SvgXml} from 'react-native-svg';
import SafeAreaView from 'react-native-safe-area-view';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import {themes, commonColors} from '../../../../themes';
import {registration, login} from '../../../../redux/actions';
import {VehicleTypeIcon, CountIconNew} from '../../../../../assets/img/svgs';
import {numberPlateValidation} from '../../../../helpers';
import {
  CustomTextField,
  CustomSelect,
  SubmitButton,
  WithBgHeader,
} from '../../../../components';
import commonStyles from '../../../../styles/commonStyles';
import Animated from 'react-native-reanimated';
import { customAnimation } from '../../../../animation/CommonAnimation';
class AddVehicles extends Component {
  constructor(props) {
    super(props);
    this.vehicleRef = React.createRef();
    this.state = {
      error: false,
      shown: false,
    };
  }

  componentDidMount() {
    const {
      navigation,
      clearState,
      formValidation,
      onRegisterInputChange,
      submitControl,
    } = this.props;

    this.focusListener = navigation.addListener('blur', () => {
      clearState('add_vehicle');
      ['vehicle_number', 'vehicle_type']?.map(item => {
        formValidation({
          field: item,
          message: '',
        });
        onRegisterInputChange({type: 'add_vehicle', name: item, value: ''});
      });
      submitControl({submitted: false});
    });
  }

  handleInputChange = (name, value) => {
    const {onRegisterInputChange, formValidation} = this.props;
    onRegisterInputChange({type: 'add_vehicle', name, value});
    formValidation({field: name, message: ''});
    this.setState({error: false});
  };

  onSubmit = () => {
    const {add_vehicle} = this.props;
    const {formValidation} = this.props;
    let err = false;
    Keyboard.dismiss();
    ['vehicle_type', 'vehicle_number']?.map(item => {
      if (add_vehicle[item]?.length < 2 || !add_vehicle[item]) {
        err = true;
        formValidation({
          field: item,
          message: 'This field is mandatory',
        });
      }
      if (numberPlateValidation(add_vehicle['vehicle_number'])) {
        err = true;
        formValidation({
          field: 'vehicle_number',
          message: numberPlateValidation(add_vehicle['vehicle_number']),
        });
      }
    });

    if (!err) {
      this.props.vehicleRegistration();
    }
  };
  render() {
    const {
      add_vehicle: {vehicle_type, vehicle_number},
      errors,
      submitted,
      mode,
    } = this.props;
    const {handleInputChange, onSubmit} = this;
    const {error} = this.state;

    return (
      <KeyboardAwareScrollView
      scrollEnabled={false}

        contentContainerStyle={{
          flexGrow: 1,
          backgroundColor: themes[mode]['bgColor'],
        }}
        style={{
          flex: 1,
          backgroundColor: themes[mode]['bgColor'],
        }}>
        <SafeAreaView
          style={{
            width: '100%',
          }}
          forceInset={{top: 'never'}}>
          <WithBgHeader
            leftIcon
            headerTitle="Add Vehicles"
            containerStyle={{
              ...commonStyles.headerSpacing,
            }}>
            <Animated.View
            {...customAnimation("FadeInRight", 700, 50, 3)}
              style={{
                ...commonStyles.headerSpacing,
                marginTop: 15,
              }}>
              <View style={{marginBottom: 20}}>
                <CustomSelect
                  placeholder={{
                    label: 'Select Vehicle',
                    value: null,
                  }}
                  name="vehicle_type"
                  value={vehicle_type}
                  label={'Type of Vehicle'}
                  items={[
                    {label: 'Car', value: 'normal', key: 1},
                    {label: 'Bike', value: 'motor_bike', key: 2},
                  ]}
                  onValueChange={handleInputChange}
                  leftIcon={
                    <SvgXml
                      xml={VehicleTypeIcon(commonColors.lightAsh1)}
                      width={19}
                      height={14}
                    />
                  }
                  error={errors?.vehicle_type}
                />
              </View>
              <CustomTextField
              autoCap={true}
                name="vehicle_number"
                label={'Vehicle Number'}
                value={vehicle_number || ''}
                onChange={handleInputChange}
                onSubmitEditing={onSubmit}
                keyboardType="default"
                icon={
                  <SvgXml
                    xml={CountIconNew(commonColors.lightAsh1)}
                    width={14}
                    height={15}
                  />
                }
                error={errors?.vehicle_number}
              />
            </Animated.View>
          </WithBgHeader>
        </SafeAreaView>

        <View style={{position: 'absolute', bottom: 0, width: '100%'}}>
          <SubmitButton
            buttonText="Create"
            handleSubmit={onSubmit}
            disableBtn={submitted || error}
          />
        </View>
      </KeyboardAwareScrollView>
    );
  }
}

const mapStateToProps = ({
  registration: {add_vehicle},
  profile: {mode},
  login: {errors, submitted},
}) => {
  return {
    add_vehicle,
    add_vehicle,
    submitted,
    mode,
    errors,
  };
};
const {onRegisterInputChange, clearState, vehicleRegistration} = registration;
const {formValidation, submitControl} = login;
const mapDispatchToProps = {
  onRegisterInputChange,
  clearState,
  formValidation,
  vehicleRegistration,
  submitControl,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddVehicles);
