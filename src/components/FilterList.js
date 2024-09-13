import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Keyboard,
  FlatList,
  TouchableWithoutFeedback,
} from 'react-native';
import {connect} from 'react-redux';
import {TextInput} from 'react-native-gesture-handler';
import SafeAreaView from 'react-native-safe-area-view';

import {themes, fonts} from '../themes';
import {detectTheme} from '../helpers';
import {WithBgHeader} from '../components';
import {SearchIcon, CrossIcon, NoVisitorData} from '../../assets/img/svgs';
import NoDataCompSearch from './NoDataCompSearch';
import {myVisitor} from '../redux/actions';
import commonStyles from '../styles/commonStyles';

class FilterList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: false,
      focus: false,
    };
  }
  onPressSearch = val => {
    const {onVisitorChange, phone, navigation} = this.props;

    this.setState({search: false, focus: false});
    onVisitorChange({name: 'phone', value: val});
    navigation.navigate('MyVisitorsList', {showModal: false});
  };

  componentDidMount() {
    const {navigation, onVisitorChange, setPhoneAggr} = this.props;
    this._unsubscribe = navigation.addListener('focus', () => {
      onVisitorChange({name: 'phone', value: ''});
      this.setState({focus: true});
    });
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  handleSearchChange = e => {
    const {filterProps} = this.props?.route?.params;
    const {updateAction, listAction, phone} = filterProps;
    if (phone.length >= e.length) {
      e.length > 7 && listAction();
      updateAction({name: 'phone', value: e});
    } else {
      updateAction({name: 'phone', value: e});
    }
  };

  searchItem = ({item, index}) => {
    const mode = detectTheme();
    return (
      <TouchableOpacity
        style={{
          borderBottomWidth: item ? 1 : 0,
          borderColor: themes[mode]['lightAsh1'],
        }}
        onPress={() => this.onPressSearch(item)}>
        <View style={{margin: 15, justifyContent: 'space-between'}}>
          <Text
            style={{
              fontFamily: fonts.medium,
              fontSize: 14,
              color: themes[mode]['headingColor'],
            }}>
            {item}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  render() {
    const mode = detectTheme();
    const {onChange, handleSearchChange} = this;
    const {search, focus} = this.state;
    const {filterProps} = this.props?.route?.params;
    const {title, data} = filterProps;
    const {phone, filteredData} = this.props;
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: themes[mode]['bgColor'],
        }}
        forceInset={{top: 'never'}}>
        <WithBgHeader
          leftIcon
          headerTitle={title}
          containerStyle={{
            ...commonStyles.headerSpacing,
          }}>
          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View
              style={{
                ...commonStyles.headerSpacing,
                marginTop: 15,
              }}>
              <View
                style={{
                  height: 40,
                  borderRadius: 10,
                  paddingHorizontal: 15,
                  paddingVertical: 10,
                  justifyContent: 'center',
                  backgroundColor:
                    themes[mode][mode === 'light' ? 'lightAsh2' : 'modalWrap'],
                }}>
                <TextInput
                  onChangeText={val => {
                    handleSearchChange(val);
                  }}
                  value={phone}
                  allowFontScaling={false}
                  style={{
                    height: 40,
                    borderRadius: 10,
                    paddingHorizontal: 15,
                    paddingVertical: 10,
                    justifyContent: 'center',
                    backgroundColor:
                      themes[mode][
                        mode === 'light' ? 'lightAsh2' : 'modalWrap'
                      ],
                    flexDirection: 'row',
                    justifyContent: 'center',
                    fontFamily: fonts.semiBold,
                    fontSize: 14,
                    color: themes[mode]['headingColor'],
                    letterSpacing: 1,
                    marginLeft: 15,
                  }}
                  onFocus={() => {
                    this.setState({search: true});
                  }}></TextInput>
                <View style={{position: 'absolute', left: 10}}>
                  <SearchIcon />
                </View>
                {phone?.length > 0 && (
                  <TouchableOpacity
                    style={{
                      width: 30,
                      height: 30,
                      position: 'absolute',
                      right: 10,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    onPress={() => {
                      handleSearchChange('');
                    }}>
                    <View
                      style={{
                        width: 13,
                        height: 13,
                        borderRadius: 4,
                        backgroundColor: themes[mode]['textColor'],
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <CrossIcon />
                    </View>
                  </TouchableOpacity>
                )}
              </View>

              {data.length > 0 && filteredData.length > 0 ? (
                <FlatList
                  showsVerticalScrollIndicator={false}
                  // legacyImplementation={true}
                  data={search || focus ? filteredData : data}
                  renderItem={search || focus ? this.searchItem : null}
                  keyExtractor={item => item.id}
                  style={{
                    marginTop: '8%',
                    zIndex: 10001,
                    minHeight: '90%',
                  }}
                  contentContainerStyle={{
                    flexGrow: 1,
                    paddingBottom: 300,
                    borderWidth: filteredData.length < 0 ? 1 : 0,
                    borderColor: themes[mode]['lightAsh1'],
                    marginTop: 0,
                  }}
                />
              ) : (
                <NoDataCompSearch
                  icon={<NoVisitorData />}
                  text="No Item Found"
                  message="We can’t find any item matching to  your search"
                />
              )}
            </View>
          </TouchableWithoutFeedback>
        </WithBgHeader>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = ({
  profile: {mode},
  myVisitor: {
    myVisitorData,
    visitor_type,
    visitorsFilter,
    from_time,
    to_time,
    visitorLoader,
    filteredData,
    phone,
  },
}) => {
  return {
    mode,
    filteredData,
    myVisitorData,
    visitor_type,
    visitorsFilter,
    from_time,
    to_time,
    visitorLoader,
    phone,
  };
};

const {onVisitorChange, listMyVisitorsData, setVisitorLoader, setPhoneAggr} =
  myVisitor;

const mapDispatchToProps = {
  listMyVisitorsData,
  onVisitorChange,
  setVisitorLoader,
  setPhoneAggr,
};

export default connect(mapStateToProps, mapDispatchToProps)(FilterList);
