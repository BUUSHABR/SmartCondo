import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  Platform,
} from "react-native";
import { connect } from "react-redux";
import CheckBox from "@react-native-community/checkbox";

import { notification } from "../../../../redux/actions";
import { detectTheme } from "../../../../helpers";
import { themes, fonts } from "../../../../themes";
import { HeaderOnly } from "../../../../components/Header";
import SafeAreaView from "react-native-safe-area-view";
import {
  FocusAwareStatusBar,
  navigationRef,
} from "../../../../navigation/RootNavigation";
import { TickIcon, CrossIcon } from "../../../../../assets/img/svgs";
import styles from "../../../../styles/notificationSubscribe";
import {
  SubscribeLoader,
  BottomLoader,
} from "../../../../../assets/img/loader";
import { WithBgHeader } from "../../../../components";
import commonStyles from "../../../../styles/commonStyles";
import { Switch } from "react-native-paper";
import Animated from "react-native-reanimated";
import { customAnimation } from "../../../../animation/CommonAnimation";
import { fetchConfigs } from "../../../../api/home";
class NotificationSubscription extends Component {
  constructor(props) {
    super(props);

    this.state = {
      guest: false,
      invite: false,
      contractor: false,
      delivery: false,
    };
  }
  onSelect = (id, value, fcm, sms) => {
    console.log(value, id, "fccmmmmmm");
    this.props.onSubscribeNotice(id, value, fcm, sms);
  };

  componentDidMount() {
    const { navigation } = this.props;
    console.log("=====================================++++");
    this.props.listSubscription();
    fetchConfigs()
      .then(({ data }) => {
        console.log(
          data.resident_notification_config,
          "notification list config"
        );
        const {
          guest,
          invite,
          delivery,
          contractor,
        } = data.resident_notification_config;
        console.log(guest, "notification list config");

        this.setState({
          guest: guest,
          invite: invite,
          delivery: delivery,
          contractor: contractor,
        });
      })
      .catch((err) => {
        console.log(err, "kkk");
      });
    this._unsubscribe = navigation.addListener("blur", async () => {
      this.props.listSubscription();
      console.log("=====================================");
    });
  }

