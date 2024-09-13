import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Keyboard,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableHighlight,
  // ScrollView,
  RefreshControl,
} from "react-native";
import moment from "moment";

import { connect } from "react-redux";
import { notification, login, registration } from "../../../../redux/actions";
import {
  detectTheme,
  timeAgo,
  NotificationIcon,
  NotificationRouting,
  customTimeFunction,
} from "../../../../helpers";
import { themes, fonts, commonColors } from "../../../../themes";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import SafeAreaView from "react-native-safe-area-view";
import { SwipeListView, SwipeRow } from "react-native-swipe-list-view";

import {
  LoginHeader,
  BottomToast,
  NoDataComp,
  WithBgHeader,
  CustomButton,
} from "../../../../components";
import { HeaderOnly } from "../../../../components/Header";
import {
  FocusAwareStatusBar,
  navigationRef,
} from "../../../../navigation/RootNavigation";
import {
  SettingIcon,
  DeleteIcon,
  ReadIcon,
  BackIcon,
  NoNotify,
} from "../../../../../assets/img/svgs";
import { NotificationLoader } from "../../../../../assets/img/loader";
import * as RootNavigation from "../../../../navigation/RootNavigation";
import commonStyles from "../../../../styles/commonStyles";
import Animated, {
  Layout,
  ZoomIn,
  ZoomInUp,
  ZoomInDown,
  Transition,
  LightSpeedInRight,
} from "react-native-reanimated";
import { customAnimation } from "../../../../animation/CommonAnimation";
import { clearAllNotifications } from "../../../../api/notification";
import { ms } from "../../../../helpers/scaling";

class NotificationList extends Component {
  constructor(props) {
    super(props);
    this.openRowRefs = [];

    this.state = {
      undo_show: false,
      refresh: false,
      open: false,
      dataSource: [
        {
          id: 1,
          name: "Andy",
          age: 12,
          disableRightSwipe: true,
          text: "abcccccc",
        },
        {
          id: 2,
          name: "Betty",
          age: 11,
          leftOpenValue: 150,
          text: "ddddddddddddddddd",
        },
        {
          id: 3,
          name: "Carl",
          age: 11,
          leftActivationValue: 200,
          text: "aaaaaaaaaaaa",
        },
      ],
    };
  }
  async componentDidMount() {
    const { navigation, listNotification } = this.props;
    listNotification();
    this._unsubscribe = navigation.addListener("focus", async () => {
      listNotification();
    });
  }

  componentWillUnmount() {
    this._unsubscribe();
  }
  closeRow = (rowMap, rowKey) => {
    console.log(rowMap[rowKey], "cloaseee rowww");
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
    this.setState({ open: false, selectedId: "" });
  };

  undoAction = () => {
    console.log("unnnnnnnnnnn");
    const { method, id, status } = this.props.last_updated;
    let params = { status: "unread" };
    status === "deleted" && this.props.updateNotification("PUT", id, params);
    this.setState({ undo_show: false });
  };

  swipeoutRight = (id, mode) => [
    {
      text: "",
      backgroundColor: themes[mode]["error"],
      component: (
        <TouchableOpacity
          style={{
            // width: 150,
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
            marginBottom: 10,
          }}
          onPress={(e) => {
            let params = { status: "deleted" };
            this.props.updateNotification("PUT", id, params);
            this.setState({ undo_show: true });
            console.log(id, "onpress rut");
          }}
        >
          <DeleteIcon />
        </TouchableOpacity>
      ),
    },
  ];

  swipeOutLeft = (id, mode) => [
    {
      text: "",
      backgroundColor: themes[mode]["blueColor"],
      component: (
        <TouchableOpacity
          style={{
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
            marginBottom: 10,

            // marginLeft: -40,
          }}
          onPress={() => {
            let params = { status: "read" };

            this.props.updateNotification("PUT", id, params);

            console.log(id, "presss lt");
          }}
        ></TouchableOpacity>
      ),
    },
  ];

