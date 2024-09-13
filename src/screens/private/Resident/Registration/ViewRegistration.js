import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Keyboard,
  StyleSheet,
  ScrollView,
  Dimensions,
  FlatList,
} from "react-native";
import moment from "moment";
import { connect } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as RootNavigation from "../../../../navigation/RootNavigation";
import { FocusAwareStatusBar } from "../../../../navigation/RootNavigation";
import SafeAreaView from "react-native-safe-area-view";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { themes, fonts, commonColors } from "../../../../themes";
import { profile, registration, login } from "../../../../redux/actions";
import { Header } from "../../../../components/Header";
import ViewDetailsComponent from "../../../../components/ViewDetailsComponent";
import { ShowVisitorDetailsLoader } from "../../../../../assets/img/loader";
import { registrationNameConversion } from "../../../../helpers";
import store from "../../../../redux/store";
import { WithBgHeader } from "../../../../components";
import commonStyles from "../../../../styles/commonStyles";

class ViewRegistration extends Component {
  componentDidMount() {
    const {
      navigation,
      route: {
        params: { data },
      },
      showRegistrationDetails,
      stopLoader,
    } = this.props;
    console.log(data, "detailssss residentss");
    this.focusListener = navigation.addListener("focus", () => {
      data?.title === "Residents"
        ? showRegistrationDetails(data?.type_id)
        : stopLoader(false);
    });
    this.blurListener = navigation.addListener("blur", () => {
      store.dispatch({
        type: "RESIDENT_DETAILS",
        payload: {
          data: { data: {} },
        },
      });
    });
  }
  render() {
    const { loader, route, residentDetails, mode } = this.props;
    const {
      name,
      phone,
      email,
      gender,
      vehicle_number,
      resident_type,
      res_position,
      id,
    } = residentDetails;
    const {type_id} =route?.params?.data;
    console.log(residentDetails, "detailssss");
    console.log(route?.params?.data,"iiui");
    return (
      <View>
        {loader && Object.keys(residentDetails).length == 0 ? (
          <SafeAreaView
            style={{
              backgroundColor: themes[mode]["bgColor"],
              height: "100%",
            }}
            forceInset={{ top: "never" }}
          >
            <WithBgHeader
              leftIcon
              headerTitle={`${route?.params?.data?.title} Details`}
              containerStyle={{
                ...commonStyles.headerSpacing,
              }}
            >
              <View
                style={{
                  ...commonStyles.headerSpacing,
                }}
              >
                {[1, 2, 3, 4]?.map((item) => {
                  return (
                    <View>
                      <ShowVisitorDetailsLoader />
                    </View>
                  );
                })}
              </View>
            </WithBgHeader>
          </SafeAreaView>
        ) : (
          <ViewDetailsComponent
            details={{
              notes: true,
              headerProp: {
                title: `${registrationNameConversion(
                  route?.params?.data?.title
                )} Details`,
                onPressRight: () => {},
                rightText: " ",
                showLeftIcon: true,
                leftIcon: true,
              },
              residentId: id,
              vehicleId:route?.params?.data?.title === "Residents"?null:type_id,
              getProfile: this.props.getProfile,
              swapPositionProp:
                route?.params?.data?.current_unit_position == "primary"||"secondary"
                  ? res_position
                  : false,
              detailsProp:
                route?.params?.data?.title === "Residents"
                  ? {
                      name: { label: "", value: name },
                      phone: { label: "", value: phone },
                      // email: {label: '', value: email},
                      resident_type: { label: "", value: resident_type },
                      res_position: { lable: "", value: res_position },
                    }
                  : route?.params?.data?.obj

              // descriptionProp: {
              //   notes:
              //     'qwertyuiowertyuio qwertyuiowertyuio qwertyuiowertyuio qwertyuiowertyuio',
              // },
              // detailsActionButton: [
              //   {
              //     btnText: 'Cancel',
              //     action: () => {},
              //     buttonStyle: {
              //       borderColor: commonColors.yellowColor,
              //       width: 120,
              //     },
              //     textStyle: {
              //       color: themes[mode]['headingColor'],
              //     },
              // disableBtn:loading,
              //   },
              //   {
              //     btnText: 'Resend',
              //     action: () => {},
              //     buttonStyle: {
              //       backgroundColor: commonColors.yellowColor,
              //       borderColor: 'transparent',
              //       width: 120,
              //     },
              //     textStyle: {
              //       color: themes[mode]['headingColor'],
              //     },
              // disableBtn:loading,

              //   },
              // ],
            }}
          />
        )}
      </View>
    );
  }
}

const mapStateToProps = ({
  profile: { mode },
  registration: { residentDetails, loader },
}) => {
  return {
    mode,
    residentDetails,
    loader,
  };
};

const { showRegistrationDetails, stopLoader } = registration;
const { getProfile } = profile;

const mapDispatchToProps = {
  showRegistrationDetails,
  stopLoader,
  getProfile,
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewRegistration);
