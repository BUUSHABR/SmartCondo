import React, {Component} from 'react';
import {ScrollView} from 'react-native';
import {WebView} from 'react-native-webview';
import {renderServicesWebView} from '../../../../helpers/deviceSupport';
import SafeAreaView from 'react-native-safe-area-view';
import {connect} from 'react-redux';
import styles from '../../../../styles/deviceInfo';
import {themes} from '../../../../themes';
import {WithBgHeader} from '../../../../components';
import commonStyles from '../../../../styles/commonStyles';

class DevicePermitSteps extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: '',
    };
  }

  async componentDidMount() {
    // let deviceURL = await renderServicesWebView();
    this.setState({
      url: await renderServicesWebView(),
    });
  }

  render() {
    const {mode} = this.props;
    console.log(this.state.url,"ytuiwehjndxwekhbcn wkhcbnwekec");
    return (
      <SafeAreaView
        style={{
          ...styles.safeArea,
          backgroundColor: themes[mode]['bgColor'],
        }}
        forceInset={{top: 'never'}}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            height: '100%',
          }}
          style={{
            backgroundColor: themes[mode]['bgColor'],
            flex: 1,
          }}>
          <WithBgHeader
            headerTitle="FAQ"
            leftIcon
            containerStyle={{...commonStyles.headerSpacing}}
            titleCase="uppercase"
            rightText="   ">
            <WebView source={{uri: this.state.url}} style={{}} />
          </WithBgHeader>
        </ScrollView>
      </SafeAreaView>
    );
  }
}
const mapStateToProps = ({profile: {mode}}) => {
  return {
    mode,
  };
};

const mapDispatchToProps = state => ({});

export default connect(mapStateToProps, mapDispatchToProps)(DevicePermitSteps);
