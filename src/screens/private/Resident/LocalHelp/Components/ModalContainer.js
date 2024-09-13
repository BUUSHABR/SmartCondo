import { Platform, Pressable, View, Modal, StatusBar } from "react-native";
import React from "react";
import { detectTheme } from "../../../../../helpers";
export const ModalContainer = ({ onClose, children }) => {
  const mode = detectTheme();
  return (
    <Modal animationType="fade" transparent visible onRequestClose={onClose}>
      <StatusBar
        translucent={true}
        barStyle={mode === "light" ? "dark-content" : "dark-content"}
        backgroundColor="#a7abad"
        
      />
      <Pressable
        style={[
          Platform.OS === "ios"
            ? {
                backgroundColor: "#000000",
                opacity: 0.3,
              }
            : {
                backgroundColor: "#232f34",
                opacity: 0.4,
              },
          {
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
          },
        ]}
        onPress={() => onClose(false)}
      />
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          marginTop: 22,
        }}
      >
        {children}
      </View>
    </Modal>
  );
};
