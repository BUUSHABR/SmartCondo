import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as RootNavigation from '../../../navigation/RootNavigation';

const AdminStack = () => {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>AdminStack</Text>
    </View>
  );
};

export default AdminStack;
