import makeRequest from './index';

export function switchUNIT(requestBody) {
  console.log(requestBody,"ooioioioiekjekjenenmnme");
  return makeRequest({
    uri: `/mobile/v1/residents/switch_unit`,
    method: 'POST',
    body: JSON.stringify(requestBody),
  });
}

export function listUNIT() {
  return makeRequest({
    uri: `/mobile/v1/residents/units`,
    method: 'GET',
  });
}
