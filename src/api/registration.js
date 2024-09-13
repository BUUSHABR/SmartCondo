import makeRequest from './index';

export function familyREGISTER({params}) {
  return makeRequest({
    uri: `/mobile/v1/units/family_member`,
    method: 'POST',
    body: JSON.stringify(params),
  });
}

export function residentREGISTER({params}) {
  return makeRequest({
    uri: `/mobile/v1/units/residents`,
    method: 'POST',
    body: JSON.stringify(params),
  });
}

export function SwapResidentPostion(id,params) {
  return makeRequest({
    uri: `/mobile/v1/units/${id}/resident_position`,
    method: "PUT",
    body: JSON.stringify(params),

  });
}


export async function DeleteResident(id) {
   return await makeRequest({
    uri: `/mobile/v1/residents/${id}/remove`,
    method: "DELETE",
  });
}
export function vehicleREGISTER({params}) {
  return makeRequest({
    uri: `/mobile/v1/residents/vehicle`,
    method: 'PUT',
    body: JSON.stringify(params),
  });
}

export function residentLIST() {
  return makeRequest({
    uri: `/mobile/v1/units/residents`,
    method: 'GET',
  });
}

export function vehicleLIST() {
  return makeRequest({
    uri: `/mobile/v1/units/vehicles`,
    method: 'GET',
  });
}

export function showRegistrationDETAILS(id) {
  return makeRequest({
    uri: `/mobile/v1/residents/${id}/details`,
    method: 'GET',
  });
}

export function SwapVehiclePostion(id,params) {
  return makeRequest({
    uri: `/mobile/v1/units/${id}/vehicle_number`,
    method: "PUT",
    body: JSON.stringify(params),
  });
}
