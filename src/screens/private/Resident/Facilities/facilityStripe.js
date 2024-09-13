import moment from "moment";
import React from "react";
import { convertToLocalDateFormat } from "../../../../helpers";
import { FacilityStripePayment } from "../../../../api/facility_booking";
import { navigate } from "../../../../navigation/RootNavigation";
import { ToastMessage } from "../../../../components";
import { FacilitySuccess } from "../../../../../assets/img/svgs";

export const StripePayment = (
  facilitiesBookingData,
  id,
  handleButton,
  amount_type,
  fixed_amount,
  rule_ids,
  amount,
  deposite_amount,
  paylater
) => {
  console.log("StripePayment Called");
  handleButton(true);

  const {
    start_date,
    start_time,
    end_time,
    comment,
    accompanied,
    slot,
    questions,
  } = facilitiesBookingData;
  console.log("submit strip questions");
  const joinDateTime = (date, time) => {
    console.log(date, time, "dtate join");
    return moment(date + " " + time, "DD/MM/YYYY hh:mm a").format();
  };
  console.log(
    moment(start_date.value).endOf("day"),
    moment(end_time.value).endOf("day"),
    "wdkjwd"
  );
  let endDay = moment(start_date.value)
    .endOf("day")
    .format("hh:mm a");
  bookings = {
    from_time: joinDateTime(
      convertToLocalDateFormat(start_date.value),
      start_time.value
    ),
    to_time: joinDateTime(
      convertToLocalDateFormat(start_date.value),
      slot == "disable" ? endDay : end_time.value
    ),
    facility_id: id,
    comment: comment["value"],
    no_of_occupants: accompanied["value"],
    through_gateway: true,
    amount: amount + (deposite_amount || 0),
    rule_ids: rule_ids,
    offline_payment: false,
    payment_type: "",
    paylater: paylater,
    answers: questions.value?.map((data) => ({
      facility_question_id: data.facility_question_id,
      answer:
        typeof data.answer == "string"
          ? data.answer
          : (data.answer.yes && true) || (data.answer.no && false),
    })),
  };
  console.log(bookings, "bookings1223232142525");
  FacilityStripePayment({ bookings: bookings })
    .then(async ({ data }) => {
      setTimeout(() => {
        handleButton(false);
      }, 2000);
      
      let Amount = amount + (deposite_amount || 0);
      console.log(
        "[Payment] WebView Url",
        Amount ,
        paylater || Amount < 1,
        Amount < 1,
      );
      if (paylater || Amount < 1) {
        setTimeout(() => {
          navigate("SuccessPage", {
            title: `Your slot is booked successfully`,
            message: `  `,
            image: <FacilitySuccess />,
            navigateTo: "FacilitiesHome",
          });
        }, 3000);
      } else {
        navigate("FacilityStripeWebView", { webViewUrl: data });
      }
    })
    .catch((err) => {
      console.log(err, "98414810840180028801283");
      setTimeout(() => {
        handleButton(false);
      }, 2000);
      let message = err[1].data ? err[1].data[0] : err[1]?.message;
      setTimeout(() => {
        ToastMessage(err[0], message);
      }, 3000);
    });
};
