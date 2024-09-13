import React, {useef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Keyboard,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableHighlight,
  RefreshControl,
  Animated,
  Image
} from 'react-native';
import {themes, fonts, commonColors} from '../../../../themes';
import moment from 'moment';
import styles from '../../../../styles/inviteHome';
import {
  // InviteRightIconLayer,
  MaskModal,
  ArrowRight,
  // VisitorCardIcon,
} from '../../../../../assets/img/svgs';
import {detectTheme} from '../../../../helpers';
import LinearGradient from 'react-native-linear-gradient';
import VisitorCardIcon from '../../../../../assets/img/invite/guest_card.svg';
import ContractorCardIcon from '../../../../../assets/img/invite/contractor_card.svg';
import DeliveryCardIcon from '../../../../../assets/img/invite/delivery_card.svg';
import SelfInvite from '../../../../../assets/img/invite/self_invite.svg';
import VisitorLayer from '../../../../../assets/img/invite/guest_layer.svg';
import ContractorLayer from '../../../../../assets/img/invite/contractor_layer.svg';
import DeliveryLayer from '../../../../../assets/img/invite/delivery_layer.svg'
import PickupDropLayer from '../../../../../assets/img/invite/pickup_drop_layer.svg';
import HandWashModal from '../../../../../assets/img/invite/hand_wash.svg';

import {
  TourGuideProvider, // Main provider
  TourGuideZone, // Main wrapper of highlight component
  TourGuideZoneByPosition, // Component to use mask on overlay (ie, position absolute)
  useTourGuideController, // hook to start, etc.
} from "rn-tourguide";
import { ms } from '../../../../helpers/scaling';
let image=require('../../../../../assets/img/Ellipse 530.png')
let image1=require('../../../../../assets/img/1.png')
let image2=require('../../../../../assets/img/pink.png')
let image3=require('../../../../../assets/img/2.png')

