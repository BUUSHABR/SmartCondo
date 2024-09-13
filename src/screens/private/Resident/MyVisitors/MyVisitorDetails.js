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
  Linking,
  BackHandler,
} from "react-native";
import { themes, fonts, commonColors } from "../../../../themes";
import { Header } from "../../../../components/Header";
import {
  detectTheme,
  handleBackPage,
  statusColor,
  tailedString,
  complaintStatusExtractor,
  visitorStatus,
  timeAgo,
} from "../../../../helpers";
import {
  NameIcon1,
  PhoneIcon1,
  TypeIcon,
  ClockIcon,
  CommentIcon,
  UnitIcon,
  CountIcon,
  CalendarIcon,
  MessengerIcon,
  StatusIcon,
  NumberPlateIcon,
  EntryModeIcon,
} from "../../../../../assets/img/svgs";
import moment from "moment";
import SafeAreaView from "react-native-safe-area-view";
import { myVisitor } from "../../../../redux/actions";
import { connect } from "react-redux";
import { showVisitorDetails } from "../../../../api/my_visitor";
import { ShowVisitorDetailsLoader } from "../../../../../assets/img/loader";
import * as RootNavigation from "../../../../navigation/RootNavigation";
import { CustomButton, WithBgHeader } from "../../../../components";
import commonStyles from "../../../../styles/commonStyles";
import { ms } from "../../../../helpers/scaling";