  componentWillUnmount() {
    this._unsubscribe;
  }
  config = (name, value) => {
    return this.state[name] == "Sms + Fcm" || this.state[name] == value;
  };
  configSubcrip = (name) => {
    console.log(this.state, "8742732839283298323");
    switch (name) {
      case "Visitor Entry":
        return {
          sms: this.config("guest", "Sms"),
          fcm: this.config("guest", "Fcm"),
        };

      case "Contractor Entry":
        return {
          sms: this.config("contractor", "Sms"),
          fcm: this.config("contractor", "Fcm"),
        };

      case "Delivery Entry":
        return {
          sms: this.config("delivery", "Sms"),
          fcm: this.config("delivery", "Fcm"),
        };

      case "Invite Entry":
        return {
          sms: this.config("invite", "Sms"),
          fcm: this.config("invite", "Fcm"),
        };
    }
  };
  renderItem = ({ item, index }) => {
    const { id, name, description, fcm, sms } = item;
    const { mode } = this.props;
    const config = this.configSubcrip(name);
    console.log(fcm, sms, "hello mannsnnns 8742732839283298323", config);
    return (
      <Animated.View
        {...customAnimation("FadeInRight", 700, 50, index)}
        key={id}
        style={styles.subscribe_row}
      >
        <View style={{ width: "100%" }}>
          <Text
            style={{
              ...styles.subscribe_name,
              color: themes[mode]["headingColor"],
            }}
          >
            {name}
          </Text>
          <Text
            style={{
              ...styles.subscribe_msg,
              color: themes[mode]["textColor"],
            }}
          >
            {description}
          </Text>
        </View>
        <View style={{ width: "100%", paddingHorizontal: 0 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 10,
            }}
          >
            {!config.sms && !config.fcm && (
              <View>
                <Text
                  style={{
                    ...styles.subscribe_msg,
                    color: themes[mode]["textColor"],
                    fontSize:15,
                  
                  }}
                > 
                  Temporarily disabled {name}, Fcm  and SMS Notification
                </Text>
              </View>
            )}

            {config.sms && (
              <View style={{ flexDirection: "row" }}>
                <CheckBox
                  tintColors={{
                    true: "#FFC727",
                    false: themes[mode]["headingColor"],
                  }}
                  disabled={false}
                  value={sms}
                  onValueChange={() => this.onSelect(id, "sms", fcm, !sms)}
                  boxType="square"
                  onCheckColor="#FFC727"
                  onTintColor="#FFC727"
                  lineWidth={2.0}
                  style={{
                    width: 17,
                    height: 17,
                  }}
                />
                <Text
                  style={{
                    ...styles.subscribe_name,
                    color: themes[mode]["headingColor"],
                    fontSize: 13,
                    alignSelf: "center",
                    marginLeft: Platform.OS == "ios" ? 10 : 15,
                  }}
                >
                  SMS Notification
                </Text>
              </View>
            )}
            {config.fcm && (
              <View style={{ flexDirection: "row" }}>
                <CheckBox
                  tintColors={{
                    true: "#FFC727",
                    false: themes[mode]["headingColor"],
                  }}
                  disabled={false}
                  value={fcm}
                  onValueChange={() => this.onSelect(id, "fcm", !fcm, sms)}
                  boxType="square"
                  onCheckColor="#FFC727"
                  onTintColor="#FFC727"
                  lineWidth={2.0}
                  style={{
                    width: 17,
                    height: 17,
                  }}
                />
                <Text
                  style={{
                    ...styles.subscribe_name,
                    color: themes[mode]["headingColor"],
                    fontSize: 13,
                    alignSelf: "center",
                    marginLeft: Platform.OS == "ios" ? 10 : 15,
                  }}
                >
                  Push Notification
                </Text>
              </View>
            )}
            {/* <Switch value={sms} onValueChange={() => this.onSelect(id, "sms",fcm,!sms)} color={"#FFC727"}/> */}
          </View>
          {/* <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginVertical: 10,
            }}
          > */}
          {/* <CheckBox
              tintColors={{ true: "#FFC727", false: "black" }}
              disabled={false}
              value={fcm}
              onValueChange={() => this.onSelect(id, "fcm", !fcm, sms)}
            />
            <Text
              style={{
                ...styles.subscribe_name,
                color: themes[mode]["headingColor"],
                fontSize: 14,
              }}
            >
              Push Notification
            </Text> */}
          {/* <Switch value={fcm}     color={"#FFC727"}/> */}
          {/* </View> */}
        </View>
      </Animated.View>
    );
  };

  itemSeperator = () => {
    const { mode } = this.props;
    return (
      <View
        style={{
          borderBottomWidth: 1,
          borderColor: themes[mode]["lineColor"],
          marginTop: "3%",
          marginBottom: "6%",
        }}
      />
    );
  };
  render() {
    const { renderItem, itemSeperator } = this;
    const { notice_subscribe, mode } = this.props;
    console.log(notice_subscribe, "renderrr");
    return (
      <SafeAreaView
        style={{
          ...styles.container,
          backgroundColor: themes[mode]["bgColor"],
        }}
        forceInset={{ top: "never" }}
      >
        <View style={styles.align}>
          {/* <HeaderOnly
            title="Settings"
            mode={mode}
            showLeftIcon
            showRightIcon
            onPressRight={() => {}}
          /> */}
          <WithBgHeader
            headerTitle={"Settings"}
            leftIcon
            containerStyle={{ ...commonStyles.headerSpacing }}
          >
            {/* <BottomLoader /> */}
            {notice_subscribe?.length > 0 ? (
              <FlatList
                data={notice_subscribe}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                style={styles.flatlist}
                ItemSeparatorComponent={itemSeperator}
              />
            ) : (
              <View style={styles.flatlist}>
                {[1, 2, 3, 4, 5, 6, 7]?.map((item) => {
                  return <SubscribeLoader />;
                })}
              </View>
            )}
          </WithBgHeader>
        </View>
        <FocusAwareStatusBar />
      </SafeAreaView>
    );
  }
}

const mapStateToProps = ({
  notification: { notice_subscribe },
  profile: { mode },
}) => {
  return {
    notice_subscribe,
    mode,
  };
};
const { onSubscribeNotice, listSubscription } = notification;

const mapDispatchToProps = {
  onSubscribeNotice,
  listSubscription,
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NotificationSubscription);
