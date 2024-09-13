import {
  createEnquiry,
  createRating,
  fetchPlace,
  fetchRating,
  fetchRecentLocation,
  overAllRating,
  populatedServices,
  quickLinksAndServicesApi,
  searchLocation,
  ServicesDetails,
  ServicesList,
  updateLocation,
  updateRating,
} from "../../api/localhelp";
import { LOCALHELP_ONCHANGE } from "../actionTypes";
import { ToastMessage } from "../../components";
import { navigate } from "../../navigation/RootNavigation";
export const LocalHelpOnchnage = ({ name, data }) => {
  console.log(name, data, "LocalHelpOnchnage");
  return (dispatch) => {
    dispatch({
      type: LOCALHELP_ONCHANGE,
      payload: {
        value: data,
        name: name,
      },
    });
  };
};

export const PopulatedServicesApi = () => {
  return (dispatch) => {
    populatedServices()
      .then(({ data }) => {
        console.log(data, "json dataaa PopulatedServicesApi");
        dispatch({
          type: LOCALHELP_ONCHANGE,
          payload: {
            value: data,
            name: "populatedServices",
          },
        });
      })
      .catch((err) => {
        console.log(err, "errrrrrrrrrrrrrrr");
        ToastMessage(err[0], err[1]?.message);
      });
  };
};

export const QuickLinksAndServicesApi = () => {
  return (dispatch, getState) => {
    const { serviceProvidedData } = getState()["localhelp"];
    const loader = (value) =>
      dispatch({
        type: LOCALHELP_ONCHANGE,
        payload: {
          value: value,
          name: "isLoading",
        },
      });
    console.log(serviceProvidedData, "serviceProvidedData");
    !serviceProvidedData.length > 0 && loader(true);
    quickLinksAndServicesApi()
      .then(({ data }) => {
        console.log(data, "json dataaa QuickLinksAndServicesApi");
        const quickLinks = [];
        const serviceProvidedData = [];
        for (const obj of data) {
          console.log(obj, "quickLinksAndServicesApi obj", obj.id);
          if (obj?.pinned) {
            quickLinks.push({
              name: obj?.title,
              uri: obj?.icon_image?.s3_image_path,
              id: obj?.id,
              description: obj?.description,
            });
          } else {
            serviceProvidedData.push({
              name: obj?.title,
              uri: obj?.banner_image?.s3_image_path,
              id: obj?.id,
              description: obj?.description,
            });
          }
        }
        dispatch({
          type: LOCALHELP_ONCHANGE,
          payload: {
            value: quickLinks,
            name: "quickLinks",
          },
        });
        dispatch({
          type: LOCALHELP_ONCHANGE,
          payload: {
            value: serviceProvidedData,
            name: "serviceProvidedData",
          },
        });
        dispatch({
          type: LOCALHELP_ONCHANGE,
          payload: {
            value: serviceProvidedData.length > 5,
            name: "serviceProvidedShowAll",
          },
        });
        loader(false);
      })
      .catch((err) => {
        console.log(err, "errrrrrrrrrrrrrrr");
        ToastMessage(err[0], err[1]?.message);
        loader(false);
      });
  };
};

