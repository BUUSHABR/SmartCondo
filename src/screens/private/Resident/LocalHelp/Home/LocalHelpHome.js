import { View, SafeAreaView, ScrollView } from "react-native";
import React, { useEffect, memo, useState } from "react";
import { fonts, themes } from "../../../../../themes";
import { detectTheme, FastImg } from "../../../../../helpers";
import { localStyles } from "../styles";
import { LocalHelpHeader } from "./LocalHeader";
import { PopulatedServices } from "./PopulatedServices";
import { ms } from "../../../../../helpers/scaling";
import { QuickLinks } from "./QuickLinks";
import { ServiceProvider } from "./ServiceProvider";
import { SkeletonHome } from "../Skeleton/SkeletonHome";
import { useDispatch, useSelector } from "react-redux";
import {
  LocalHelpOnchnage,
  PopulatedServicesApi,
  QuickLinksAndServicesApi,
  ServicesListApi,
} from "../../../../../redux/actions/localhelp";

const LocalHelpHome = ({ navigation }) => {
  const mode = detectTheme();
  const dispatch = useDispatch();
  const {
    serviceProvidedData,
    populatedServices,
    quickLinks,
    serviceProvidedShowAll,
    isLoading,
    locationAddress,
  } = useSelector((state) => state.localhelp);
  const condoName = useSelector(
    (state) => state.profile?.userData?.current_unit?.condo_name
  );
  useEffect(() => {
    triggerApi();
    navigation.addListener("focus", () => resetList());
  }, []);
  const resetList = () => {
    // dispatch(LocalHelpOnchnage({ name: "populatedServices", data: [] }));
    // dispatch(LocalHelpOnchnage({ name: "quickLinks", data: [] }));
    // dispatch(LocalHelpOnchnage({ name: "serviceProvidedData", data: [] }));
  };
  const triggerApi = async () => {
    await dispatch(PopulatedServicesApi());
    await dispatch(QuickLinksAndServicesApi());
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: themes[mode]["bgColor"],
      }}
      forceInset={{ top: "never" }}
    >
      {!isLoading ? (
        <View style={{ ...localStyles.flexFull }}>
          <LocalHelpHeader {...{ locationAddress, condoName }} />
          <ScrollView
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}
            // nestedScrollEnabled
          >
            <PopulatedServices {...{ populatedServices }} />
            <QuickLinks {...{ quickLinks }} />
            <ServiceProvider
              {...{
                serviceProvided: serviceProvidedData,
                header: true,
                isShowAll: serviceProvidedShowAll,
              }}
            />
          </ScrollView>
        </View>
      ) : (
        <SkeletonHome />
      )}
    </SafeAreaView>
  );
};

export default memo(LocalHelpHome);
