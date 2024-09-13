import { View, Text } from "react-native";
import React from "react";
import { ms } from "../../../../../helpers/scaling";
import { fonts, themes } from "../../../../../themes";
import { BlackStar } from "../../../../../../assets/img/svgs";
import { detectTheme } from "../../../../../helpers";
import { LocalHelpRating } from "../Components/ratings";
export const RatingInfo = ({ rating, rating_count }) => {
  const mode = detectTheme();
  return (
    <View>
      <View
        style={{
          borderWidth: 0.4,
          borderColor: "#C6CEDD",
          marginTop: ms(20),
          marginBottom: ms(5),
          marginHorizontal: ms(20),
        }}
      />

      <Text
        style={{
          color: themes[mode]["headingColor"],
          fontSize: ms(15),
          marginHorizontal: ms(20),
          fontWeight: "700",
          marginVertical: ms(10),
          letterSpacing: 0.4,
        }}
      >
        Rating and review
      </Text>

      <View style={{ flexDirection: "row", marginHorizontal: ms(20) }}>
        <View style={{ flex: 0.5 }}>
          <View
            style={{
              height: ms(35),
              width: ms(50),
              backgroundColor: "#FFC727",
              borderRadius: ms(5),
              justifyContent: "center",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginLeft: ms(5),
              }}
            >
              <BlackStar />
              <Text
                style={{
                  color: "black",
                  fontFamily: fonts.medium,
                  fontSize: ms(12),
                  fontWeight: "700",
                  letterSpacing: 0.7,
                  marginLeft: ms(5),
                }}
              >
                {rating}
              </Text>
            </View>
          </View>
        </View>
        <View style={{ flex: 2, justifyContent: "space-evenly" }}>
          <View style={{ flexDirection: "row" }}>
            <Text
              style={{
                color: "black",
                fontFamily: fonts.medium,
                fontSize: ms(12),
                fontWeight: "700",
                letterSpacing: 0.7,
              }}
            >
              {rating} out of 5
            </Text>
            <Text
              style={{
                color: themes[mode]["lightAsh"],
                fontFamily: fonts.medium,
                fontSize: ms(12),
                fontWeight: "700",
                letterSpacing: 0.7,
                marginLeft: ms(5),
              }}
            >
              {`( ${rating_count} Reviews)`}
            </Text>
          </View>
          <View style={{ alignItems: "flex-start", marginTop: ms(4) }}>
            <LocalHelpRating {...{ ratingSize: 12, readOnly: true, rating }} />
          </View>
        </View>
      </View>
      <View
        style={{
          borderWidth: 0.4,
          borderColor: "#C6CEDD",
          marginTop: ms(25),
          marginHorizontal: ms(20),
        }}
      />
    </View>
  );
};
