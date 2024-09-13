import makeRequest from "./index";

export function subscribeNotice({ id, params }) {
  return makeRequest({
    uri: `/mobile/v1/notices/${id}/subscribe`,
    method: "PUT",
    body: JSON.stringify(params),
  });
}

export function subscriptionList() {
  return makeRequest({
    uri: `/mobile/v1/notices/list`,
    method: "GET",
  });
}

export function clearAllNotifications() {
  return makeRequest({
    uri: `/mobile/v1/notifications/remove_notifications`,
    method: "DELETE",
  });
}
export function callSettings(id, params) {
  console.log(params,"pojxiwbcuwgj wjwn c");
  return makeRequest({
    uri: `/mobile/v1/residents/${id}/call_type`,
    method: "PUT",
    body: JSON.stringify(params),
  });
}
export function bleSettings(id, params) {
  console.log(params,"pojxiwbcuwgj wjwn c bleee");
  return makeRequest({
    uri: `/mobile/v1/residents/${id}/ble`,
    method: "PUT",
    body: JSON.stringify(params),
  });
}
export function notificationList() {
  return makeRequest({
    uri: `/mobile/v1/notifications/list`,
    method: "GET",
  });
}

export function notificationUpdate({ method, id, params }) {
  return makeRequest({
    uri: `/mobile/v1/notifications/${id}/update_status`,
    method: method,
    body: JSON.stringify(params),
  });
}
