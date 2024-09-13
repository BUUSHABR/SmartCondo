import { LOCALHELP_ONCHANGE } from "../actionTypes";

const initialState = {
  locationAddress: "",
  populatedServices: [],
  quickLinks: [],
  serviceProvidedData: [],
  serviceList: [],
  serviceHeader: {
    name: "Electrician",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  serviceProvidedShowAll: true,
  isLoading: false,
  serviceDetails: {
    phone: "",
    serviceImages: [],
    userComments: [],
  },
  userComments: [],
  overAllRating: {},
  isShowAll: true,
  locationList: [],
  locationHistory: [],
  isListEndSearch: false,
  isMoreLoadingSearch: false,
  pageSearch: 1,
  isListEndService: false,
  isMoreLoadingService: false,
  pageService: 1,
  isListEndComments: false,
  isMoreLoadingComments: false,
  pageComments: 1,
};

export default function(state = initialState, action) {
  switch (action.type) {
    case LOCALHELP_ONCHANGE: {
      const { name, value } = action.payload;
      return {
        ...state,
        [name]: value,
      };
    }

    default:
      return state;
  }
}
