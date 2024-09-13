import makeRequest from "./index";

export function fetchProfile() {
  return makeRequest({
    uri: `/mobile/v1/residents/profile`,
    method: "GET",
  });
}
export function folderList() {
  return makeRequest({
    uri: `/mobile/v1/document_groups`,
    method: "GET",
  });
}
export function documentList(id) {
  return makeRequest({
    uri: `/mobile/v1/document_groups/${id}/documents`,
    method: "GET",
  });
}

export const updateProfile = (params,formData) => {
  console.log(params,"deljfewkfdd",formData);
  return makeRequest({
    uri: `/mobile/v1/residents/profile`,
    method: "PUT",
    body: formData ? params : JSON.stringify(params),
    formData: formData,
  });
};

export const bugReport = (params) => {
  return makeRequest({
    uri: `/mobile/v1/feedbacks`,
    method: "POST",
    body: JSON.stringify(params),
  });
};

export const deviceInfo = (params) => {
  return makeRequest({
    uri: `/mobile/v1/feedbacks/device_details`,
    method: "POST",
    body: JSON.stringify(params),
  });
};
