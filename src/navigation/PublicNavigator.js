import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {
  LoginScreen,
  OTPScreen,
  SetPassword,
  ForgotPassword,
  SplashScreen,
} from '../screens/public';
import Private from './privateNavigator';
import MyVisitorsList from '../screens/private/Resident/MyVisitors/MyVisitorsList';
import InviteHome from '../screens/private/Resident/Invite/InviteHome';
import FilterList from '../components/FilterList';
import VisitorForm from '../screens/private/Resident/Invite/VisitorForm';
import SubVisitorType from '../screens/private/Resident/Invite/SubVisitorType';
import SOSScreen from '../screens/private/Resident/Home/SOSScreen';
import AnnouncementDetail from '../../src/screens/private/Resident/Home/AnnouncementDetail';
import HomeScreen from '../screens/private/Resident/Home/HomeScreen';
import ComplaintScreen from '../screens/private/Resident/ComplaintScreen';

const Stack = createStackNavigator();

const Public = () => {
  return (
    <Stack.Navigator
      screenOptions={{animationEnabled: false, headerShown: false}}>
      {/* <Stack.Screen name="MyVisitorsList" component={MyVisitorsList} /> */}
      {/* <Stack.Screen name="FilterList" component={FilterList} /> */}
      {/* <Stack.Screen name="InviteHome" component={InviteHome} /> */}

      {/* Complaints screen */}
      {/* <Stack.Screen name="ComplaintSuccess" component={ComplaintSuccess} /> */}
      {/* <Stack.Screen name="ComplaintCategory" component={ComplaintCategory} /> */}
      {/* <Stack.Screen name="ComplaintDetail" component={ComplaintDetail} /> */}
      {/* <Stack.Screen name="AnnouncementDetail" component={AnnouncementDetail} /> */}
      {/* <Stack.Screen name="HomeScreen" component={HomeScreen} /> */}

      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="OTPScreen" component={OTPScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="SetPassword" component={SetPassword} />
      <Stack.Screen name="SplashScreen" component={SplashScreen} />

      <Stack.Screen name="Private" component={Private} />
    </Stack.Navigator>
  );
};

export default Public;
