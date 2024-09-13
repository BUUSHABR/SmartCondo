import moment from "moment";
import makeRequest from "./index";

export const gateOpenClose = (id, params, ver) => {
  console.log(id, params, "gate paramrams called");
  return makeRequest({
    uri: `/mobile/${ver}/video_calls/${id}/result`,
    method: "PUT",
    body: JSON.stringify(params),
  });
};

export const joinRoom = (id, ver) => {
  return makeRequest({
    uri: `/mobile/${ver}/video_calls/${id}/token`,
    method: "GET",
  });
};

export const VideoCallReceived = (id, answer) => {
  return makeRequest({
    uri: `/mobile/v2/video_calls/${id}/status`,
    method: "PUT",
    body: JSON.stringify(answer),
  });
};

export const IsRoomActive = (id) => {
  return makeRequest({
    uri: `/mobile/v2/video_calls/${id}/details`,
    method: "GET",
  });
};

export const CallLogs = (total_entries, id) => {
  console.log(total_entries, "loggs", id);
  return makeRequest({
    uri: `/mobile/v1/call_logs/?unit_id=${id}&&page=${total_entries}&per_page=10`,
    method: "GET",
  });
};
