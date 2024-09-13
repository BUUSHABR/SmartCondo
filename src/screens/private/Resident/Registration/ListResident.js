import React, { Component } from "react";
import { View, Text, ScrollView, FlatList, Image } from "react-native";
import { connect } from "react-redux";
import { TouchableOpacity } from "react-native-gesture-handler";
import { SvgXml } from "react-native-svg";
import SafeAreaView from "react-native-safe-area-view";

import { registration } from "../../../../redux/actions";
import {
  capitalizeTwoLetter,
  complaintStatusExtractor,
  tailedString,
  titleize,
} from "../../../../helpers";
import { WithBgHeader } from "../../../../components";

import {
  NoData,
  CarIcon,
  BikeIcon,
  BikeIconVehicle,
  CarIconVehicle,
  ResidentIcon,
} from "../../../../../assets/img/svgs";
import styles from "../../../../styles/listResident";
import commonStyles from "../../../../styles/commonStyles";
import { themes, commonColors, fonts } from "../../../../themes";
import moment from "moment";
import Animated from "react-native-reanimated";
import { customAnimation } from "../../../../animation/CommonAnimation";
import { fetchConfigs } from "../../../../api/home";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ms } from "../../../../helpers/scaling";

class ListResident extends Component {
  constructor(props) {
    super(props);

    this.state = {
      config: false,
    };
  }
  componentDidMount() {
    const { residentList, vehicleList, navigation } = this.props;

    residentList();
    vehicleList();
    fetchConfigs()
      .then(({ data }) => {
        console.log(data, "iuewewiuew");
        this.setState({
          config: data?.resident_config?.resident_create_access,
        });
      })
      .catch((err) => {
        console.log(err, "log err");
      });
    this.focusListener = navigation.addListener("focus", () => {
      residentList();
      vehicleList();
    });
  }
  componentWillUnmount() {
    this.focusListener();
  }

  onPressCard = async ({ item, index, title }) => {
    let user = await AsyncStorage.getItem("user");

    const { navigation } = this.props;
    const {
      name,
      relation,
      resident_type,
      vehicle_type,
      vehicle_number,
      phone,
      email,
      gender,
      id,
      number_plate,
      position,
    } = item.item;
    let obj = {};
    if (index == 0) {
      obj = {
        name,
        phone,
        email,
        resident_type,
        title,
        id,
      };
    } else if (index == 1) {
      obj = {
        vehicle_type: {
          label: "",
          value: vehicle_type === "normal" ? "Car" : "Motor Bike",
        },
        vehicle_number: { label: "", value: number_plate },
        vehicle_position:{label:"",value:position}
      };
    } else {
      obj = {
        name: { label: "", value: name },
        gender: { label: "", value: gender },
        relation: { label: "", value: relation },
      };
    }
    navigation.navigate("ViewRegistration", {
      data: {
        obj,
        type_id: id,
        title,
        current_unit_position: JSON.parse(user)?.data?.current_unit
          ?.resident_position,
      },
    });
  };

