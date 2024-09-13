import { View, Text, Image } from "react-native";
import React from "react";
import { ms } from "../../../../helpers/scaling";
import { fonts, themes } from "../../../../themes";
import { detectTheme } from "../../../../helpers";
import { LocalHelpRating } from "../LocalHelp/Components/ratings";
import { LocalButton } from "../LocalHelp/Components/button";
export const FeedBackRating = ({ id, showTicket }) => {
  const [rating, setRating] = useState(0);
  console.log(rating, "RatingView", id);
  const mode = detectTheme();
  emoji = "";
  switch (rating) {
    case 0:
    case 1:
      emoji = require("../../../../../assets/img/emoji_sad.png");
      break;
    case 2:
      emoji = require("../../../../../assets/img/emoji_average.png");
      break;
    case 3:
    case 4:
      emoji = require("../../../../../assets/img/emoji_good.png");
      break;
    case 5:
      emoji = require("../../../../../assets/img/emoji_great.png");
      break;
  }
  return (
    <View
      style={{
        // elevation: 2,
        backgroundColor: "white",
        borderRadius: ms(10),
        borderColor: themes[mode]["lightAsh"],
        borderWidth: 0.6,
        marginBottom: ms(10),
        // marginHorizontal: ms(20),
        paddingVertical: ms(20),
        width: "90%",
        alignSelf: "center",
      }}
    >
      <Text
        style={{
          color: themes[mode]["headingColor"],
          fontSize: ms(15),
          fontFamily: fonts.bold,
          alignSelf: "center",
        }}
      >
        How’s your experience so far?
      </Text>
      <Text
        style={{
          color: themes[mode]["lightAsh"],
          fontSize: ms(12),
          fontFamily: fonts.medium,
          alignSelf: "center",
          marginVertical: ms(5),
        }}
      >
        How’s your experience so far?
      </Text>
      <View
        style={{
          alignItems: "center",
          marginVertical: ms(5),
          marginTop: ms(20),
        }}
      >
        <Image
          source={emoji}
          style={{
            height: 50,
            width: 50,
          }}
        />
        <View style={{ marginTop: ms(10), width: "100%" }}>
          <LocalHelpRating
            {...{
              ratingSize: 27,
              rating: rating,
              setRating: setRating,
            }}
          />
          <View style={{ paddingHorizontal: ms(20), marginTop: ms(30) }}>
            <LocalButton
              name="Submit"
              onPress={() => {}}
              buttonStyle={{
                height: ms(40),
                backgroundColor:
                  rating != 0 ? "#FFC727" : themes[mode]["lightAsh"],
                borderRadius: ms(5),
                justifyContent: "center",
                alignItems: "center",
                marginTop: ms(20),
              }}
              textStyle={{
                color: "white",
                fontFamily: fonts.medium,
                fontSize: ms(15),
              }}
            />
          </View>
        </View>
      </View>
    </View>
  );
};
