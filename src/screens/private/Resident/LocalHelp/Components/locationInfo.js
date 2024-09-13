import { View, Text } from "react-native";
import { LocalHelpLocation } from "../../../../../../assets/img/svgs";
import { detectTheme } from "../../../../../helpers";
import { ms, vs } from "../../../../../helpers/scaling";
import React from "react";
import { themes } from "../../../../../themes";
import PopupMenu from "../../../../../components/PopupMenu";
export const LocationInfo = ({ locationAddress, locationTitle }) => {
  const mode = detectTheme();
  const menu = {
    Menu_name: locationTitle,
    menu_name_style: {
      color: themes[mode]["lightAsh"],
      fontSize: ms(13),
      letterSpacing: 0.3,
    },
    menu_name_type: "string",
    optionsContainer: {
      paddingRight: ms(8),
      paddingVertical: vs(5),
      justifyContent: "center",
      backgroundColor: "#292929",
      borderRadius: ms(10),
    },
    menu_options: [
      {
        onSelect: () => {},
        onSelectParams: "1",
        isIcon: true,
        Icon: LocalHelpLocation,
        menu_name: locationAddress,
        menu_name_style_option: {
          color: themes[mode]["lightAsh"],
          textAlign: "center",
          fontSize: 12,
        },
      },
    ],
  };
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <LocalHelpLocation />
      {/* <Text
        style={{
          color: themes[mode]["lightAsh"],
          fontSize: ms(13),
          letterSpacing: 0.3,
          marginLeft: ms(7),
        }}
      >
        {locationAddress}
      </Text> */}
      <View style={{ marginLeft: ms(7) }}>
        <PopupMenu menu={menu} />
      </View>
    </View>
  );
};
