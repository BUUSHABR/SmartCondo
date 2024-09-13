import { View, SafeAreaView, ScrollView, StatusBar, Text } from "react-native";
import React, { useEffect, memo } from "react";
import { fonts, themes } from "../../../../../themes";
import { detectTheme, FastImg } from "../../../../../helpers";
import { localStyles } from "../styles";

import commonStyles from "../../../../../styles/commonStyles";
import { WithBgHeader } from "../../../../../components";
import { ms } from "../../../../../helpers/scaling";
import { ServiceProvider } from "../Home/ServiceProvider";
import { Header } from "../Components/header";

const ServicesHome = ({route}) => {
  const mode = detectTheme();
  const {serviceProvided}=route?.params

  // const serviceProvided = [
  //   {
  //     uri:
  //       "https://docs-assets.katomaran.tech/images/smart-condo/homecleaning/2023/05/Rectangle_828.png",
  //     name: "Home Cleaning",
  //     id: 1,
  //   },
  //   {
  //     uri:
  //       "https://docs-assets.katomaran.tech/images/smart-condo/carpenter/2023/05/Rectangle_839.png",
  //     name: "Carpenter",
  //     id: 2,
  //   },
  //   {
  //     uri:
  //       "https://docs-assets.katomaran.tech/images/smart-condo/leakagecontrol/2023/05/Rectangle_828(1).png",
  //     name: "Leakage control",
  //     id: 3,
  //   },
  //   {
  //     uri:
  //       "https://docs-assets.katomaran.tech/images/smart-condo/homecleaning/2023/05/Rectangle_828.png",
  //     name: "Home Cleaning",
  //     id: 4,
  //   },
  //   {
  //     uri:
  //       "https://docs-assets.katomaran.tech/images/smart-condo/carpenter/2023/05/Rectangle_839.png",
  //     name: "Carpenter",
  //     id: 5,
  //   },
  //   {
  //     uri:
  //       "https://docs-assets.katomaran.tech/images/smart-condo/leakagecontrol/2023/05/Rectangle_828(1).png",
  //     name: "Leakage control",
  //     id: 6,
  //   },
  //   {
  //     uri:
  //       "https://docs-assets.katomaran.tech/images/smart-condo/homecleaning/2023/05/Rectangle_828.png",
  //     name: "Home Cleaning",
  //     id: 1,
  //   },
  //   {
  //     uri:
  //       "https://docs-assets.katomaran.tech/images/smart-condo/carpenter/2023/05/Rectangle_839.png",
  //     name: "Carpenter",
  //     id: 2,
  //   },
  //   {
  //     uri:
  //       "https://docs-assets.katomaran.tech/images/smart-condo/leakagecontrol/2023/05/Rectangle_828(1).png",
  //     name: "Leakage control",
  //     id: 3,
  //   },
  //   {
  //     uri:
  //       "https://docs-assets.katomaran.tech/images/smart-condo/homecleaning/2023/05/Rectangle_828.png",
  //     name: "Home Cleaning",
  //     id: 4,
  //   },
  //   {
  //     uri:
  //       "https://docs-assets.katomaran.tech/images/smart-condo/carpenter/2023/05/Rectangle_839.png",
  //     name: "Carpenter",
  //     id: 5,
  //   },
  //   {
  //     uri:
  //       "https://docs-assets.katomaran.tech/images/smart-condo/leakagecontrol/2023/05/Rectangle_828(1).png",
  //     name: "Leakage control",
  //     id: 6,
  //   },
  // ];
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: themes[mode]["bgColor"],
      }}
      forceInset={{ top: "never" }}
    >
      <WithBgHeader leftIcon containerStyle={commonStyles.headerSpacing}>
        <StatusBar
          translucent={true}
          barStyle={mode === "light" ? "dark-content" : "dark-content"}
          backgroundColor="transparent"
        />
        <View style={{ ...localStyles.flexFull, paddingHorizontal: ms(20) }}>
          <Header
            {...{
              name: "Local Help",
              content: "List of services provided near your locality",
            }}
          />
          <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
            <ServiceProvider {...{ serviceProvided }} />
          </ScrollView>
        </View>
      </WithBgHeader>
    </SafeAreaView>
  );
};

export default memo(ServicesHome);
