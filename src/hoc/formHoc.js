import { View, Text } from "react-native";
import React from "react";
import { SubmitButton } from "../components";
SubmitButton;
const FormHoc = (WrappedCompenent) => {
  const HOC = () => {
    // console.log(...props,"lsllslsllls");
    return (
      <>
        {/* <View style={{borderColor:"blue",borderWidth:1,flex:1}}> */}
          <WrappedCompenent />
          <View
            style={{
              position: "absolute",
              width: "100%",
            //   zIndex: 22,
              borderColor: "green",
              borderWidth: 1,
              bottom:0,
            }}
          >
            <SubmitButton
              buttonText={"Create"}
              //   disableBtn={disableBtn}
              //   handleSubmit={handlesubmit}
            />
          </View>
        {/* </View> */}
      </>
    );
  };
  return HOC;
};

export default FormHoc;
