import React from "react";
import { Rating } from "react-native-ratings";
import { detectTheme } from "../../../../../helpers";

export const LocalHelpRating = ({
  ratingSize,
  readOnly,
  rating,
  setRating,
}) => {
  const mode = detectTheme();
  return (
    <Rating
      size={20}
      onFinishRating={(rating) => setRating(rating)}
      imageSize={ratingSize}
      readonly={readOnly}
      startingValue={rating}
    />
  );
};