  renderItem = ({ item, index, title }) => {
    const { mode } = this.props;
    const {
      name,
      relation,
      id,
      resident_type,
      number_plate,
      vehicle_type,
      registration_status,
    } = item.item;
    console.log(item, "ougrginregpigreog", title);

    return (
      <TouchableOpacity
        key={id}
        onPress={() => this.onPressCard({ item, index, title })}
        style={{
          ...styles.boxShadow,
          paddingBottom: title == "My Vehicles" ? 10 : 20,
          backgroundColor:
            themes[mode][mode === "light" ? "bgColor" : "boxShadow"],
          borderColor: themes[mode]["lightAsh1"],
        }}
      >
        <View
          style={{
            ...styles.avatar,
          }}
        >
          {name ? (
            <Text
              style={{
                ...styles.avatarText,
                color: commonColors.darkViolet1,
              }}
            >
              {name && name.length > 0 ? capitalizeTwoLetter(name) : ""}
            </Text>
          ) : (
            <SvgXml
              xml={
                vehicle_type === "normal"
                  ? CarIcon(commonColors.darkViolet1)
                  : BikeIcon(commonColors.darkViolet1)
              }
              width={20}
              height={21}
            />
          )}
        </View>
        <View
          style={{
            ...styles.centerAlign,
          }}
        >
          <Text
            style={{
              ...styles.text1,
              color: themes[mode]["headingColor"],
            }}
          >
            {tailedString(name || number_plate, 10)}
          </Text>
          <Text
            style={{
              ...styles.text2,
              color: themes[mode]["lightAsh3"],
            }}
          >
            {vehicle_type
              ? vehicle_type === "normal"
                ? "Car"
                : "Motor Bike"
              : resident_type || tailedString(relation, 18)}
          </Text>
          {title == "My Vehicles" && (
            <View
              style={{
                paddingHorizontal: 7,
                paddingVertical: 3,
                borderRadius: 20,
                marginLeft: 0,

                marginTop: 10,
                // marginBottom:"10%"
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              {registration_status != "approved" && (
                <>
                  <View
                    style={{
                      height: 7,
                      width: 7,
                      borderRadius: 15,
                      backgroundColor: complaintStatusExtractor(
                        registration_status
                      ).bgColor,
                    }}
                  ></View>
                  <Text
                    style={{
                      marginLeft: 6,
                      marginTop: -5,
                      ...commonStyles.semiBold_12,
                      color: complaintStatusExtractor(registration_status)
                        .color,
                    }}
                  >
                    {titleize(registration_status)}
                  </Text>
                </>
              )}
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  renderItem1 = ({ item, index, title }) => {
    const { mode } = this.props;
    const {
      name,
      relation,
      id,
      resident_type,
      number_plate,
      vehicle_type,
      registration_status,
      expiry_date,
      status,
      profile_image,
      class_name,
      res_position,
      position
    } = item.item;
    console.log(
      class_name,
      "ougrginregpigreog",
      name,
      registration_status,
      item.item,
      status
    );
    console.log("loPos", position)
    if (title == "My Vehicles") {
      return (
        <Animated.View>
          <TouchableOpacity
            key={id}
            onPress={() => this.onPressCard({ item, index, title })}
            style={{
              ...styles.boxShadow,
              backgroundColor:
                themes[mode][mode === "light" ? "bgColor" : "boxShadow"],
              elevation: 10,
            }}
          >
            <View
              style={{
                height: ms(100),
                width: ms(100),
                position: "absolute",
                bottom: ms(-2),
                right: 0,
                zIndex:ms(-89),
                borderRadius: ms(16),
                justifyContent: "flex-end",
                alignItems: "flex-end",
                overflow: "hidden",
              }}
            >
              {vehicle_type === "normal" ? (
                <CarIconVehicle />
              ) : (
                <BikeIconVehicle />
              )}
            </View>
            <View style={{}}>
              {/* <View */}

              <Text
                style={{
                  // ...styles.text1,
                  ...commonStyles.regular_14,
                  marginVertical: ms(7),
                  fontFamily: fonts.medium,
                  color: themes[mode]["headingColor"],
                  marginRight: ms(25),
                }}
              >
                {tailedString(number_plate, 10)}
              </Text>
              {/* </View> */}
              {title == "My Vehicles" && (
                <View
                  style={{
                    // paddingHorizontal: 7,
                    paddingVertical: ms(3),
                    borderRadius: 20,
                    marginLeft: 0,

                    marginTop: 0,
                    // marginBottom:"10%"
                    flexDirection: "row",
                    // alignItems: "center",
                    justifyContent: "flex-start",
                  }}
                >
                  {class_name != "Vehicle" ? (
                    <>
                      <View
                        style={{
                          height: 7,
                          width: 7,
                          borderRadius: 15,
                          backgroundColor: complaintStatusExtractor(
                            registration_status
                          ).bgColor,
                          marginRight: 6,
                        }}
                      ></View>
                      <Text
                        style={{
                          marginLeft: 0,
                          marginTop: ms(-5),
                          ...commonStyles.semiBold_12,
                          color: complaintStatusExtractor(registration_status)
                            .color,
                        }}
                      >
                        {titleize(registration_status)}
                      </Text>
                    </>
                  ) : (
                    <View>
                      {position !=="other" && position  ?
                        <View style={{flexDirection:"row",padding:1}}>
                          <View
                            style={{
                              height: ms(7),
                              width: ms(7),
                              borderRadius: ms(15),
                              backgroundColor: complaintStatusExtractor(
                                position
                              ).bgColor,
                              marginRight: ms(6),
                            }}
                          ></View>
                          <Text
                            style={{
                              marginLeft: 0,
                              marginTop: ms(-5),
                              ...commonStyles.semiBold_12,
                              color: complaintStatusExtractor(position)
                                .color,
                            }}
                          >
                            {titleize(position)}
                          </Text>
                        </View> : <View style={{flexDirection:"row",padding:1,height:ms(7)}}/>}
                      <Text
                        style={{
                          color: themes[mode]["lightAsh"],
                          fontFamily: fonts.regular,
                          fontSize: 11,
                        }}
                      >
                        Valid until
                      </Text>
                      <Text
                        style={{
                          color: themes[mode]["headingColor"],
                          fontFamily: fonts.regular,
                          fontSize: 13,
                        }}
                      >
                        {expiry_date
                          ? moment(expiry_date).format("DD MMM YYYY")
                          : "-"}
                      </Text>
                    </View>
                  )}
                </View>
              )}
            </View>
          </TouchableOpacity>
        </Animated.View>
      );
    } else {
      return (
        status != "pending" && (
          <Animated.View>
            <TouchableOpacity
              key={id}
              onPress={() => this.onPressCard({ item, index, title })}
              style={{
                ...styles.boxShadow,
                backgroundColor:
                  themes[mode][mode === "light" ? "bgColor" : "boxShadow"],
                elevation: 10,
              }}
            >
              <View
                style={{
                  height: ms(100),
                  width: ms(100),
                  position: "absolute",
                  bottom: -2,
                  right: 0,
                  zIndex: -89,
                  borderRadius: 16,
                  justifyContent: "flex-end",
                  alignItems: "flex-end",
                  overflow: "hidden",
                }}
              >
                <ResidentIcon />
              </View>
              <View
                style={{
                  paddingHorizontal: 2,
                  width: "100%",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    ...styles.avatar,
                    width:ms(30),
                    height: ms(30),
                  }}
                >
                  {profile_image ? (
                    <Image
                      style={{
                        width: ms(30),
                        height: ms(30),
                        borderRadius: ms(30),
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "black",
                      }}
                      source={{
                        uri: profile_image,
                      }}
                    />
                  ) : (
                    <Text
                      style={{
                        ...styles.avatarText,
                        color: commonColors.darkViolet1,
                      }}
                    >
                      {console.log(
                        name && name.length > 0
                          ? capitalizeTwoLetter(name).replace(/\s/g, "")
                          : "",
                        "ppopoopopo"
                      )}
                      {name && name.length > 0
                        ? capitalizeTwoLetter(name).replace(/\s/g, "")
                        : ""}
                    </Text>
                  )}
                </View>

                <Text
                  style={{
                    ...styles.text2,
                    color: themes[mode]["lightAsh3"],
                  }}
                >
                  {resident_type || tailedString(relation, 18)}
                  {/* Owner */}
                </Text>
              </View>
              <View style={{ width: "100%", paddingLeft: 5 }}>
                <Text
                  style={{
                    // ...styles.text1,
                    color: themes[mode]["headingColor"],
                    fontFamily: fonts.medium,
                    // marginRight: 0,
                    fontSize:ms(10)
                  }}
                >
                  {tailedString(name || number_plate, 9)}
                </Text>
                <View
                  style={{
                    paddingHorizontal: 0,
                    paddingVertical: ms(3),
                    borderRadius: ms(20),
                    marginLeft: 0,

                    marginBottom: ms(10),
                    // marginBottom:"10%"
                    flexDirection: "row",
                    // alignItems: "center",
                    marginRight: 25,
                    marginTop: ms(5),
                  }}
                >
                  <>
                    {(res_position == "primary" ||
                      res_position == "secondary") && (
                        <View
                          style={{
                            height: ms(7),
                            width: ms(7),
                            borderRadius: 15,
                            backgroundColor: complaintStatusExtractor(
                              res_position == "primary" ? "answered" : "pending"
                            ).bgColor,
                          }}
                        ></View>
                      )}
                    {(res_position == "primary" ||
                      res_position == "secondary") && (
                        <Text
                          style={{
                            marginLeft: 6,
                            marginTop: ms(-5),
                            ...commonStyles.semiBold_12,
                            color: complaintStatusExtractor(
                              res_position == "primary" ? "answered" : "pending"
                            ).color,
                            fontSize: ms(10),
                          }}
                        >
                          {res_position == "primary" ? "Primary" : "Secondary"}
                        </Text>
                      )}
                  </>
                </View>
              </View>
              <View
                style={{
                  ...styles.centerAlign,
                  width: "100%",
                }}
              ></View>
            </TouchableOpacity>
          </Animated.View>
        )
      );
    }
  };

  addFamilyMembers = () => {
    this.props.navigation.navigate("AddFamilyMembers");
  };

  addResidents = () => {
    this.props.navigation.navigate("AddResident");
  };

  addVehicles = () => {
    this.props.navigation.navigate("AddVehicles");
  };

  render() {
    const {
      residents_list,
      vehicles_list,
      loader,
      mode,
      userData,
    } = this.props;
    const { resident_position } = userData?.current_unit;
    const categories = [
      {
        title: "Residents",
        data: residents_list,
        onPress: this.addResidents,
        dataShow: !loader && residents_list?.length > 0,
      },
      {
        title: "My Vehicles",
        data: vehicles_list,
        onPress: this.addVehicles,
        dataShow: !loader && vehicles_list?.length > 0,
      },
    ];
    console.log(resident_position, "resident_position+");
    console.log(vehicles_list, "vehoicdlfhelfewlkfewfwf ifoewflewhf");
    let show = false;
    switch (this.state.config) {
      case "Primary Resident Only":
        show = resident_position == "primary" ? true : false;
        break;
      case "Disable":
        show = false;
        break;
      case "All":
        show = true;
        break;
      case "Primary + Secondary":
        show =
          resident_position == "primary" || resident_position == "secondary"
            ? true
            : false;
        break;
    }
    return (
      <ScrollView
        contentContainerStyle={{
          ...styles.containerStyle,
          backgroundColor: themes[mode]["bgColor"],
        }}
        style={{
          ...styles.scrollStyle,
          backgroundColor: themes[mode]["bgColor"],
        }}
      >
        <SafeAreaView
          style={{ backgroundColor: themes[mode]["bgColor"] }}
          forceInset={{ top: "never" }}
        >
          <WithBgHeader
            includeFont
            leftIcon
            headerTitle="My Unit"
            containerStyle={{
              ...commonStyles.headerSpacing,
              // marginTop: 0,
            }}
          >
            <View
              style={{
                marginVertical: 25,
              }}
            >
              {categories?.map((item, index) => {
                const { title, data, onPress, dataShow } = item;
                console.log(dataShow, "skkskklidheqguejbcbryf cdbhf nd", item);
                return (
                  <View >
                    <View
                      style={{
                        ...styles.blockHeader,
                      }}
                    >
                      <Text
                        style={{
                          ...commonStyles.medium_18,
                          color: themes[mode]["lightAsh3"],
                        }}
                      >
                        {title}
                      </Text>
                      {((title == "Residents" && show) ||
                        title == "My Vehicles") && (
                          <TouchableOpacity onPress={onPress} style={{ flex: 1 }}>
                            <Text
                              style={{
                                ...commonStyles.medium_16,
                                color: themes[mode]["primaryColor"],
                              }}
                            >
                              Add +
                            </Text>
                          </TouchableOpacity>
                        )}
                    </View>
                    {dataShow ? (
                      <View style={{minHeight:ms(150)}}>
                        <FlatList
                          horizontal
                          showsHorizontalScrollIndicator={false}
                          legacyImplementation={false}
                          data={data}
                          renderItem={(item) =>
                            this.renderItem1({ item, index, title })
                          }
                          keyExtractor={(item) => item.id}
                          style={{
                            ...styles.listStyle,
                          }}
                          contentContainerStyle={{
                            ...styles.containerStyle,
                            paddingRight: 50,
                            paddingLeft: 5,
                          }}
                        />
                      </View>
                    ) : (
                      <View
                        style={{
                          ...styles.noDataAlign,
                        }}
                      >
                        <View
                          style={{
                            ...styles.boxShadow,
                            ...styles.noDataBoxShadow,
                            backgroundColor: themes[mode]["boxShadow"],
                          }}
                        >
                          <NoData />
                          <Text
                            style={{
                              ...styles.noData,
                              color: themes[mode]["lightAsh3"],
                            }}
                          >
                            No Data
                          </Text>
                        </View>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          </WithBgHeader>
        </SafeAreaView>
      </ScrollView>
    );
  }
}

const mapStateToProps = ({
  registration: { residents_list, vehicles_list, loader },
  profile: { mode, userData },
}) => {
  return {
    residents_list,
    vehicles_list,
    loader,
    mode,
    userData,
  };
};
const { residentList, vehicleList } = registration;
const mapDispatchToProps = {
  residentList,
  vehicleList,
};

export default connect(mapStateToProps, mapDispatchToProps)(ListResident);
