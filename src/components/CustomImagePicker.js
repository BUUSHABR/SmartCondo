import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Image,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { fonts, themes } from "../themes";
import ImagePicker from "react-native-image-crop-picker";
import {
  AttachmentIcon,
  CrossIcon,
  ErrorIcon,
  ImageCloseIcon,
} from "../../assets/img/svgs";
import { ms } from "../helpers/scaling";

const CustomImagePicker = (props) => {
  const {
    id,
    type,
    value,
    multiselect,
    onChange,
    error,
    isDeposit,
    name,
  } = props;
  const [ImageData, setImageData] = useState(value);
  const showError = error?.length > 5;
  const { mode } = useSelector((state) => {
    return state.profile;
  });
  useEffect(() => {
    console.log(ImageData, "imagardatatadatada");
    setImageData(value);
  });
  const onCancelImage = async (decide, dataIndex) => {
    console.log("oncancle image", decide, dataIndex);
    if (decide) {
      // let d = value;
      // await d.splice(index, 1);
      // setTimeout(() => {
      //   console.log("loggng");
      //   console.log(d, "manish");
      // }, 3000);
      let map = ImageData.filter((data, index) => {
        if (index != dataIndex) {
          return data;
        }
      });
      console.log(map, "mapmapmapmap");
      setImageData(map);
      onChange("delete-image", map, id, type);
    } else {
      onChange("delete-image", null, id, type);
    }
  };

  const selectFile = () => {
    Alert.alert("", "You can select pictures from here", [
      {
        text: "Cancel",
        onPress: () => {},
        style: "cancel",
      },
      {
        text: "Gallery",
        onPress: () => {
          ImagePicker.openPicker({
            multiple: multiselect,
            cropping: true,
            freeStyleCropEnabled: true,
            mediaType: "photo",
          }).then((image) => {
            console.log(image, "select gal img");
            onChange("image-picker", image, id, type);
          });
        },
      },
      {
        text: "Camera",
        onPress: () => {
          ImagePicker.openCamera({
            multiple: multiselect,
            width: 300,
            height: 400,
            cropping: true,
            mediaType: "photo",
            freeStyleCropEnabled: true,
          }).then((image) => {
            console.log(image, "cma img");
            onChange("image-picker", image, id, type);
          });
        },
      },
    ]);
  };

  const renderItem = ({ item, index }) => {
    console.log(item, "nciebiweiwbiwe", index);
    return (
      <View style={{ marginHorizontal: 10, paddingVertical: 20 }}>
        <Image
          style={{
            resizeMode: "cover",
            width: 70,
            height: 60,
            // marginTop: -10,
            borderRadius: 10,
            backgroundColor: themes[mode]["lightAsh"],
          }}
          // source={{
          //   uri: 'https://bms-assets.katomaran.in/ci/images/facilities/InShot_20220111_223540691.jpg',
          // }}
          source={{
            uri: item?.path,
          }}
        />
        <TouchableOpacity
          onPress={() => onCancelImage(true, index)}
          style={{
            width: 19,
            height: 19,
            borderRadius: 6,
            borderWidth: 1,
            borderColor: themes[mode]["textColor"],
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            top: 13,
            right: -7,
          }}
        >
          <ImageCloseIcon />
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <View>
      <View>
        <TouchableOpacity
          style={{
            borderRadius: 15,
            backgroundColor: "#F7F7F7",
            width: isDeposit ? 150 : "100%",
            height: isDeposit ? 70 : 100,
            justifyContent: "center",
            alignItems: "center",
            borderStyle: "dashed",
            borderWidth: 1,
            borderColor: "#282828",
          }}
          onPress={selectFile}
        >
          <Text
            style={{
              fontSize: isDeposit ? ms(10) : ms(16),
              lineHeight: ms(17),
              fontFamily: fonts.bold,
              textDecorationLine: "underline",
              color: "#282828",
              paddingBottom: 1,
              textAlign:"center",
              paddingHorizontal:10
            }}
          >
            Browse {name} file (max 10MB)
          </Text>
          <Text
            style={{
              marginTop: ms(5),
              fontSize: isDeposit ? ms(7) : ms(13),
              lineHeight: ms(17),
              fontFamily: fonts.regular,
              color: themes[mode]["lightAsh"],
              paddingBottom: ms(1),
            }}
          >
            File Support jpg,png
          </Text>
        </TouchableOpacity>
      </View>
      {showError && (
        <View style={{ flexDirection: "row", marginVertical: 5 }}>
          <ErrorIcon />
          <Text
            style={{
              ...styles.error,
              color: themes[mode]["error"],
            }}
          >
            {error}
          </Text>
        </View>
      )}
      <View
        style={{
          marginLeft: 12,
          flexDirection: "row",
          alignItems: "center",
          marginTop: 25,
          // marginBottom:10
        }}
      >
        {!multiselect && value ? <AttachmentIcon /> : null}
        <Text
          style={{
            fontFamily: fonts.medium,
            fontSize: 12,
            letterSpacing: 0.5,
            color: themes[mode]["headingColor"],
            marginHorizontal: 7,
            flexGrow: 1,
          }}
        >
          {!multiselect && value ? "File selected" : ""}
        </Text>
        {!multiselect && value ? (
          <TouchableOpacity
            onPress={() => onCancelImage(false)}
            style={{
              width: 19,
              height: 19,
              borderRadius: 6,
              borderWidth: 1,
              borderColor: themes[mode]["textColor"],
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CrossIcon color={themes[mode]["textColor"]} />
          </TouchableOpacity>
        ) : null}
        {multiselect && value && (
          <FlatList
            // initialScrollIndex={value.length > 5 ? value.length - 1 : 0}
            // removeClippedSubviews={true}
            horizontal
            data={ImageData}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            extraData={ImageData}
            // nestedScrollEnabled={true}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  error: {
    fontFamily: fonts.regular,
    fontSize: 12,
    alignSelf: "flex-start",
    marginLeft: 7,
  },
});
export default CustomImagePicker;
