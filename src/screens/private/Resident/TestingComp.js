import React from 'react';
import { View, StyleSheet, Dimensions,Text } from 'react-native';
import Svg, { Ellipse, Defs, RadialGradient, Stop } from 'react-native-svg';
import { ms } from '../../../helpers/scaling';
import { SafeAreaView } from 'react-native';
import { CurvedBottomBar } from 'react-native-curved-bottom-bar';
import { IconButton } from 'react-native-paper';
import HomeScreen from './Home/HomeScreen';
import InviteHome from './Invite/InviteHome';
import ProfileScreen from './ProfileScreen';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { VisitorCardIcon } from '../../../../assets/img/svgs';
import { ScrollView } from 'react-native-gesture-handler';


const { width, height } = Dimensions.get('window');

const TestingComp = () => {
    const navigate=useNavigation()
    const renderTabBar = ({ routeName }) => {
         return (
           <TouchableOpacity
             onPress={() => navigate(routeName)}
             style={{marginHorizontal:"5%",height:ms(40)}}
           >
            <VisitorCardIcon />
           {/* {_renderIcon(routeName, selectedTab)} */}
           <Text >
          {routeName} 
        </Text>
      </TouchableOpacity>
      );
    }
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={{width:"100%",paddingBottom:"20%"}}>
                {[1,2,3,4,5,6].map((item,index)=>{
                    return(
                    <View style={styles.cardContainer}>
                    {[1, 0.8, 0.6, 0.5].map((opacity, index) => (
                        <View
                            key={index}
                            style={[
                                styles.card,
                                { backgroundColor: 'red', top: index * 5, opacity: opacity },
                            ]}
                        />
                    ))}
                </View>
                    )
                })}
            
            {/* <CurvedBottomBar.Navigator
                strokeWidth={5}
                circleWidth={56}
                strokeColor="#DDDDDD"
                // defaultScreenOptions={navigation}
                style={{width:"100%",height:"25%",    paddingBottom: 30,}}
                screenOptions={{ headerShown: false }}
                bgColor={"white"}
                initialRouteName={HomeScreen}
                // borderTopLeftRight
                renderCircle={() => (
                    <IconButton
                        height={ms(86)}
                        width={ms(86)}
                        onPress={()=>console.log("tery")}
                        borderRadius={ms(48)}
                        
                        style={{backgroundColor:"red"}}
                    >
                        <Text>H</Text>
                    </IconButton>
                )}
                tabBar={renderTabBar}
            >
                <CurvedBottomBar.Screen
                    name={"  "}
                    position="LEFT"
                    component={HomeScreen}
                    
                />
                <CurvedBottomBar.Screen
                    name={" "}
                    position="LEFT"
                    component={HomeScreen}
                />
                <CurvedBottomBar.Screen
                    name={"   "}
                    component={ProfileScreen}
                    position="RIGHT"
                    
                />
                <CurvedBottomBar.Screen
                    name={"     "}
                    component={InviteHome}
                    position="RIGHT"
                />
            </CurvedBottomBar.Navigator> */}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // alignItems: 'center',
        // justifyContent: 'center',
    },
    cardContainer: {
        width: '90%',
        height: '30%',
        marginHorizontal: '5%',
        marginTop: 100,
        position: 'relative',
    },
    card: {
        width: '100%',
        height: '100%',
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        position: 'absolute',
    },
});


export default TestingComp;
{/* <View style={styles.container}>
      <Svg width="100%" height="100%" style={styles.svg}>
        <Defs>
          <RadialGradient id="grad1" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <Stop offset="0%" stopColor="rgba(158, 204, 255, 1)" stopOpacity="1" />
            <Stop offset="100%" stopColor="rgba(158, 204, 255, 0)" stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Ellipse cx="192" cy="192" rx="139.5" ry="139.5" fill="url(#grad1)" />
      </Svg>

      <Svg width={ms(550)} height={ms(550)} style={styles.svg2}>
        <Defs>
          <RadialGradient id="grad2" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <Stop offset="0%" stopColor="rgba(247, 178, 232, 0.2);" stopOpacity="1" />
            <Stop offset="100%" stopColor="rgba(247, 178, 232, 0)" stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Ellipse cx="300" cy="300" rx="189.5" ry="189.5" fill="url(#grad2)" />
      </Svg> */}
{/* </View> */ }

//   svg: {
//     position: 'absolute',
//     top: 0,
//     left: 120,
//     opacity: 0.7,  // Increase opacity for better visibility of the glow
//   },
//   svg2: {
//     position: 'absolute',
//     top: ms(60),
//     right:ms(120),
//     // left:90,
//     opacity: 1,
//     // borderWidth:1  // Increase opacity for better visibility of the glow
//   },
//   svg3: {
//     position: 'absolute',
//     top: 400,
//     right:0,
//     opacity: 0.7, 
//      // Increase opacity for better visibility of the glow
//   },
// });
