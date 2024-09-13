import React, {useEffect} from 'react';
import {TouchableOpacity, View, StyleSheet, Text} from 'react-native';
import {themes, fonts} from '../themes';
import {RegisterSuccess, LeftCorner} from '../../assets/img/svgs';
import {detectTheme} from '../helpers';
import * as RootNavigation from '../navigation/RootNavigation';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Header} from './Header';
import {ScrollView} from 'react-native-gesture-handler';
import {CustomButton} from '.';
import { ms } from '../helpers/scaling';

const FacilityMaApproval = props => {
  const {title, message, image, navigateTo} = props?.route?.params;
  const mode = detectTheme();

  useEffect(() => {
    // setTimeout(() => {
    //   RootNavigation.navigate(
    //     props?.route?.params?.navigateTo || 'ListResident',
    //   );
    // }, 5000000);
  }, []);
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: themes[mode]['bgColor'],
        // justifyContent: 'center',
        // alignItems: 'center',
      }}>
      {/* <RootNavigation.FocusAwareStatusBar /> */}
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          backgroundColor: themes[mode]['bgColor'],
        }}
        style={{flex: 1}}>
        <View
          style={{
            paddingVertical: '15%',
            paddingHorizontal: 20,
            flex: 1,
            justifyContent:"space-between",
            alignItems: 'center',
          }}>
          <View
            style={{
              marginVertical: '6%',
              marginTop:"30%"
              
            }}>
            {image || <RegisterSuccess />}
          </View>
          <View>
            <Text
              style={{
                fontFamily: fonts.medium,
                fontSize: ms(14),
                lineHeight: ms(25),
                color: themes[mode]['headingColor'],
                marginVertical: '5%',
                textAlign: 'center',
                marginHorizontal: '5%',
                
              }}>
              {message}
            </Text>
          </View>
          <View style={{width: '100%', marginTop: '20%'}}>
            <CustomButton
              title={'Go Back'}
              handleSubmit={() => {
                RootNavigation.navigate(
                  props?.route?.params?.navigateTo || 'BottomTab',
                );
              }}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default FacilityMaApproval;
