import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  Platform,
  Image,
  ScrollView,
} from "react-native";
import SafeAreaView from "react-native-safe-area-view";
import { themes, fonts } from "../../../../themes";
import {
  customTimeFunction,
  detectTheme,
  SliceName,
} from "../../../../helpers";
import { NoDataComp, WithBgHeader } from "../../../../components";
import commonStyles from "../../../../styles/commonStyles";
import {
  HeartIcon,
  NoDocument,
  ReportCommuIcon,
} from "../../../../../assets/img/svgs";
import { connect } from "react-redux";
import { community } from "../../../../redux/actions";
import {
  CommunityListLoader,
  NotificationLoader,
} from "../../../../../assets/img/loader";

const CommunityLikeList = (props) => {
  const [pollshow, setpollshow] = useState(false);

  const mode = detectTheme();
  console.log(props.communityShowData, "de");
  const { communityShowData } = props;
  useEffect(()=>{
    return ()=>{
      console.log("hello boss ");
      props.resetLikeList()
    }
  },[])
  return (
    <SafeAreaView
      style={{
        width: "100%",
        backgroundColor: themes[mode]["bgColor"],
      }}
      forceInset={{ top: "never" }}
    >
      <WithBgHeader
        leftIcon={true}
        headerTitle={`Likes (${props.communityListLike.length})`}
        containerStyle={{
          ...commonStyles.headerSpacing,
        }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            minHeight: "100%",
          }}
        >
          <View
            style={{
              marginHorizontal: 25,
              marginTop: 15,
            }}
          >
            {!props.likeLoader ? (
              props.communityListLike.length > 0 ? (
                props.communityListLike?.map((data) => {
                  console.log(data, "dwludhykwdhwd");
                  return (
                    <View style={{ flexDirection: "row" ,marginBottom:25}}>
                      <View>
                        <Image
                          style={{
                            width: 45,
                            height: 45,
                            borderRadius: 30,
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: "black",
                          }}
                          source={{
                            uri: data?.profile_image,
                          }}
                        />
                      </View>
                      <View style={{ marginLeft: 20 }}>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          <Text
                            style={{
                              fontFamily: fonts.bold,
                              color: themes[mode]["headingColor"],
                              fontSize: 16,
                            }}
                          >
                            {data.liked ? "You " : data.name}
                          </Text>
                        </View>
                        <Text
                          style={{
                            fontFamily: fonts.regular,
                            color: themes[mode]["lightAsh"],
                            fontSize: 12,
                            marginTop: 5,
                          }}
                        >
                          {data.unit_number[0]}
                        </Text>
                      </View>
                    </View>
                  );
                })
              ) : (
                <NoDataComp
                  noDataVector={<NoDocument />}
                  text="No Likes"
                  message="No Likes found here"
                  bottomButtonText="OK"
                />
              )
            ) : (
              <View style={{ ...commonStyles.headerSpacing, marginTop: 15 }}>
                {[1, 2, 3, 4, 5, 6, 7]?.map((item) => {
                  return (
                    <View style={{ marginBottom: 20 }}>
                      <NotificationLoader />
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        </ScrollView>
      </WithBgHeader>
    </SafeAreaView>
  );
};

const mapStateToProps = ({ community: { showLoader, communityListLike ,likeLoader} }) => {
  return {
    showLoader,
    communityListLike,
    likeLoader
  };
};

const { communitylist, communityshow ,resetLikeList} = community;
const mapDispatchToProps = {
  communitylist,
  communityshow,
  resetLikeList
};
export default connect(mapStateToProps, mapDispatchToProps)(CommunityLikeList);