  renderHiddenItem = (data, rowMap) => {
    const { mode } = this.props;
    const { id, status } = data?.item;
    return (
      <View
        style={{
          height: 100,
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          // marginVertical: 7,
          backgroundColor:
            mode == "light" ? themes[mode]["bgColor"] : "#181818",
        }}
      >
        <TouchableOpacity
          style={{
            alignItems: "center",
            bottom: 0,
            justifyContent: "center",
            // position: 'absolute',
            // top: 0,
            // right: 75,
            width: 105,
            height: 100,
            marginVertical: 1,

            backgroundColor: themes[mode]["blueColor"],
            // right: 75,
          }}
          onPress={() => {
            this.closeRow(rowMap, id);
            console.log(status, "statusssss");
            let params = { status: status === "read" ? "unread" : "read" };

            this.props.updateNotification("PUT", id, params);
            this.closeRow(rowMap, id);
          }}
        >
          <ReadIcon />
          <Text
            style={{
              fontFamily: fonts.regular,
              fontSize: 12,
              margin: 5,
              color: "#fff",
            }}
          >
            {status === "read" ? "UnRead" : "Read"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            alignItems: "center",
            bottom: 0,
            justifyContent: "center",
            // position: 'absolute',
            // top: 0,
            // right: 0,
            width: 105,
            height: 100,
            backgroundColor: themes[mode]["error"],
            // right: 0,
          }}
          onPress={() => {
            this.closeRow(rowMap, id);
            let params = { status: "deleted" };
            this.props.updateNotification("PUT", id, params);
            this.setState({ undo_show: true });
          }}
        >
          <DeleteIcon />
          <Text
            style={{
              fontFamily: fonts.regular,
              fontSize: 12,
              margin: 5,
              color: "#fff",
            }}
          >
            Delete
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
  onRowDidOpen = (rowKey, rowMap) => {
    console.log("This row opened", rowKey);
    this.openRowRefs.push(rowMap[rowKey]);
    this.setState({ open: true, selectedId: rowKey });
  };
  closeAllOpenRows() {
    console.log("claose all rows");
    this.openRowRefs.forEach((ref) => {
      ref.closeRow && ref.closeRow();
    });
    this.setState({ open: false, selectedId: "" });
  }

  onRowOpen = (rowKey, rowMap) => {
    // Grab reference to this row
    console.log(rowKey, "o rowww open");

    // const rowRef = rowMap[rowKey];
    this.setState({ open: true, selectedRow: rowKey });

    // Do something with the row
    // rowRef.closeRow();
  };

  handleClear = () => {
    clearAllNotifications()
      .then((data) => {
        setTimeout(() => {
          this.props.listNotification();
        }, 1000);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  renderItem = ({ item, index }) => {
    const { mode, navigation } = this.props;
    // console.log(item, 'entity iddd');
    const {
      notify_type,
      // entity: {id},
      description,
      mediums,
      icon,
      created_at,
      status,
      subject,
      entity_type,
      entity_id,
      id,
      visitor_type,
    } = item;
    const { leftAction } = this;
    const buttonRight = this.swipeoutRight(id, mode);
    const buttonLeft = this.swipeOutLeft(id, mode);
    const { undo_show, refresh, selectedId, open } = this.state;
    // console.log(selectedId, index, open && selectedId == index, 'indexx heck');
    const data = {
      type_id: entity_id,
      type: entity_type,
      title: subject,
      message: description,
      subVisitor: visitor_type?.name,
    };
    return (
      <Animated.View {...customAnimation("FadeInRight", 700, 50, index)}>
        <TouchableOpacity
          style={{
            // height: 100,
            // borderRadius: 6,
            // width: '100%',
            // marginVertical: 30,
            height: description.length > 70 ? 110 : 90,
            // borderWidth: 1,

            // backgroundColor: themes[mode]["bgColor"],

            // backgroundColor: 'red',
            paddingHorizontal: 20,
            // paddingVertical:50,
            // marginBottom: 0,
            marginVertical: 10,
            justifyContent: "center",
            elevation: open && selectedId == index ? 4 : 0,
            // shadowColor: themes[mode]["headingColor"],
            // borderWidth: 1,
            // borderColor: 'red',
            // borderWidth: 0.5,
          }}
          // underlayColor={themes[mode]['bgColor']}
          onPress={() => {
            console.log(
              NotificationRouting(entity_type),
              "navigationnnnn",
              data
            );
            RootNavigation.navigate(NotificationRouting(entity_type), { data });
            // RootNavigation.navigate('MyVisitorDetails');

            let params = { status: "read" };
            status === "unread" &&
              this.props.updateNotification("PUT", id, params);
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              // marginVertical: '7%',
            }}
          >
            <View
              style={{
                flexDirection: "row",
                width: "70%",
                // backgroundColor: "blue",
                // marginRight: 10,
              }}
            >
              <View
                style={{
                  width: 35,
                  height: 35,
                  borderRadius: 17,
                  backgroundColor: "#FFC727",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {NotificationIcon(entity_type)}
              </View>

              <View
                style={{
                  marginLeft: 10,
                  // backgroundColor: "green",
                  width: "84%",
                }}
              >
                <Text
                  style={{
                    fontFamily: fonts.semiBold,
                    fontSize: 15,
                    color: themes[mode]["headingColor"],
                    letterSpacing: 0.4,
                    fontWeight: "600",
                    textTransform: "capitalize",
                  }}
                >
                  {subject}
                </Text>
                <Text
                  style={{
                    fontFamily: fonts.medium,
                    fontSize:ms(13),
                    lineHeight: ms(20),
                    color: themes[mode]["headingColor"],
                    letterSpacing: 1,
                    fontWeight: "500",
                    marginTop: 5,
                  }}
                >
                  {description
                    ?.replace(/\s+/g, " ")
                    .trim()
                    .substring(0, 50)}
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",

                height: 20,
                justifyContent: "center",
                alignItems: "center",
                width: "28%",
                // backgroundColor: "red",
              }}
            >
              {status === "unread" && (
                <View
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: themes[mode]["primaryColor"],
                  }}
                />
              )}
              <Text
                style={{
                  fontFamily: fonts.medium,
                  fontSize: 12,
                  color: themes[mode]["textColor"],
                  letterSpacing: 0.2,
                  marginHorizontal: 5,
                  textAlign: "center",
                }}
              >
                {/* {timeAgo(created_at)} */}
                {customTimeFunction(created_at)}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  render() {
    const { renderItem, renderHiddenItem, onRowDidOpen } = this;
    const { navigation, list_notice, last_updated, mode, loader } = this.props;
    const { undo_show, dataSource, refresh } = this.state;
    let loaderVal = loader || list_notice?.length > 0;
    console.log(list_notice, "listtt");
    return (
      // <NoDataComp />
      <SafeAreaView
        style={{
          flex: 1,
          height: "100%",
          backgroundColor: themes[mode]["bgColor"],
          // paddingBottom: 60,

          // paddingBottom: 120,
        }}
        forceInset={{ top: "never" }}
      >
        <View style={styles.safeArea}>
          {!loader && list_notice?.length === 0 && (
            <NoDataComp
              showLeftIcon
              leftIcon
              includeFont
              title="Notification"
              showRightIcon
              rightIcon={<SettingIcon color={themes[mode]["primaryColor"]} />}
              onPressRight={() => {
                navigation.navigate("NotificationSubscription");
              }}
              noDataVector={<NoNotify />}
              text="No notification yet "
              message="You have no notifications right now. Come back later. "
              bottomButtonText="OK"
            />
          )}

          {loaderVal && (
            <View>
              {/* <View
                style={{
                  marginTop: '7%',
                  marginBottom: '2%',
                  paddingHorizontal: 15,
                }}>
                <HeaderOnly
                  showLeftIcon
                  includeFont
                  title="Notification"
                  showRightIcon
                  rightIcon={
                    <SettingIcon color={themes[mode]['primaryColor']} />
                  }
                  onPressRight={() => {
                    navigation.navigate('NotificationSubscription');
                  }}
                />
              </View> */}
              <WithBgHeader
                leftIcon
                rightIcon={<SettingIcon color={themes[mode]["primaryColor"]} />}
                onPressRightIcon={() => {
                  navigation.navigate("NotificationSubscription");
                }}
                headerTitle="Notification"
                containerStyle={{
                  ...commonStyles.headerSpacing,
                }}
              >
                {loader ? (
                  <View
                    style={{
                      paddingHorizontal: 15,
                      ...styles.container,
                    }}
                  >
                    {[1, 2, 3, 4, 5, 6, 7]?.map((item) => {
                      return <NotificationLoader />;
                    })}
                  </View>
                ) : (
                  <ScrollView
                    nestedScrollEnabled={true}
                    contentContainerStyle={styles.container}
                    showsVerticalScrollIndicator={false}
                    onScroll={() => {
                      // alert('sccroll');
                      console.log("onscrilll view");
                      this.closeAllOpenRows();
                    }}
                    onScrollBeginDrag={() => {
                      console.log("onScrollBeginiDrag");
                    }}
                    onScrollEndDrag={() => {
                      console.log("onScrollEndDrag");
                    }}
                    onScrollToTop={() => {
                      console.log("onnScrollToTops");
                    }}
                    // overScrollMode={() => {
                    //   console.log('over sceroll mode');
                    // }}
                    refreshControl={
                      <RefreshControl
                        enabled
                        colors={[
                          themes[mode]["primaryColor"],
                          themes[mode]["primaryColor"],
                        ]}
                        refreshing={loader}
                        onRefresh={() => {
                          this.props.listNotification();
                          this.setState({ refresh: true });
                        }}
                      />
                    }
                    style={{
                      ...styles.scrollContainer,
                      // backgroundColor:
                      //   mode == "light" ? themes[mode]["bgColor"] : "#181818",
                    }}
                  >
                    <SwipeListView
                      data={list_notice}
                      renderItem={renderItem}
                      // renderHiddenItem={renderHiddenItem}
                      leftOpenValue={100}
                      rightOpenValue={-100}
                      previewRowKey={"0"}
                      previewOpenValue={-40}
                      previewOpenDelay={3000}
                      onRowDidOpen={onRowDidOpen}
                      keyExtractor={(item, index) => index.toString()}
                      onRowOpen={(item, b) => {
                        console.log(item, b, "onrowopennn"),
                          this.onRowOpen(item);
                        //   item,
                      }}
                      closeOnRowOpen={false}
                      closeOnRowBeginSwipe={true}
                      closeOnRowPress={this.closeAllOpenRows}
                      // onRowDidOpen={() => {
                      //   this.setState({open: true});
                      // }}
                      isEnabled={true}
                      closeOnScroll
                      onScrollEnabled={() => {
                        console.log("scroll start");
                        this.closeAllOpenRows;
                      }}
                      onRowClose={() => {
                        this.setState({ open: false, selectedId: "" });
                      }}
                    />
                  </ScrollView>
                )}

                {list_notice?.length > 0 && (
                  <View
                    style={{
                      width: "100%",
                      bottom: 20,
                      position: "absolute",
                      right: 0,
                      alignItems: "center",
                      zIndex: 109,
                    }}
                  >
                    <CustomButton
                      buttonStyle={{
                        borderColor: commonColors.yellowColor,
                        backgroundColor: commonColors.yellowColor,
                        width: 120,
                        borderRadius: 100,
                      }}
                      textStyle={{
                        color: "#fff",
                      }}
                      title={"Clear All"}
                      handleSubmit={this.handleClear}
                    />
                  </View>
                )}
              </WithBgHeader>
            </View>
          )}
          {/* {undo_show ? (
            <View
              style={{
                width: "100%",
                bottom: 20,
                position: "absolute",
              }}
            >
              <BottomToast
                message={"1 Notification deleted"}
                action="Undo"
                shown={true}
                onPressAction={this.undoAction}
              />
            </View>
          ) : null} */}
        </View>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = ({
  profile: { mode },
  notification: { list_notice, last_updated },
  registration: { loader },
}) => {
  return {
    mode,
    list_notice,
    last_updated,
    loader,
  };
};
const { updateNotification, listNotification } = notification;
const { addFcmToken } = login;
const { stopLoader } = registration;

const mapDispatchToProps = {
  updateNotification,
  listNotification,
  addFcmToken,
  stopLoader,
};
export default connect(mapStateToProps, mapDispatchToProps)(NotificationList);

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingBottom: 100,
    marginTop: "5%",
  },
  scrollContainer: {
    height: "100%",
  },
  safeArea: {
    flex: 1,
    justifyContent: "flex-start",
  },
});