class MyVisitorDetails extends Component {
  constructor(props) {
    super(props);
    this.state={
      CallBtnStatus:false
  }
  }
  componentDidMount() {
    console.log(this.props, ",my visitor detailsss");

    const { navigation, showVisitor, onVisitorChange } = this.props;
    const {
      data: { type_id },
    } = this.props?.route?.params;
    this._unsubscribe = navigation.addListener("focus", async () => {
      console.log("FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF");
      console.log(type_id, "iddddd");

      showVisitor(type_id);
    });
    this._unsubscribe1 = navigation.addListener("blur", async () => {
      onVisitorChange({ name: "visitorDetails", value: {} });
    });

    BackHandler.addEventListener("hardwareBackPress", () => {
      // handleBackPage('Visitor');
      // RootNavigation.navigate(handleBackPage('MyVisitorsList'));
    });
  }
  openDialPad = (number) => {
    let num = "";
    if (Platform.OS === "android") {
      num = `tel:${number}`;
    } else {
      num = `telprompt:${number}`;
    }
    Linking.openURL(num);
  };
  durationDiff = (from,end) => {
    console.log(from,end,"kdk");
    var duration = moment.duration(moment(end).diff(from)); 
    var hours = Math.round(duration.asHours());
    console.log(typeof hours,"hoursedddd");
    return Math.abs(parseInt(hours))+ " hour"
  };
  
 
  handleDebounce = (func, delay) => {
    this.setState({ CallBtnStatus: true });
    func();
    setTimeout(() => this.setState({ CallBtnStatus: false }), delay);
  };

 
  render() {
    const mode = detectTheme();
    console.log(this.props, "routeeeeee render my visjtorr");

    const {
      block,
      visitors,
      mode_of_entry,
      number_plate,
      visitor_type,
      visitor_type_name,
      device_name,
      status,
      in_time,
      out_time,
    } = this.props?.visitorDetails;

    console.log(mode_of_entry, this.props?.visitorDetails, "pateeee");

    const row1 = [
      {
        value: "name",
        label: "Name",
        val:
          visitors?.length > 0
            ? tailedString(visitors && visitors[0].name, 20)
            : "-",
        icon: <NameIcon1 color={themes["light"]["primaryColor"]} />,
      },
      {
        value: "phone",
        label: "Mobile Number",
        val: visitors?.length > 0 ? visitors && visitors[0].phone : "-",
        icon: <PhoneIcon1 color={themes["light"]["primaryColor"]} />,
      },
      {
        value: "visitor_type_name",
        label: "Type of Visit",
        val: visitor_type_name,
        icon: <MessengerIcon color={themes["light"]["primaryColor"]} />,
      },
      {
        value: "count",
        label: "Add-on Visitors",
        val: visitors?.length,
        icon: <CountIcon />,
      },
      {
        value: "in_time",
        label: "Entry Time",
        val: moment(in_time).format("DD MMM, hh:mm A"),
        icon: <CalendarIcon color={themes["light"]["primaryColor"]} />,
      },
      {
        value: "out_time",
        label: "Duration",
        val: out_time ? this.durationDiff(in_time,out_time): null,
        icon: <CalendarIcon color={themes["light"]["primaryColor"]} />,
      },

      {
        value: "mode_of_entry",
        label: "Mode Of Entry",
        val: mode_of_entry,
        icon: <EntryModeIcon />,
      },
      {
        value: "number_plate",
        label:number_plate? "Number Plate":null,
        val: number_plate?number_plate:null,
        icon:number_plate? <NumberPlateIcon />:null,
      },

      {
        value: "status",
        label: "Status",
        val:mode_of_entry!="walkin"? visitorStatus(status).text:null,
        icon: <StatusIcon />,
      },
    ];
    const filter = row1.filter((item) => {
      console.log(
        item.val,
        item.value === "count" && item.val > 1,
        item.value,
        "null"
      );
      if (item.val !== null && item.value !== "count") {
        return item;
      }
      if (item.value === "count" && item.val > 1) {
        return item;
      }
      if (item.value === "out_time" && item.val) {
        return item;
      }
    });

    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: themes[mode]["bgColor"],
          // height: '100%',
        }}
        forceInset={{ top: "never" }}
      >
        <WithBgHeader
          leftIcon
          headerTitle={
            visitor_type_name
              ? `${visitor_type || visitor_type_name} Details`
              : ""
          }
          containerStyle={{
            ...commonStyles.headerSpacing,
            // marginTop:0
          }}
        >
          {/* <View style={{marginTop: '-7%'}}>
          <Header
            showLeftIcon
            leftIcon
            showRightIcon
            title={
              visitor_type_name
                ? `${visitor_type || visitor_type_name} Details`
                : ''
            }
            rightIcon
            onPressRight={() => {}}
            onPressLeftIcon
          />
        </View> */}

          <View
            style={{
              ...styles.row1,
            }}
          >
            {Object.keys(this.props.visitorDetails).length > 0 ? (
              <FlatList
                columnWrapperStyle={{
                  flex: 1,
                  justifyContent: "space-between",
                  // borderWidth: 1,
                }}
                numColumns={2}
                data={filter}
                renderItem={({ item, index }) => {
                  const { icon, label, value, val } = item;

                  console.log(
                    
                   
                    "visitor details item",
                    value,
                    val,
                  );
                  return (
                    <View
                      style={{
                        ...styles.col1,
                        paddingLeft: Math.abs(index % 2) == 1 ? 20 : 0,
                        // w: Math.abs(index % 2) == 1 ? '40%' : '50%',
                      }}
                    >
                      <View
                        style={{
                          ...styles.ele1,
                        }}
                      >
                        {/* <NameIcon color={themes[mode]['primaryColor']} />
                         */}
                        {icon}
                        <Text
                          style={{
                            ...styles.label,
                            color: themes[mode]["textColor"],
                          }}
                        >
                          {label}
                        </Text>
                      </View>
                      <Text
                        style={{
                          ...styles.value,
                          color:
                            value === "status"
                              ? visitorStatus(val).color
                              : themes[mode]["headingColor"],
                          textTransform:
                            value === "number_plate"
                              ? "uppercase"
                              : value !== "in_time"
                              ? "capitalize"
                              : "none",
                        }}
                      >
                        {val}
                      </Text>
                    </View>
                  );
                }}
              />
            ) : (
              [1, 2, 3, 4]?.map((item) => {
                return (
                  <View>
                    <ShowVisitorDetailsLoader />
                  </View>
                );
              })
            )}
          </View>
          {visitors?.length > 0 && visitors && (
            <View
              style={{
                position: "absolute",
                width: "100%",
                paddingHorizontal: 40,
                bottom: 0,
                marginBottom: 20,
              }}
            >
              <CustomButton
                title={"Call Visitor"}
                buttonStyle={{
                  borderColor: commonColors.yellowColor,
                  backgroundColor: commonColors.yellowColor,
                }}
                textStyle={{
                  color: "#fff",
                }}
                handleSubmit={() => {
                  this.handleDebounce(() => this.openDialPad(visitors[0].phone),500);  
                }}
                disableBtn={this.state.CallBtnStatus}
              />
            </View>
          )}
        </WithBgHeader>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = ({
  profile: { mode },
  myVisitor: { visitorDetails },
}) => {
  return {
    mode,
    visitorDetails,
  };
};

const { showVisitor, onVisitorChange } = myVisitor;

const mapDispatchToProps = {
  showVisitor,
  onVisitorChange,
};

export default connect(mapStateToProps, mapDispatchToProps)(MyVisitorDetails);

const styles = StyleSheet.create({
  row1: {
    flexDirection: "row",
    marginVertical: "5%",
    // marginTop: '6%',
    // width: '100%',
    flexWrap: "wrap",
    marginHorizontal: ms(20),
    ...commonStyles.headerSpacing,
    marginTop: 10,
  },
  col1: {
    width: "50%",
    // height: 60,
    marginVertical: 15,

    // height: 100,
    // width: 300,
    // flexWrap: 'nowrap',
  },
  ele1: {
    // width: '50%',
    flexDirection: "row",
    // justifyContent: 'center',
    // minWidth: '50%',
    alignItems: "center",

    // borderWidth: 1,
  },
  label: {
    fontFamily: fonts.regular,
    fontSize:ms(14),
    marginLeft: 10,
  },
  value: {
    fontFamily: fonts.semiBold,
    fontSize: ms(16),
    marginLeft: 20,
    marginVertical: 5,
    // textTransform: 'capitalize',
  },
});
