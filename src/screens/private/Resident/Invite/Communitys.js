import React, {Component} from 'react';
import {
  Text,
  ScrollView,
  Animated,
} from 'react-native';

import {connect} from 'react-redux';
import SafeAreaView from 'react-native-safe-area-view';

import {themes, fonts} from '../../../../themes';
import {invite} from '../../../../redux/actions';
import {InviteType, CovidInstructions} from '../Invite/InviteType';
import {WithBgHeader} from '../../../../components';
import commonStyles from '../../../../styles/commonStyles';
import {
  TourGuideProvider, // Main provider
  TourGuideZone, // Main wrapper of highlight component
  TourGuideZoneByPosition, // Component to use mask on overlay (ie, position absolute)
  useTourGuideController, // hook to start, etc.
} from "rn-tourguide";
class Communitys extends Component {

  componentDidMount() {
    const {navigation} = this.props;
    this.focusListener = navigation.addListener('focus', () => {
      console.log("dwkjdfwnwkjdnkwfdkwnfkwjfnkhwbfkhbwf");
    });  }

 
  render() {
   
    const {mode, invite,  navigation} = this.props;

    return (
      <SafeAreaView
        style={{
          flex: 1,
          height: '100%',
          backgroundColor: themes[mode]['bgColor'],
        }}
        forceInset={{top: 'never'}}>
        <WithBgHeader
          headerTitle="Invitation"
          rightText="History"
          onPressRightIcon={() => {
            navigation.navigate('MyInvitationsList');
          }}
          containerStyle={{
            ...commonStyles.headerSpacing,
          }}
          leftTextStyle={{
            minWidth: 60,
          }}>
          
          <ScrollView
            contentContainerStyle={{
              paddingBottom: 100,
            }}
            style={{
              flex: 1,
              height: '100%',
            }}
            showsVerticalScrollIndicator={false}>
               {/* <TourGuideZone
              zone={5}
              text={"A# ldlldll dldlldld dlldlld 🎉"}
              borderRadius={16}
              style={{ padding: 10,height:300 }}
              > */}
             
          </ScrollView>
        </WithBgHeader>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = ({profile: {mode}, invite}) => {
  return {
    mode,
    invite,
  };
};
const {inviteChange, initialVisitorInvite, setSubvisitorList} = invite;

const mapDispatchToProps = {
  inviteChange,
  initialVisitorInvite,
  setSubvisitorList,
};
export default connect(mapStateToProps, mapDispatchToProps)(Communitys);
