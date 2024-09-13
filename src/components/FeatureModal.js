import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StatusBar,
} from "react-native";

import { detectTheme } from "../helpers";
import { themes, fonts, commonColors } from "../themes";
import Modal from "react-native-modal";
import { FeatureIcon } from "../../assets/img/svgs";
import CustomButton from "./CustomButton";
import { useDispatch, useSelector } from "react-redux";
import { homePageLoader } from "../redux/actions/home";
import AsyncStorage from "@react-native-async-storage/async-storage";
homePageLoader;
const FeatureModal = (props) => {
  const { appFeature ,FeatureData} = props;
  const mode = detectTheme();
  const dispatch = useDispatch();
  return (
    <View style={{}}>
      <StatusBar backgroundColor="white" hidden={false} />
      <Modal
        isVisible={appFeature}
        animationIn="fadeIn"
        animationOut={"fadeOut"}
        style={{
          margin: 0,
          padding: 0,
          alignItems: undefined,
          justifyContent: undefined,
          flex: 1,
        }}
      >
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <View
            style={{
              backgroundColor: "white",
              height: "45%",
              width: "90%",
              borderRadius: 15,
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            <View
              style={{
                justifyContent: "flex-end",
                alignItems: "center",
                height: 250,
              }}
            >
              <FeatureIcon />
              <Text style={{ fontFamily: fonts.bold, marginTop: 20 }}>
                {FeatureData.title}
              </Text>
              <Text
                style={{
                  fontFamily: "Montserrat-Light",
                  color:
                    themes[mode][mode === "light" ? "tagLine" : "lineColor"],
                  fontSize: 12,
                  marginTop: 10,
                }}
              >
              {FeatureData.content}
              </Text>
            </View>
            <CustomButton
              title={"Ok, Buddy"}
              buttonStyle={{
                borderColor: commonColors.yellowColor,
                backgroundColor: commonColors.yellowColor,
              }}
              textStyle={{
                color: "#fff",
              }}
              handleSubmit={async () => {
                dispatch(homePageLoader("appFeature", false));
                dispatch(homePageLoader("featureData", {}));
                await AsyncStorage.removeItem("appfeature");
              }}
              disableBtn={false}
            />
          </View>
        </View>
        <View
          style={{ height: 16, backgroundColor: "rgb(58,58,58)", opacity: 0.9 }}
        ></View>
      </Modal>
    </View>
  );
};

export default FeatureModal;
