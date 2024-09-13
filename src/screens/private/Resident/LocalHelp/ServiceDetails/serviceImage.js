import {
  StatusBar,
  TouchableOpacity,
  View,
  Image,
  Text,
  FlatList,
  ImageBackground,
  StyleSheet,
} from "react-native";
import React, { memo, useState } from "react";
import { fonts, themes } from "../../../../../themes";
import { ms, vs } from "../../../../../helpers/scaling";
import * as RootNavigation from "../../../../../navigation/RootNavigation";
import { detectTheme } from "../../../../../helpers";
import styles from "../../../../../styles/home";
import { LocalArrow } from "../../../../../../assets/img/svgs";
import Animated from "react-native-reanimated";
import { customAnimation } from "../../../../../animation/CommonAnimation";
import { ModalContainer } from "../Components/ModalContainer";

export const ServiceImage = memo(({ banner_images }) => {
  const [image, setImage] = useState("");
  const [isModal, setIsModal] = useState(false);
  const mode = detectTheme();
  console.log("[ServiceProvider] list", banner_images);
  const renderItem = ({ item, index }) => {
    return (
      <Animated.View {...customAnimation("ZoomIn", 1000, 100, index)}>
        <TouchableOpacity
          style={{
            marginHorizontal: ms(5),
            marginVertical: ms(7),
          }}
          onPress={() => {
            setImage(item?.s3_image_path);
            setIsModal(true)
          }}
        >
          <ImageBackground
            style={{
              height: vs(60),
              width: ms(70),
              borderRadius: 50,
              justifyContent: "flex-end",
              alignItems: "center",
            }}
            imageStyle={{ borderRadius: ms(10) }}
            source={{ uri: item.s3_image_path }}
          ></ImageBackground>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const keyExtractor = (item) => item.id;

  return (
    <Animated.View
      {...customAnimation("FadeInDown", 1000, 100)}
      style={{
        paddingHorizontal: ms(20),
        marginVertical: ms(5),
        marginBottom: ms(20),
      }}
    >
      <View>
        <Text
          style={{
            ...styles.blockHead,
            color: themes[mode]["headingColor"],
            fontSize: ms(15),
            marginBottom: ms(10),
            marginTop: 0,
            marginLeft: 0,
            letterSpacing: 0.4,
            fontWeight: "700",
          }}
        >
          Photos
        </Text>
      </View>
      <FlatList
        data={banner_images}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        horizontal
        contentContainerStyle={{
          justifyContent: "center",
          alignItems: "center",
        }}
        showsHorizontalScrollIndicator={false}
      />
      {isModal && (
        <ModalContainer onClose={setIsModal}>
          <ImageBackground
            style={{
              height: vs(330),
              width: ms(330),
              borderRadius: 10,
              justifyContent: "flex-end",
              alignItems: "center",
            }}
            imageStyle={{ borderRadius: ms(10) }}
            source={{ uri: image }}
          ></ImageBackground>
        </ModalContainer>
      )}
    </Animated.View>
  );
});
