import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  Platform,
  Image
} from "react-native";
import SafeAreaView from "react-native-safe-area-view";

import { themes, fonts } from "../themes";
import { detectTheme, SliceName } from "../helpers";
import { NoVisitorData, SearchIcon, Tickic } from "../../assets/img/svgs";
import { SvgUri } from "react-native-svg";
import {
  SOSLoader,
  SOSCommunityLoader,
  SOSLoaderr,
} from "../../assets/img/loader";
import { NoDataCompSearch, WithBgHeader } from ".";
import commonStyles from "../styles/commonStyles";
import Animated from "react-native-reanimated";
import { customAnimation } from "../animation/CommonAnimation";
import { ms } from "../helpers/scaling";

class ListTypeColumn extends Component {

  render() {
    const mode = detectTheme();
    const {
      headerProps: {
        title,
        leftIcon,
        onPressRight,
        rightIcon,
        rightText,
        showRightIcon,
        showLeftIcon,
      },
      listProps: { data, onClick, sub_visitor, clearvalue },
      searchProps: { handleSearchChange, value, placeholder, name },
      searchEnabled,
      complaint,
      param,
    } = this.props.props;
    // alert(JSON.stringify(data.length))
    console.log(value,"dddedeuu37r763r6376rr763r763r7",data);
    return (
      <SafeAreaView
        style={{
          width: "100%",
          backgroundColor: themes[mode]["bgColor"],
        }}
        forceInset={{ top: "never" }}
      >
        <WithBgHeader
          leftIcon={leftIcon}
          headerTitle={title}
          rightIcon={rightIcon}
          rightText={rightText}
          onPressRightIcon={onPressRight}
          // onPressLeftIcon={clearvalue}
          // rightText="Add New"

          // onPressRightIcon={() => {
          //   navigation.navigate("ComplaintCategory");
          // }}
          containerStyle={{
            ...commonStyles.headerSpacing,
          }}
        >
          <View
            style={{
              marginHorizontal: 20,
            }}
          >
            {searchEnabled ? (
              <View
                style={{
                  height: ms(40),
                  borderRadius: ms(10),
                  paddingHorizontal: ms(15),
                  paddingVertical: ms(10),
                  justifyContent: "center",
                  backgroundColor:
                    themes[mode][mode === "light" ? "lightAsh2" : "modalWrap"],
                }}
              >
                <TextInput
                  name={name}
                  onChangeText={(value) => {
                    handleSearchChange({
                      name,
                      value,
                      navigate: false,
                      search: "search",
                    });
                  }}
                  editable={(data?.length==0 && value.length==0)?false:true}
                  value={value}
                  style={{
                    height: ms(40),
                    borderRadius: ms(10),
                    paddingHorizontal: ms(15),
                    paddingVertical: ms(10),
                    justifyContent: "center",
                    backgroundColor:
                      themes[mode][
                        mode === "light" ? "lightAsh2" : "modalWrap"
                      ],
                    flexDirection: "row",
                    justifyContent: "center",
                    fontFamily: fonts.semiBold,
                    fontSize: ms(16),
                    color: themes[mode]["headingColor"],
                    letterSpacing: 1,
                    marginLeft: 15,
                  }}
                  placeholder={placeholder}
                  placeholderTextColor={"#c1c1c1"}
                  onFocus={() => {
                    this.setState({ search: true });
                  }}
                ></TextInput>
                <View style={{ position: "absolute", left: 10 }}>
                  <SearchIcon />
                </View>
              </View>
            ) : null}
          </View>

          {param ? (
            <FlatList
              columnWrapperStyle={{
                justifyContent: "center",
              }}
              data={data.length > 0 ? data : [1, 2, 3, 4, 5]}
              numColumns={3}
              contentContainerStyle={{
                marginTop: "10%",
                flexGrow: 1,
                backgroundColor: themes[mode]["bgColor"],
                paddingBottom: ms(150),
                minHeight: "100%",
              }}
              showsVerticalScrollIndicator={false}
              renderItem={({ item, index }) => {
                console.log(item, "itemss");
                let url = complaint
                  ? item.icon_url
                    ? item.icon_url
                    : "https://docs-assets.katomaran.tech/images/smartcondo/complaints/2021/11/maintenance.svg"
                  : item.url
                  ? item.url
                  : "https://docs-assets.katomaran.tech/images/smartcondo/complaints/2021/11/maintenance.svg";
                console.log("hgfjdklkkfkjdfkjdkjjkfdkdkjjkdjkf", url);
                return (
                  <View>
                    {data?.length > 0 ? (
                      <>
                        <Animated.View
                          {...customAnimation("ZoomIn", 200, 50, index)}
                        >
                          <TouchableOpacity
                            style={{
                              width: ms(90),
                              minHeight: ms(90),
                              borderRadius: 100,
                              backgroundColor:
                                themes[mode][
                                  mode === "light" ? "bgColor" : "modalWrap"
                                ],

                              justifyContent: "center",
                              marginHorizontal: ms(15),
                              marginVertical: 7,
                              shadowOffset: { width: 2, height: 1 },
                              shadowOpacity: 0.15,
                              // shadowColor: "#bbb",
                              shadowRadius: 10,
                              shadowOpacity: 0.1,
                              elevation: 5,
                            }}
                            onPress={() =>
                              onClick({
                                name: name,
                                value: complaint ? item.title : item.name,
                                navigate: true,
                                id: item.id,
                                icon: item.banner_url,
                                terms: item.terms,
                              })
                            }
                          >
                            {sub_visitor?.value == item.name ? (
                              <View
                                style={{
                                  height: ms(25),
                                  width: ms(25),
                                  backgroundColor: "#FFC727",
                                  borderRadius: ms(20),
                                  marginLeft: ms(65),
                                  marginTop: ms(-16),
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <Tickic />
                              </View>
                            ) : null}

                            <View
                              style={{
                                width: ms(90),
                                // height: 90,
                                height: ms(60),
                                // justifyContent: "center",
                                alignItems: "center",
                                // marginTop:-8
                              }}
                            >
                              <SvgUri width="40" height="60" uri={url} />
                            </View>
                          </TouchableOpacity>
                          <View
                            style={{
                              width: Platform.OS === "android" ? ms(128) : ms(130),
                              minHeight: Platform.OS === "android" ? ms(29) : ms(30),
                              alignSelf: "center",
                            }}
                          >
                            <Text
                              style={{
                                fontFamily: fonts.medium,
                                fontSize: ms(14),
                                color:
                                  sub_visitor?.value == item.name
                                    ? themes[mode][
                                        mode === "light"
                                          ? "headingColor"
                                          : "textColor"
                                      ]
                                    : "#989898",
                                textAlign: "center",
                              }}
                            >
                              {SliceName(
                                complaint ? item?.title : item?.name,
                                20
                              )}
                            </Text>
                          </View>
                        </Animated.View>
                      </>
                    ) : (
                     
                      !value ? <SOSLoaderr/>:<NoDataCompSearch
                     icon={<NoVisitorData />}
                     text={"Item Not Found"}
                     message="We can’t find any item matching to  your search"
                   />
                    )}
                  </View>
                );
              }}
            />
          ) : (
            <>
          
            <FlatList
              // columnWrapperStyle={{
              //   justifyContent: "center",
              // }}
              data={data.length > 0 ? data : [1, 2, 3, 4, 5]}
              // numColumns={3}
              contentContainerStyle={{
                marginTop: "5%",
                flexGrow: 1,
                // backgroundColor: themes[mode]["bgColor"],
                paddingBottom: ms(150),
                minHeight: "100%",
              }}
              showsVerticalScrollIndicator={false}
              renderItem={({ item, index }) => {
                let url = complaint
                  ? item.icon_url
                    ? item.icon_url
                    : "https://docs-assets.katomaran.tech/images/smartcondo/complaints/2021/11/maintenance.svg"
                  : item.url
                  ? item.url
                  : "https://docs-assets.katomaran.tech/images/smartcondo/complaints/2021/11/maintenance.svg";
                let urll = Image.resolveAssetSource(url);
                console.log("secofggrrhnd", url, "kjkk", complaint);
                return (
                  <View>
                    {data?.length > 0 ? (
                      <>
                        <Animated.View
                          {...customAnimation("FlipInEasyX", 200, 50, index)}
                        >
                          <TouchableOpacity
                            style={{
                              width: "91%",
                              minHeight: ms(70),
                              borderRadius: ms(10),
                              backgroundColor:
                                themes[mode][
                                  mode === "light" ? "bgColor" : "modalWrap"
                                ],
                              // justifyContent: "center",
                              marginHorizontal: ms(20),
                              marginVertical: ms(10),
                              shadowOffset: { width: 2, height: 1 },
                              shadowOpacity: 0.15,
                              // shadowColor: "#bbb",
                              shadowRadius: 10,
                              shadowOpacity: 0.1,
                              elevation: 1.5,
                              flexDirection: "row",
                              alignItems: "center",
                              shadowColor: "black",
                            }}
                            onPress={() =>
                              onClick({
                                name: name,
                                value: complaint ? item.title : item.name,
                                navigate: true,
                                id: item.id,
                                icon: item.banner_url,
                                terms: item.terms,
                              })
                            }
                          >
                            <View
                              style={{
                                width: ms(35),
                                height: ms(35),
                                justifyContent: "center",
                                alignItems: "center",
                                backgroundColor: "#FFC727",
                                borderRadius: ms(50),
                                margin: 10,
                                marginLeft: 15,
                              }}
                            >
                              <SvgUri
                                width="30"
                                height="20"
                                source={{
                                  uri:
                                    "https://docs-assets.katomaran.tech/images/smartcondo/complaints/2021/11/maintenance.svg",
                                }}
                                uri={
                                  url.includes(".svg")
                                    ? url
                                    : "https://docs-assets.katomaran.tech/images/smartcondo/complaints/2021/11/maintenance.svg"
                                }
                              />
                            </View>
                            <View
                              style={{
                                width: Platform.OS === "android" ? ms(270) : ms(130),
                                minHeight: Platform.OS === "android" ? ms(29) : ms(30),
                                alignSelf: "center",
                                marginLeft: 5,
                                // backgroundColor:'pink'
                              }}
                            >
                              <Text
                                style={{
                                  fontFamily: fonts.medium,
                                  fontSize: ms(14),
                                  color:
                                    themes[mode][
                                      mode === "light"
                                        ? "headingColor"
                                        : "textColor"
                                    ],
                                  // textAlign: "center",
                                }}
                              >
                                {SliceName(
                                  complaint ? item?.title : item?.name,
                                  30
                                )}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        </Animated.View>
                      </>
                    ) : (
                    !value ? <SOSCommunityLoader />:<NoDataCompSearch
                     icon={<NoVisitorData />}
                     text={"Item Not Found"}
                     message="We can’t find any item matching to  your search"
                   />
                    )}
                  </View>
                );
              }}
            />
              </>
          )}
        
        </WithBgHeader>
      </SafeAreaView>
    );
  }
}

export default ListTypeColumn;
{/* <NoDataCompSearch
                     icon={<NoVisitorData />}
                     text={"Item Not Found"}
                     message="We can’t find any item matching to  your search"
                   /> */}