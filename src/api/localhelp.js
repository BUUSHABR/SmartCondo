import makeRequest from "./index";

export function updateLocation(body) {
  console.log(body, "[Geo Location ] updateLocation Api Body");
  return makeRequest({
    uri: `/mobile/v1/residents/update_coordinates`,
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export function populatedServices() {
  return makeRequest({
    uri: `/mobile/v1/local_helpers/most_used_service`,
    method: "GET",
  });
}

export function quickLinksAndServicesApi() {
  return makeRequest({
    uri: `/mobile/v1/local_helper_types`,
    method: "GET",
  });
}
export function ServicesList(id, page) {
  return makeRequest({
    uri: `/mobile/v1/local_helpers?local_helper_type_id=${id}&page=${page}&per_page=10`,
    method: "GET",
  });
}
export function ServicesDetails(id) {
  return makeRequest({
    uri: `/mobile/v1/local_helpers/${id}`,
    method: "GET",
  });
}
export function createRating(id, body) {
  return makeRequest({
    uri: `/mobile/v1/local_helpers/${id}/rating`,
    method: "POST",
    body: JSON.stringify(body),
  });
}
export function updateRating(id, body) {
  return makeRequest({
    uri: `/mobile/v1/local_helpers/${id}/update_rating`,
    method: "PUT",
    body: JSON.stringify(body),
  });
}
export function createEnquiry(id, body) {
  return makeRequest({
    uri: `/mobile/v1/local_helpers/${id}/enquiry`,
    method: "POST",
    body: JSON.stringify(body),
  });
}
export function fetchRating(id, page) {
  return makeRequest({
    uri: `/mobile/v1/local_helpers/${id}/fetch_ratings?page=${page}&per_page=10`,
    method: "GET",
  });
}
export function searchLocation(location) {
  return makeRequest({
    uri: `/mobile/v1/local_helpers/fetch_places?address=${location}`,
    method: "GET",
  });
}
export function overAllRating(id,page) {
  return makeRequest({
    uri: `/mobile/v1/local_helpers/${id}/ratings_count`,
    method: "GET",
  });
}
export function fetchPlace(body) {
  return makeRequest({
    uri: `/mobile/v1/local_helpers/create_search_result`,
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function fetchRecentLocation(page) {
  return makeRequest({
    uri: `/mobile/v1/local_helpers/fetch_search_result?page=${page}&per_page=10`,
    method: "GET",
  });
}
