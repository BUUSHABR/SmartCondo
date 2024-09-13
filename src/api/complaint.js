import makeRequest from './index';

export function fetchComplaintList(params) {
  console.log(params,"48girwkvnw,jhvrewv");
  return makeRequest({
    uri: `/mobile/v1/help_desks?query=${params}`,
    method: 'GET',
  });
}
// /mobile/v1/complaints/list?query=${params}
export function showComplaints(id) {
  return makeRequest({
    uri: `/mobile/v1/help_desks/${id}`,
    method: 'GET',
  });
}

export function createComplaints(params, formData) {
  console.log(params,"1223457999");
  return makeRequest({
    uri: `/mobile/v1/complaints`,
    method: 'POST',
    body: formData ? params : JSON.stringify(params),
    formData: formData,
  });
}

export function createConversation(id, params) {
  console.log("ekfekf",id,params);
  return makeRequest({
    uri: `/mobile/v1/help_desks/${id}/conversation`,
    method: 'POST',
    body: JSON.stringify(params),
  });
}

export function fetchComplaintsData() {
  return makeRequest({
    uri: `/mobile/v1/help_desk_categories`,
    method: 'GET',
  });
}
export function help_deskCategories(id){
  return makeRequest({
    uri: `/mobile/v1/help_desk_categories/${id}`,
    method: 'GET',
  });
}
export function helpDesk_Submit(id,answer,formData){
  return makeRequest({
    uri: `/mobile/v1/help_desks/${id}/submit`,
    method: 'POST',
    body: answer,
    formData: formData,
  });
}