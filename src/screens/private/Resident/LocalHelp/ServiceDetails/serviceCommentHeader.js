import React from "react";
import { View, Text } from "react-native";
import { detectTheme } from "../../../../../helpers";
import { ms } from "../../../../../helpers/scaling";
import { fonts, themes } from "../../../../../themes";
import { ProgressBar } from "../Components/ProgressBar";
import { LocalHelpRating } from "../Components/ratings";

export const ServiceCommentHeader = ({
  rating_count,
  avg_rating,
  overAllRating,
}) => {
  const mode = detectTheme();
  return (
    <View
      style={{
        marginBottom: ms(15),
      }}
    >
      <View style={{ width: "100%" }}>
        <Text
          style={{
            color: themes[mode]["headingColor"],
            fontSize: ms(38),
            fontFamily: fonts.bold,
            alignSelf: "center",
            marginBottom: ms(10),
          }}
        >
          {avg_rating}
        </Text>
        <LocalHelpRating
          {...{ ratingSize: 27, rating: avg_rating, readOnly: true }}
        />
        <Text
          style={{
            color: themes[mode]["headingColor"],
            fontSize: ms(14),
            fontFamily: fonts.medium,
            alignSelf: "center",
            marginTop: ms(15),
          }}
        >
          based on {rating_count} reviews
        </Text>
      </View>
      <View>
        <ProgressBar {...{ overAllRating }} />
      </View>
      <View
        style={{
          borderWidth: 0.4,
          borderColor: "#C6CEDD",
          marginTop: ms(15),
          marginHorizontal: ms(20),
        }}
      />
    </View>
  );
};
