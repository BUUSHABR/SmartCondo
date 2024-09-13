import { View, Text } from "react-native";
import React from "react";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import { DeleteBorderIcon, ThreeDotIcon } from "../../assets/img/svgs";
import { ms } from "../helpers/scaling";
const PopupMenu = ({ menu }) => {
  const {
    Menu_name,
    menu_name_type,
    menu_options,
    menu_name_style,
    optionsContainer,
  } = menu;
  console.log(menu, "78392738928739");
  return (
    <View>
      <Menu>
        <MenuTrigger>
          {menu_name_type == "svg" ? (
            <Menu_name />
          ) : (
            <Text style={{ ...menu_name_style }}>{Menu_name}</Text>
          )}
        </MenuTrigger>
        <MenuOptions
          customStyles={{
            optionsContainer: { ...optionsContainer },
          }}
        >
          {menu_options?.map(
            ({
              onSelect,
              onSelectParams,
              isIcon,
              Icon,
              menu_name,
              menu_name_style_option,
            }) => {
              return (
                <MenuOption onSelect={() => onSelect(onSelectParams)}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    {isIcon && (
                      <View style={{ marginLeft: 10 }}>
                        <Icon />
                      </View>
                    )}
                    <Text style={{ marginLeft: 15, ...menu_name_style_option }}>
                      {menu_name}
                    </Text>
                  </View>
                </MenuOption>
              );
            }
          )}
        </MenuOptions>
      </Menu>
    </View>
  );
};

export default PopupMenu;