const InviteType = props => {

  const {purpose, onChange,onViewAllpress} = props;
  const mode = detectTheme();
  return (
    <View
      style={{
        // paddingHorizontal: 5,
        // width: '100%',
        alignItems: 'center',
        marginBottom: 20,
        alignSelf: 'center',
        width:"90%",
      }}>
              {/* <TourGuideZone
              zone={5}
              text={"Pre-Invite your visitors based on their purpose"}
              borderRadius={16}
              style={{ padding: 10,}}
              > */}
      <View style={styles.row}>
        <TouchableOpacity
          onPress={() => onChange({name: 'purpose', value: 'Visitor'})}
          style={{
            marginBottom: 15,
            marginRight: 15,
            width:"50%"
          }}>
            
           
              <LinearGradient
              start={{x: 0.2, y: 0}}
              // end={{x: 0.9, y: 1}}
            colors={['#8677FE', '#B7AEFF']}
            style={{
              ...styles.card2,
            }}>
            <View style={styles.cardAlign2}>
              <View style={styles.card2Col1}>
           
                <View style={{height:ms(35),width:ms(35),backgroundColor:"white",borderRadius:100,alignItems:"center",justifyContent:"center",marginTop:15}}>
                  <VisitorCardIcon />
                </View>
                <Text
                  style={{
                    ...styles.text1,
                    color: themes['light']['bgColor'],
                  }}>
                Guest
                </Text>
              </View>

              <View style={styles.card1Col2}>
                {/* <PickupDropLayer /> */}

                <View style={{marginTop: 15}}>
                  <ArrowRight color={themes['light']['bgColor']} />
                </View>
              </View>
            </View>
          </LinearGradient>
          {/* <Image
        style={{height:"50%",width:20}}
        source={image}
      /> */}
        </TouchableOpacity>
        
          <TouchableOpacity
            style={{width:"50%"}}
            onPress={() => onChange({name: 'purpose', value: 'Contractor'})}
            >
           {/* <Image
        style={styles.stretch}
        source={image1}
      /> */}
       <LinearGradient
              start={{x: 0.1, y: 0}}
            colors={["#FF7544", '#FF9D7B']}
            style={{
              ...styles.card2,
            }}>
            <View style={styles.cardAlign2}>
              <View style={styles.card2Col1}>
                <View style={{height:ms(35),width:ms(35),backgroundColor:"white",borderRadius:100,alignItems:"center",justifyContent:"center",marginTop:15}}>
                  <ContractorCardIcon />
                </View>
                <Text
                  style={{
                    ...styles.text1,
                    color: themes['light']['bgColor'],
                  }}>
             Contractor
                </Text>
              </View>

              <View style={styles.card1Col2}>
                {/* <PickupDropLayer /> */}

                <View style={{marginTop: 15}}>
                  <ArrowRight color={themes['light']['bgColor']} />
                </View>
              </View>
            </View>
          </LinearGradient>
          </TouchableOpacity>
        
      </View>
      <View style={styles.row1}>
      <TouchableOpacity
            onPress={() => onChange({name: 'purpose', value: 'Delivery'})}
            style={{
              marginBottom: 15,
              marginRight: 15,
              width:"50%"
            }}
            >
             {/* <Image
        style={styles.stretch}
        source={image2}
      /> */}
       <LinearGradient
              start={{x: 0.1, y: 0}}

            colors={["#FB5A7C", '#FF93AA']}
            style={{
              ...styles.card2,
            }}>
            <View style={styles.cardAlign2}>
              <View style={styles.card2Col1}>
                <View style={{height:ms(35),width:ms(35),backgroundColor:"white",borderRadius:100,alignItems:"center",justifyContent:"center",marginTop:15}}>
                  <DeliveryCardIcon />
                </View>
                <Text
                  style={{
                    ...styles.text1,
                    color: themes['light']['bgColor'],
                  }}>
                Delivery
                </Text>
              </View>

              <View style={styles.card1Col2}>
                {/* <PickupDropLayer /> */}

                <View style={{marginTop: 15}}>
                  <ArrowRight color={themes['light']['bgColor']} />
                </View>
              </View>
            </View>
          </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onChange({name: 'purpose', value: 'SelfInvite'})}
            style={{width:"50%"}}
           >
             {/* <Image
       
        source={image3}
      /> */}
       <LinearGradient
        start={{x: 0.2, y: 0}}
            colors={['#1AB1B0',"#8FE5E5"]}
            style={{
              ...styles.card2,
            }}>
            <View style={styles.cardAlign2}>
              <View style={styles.card2Col1}>
                <View style={{height:ms(35),width:ms(35),backgroundColor:"white",borderRadius:100,alignItems:"center",justifyContent:"center",marginTop:15}}>
                  <SelfInvite />
                </View>
                <Text
                  style={{
                    ...styles.text1,
                    color: themes['light']['bgColor'],
                  }}>
                Self Invite
                </Text>
              </View>

              <View style={styles.card1Col2}>
                {/* <PickupDropLayer /> */}

                <View style={{marginTop: 15}}>
                  <ArrowRight color={themes['light']['bgColor']} />
                </View>
              </View>
            </View>
          </LinearGradient>
          </TouchableOpacity>
          </View>
      <View style={{...styles.row, marginTop: 0}}>
        {/* <TouchableOpacity
          onPress={() => onChange({name: 'purpose', value: 'Pickup / Drop'})}>
          <LinearGradient
            colors={['#EB9E9F', '#E77E7E', '#E77E7E']}
            style={{
              ...styles.card2,
            }}>
            <View style={styles.cardAlign2}>
              <View style={styles.card2Col1}>
                <View style={{...styles.icon2}}>
                  <PickupDropCardIcon />
                </View>
                <Text
                  style={{
                    ...styles.text1,
                    color: themes['light']['bgColor'],
                  }}>
                  Pickup / drop
                </Text>
              </View>

              <View style={styles.card1Col2}>
                <PickupDropLayer />

                <View style={{marginTop: 15}}>
                  <ArrowRight color={themes['light']['bgColor']} />
                </View>
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity> */}
      </View>
      {/* <View
        style={{
          ...styles.row,
          marginTop: 0,
          paddingBottom: -5,
        }}>
        <TouchableOpacity
          onPress={() => onChange({name: 'purpose', value: 'Pickup / Drop'})}>
          <LinearGradient
            colors={['#99A3ED', '#99A3ED', '#99A3ED']}
            style={{
              ...styles.card2,
              // marginRight: 20
            }}>
            <View style={styles.cardAlign2}>
              <View style={styles.card2Col1}>
                <ContractorCardIcon />
                <Text
                  style={{
                    ...styles.text1,
                    color: themes['light']['bgColor'],
                  }}>
                  Pickup / drop
                </Text>
              </View>

              <View style={styles.card1Col2}>
                <PickupDropLayer />

                <View style={{marginTop: 15}}>
                  <ArrowRight color={themes['light']['bgColor']} />
                </View>
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onChange({name: 'purpose', value: 'Delivery'})}
          style={{marginTop: '-5%'}}>
          <LinearGradient
            colors={['#CDF6D9', '#86E9A1', '#88E9A3']}
            style={{...styles.card1, marginRight: 0}}>
            <View style={styles.cardAlign1}>
              <View style={styles.card1Col1}>
                <DeliveryCardIcon />
                <Text
                  style={{
                    ...styles.text1,
                    color: themes['light']['headingColor'],
                  }}>
                  Delivery
                </Text>
              </View>

              <View style={styles.card1Col2}>
                <DeliveryLayer />

                <View style={{marginTop: 15}}>
                  <ArrowRight color={themes['light']['headingColor']} />
                </View>
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity> */}
      {/* <TouchableOpacity
          style={{
            ...styles.card2,
            marginLeft: 15,
          }}
          onPress={() => onChange({name: 'purpose', value: 'Delivery'})}>
          <DeliveryBg />
        </TouchableOpacity> */}
      {/* </View> */}
      {/* </TourGuideZone> */}
    </View>
  );
};

export const CovidInstructions = props => {
  const {onScroll, covidData, scrollX,onViewAllpress,features,renderItemData} = props;
  const mode = detectTheme();
 
  return (
    <View style={styles.instruction}>
   
      {/* <ScrollView
        horizontal
        // pagingEnabled
        legacyImplementation={true}
        onScroll={onScroll}
        showsHorizontalScrollIndicator={false}
        // onScroll={Animated.event([
        //   {nativeEvent: {contentOffset: {x: this.state.scrollX}}},
        // ])}
        scrollEventThrottle={16}
        keyExtractor={item => item.id}
        style={styles.scroll}
        contentContainerStyle={styles.container}
        automaticallyAdjustContentInsets={true}>
        {renderItem({covidData, mode})}
      </ScrollView> */}
      <FlatList
                  // horizontal
                  
                  // ItemSeparatorComponent={() => {
                  //   return (
                  //     <View
                  //       style={{
                  //         ...styles.seperatorLine,
                  //         borderColor: themes[mode]["bottom"],
                  //       }}
                  //     />
                  //   );
                  // }}
                  showsHorizontalScrollIndicator={false}
                  legacyImplementation={false}
                  data={features}
                  renderItem={renderItemData}
                  keyExtractor={(item) => item.id}
                  style={{
                    width: "100%",
                    marginTop:10,
                    paddingHorizontal:6,
                    marginLeft:5
                  }}
                  contentContainerStyle={styles.featureContainer}
                />
    </View>
  );
};

export {InviteType};
