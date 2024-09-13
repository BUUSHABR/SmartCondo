import React from "react";
import { StyleSheet, Dimensions, View } from "react-native";
import Pdf from "react-native-pdf";
import { ShareIcon } from "../../../../assets/img/svgs";
import { WithBgHeader } from "../../../components";
import commonStyles from "../../../styles/commonStyles";
import Share from "react-native-share";
import { themes } from "../../../themes";
import { detectTheme } from "../../../helpers";

const PdfViewer = (props) => {
  const source = props?.route?.params?.data;
  const mode = detectTheme();
  //const source = require('./test.pdf');  // ios only
  //const source = {uri:'bundle-assets://test.pdf' };
  //const source = {uri:'file:///sdcard/test.pdf'};
  //const source = {uri:"data:application/pdf;base64,JVBERi0xLjcKJc..."};
  //const source = {uri:"content://com.example.blobs/xxxxxxxx-...?offset=0&size=xxx"};
  //const source = {uri:"blob:xxxxxxxx-...?offset=0&size=xxx"};
  const ShareData = () => {
    // let shareImage = {
    //   title: "", //string
    //   message: "", //string
    //   url: data.s3_image_path, // eg.'http://img.gemejo.com/product/8c/099/cf53b3a6008136ef0882197d5f5.jpg',
    // };
    const shareOptions = {
      url: source.uri,
    }; // country code + phone number    filename: 'test' , // only for base64 file in Android  };
    Share.open(shareOptions)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        err && console.log(err);
      });
  };
  return (
    <View style={styles.container}>
      <WithBgHeader
        leftIcon
        headerTitle={source?.name?source?.name:"Documents"}
        containerStyle={{
          ...commonStyles.headerSpacing,
        }}
        rightIcon={<ShareIcon color={themes[mode]["primaryColor"]} />}
        onPressRightIcon={() => {
          ShareData();
        }}
      >
        <Pdf
          trustAllCerts={false}
          source={source}
          onLoadComplete={(numberOfPages, filePath) => {
            console.log(`Number of pages: ${numberOfPages}`);
          }}
          onPageChanged={(page, numberOfPages) => {
            console.log(`Current page: ${page}`);
          }}
          onError={(error) => {
            console.log(error);
          }}
          onPressLink={(uri) => {
            console.log(`Link pressed: ${uri}`);
          }}
          style={styles.pdf}
        />
      </WithBgHeader>
    </View>
  );
};

export default PdfViewer;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    // marginTop: 25,
  },
  pdf: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});