export const ServicesListApi = (service, page, focus, restrictLoader) => {
  console.log(service, "json dataaa ServicesListApi service");

  return (dispatch, getState) => {
    const { serviceList, pageService } = getState()["localhelp"];
    const loader = (value) =>
      dispatch({
        type: LOCALHELP_ONCHANGE,
        payload: {
          value: value,
          name: "isLoading",
        },
      });
    !restrictLoader && loader(true);

    dispatch({
      type: LOCALHELP_ONCHANGE,
      payload: {
        value: page != 1 && true,
        name: "isMoreLoadingService",
      },
    });
    ServicesList(service?.id, page)
      .then(({ data, total_entries }) => {
        console.log(
          data,
          "json dataaa ServicesListApi",
          total_entries != serviceList?.length,
          focus
        );

        dispatch({
          type: LOCALHELP_ONCHANGE,
          payload: {
            value:
              total_entries == serviceList?.length ||
              pageService * 10 >= total_entries,
            name: "isListEndService",
          },
        });

        dispatch({
          type: LOCALHELP_ONCHANGE,
          payload: {
            value: false,
            name: "isMoreLoadingService",
          },
        });

        (total_entries != serviceList?.length || focus) &&
          dispatch({
            type: LOCALHELP_ONCHANGE,
            payload: {
              value: [...serviceList, ...data],
              name: "serviceList",
            },
          });

        dispatch({
          type: LOCALHELP_ONCHANGE,
          payload: {
            value: {
              name: service?.name || service?.title,
              content: service?.description,
            },
            name: "serviceHeader",
          },
        });
        loader(false);
      })
      .catch((err) => {
        console.log(err, "errrrrrrrrrrrrrrr");
        ToastMessage(err[0], err[1]?.message);
        loader(false);
      });
  };
};
export const ServicesDetailsApi = (id) => {
  return (dispatch, getState) => {
    const loader = (value) =>
      dispatch({
        type: LOCALHELP_ONCHANGE,
        payload: {
          value: value,
          name: "isLoading",
        },
      });
    loader(true);
    ServicesDetails(id)
      .then(({ data }) => {
        console.log(
          data,
          "json dataaa ServicesDetailsApi",
          data?.ratings > 2,
          data?.ratings.length
        );
        dispatch({
          type: LOCALHELP_ONCHANGE,
          payload: {
            value: data,
            name: "serviceDetails",
          },
        });
        dispatch({
          type: LOCALHELP_ONCHANGE,
          payload: {
            value: data?.ratings?.length > 2,
            name: "isShowAll",
          },
        });
        loader(false);
      })
      .catch((err) => {
        console.log(err, "errrrrrrrrrrrrrrr");
        ToastMessage(err[0], err[1]?.message);
        loader(false);
      });
  };
};
export const UpdateLocation = (body, isHistory) => {
  return (dispatch) => {
    console.log(body, "[Geo Location ] before api Update Location", isHistory);
    updateLocation(body)
      .then(({ data }) => {
        console.log(data, "[Geo Location ] api Update Location Address");
        dispatch({
          type: LOCALHELP_ONCHANGE,
          payload: {
            value: data?.data?.[2] || data?.data?.[0],
            name: "locationAddress",
          },
        });
        isHistory && navigate("LocalHelpHome");
        isHistory && ToastMessage(200, "Location updated successfully");
      })
      .catch((err) => {
        console.log(err, "errrrrrrrrrrrrrrr");
        ToastMessage(err[0], err[1]?.message);
      });
  };
};

export const CreateRating = (id, body, d, d1, d2, helperListID) => {
  console.log(body, "Create rating");
  return (dispatch, getState) => {
    const { listData, pageService } = getState()["localhelp"];

    createRating(id, body)
      .then(({ data }) => {
        dispatch(ServicesDetailsApi(id));
        dispatch(ServicesListApi({ id: helperListID }, pageService, true));
      })
      .catch((err) => {
        console.log(err, "errrrrrrrrrrrrrrr");
        ToastMessage(err[0], err[1]?.message);
      });
  };
};
export const UpdateRating = (
  id,
  body,
  mainId,
  setShowEdit,
  isList,
  helperListID
) => {
  console.log(body, "update rating");
  return (dispatch, getState) => {
    const { listData, pageService } = getState()["localhelp"];

    dispatch(LocalHelpOnchnage({ name: "pageComments", data: 1 }));
    dispatch(LocalHelpOnchnage({ name: "userComments", data: [] }));
    updateRating(id, body)
      .then(({ data }) => {
        if (isList) {
          dispatch(FetchRating(mainId, 1));
          dispatch(OverAllRating(mainId));
        } else {
          dispatch(ServicesDetailsApi(mainId));
        }
        dispatch(ServicesListApi({ id: helperListID }, pageService, true));

        setShowEdit(false);
      })
      .catch((err) => {
        console.log(err, "errrrrrrrrrrrrrrr");
        ToastMessage(err[0], err[1]?.message);
        setShowEdit(false);
      });
  };
};
export const CreateEnquiry = (id, body, setIsModal, setEnquiry, isCall) => {
  console.log(body, "update rating");
  return (dispatch) => {
    createEnquiry(id, body)
      .then(({ data }) => {
        !isCall && setEnquiry("");
        !isCall && setIsModal(false);
      })
      .catch((err) => {
        console.log(err, "errrrrrrrrrrrrrrr");
        ToastMessage(err[0], err[1]?.message);
        !isCall && setIsModal(false);
      });
  };
};
export const FetchRating = (id, page = 0) => {
  return (dispatch, getState) => {
    const { userComments, pageComments } = getState()["localhelp"];

    const loader = (value) =>
      dispatch({
        type: LOCALHELP_ONCHANGE,
        payload: {
          value: value,
          name: "isLoading",
        },
      });
    loader(true);

    dispatch({
      type: LOCALHELP_ONCHANGE,
      payload: {
        value: page != 1 && true,
        name: "isMoreLoadingComments",
      },
    });
    fetchRating(id, page)
      .then(({ data, total_entries }) => {
        console.log(data, "OverAll fetch Rating");
        dispatch({
          type: LOCALHELP_ONCHANGE,
          payload: {
            value:
              total_entries == userComments?.length ||
              pageComments * 10 >= total_entries,
            name: "isListEndComments",
          },
        });

        dispatch({
          type: LOCALHELP_ONCHANGE,
          payload: {
            value: false,
            name: "isMoreLoadingComments",
          },
        });

        total_entries != userComments?.length &&
          dispatch({
            type: LOCALHELP_ONCHANGE,
            payload: {
              value: [...userComments, ...data],
              name: "userComments",
            },
          });
      })
      .catch((err) => {
        console.log(err, "errrrrrrrrrrrrrrr");
        ToastMessage(err[0], err[1]?.message);
      });
  };
};
export const OverAllRating = (id, page) => {
  return (dispatch, getState) => {
    const loader = (value) =>
      dispatch({
        type: LOCALHELP_ONCHANGE,
        payload: {
          value: value,
          name: "isLoading",
        },
      });
    loader(true);
    overAllRating(id)
      .then(({ data }) => {
        console.log(data, "OverAll ratings");
        dispatch({
          type: LOCALHELP_ONCHANGE,
          payload: {
            value: data,
            name: "overAllRating",
          },
        });
        loader(false);
      })
      .catch((err) => {
        console.log(err, "errrrrrrrrrrrrrrr");
        ToastMessage(err[0], err[1]?.message);
        loader(false);
      });
  };
};

