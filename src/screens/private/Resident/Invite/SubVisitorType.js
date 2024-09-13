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
import { SafeAreaView } from "react-native-safe-area-context";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { themes, fonts } from "../../../../themes";
import { profile, registration } from "../../../../redux/actions";
import {
  ResidentAddIcon,
  SwitchUnitIcon,
  RecentVisitorIcon,
  FaqIcon,
  LogoutIcon,
  IconNext,
  NameIcon,
  PhoneIcon,
  MessageBox,
  LeftCorner,
  RightCorner,
  VisitorVector,
  ContractorVector,
  DeliveryVector,
  PickupVector,
  ContractorType,
  Count,
} from "../../../../../assets/img/svgs";
import {
  detectTheme,
  capitalizeTwoLetter,
  nameValidation,
  phoneValidation,
} from "../../../../helpers";
import {
  CustomTextField,
  CustomSelect,
  CustomUsername,
  RadioButton,
  SubmitButton,
} from "../../../../components";
import CustomDatePicker from "../../../../components/CustomDatePicker";
import { invite } from "../../../../redux/actions";
import data from "../../../private/InviteData.json";
import { SvgUri, SvgXml } from "react-native-svg";
import { ListTypeColumn } from "../../../../components";

class SubVisitorType extends Component {
  componentDidMount() {
    const { setSubvisitorList } = this.props;
    setSubvisitorList();
  }
  handleChange = ({ name, value, navigate }) => {
    // alert(value)
    console.log(name, value, "subvisitor changee");
    this.props.inviteChange({ name, value });
    if(!value){
      console.log("Aswad")
    }

    navigate && this.props.navigation.goBack();

  };
  render() {
    // alert(JSON.stringify(this.props.route.params.subvisit))
    const param=this.props.route.params.subvisit
    const { invite } = this.props;
    const { subVisitorTypeArr, } = invite;
    const { purpose, sub_visitor } = invite.inviteeData;
// alert(JSON.stringify(subVisitorTypeArr))
    const { handleChange } = this;
    let searchProps = {
      handleSearchChange: handleChange,
      value: sub_visitor,
      placeholder: `Search your type of ${`${purpose.value}`.toLowerCase()}`,
      name: "sub_visitor",
    };
    let headerProps = {
      title: `${purpose.value} Type`,
      showLeftIcon: true,
      leftIcon: true,
      showRightIcon: true,
      //   onPressRight:,
    };
    let listProps = {
      data: subVisitorTypeArr,
      onClick: handleChange,
      sub_visitor:sub_visitor,
    };

    return (
      <ListTypeColumn
        props={{
          searchEnabled: purpose.value === "Contractor" ? false : true,
          searchProps,
          headerProps,
          listProps,
          complaint: false,
          param,
        }}
      />
    );
  }
}

const mapStateToProps = ({
  profile: { mode },
  invite,
  login: { submitted },
}) => {
  return {
    mode,
    invite,
    submitted,
  };
};
// const {} = myvisitor;
const {
  inviteChange,
  inviteeValidation,
  initialVisitorInvite,
  createInvite,
  setSubvisitorList,
  clearvalue
} = invite;

const mapDispatchToProps = {
  inviteChange,
  inviteeValidation,
  initialVisitorInvite,
  setSubvisitorList,
  createInvite,
  clearvalue
};
export default connect(mapStateToProps, mapDispatchToProps)(SubVisitorType);
