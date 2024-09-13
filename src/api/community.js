import makeRequest from "./index";

export function communityList(total_entries) {
  return makeRequest({
    uri: `/mobile/v1/community_posts?page=1&per_page=${total_entries}`,
    method: "GET",
  });
}
export function communityShow(id) {
  console.log(id,"E");
  return makeRequest({
    uri: `/mobile/v1/community_posts/${id}`,
    method: "GET",
  });
}

export function communityDelete(id) {
  console.log(id,"delete");
  return makeRequest({
    uri: `/mobile/v1/community_posts/${id}`,
    method: "DELETE",
  });
}
export function commentDelete(id) {
  console.log(id,"delete");
  return makeRequest({
    uri: `/mobile/v1/community_posts/${id}/remove_comments`,
    method: "DELETE",
  });
}


export function communityLike(params, id) {
  console.log(params, id, "Dwdowedkdkeneifd");
  return makeRequest({
    uri: `/mobile/v1/community_posts/${id}/likes`,
    method: "PUT",
    body: JSON.stringify(params),
    formData: false,
  });
}
export function communityLikeList(id) {
  return makeRequest({
    uri: `/mobile/v1/community_posts/${id}/likes`,
    method: "GET",
  });
}
export function communityReport(params,id) {
  return makeRequest({
    uri: `/mobile/v1/community_posts/${id}/reports`,
    method: "POST",
    body: JSON.stringify(params),
    formData: false,
  });
}
export function communityForm(params, formData) {
  console.log(params, formData, "Dwdowedkdkeneifd");
  return makeRequest({
    uri: `/mobile/v1/community_posts`,
    method: "POST",
    body: formData ? params : JSON.stringify(params),
    formData: formData,
  });
}

export function communityComment(id,params) {
  return makeRequest({
    uri: `/mobile/v1/community_posts/${id}/comments`,
    method: "POST",
    body: JSON.stringify(params),
    formData: false,
  });
}
