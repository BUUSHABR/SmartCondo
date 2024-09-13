import ProgressBarAnimated from "react-native-progress-bar-animated";
import React, { useEffect, useState } from "react";
import { View, Dimensions, Text, FlatList } from "react-native";
import { ms } from "../../../../../helpers/scaling";
import { fonts, themes } from "../../../../../themes";
import { detectTheme } from "../../../../../helpers";
export const ProgressBar = ({ overAllRating }) => {
  const mode = detectTheme();
  const [rating, setRating] = useState([
    {
      name: "Excellent",
      value: 0,
      progressCustomStyles: {
        backgroundColor: "#3FBF62",
        borderRadius: 5,
      },
      id: 0,
    },
    {
      name: "Good",
      value: 0,
      progressCustomStyles: {
        backgroundColor: "#455A64",
        borderRadius: 5,
      },
      id: 2,
    },
    {
      name: "Average",
      value: 77,
      progressCustomStyles: {
        backgroundColor: "#FFC727",
        borderRadius: 5,
      },
      id: 3,
    },
    {
      name: "Poor",
      value: 0,
      progressCustomStyles: {
        backgroundColor: "#EB5757",
        borderRadius: 5,
      },
      id: 3,
    },
  ]);
  useEffect(() => {
    const percentage = (val) => (val / overAllRating?.rating_count) * 100;

    const ratingItems = [
      {
        name: "Excellent",
        value: percentage(overAllRating["5"]),
        progressCustomStyles: {
          backgroundColor: "#3FBF62",
          borderRadius: 5,
        },
        id: 0,
      },
      {
        name: "Good",
        value: percentage(overAllRating["3"] + overAllRating["4"]),
        progressCustomStyles: {
          backgroundColor: "#455A64",
          borderRadius: 5,
        },
        id: 2,
      },
      {
        name: "Average",
        value: percentage(overAllRating["2"]),
        progressCustomStyles: {
          backgroundColor: "#FFC727",
          borderRadius: 5,
        },
        id: 3,
      },
      {
        name: "Poor",
        value: percentage(overAllRating["1"]),
        progressCustomStyles: {
          backgroundColor: "#EB5757",
          borderRadius: 5,
        },
        id: 3,
      },
    ];
    setRating(ratingItems);
  }, [overAllRating]);
  const ratingItems = [
    {
      name: "Excellent",
      value: 100,
      progressCustomStyles: {
        backgroundColor: "#3FBF62",
        borderRadius: 5,
      },
      id: 0,
    },
    {
      name: "Good",
      value: 46,
      progressCustomStyles: {
        backgroundColor: "#455A64",
        borderRadius: 5,
      },
      id: 2,
    },
    {
      name: "Average",
      value: 77,
      progressCustomStyles: {
        backgroundColor: "#FFC727",
        borderRadius: 5,
      },
      id: 3,
    },
    {
      name: "Poor",
      value: 23,
      progressCustomStyles: {
        backgroundColor: "#EB5757",
        borderRadius: 5,
      },
      id: 3,
    },
  ];
  const renderItem = ({ item }) => {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginVertical: ms(5),
        }}
      >
        <View style={{ width: ms(90) }}>
          <Text
            style={{
              color: themes[mode]["headingColor"],
              fontSize: ms(12),
              // fontFamily: fonts.medium,
              fontWeight: "600",
              letterSpacing: 0.6,
            }}
          >
            {item?.name}
          </Text>
        </View>
        <View>
          <ProgressBarAnimated
            {...item?.progressCustomStyles}
            width={ms(230)}
            value={item?.value}
            height={ms(10)}
          />
        </View>
      </View>
    );
  };
  const keyExtractor = (item) => item.id;

  return (
    <View
      style={{
        width: "100%",
        alignItems: "center",
        marginVertical: ms(10),
      }}
    >
      <FlatList
        data={rating}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={{
          width: "100%",
          justifyContent: "center",
        }}
      />
    </View>
  );
};
