import makeRequest from "./index";

export const generateParams = (params = {}) => {
  const { status } = params;
  let stateVal = "";

  if (status) {
    if (status === "All") {
      stateVal = [
        "Created",
        "In Progress",
        "Completed",
        "Closed",
        "Rejected",
        "Reopened",
      ]
        ?.map((val) => `&status[]=${val}`)
        .join("");
    } else if (status === "Completed") {
      stateVal = ["Completed", "Closed", "Rejected"]
        ?.map((val) => `&status[]=${val}`)
        .join("");
    } else {
      stateVal = ["Created", "In Progress", "Reopened"]
        ?.map((val) => `&status[]=${val}`)
        .join("");
    }
  }
  console.log(
    `from_time=${params.from_time}&to_time=${params.to_time}${stateVal}&page=${params.page}&per_page=${params.per_page}`,
    "params params"
  );
  return `from_time=${params.from_time}&to_time=${params.to_time}${stateVal}&page=${params.page}&per_page=${params.per_page}`;
};

export function ticketCategories() {
  return makeRequest({
    uri: `/mobile/v1/ticket_categories`,
    method: "GET",
  });
}

export function ticketCreate(params) {
  return makeRequest({
    uri: `/mobile/v1/tickets`,
    method: "POST",
    body: params,
    formData: true,
  });
}

export function ticketList({ params }) {
  return makeRequest({
    uri: `/mobile/v1/tickets?${generateParams(params)}`,
    method: "GET",
  });
}

export function ticketShow(id) {
  return makeRequest({
    uri: `/mobile/v1/tickets/${id}`,
    method: "GET",
  });
}

export function ticketDelete(id) {
  return makeRequest({
    uri: `/mobile/v1/tickets/${id}`,
    method: "DELETE",
  });
}
export function ticketComment(params) {
  console.log(params, "ticker  comment paramsa api");
  return makeRequest({
    uri: `/mobile/v1/ticket_comments`,
    method: "POST",
    body: params,
    formData: true,
  });
}

export function deleteTicketComment(id) {
  console.log(id, "ticker  comment paramsa api");
  return makeRequest({
    uri: `/mobile/v1/ticket_comments/${id}`,
    method: "DELETE",
  });
}
