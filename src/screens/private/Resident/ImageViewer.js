import { View, Text, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import ImageView from "react-native-image-viewing";
import { navigate } from "../../../navigation/RootNavigation";
const ImageViewer = (props) => {
  const [visible, setIsVisible] = useState(false);
  useEffect(() => {
    setIsVisible(true);
  }, []);
  const images = props?.route?.params?.data;
  const {
    payment_mode,
    client_key,
    country_code,
    environment,
    currency,
    merchant_account_name,
    amount,
    id,
    deposit_mode,
    approval
  } = props?.route?.params;
  console.log("akilan = lenceqncewncewcjnw",payment_mode,
  client_key,
  country_code,
  environment,
  currency,
  merchant_account_name,
  amount,
  id,);
  return (
    <View style={styles.container}>
      <ImageView
        doubleTapToZoomEnabled={false}
        images={images}
        imageIndex={0}
        visible={visible}
        onRequestClose={() => {
          props?.route?.params?.attachment
            ? navigate("FacilityPayment", {
                open: true,
                payment_mode,
                client_key,
                country_code,
                environment,
                currency,
                merchant_account_name,
                amount,
                id,
                deposit_mode,
                approval
              })
            : navigate("DocumentView");
          setIsVisible(false);
        }}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 25,
  },
  // pdf: {
  //   flex: 1,
  //   width: Dimensions.get("window").width,
  //   height: Dimensions.get("window").height,
  // },
});
export default ImageViewer;
