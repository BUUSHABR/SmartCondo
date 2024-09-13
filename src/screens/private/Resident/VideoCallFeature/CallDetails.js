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

class CallDetails extends Component {
  render() {
    const {
        navigation,
        route: {
          params: {data},
        },
        showRegistrationDetails,
        stopLoader,
      } = this.props;
    return (
      <View>
        <ViewDetailsComponent
          details={{
            notes: true,
            headerProp: {
              title: `Call Details`,
              onPressRight: () => {},
              rightText: " ",
              showLeftIcon: true,
              leftIcon: true,
            },
            detailsProp: {
              device_name: {
                label: "",
                value: data?.device_name,
              },
              call_status: {
                label: "",
                value: data?.call_status,
              },
              // email: {label: '', value: email},
              gate_open: { label: "", value: data?.gate_open },
              call_type: { label: "", value: data?.call_type },
              resident_variant: { label: "", value: data?.resident_variant },
              resident_name: { label: "", value: data?.resident_name },

            },
          }}
        />
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

const mapDispatchToProps = {
  showRegistrationDetails,
  stopLoader,
};

export default connect(mapStateToProps, mapDispatchToProps)(CallDetails);
