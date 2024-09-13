import React, { useState, useCallback } from "react";
import { View, Image } from "react-native";

import { detectTheme } from "../helpers";
import PaginationComponent from "./PaginationComponent";
import { HeaderOnly } from "./Header";
import { themes } from "../themes";

const renderImage = ({ ele, itemWidth, itemHeight, header }) => {
  const mode = detectTheme();
  return (
    <View
      style={{
        width: itemWidth,
        height: itemHeight,
        elevation: 1,
        backgroundColor: themes[mode]["lightAsh"],
      }}
    >
      {header && (
        <View
          style={{
            position: "absolute",
            top: 50,
            left: 15,
            zIndex: 1001,
          }}
        >
          <HeaderOnly
            showLeftIcon
            title=""
            rightText=" "
            onPressRight={() => {}}
            iconColor={themes[mode]["textColor"]}
          />
        </View>
      )}
      <Image
        style={{
          width: itemWidth,
          height: itemHeight + 100,
        }}
        source={
          ele.item?.s3_image_path
            ? {
                uri: ele.item?.s3_image_path,
              }
            : null
        }
      />
    </View>
  );
};

const BannerImage = (props) => {
  const [index, setIndex] = useState(0);
  const {
    image_url,
    itemWidth,
    itemHeight,
    dotStyle1,
    leftText,
    header,
  } = props;
  const snapItem = useCallback(
    (index) => {
      setIndex(index);
    },
    [index]
  );
  return (
    <PaginationComponent
      data={
        image_url?.length < 1
          ? [1, 2, 3, 4]
          : image_url?.length < 3
          ? [...image_url]
          : image_url
      }
      renderItem={(ele) => {
        return renderImage({ ele, itemWidth, itemHeight, header });
      }}
      onSnapToItem={(index) => {
        snapItem(index);
      }}
      currentIndex={index}
      itemHeight={itemHeight}
      itemWidth={itemWidth}
      dotStyle1={dotStyle1}
      leftText={leftText}
      enableSnap
    />
  );
};

export default BannerImage;
