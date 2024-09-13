import makeRequest from "./index";

export const generateParams = (params = {}) => {
  let visitor_type = "";
  let stateVal = "";

  visitor_type = ["All", "Guest", "Contractor", "Delivery", "Pickup/Drop"]
    ?.map((val) => `&purpose[]=${val}`)
    .join("");

  stateVal = [
    "Upcoming",
    "Expired",
    "Blocked",
    "Cancelled",
    "Visited",
    "Rejected",
  ]
    ?.map((val) => `&state[]=${val}`)
    .join("");

  return `from_time=${params.from_time}&to_time=${
    params.to_time
  }${visitor_type}${stateVal}&page=${params.page}&per_page=${10}`;
};

export function fetchSubVisitorData(purpose) {
  return makeRequest({
    uri: `/mobile/v1/configurations/list_jsons?type=${purpose}`,
    method: "GET",
  });
}

export function createInvites(params, formData) {
  console.log(params, formData, "inviteform");
  return makeRequest({
    uri: `/mobile/v1/invites`,
    method: "POST",
    body: formData ? params : JSON.stringify(params),
    formData: formData,
  });
}

export function InviteDetails(id) {
  return makeRequest({
    uri: `/mobile/v1/invites/${id}/details`,
    method: "GET",
  });
}

export function inviteUpdateVehicle(id, value) {
  return makeRequest({
    uri: `/mobile/v1/invites/${id}`,
    method: "PUT",
    body: JSON.stringify({
      vehicle_number: value,
    })
  });
}

export function ResendInvite(id) {
  return makeRequest({
    uri: `/mobile/v1/invites/${id}/resend`,
    method: "PUT",
  });
}

export function myInviteList({ params }) {
  // alert(JSON.stringify(params))
  return makeRequest({
    uri: `/mobile/v1/invites/list?${generateParams(params)}`,
    method: "GET",
  });
}

export function cancelInvite(id) {
  return makeRequest({
    uri: `/mobile/v1/invites/${id}/cancel`,
    method: "PUT",
  });
}

export function showInvite(id) {
  return makeRequest({
    uri: `/mobile/v1/invites/${id}`,
    method: "GET",
  });
}
