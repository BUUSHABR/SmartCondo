import makeRequest from './index';

export function fetchAnnouncement(status) {
  return makeRequest({
    uri: `/mobile/v1/announcements?status=${status}&page=1&per_page=30`,
    method: 'GET',
  });
}
export function fetchModules() {
  return makeRequest({
    uri: `/mobile/v1/web_apps/status_v2`,
    method: 'GET',
  });
}
export function showAnnouncementDetails(id) {
  return makeRequest({
    uri: `/mobile/v1/announcements/${id}`,
    method: 'GET',
  });
}

export function fetchRecentVisitors() {
  return makeRequest({
    uri: `/mobile/v1/visits/recent_visitors`,
    method: 'GET',
  });
}

export function fetchCondoInfo() {
  return makeRequest({
    uri: `/condos/info`,
    method: 'GET',
  });
}

export function fetchSosNumbers() {
  return makeRequest({
    uri: `/mobile/v1/configurations/sos`,
    method: 'GET',
  });
}

export function fetchConfigs() {
  return makeRequest({
    uri: `/mobile/v1/configurations/configs`,
    method: 'GET',
  });
}
