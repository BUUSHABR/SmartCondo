import makeRequest from "./index";

export const generateParams = (params) => {
  console.log("generateParam", params);
  let facility_status = [
    "Upcoming",
    "Confirmed",
    "Cancelled",
    "Pending",
    "Rejected",
    "Completed",
    "Expired",
    "Payment Initiated",
    "Refunded",
    "Failed",
    "Deposit Refunded",
    "Reserved",
    "Confirmed",
  ]
    ?.map((val) => `&status[]=${val}`)
    .join("");

  return `from_time=${params.from_time}&to_time=${params.to_time}&page=${
    params?.page
  }&per_page=${10}${facility_status}`;
};

export function listFacilityTypes() {
  return makeRequest({
    uri: `/mobile/v1/facilities`,
    method: "GET",
  });
}

export function facilityDetails(id) {
  return makeRequest({
    uri: `/mobile/v1/facilities/${id}`,
    method: "GET",
  });
}
export function facilitygenerateStripeToken(id) {
  return makeRequest({
    uri: `/mobile/v1/bookings/${id}/generate_stripe_token`,
    method: "POST",
  });
}

export function facilityBooking({ params }) {
  return makeRequest({
    uri: `/mobile/v1/bookings`,
    method: "POST",
    body: params,
    formData: true,
  });
}

export function bookingsList({ params }) {
  return makeRequest({
    uri: `/mobile/v1/bookings/list?${generateParams(params)}`,
    method: "GET",
  });
}

export function BookingDetails(id) {
  return makeRequest({
    uri: `/mobile/v1/bookings/${id}`,
    method: "GET",
  });
}

export function cancelBookedFacility(id) {
  return makeRequest({
    uri: `/mobile/v1/bookings/${id}/cancel`,
    method: "PUT",
  });
}

export function BookingsFilter(params) {
  return makeRequest({
    uri: `/mobile/v1/bookings/aggs?from_time=${params.from_time}&to_time=${params.to_time}`,
    method: "GET",
  });
}
export function FacilityPaymentConfig() {
  return makeRequest({
    uri: `/mobile/v1/payments/payment_config`,
    method: "GET",
  });
}
export function facilitySlotBookingsDetails(id, time) {
  console.log(id, time, "FacilitySlotBookingsDetails api");
  return makeRequest({
    uri: `/mobile/v1/facilities/${id}/booking_details?booking_time=${time}`,
    method: "GET",
  });
}

export function FacilityPayment(url, data, isApiKey, Api_Key) {
  console.log("data1234567890", data, isApiKey, Api_Key, url);
  return makeRequest({
    uri: url,
    method: "POST",
    body: JSON.stringify(data),
    Payment_Key: isApiKey,
    Payment_Api_Key: Api_Key,
  });
}
export function FacilityStripePayment(data) {
  return makeRequest({
    uri: "/mobile/v1/bookings",
    method: "POST",
    body: JSON.stringify(data),
  });
}