export const SearchLocation = (location) => {
  return (dispatch) => {
    searchLocation(location)
      .then(({ data }) => {
        console.log(data, "location search");
        dispatch({
          type: LOCALHELP_ONCHANGE,
          payload: {
            value: data,
            name: "locationList",
          },
        });
      })
      .catch((err) => {
        console.log(err, "errrrrrrrrrrrrrrr");
        ToastMessage(err[0], err[1]?.message);
      });
  };
};

export const FetchPlace = (location) => {
  return (dispatch) => {
    fetchPlace(location)
      .then(({ data }) => {
        console.log(data, "location search FetchPlace");
        dispatch({
          type: LOCALHELP_ONCHANGE,
          payload: {
            value: data?.[2] || data?.[0],
            name: "locationAddress",
          },
        });
        ToastMessage(200, "Location updated successfully");

        navigate("LocalHelpHome");
      })
      .catch((err) => {
        console.log(err, "errrrrrrrrrrrrrrr");
        ToastMessage(err[0], err[1]?.message);
      });
  };
};

export const FetchRecentLocation = (page) => {
  return (dispatch, getState) => {
    const { locationHistory, pageSearch } = getState()["localhelp"];
    console.log(
      page,
      "page number fetch recent location",
      pageSearch * 10 != locationHistory?.length,
      locationHistory?.length,
      pageSearch,
      pageSearch * 10 <= locationHistory?.length
    );
    dispatch({
      type: LOCALHELP_ONCHANGE,
      payload: {
        value: page != 1 && true,
        name: "isMoreLoadingSearch",
      },
    });
    fetchRecentLocation(page)
      .then(({ data, total_entries }) => {
        console.log(
          data,
          "location search locationHistory",
          total_entries,
          "entries",
          locationHistory?.length,
          total_entries != locationHistory?.length
        );

        dispatch({
          type: LOCALHELP_ONCHANGE,
          payload: {
            value:
              total_entries == locationHistory?.length ||
              pageSearch * 10 >= total_entries,
            name: "isListEndSearch",
          },
        });

        dispatch({
          type: LOCALHELP_ONCHANGE,
          payload: {
            value: false,
            name: "isMoreLoadingSearch",
          },
        });

        total_entries != locationHistory?.length &&
          dispatch({
            type: LOCALHELP_ONCHANGE,
            payload: {
              value: [...locationHistory, ...data],
              name: "locationHistory",
            },
          });
      })
      .catch((err) => {
        console.log(err, "errrrrrrrrrrrrrrr");
        ToastMessage(err[0], err[1]?.message);
      });
  };
};
