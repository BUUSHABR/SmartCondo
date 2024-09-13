import React, { useRef } from "react";

import SafeAreaView from "react-native-safe-area-view";
import { WebView } from "react-native-webview";
import { connect } from "react-redux";
import { FacilitySuccess, RejectedIcon } from "../../../../../assets/img/svgs";
import { ToastMessage, WithBgHeader } from "../../../../components";
import { navigate } from "../../../../navigation/RootNavigation";
import { facility } from "../../../../redux/actions";

import commonStyles from "../../../../styles/commonStyles";

const FacilityStripeWebView = ({ route, facilityValidation }) => {
  const webviewRef = useRef(null);
  const resetBooking = () => {
    ["start_date", "start_time", "end_time", "comment", "accompanied"]?.map(
      (item) => {
        console.log("event listner logging 1");
        facilityValidation({
          name: item,
          value: item === "start_date" ? new Date() : "",
          error: "",
          stateChange: false,
        });
      }
    );
    facilityValidation({
      name: "fixed_amount",
      value: 0,
    });
    facilityValidation({
      name: "amount",
      value: 0,
    });
    facilityValidation({
      name: "rule_ids",
      value: [],
    });
    facilityValidation({
      name: "SlotStore",
      value: [],
    });
  };
  const onNavigationStateChange = (webViewState) => {
    console.log(webViewState, "onNavigationStateChange Data");
    if (webViewState?.url?.includes("success")) {
      console.log("webviewmessage close website");
      setTimeout(() => {
        console.log("webviewmessage close website222");
        resetBooking();
        navigate("BottomTab");
      }, 5000);
    }
    if (webViewState?.url?.includes("error")) {
      setTimeout(() => {
        resetBooking();
        navigate("BottomTab");
      }, 4000);
    }
    if (!webViewState?.url?.includes("payments")) {
      setTimeout(() => {
        resetBooking();
        ToastMessage(200, "Please try again later");
        navigate("BottomTab");
        console.log("suscriptionfail");
      }, 5000);
    }
  };
  console.log(
    facilityValidation,
    "FacilityStripeWebView data",
    route?.params?.webViewUrl
  );

  return (
    <SafeAreaView
      style={{
        width: "100%",
        height: "100%",
      }}
      forceInset={{ top: "never" }}
    >
      <WithBgHeader
        leftIcon
        headerTitle="Payment"
        containerStyle={{
          ...commonStyles.headerSpacing,
        }}
      >
        <WebView
          ref={webviewRef}
          source={{
            uri: route?.params?.webViewUrl,
            // "https://a30d-49-37-202-20.ngrok-free.app/payments/123/details"
          }}
          onNavigationStateChange={onNavigationStateChange}
          style={{ flex: 1 }}
        />
      </WithBgHeader>
    </SafeAreaView>
  );
};

const mapStateToProps = ({ profile: { mode }, facility }) => {
  return {
    mode,
    facility,
  };
};
const { facilityValidation } = facility;

const mapDispatchToProps = {
  facilityValidation,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FacilityStripeWebView);
