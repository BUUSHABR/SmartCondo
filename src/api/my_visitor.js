import makeRequest from './index';

export const generateParams = (params = {}) => {
  const {phone, purpose} = params;
  let visitor_type = '';

  if (purpose) {
    visitor_type = purpose?.map(val => `&purpose[]=${val}`).join('');
  }
  return phone
    ? `from_time=${params.from_time}&to_time=${params.to_time}${visitor_type}&phone=${phone}&page=${params.page}&per_page=${2}`
    : `from_time=${params.from_time}&to_time=${params.to_time}${visitor_type}&page=${params.page}&per_page=${params.per_page}`;
};

export const aggsParams = (params = {}) => {
  const {from_time, to_time, purpose} = params;
  let visitor_type = '';
  if (purpose) {
    visitor_type = purpose?.map(val => `&purpose[]=${val}`).join('');
  }
  return `from_time=${from_time}&to_time=${to_time}${visitor_type}&aggs_field[]=phone`;
};

export function myVisitorList({params}) {
  return makeRequest({
    uri: `/mobile/v1/visits/unit_visitors?${generateParams(params)}`,
    method: 'GET',
  });
}

export function myVisitorsAggs({params}) {
  return makeRequest({
    uri: `/mobile/v1/visits/aggs?${aggsParams(params)}`,
    method: 'GET',
  });
}

export function showVisitorDetails(id) {
  return makeRequest({
    uri: `/mobile/v1/visits/${id}`,
    method: 'GET',
  });
}
