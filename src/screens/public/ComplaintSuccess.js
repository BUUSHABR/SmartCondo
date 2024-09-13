import React, {Component} from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  ImageStore,
} from 'react-native';
import {themes, fonts} from '../../themes';
import {Header} from '../../components/Header';
import {SafeAreaView} from 'react-native-safe-area-context';

import {connect} from 'react-redux';
import {FocusAwareStatusBar} from '../../navigation/RootNavigation';
import {
  TextInput,
  FlatList,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import images from '../../../assets/img/images';
import { ms } from '../../helpers/scaling';

class ComplaintSuccess extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {mode} = this.props;

    return (
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          backgroundColor: themes[mode]['bgColor'],
          // backgroundColor: '#FAFAFA',
        }}
        style={{
          flex: 1,
          backgroundColor: themes[mode]['bgColor'],
          // backgroundColor: '#FAFAFA',
        }}>
        <SafeAreaView>
          <FocusAwareStatusBar />
          <View
            style={{
              position: 'absolute',
              width: '100%',
              marginTop: '32%',
            }}>
            <View style={{flex: 1}}>
              <View
                style={{
                  flex: 3,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 30
                }}>
                <Image source={images.complaintSuccess} />
              </View>
              <View
                style={{
                  flex: 3,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 35,
                  marginLeft: 30,
                  marginRight: 30
                }}>
                <Text style={{fontSize: 22, fontFamily: fonts.bold, textAlign: 'center'}}>
                  Complaint Submitted Successfully
                </Text>
                <Text
                  style={{
                    fontSize:ms(16),
                    fontFamily: fonts.regular,
                    color: '#868686',
                    textAlign: 'center',
                    marginTop: ms(20),
                    lineHeight: ms(25)
                  }}>
                  Your complaint has been noted. Our support will reply as soon as possible.
                  as possible.
                </Text>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </ScrollView>
    );
  }
}

const mapStateToProps = ({profile: {mode}}) => {
  return {
    mode,
  };
};

const styles = StyleSheet.create({});

export default connect(mapStateToProps)(ComplaintSuccess);
