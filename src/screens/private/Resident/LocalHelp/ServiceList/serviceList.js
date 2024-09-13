import { View, SafeAreaView, ScrollView, StatusBar, Text } from "react-native";
import React, { useEffect, memo } from "react";
import { fonts, themes } from "../../../../../themes";
import { detectTheme, FastImg, SliceName } from "../../../../../helpers";
import { localStyles } from "../styles";

import commonStyles from "../../../../../styles/commonStyles";
import { WithBgHeader } from "../../../../../components";
import { ms } from "../../../../../helpers/scaling";
import { Header } from "../Components/header";
import { ServiceCard } from "./serviceCard";
import Animated from "react-native-reanimated";
import { customAnimation } from "../../../../../animation/CommonAnimation";
import { SkeletonList } from "../Skeleton/SkeletonList";
import {
  LocalHelpOnchnage,
  ServicesListApi,
} from "../../../../../redux/actions/localhelp";
import { useDispatch, useSelector } from "react-redux";

const ServiceList = ({ navigation, route }) => {
  const listData = route?.params?.data;
  const mode = detectTheme();
  const {
    serviceList,
    isLoading,
    serviceHeader: { name, content },
    pageService,
    isListEndService,
    isMoreLoadingService,
  } = useSelector((state) => state.localhelp);
  const dispatch = useDispatch();
  console.log(serviceList?.length, "serviceList serviceList Screen");
  useEffect(() => {
    console.log(
      serviceList?.length,
      "pagination search serviceList",
      serviceList
    );
    dispatch(ServicesListApi(listData, pageService));
  }, [pageService]);
  useEffect(() => {
    navigation.addListener("focus", () => {
      dispatch(ServicesListApi(listData, pageService,"",true));
    });
    navigation.addListener("blur", () => {
      dispatch(LocalHelpOnchnage({ name: "pageService", data: 1 }));
      dispatch(LocalHelpOnchnage({ name: "serviceList", data: [] }));
    });
  }, []);
  const fetchMoreData = () => {
    console.log(
      "fetching more data...",
      pageService,
      isListEndService,
      isMoreLoadingService
    );
    if (!isListEndService && !isMoreLoadingService) {
      dispatch(
        LocalHelpOnchnage({ name: "pageService", data: pageService + 1 })
      );
    }
  };
  const serviceCardProp = {
    serviceList,
    pageService,
    dispatch,
    LocalHelpOnchnage,
    fetchMoreData,
    isListEndService,
    isMoreLoadingService,
    id: listData?.id,
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: themes[mode]["bgColor"],
      }}
      forceInset={{ top: "never" }}
    >
      {serviceList?.length > 0 || !isLoading ? (
        <WithBgHeader
          leftIcon
          containerStyle={{ ...commonStyles.headerSpacing }}
        >
          <StatusBar
            translucent={true}
            barStyle={mode === "light" ? "dark-content" : "dark-content"}
            backgroundColor="transparent"
          />
          <View style={{ ...localStyles.flexFull }}>
            <Animated.View
              {...customAnimation("FadeInUp", 1000, 100)}
              style={{ paddingHorizontal: ms(20) }}
            >
              <Header
                {...{
                  name: name,
                  content: SliceName(content, 100)
                    .replace(/\n/g, " ")
                    .trim(),
                }}
              />
            </Animated.View>
            <View
              style={{
                flex: 1,
                justifyContent:
                  serviceList?.length > 0 ? "flex-start" : "center",
              }}
            >
              <ServiceCard {...serviceCardProp} />
            </View>
          </View>
        </WithBgHeader>
      ) : (
        <SkeletonList />
      )}
    </SafeAreaView>
  );
};

export default memo(ServiceList);
