import {
  TICKET_RESET,
  LIST_TICKET_DATA,
  ON_RESET_FILTER,
  SET_TICKET_LOADER,
  ON_CLICK_TICKET,
} from "../actionTypes";

const initialState = {
  subTicketTypeArr: [],
  subTicketOrgArr: [],
  ticketLoader: true,
  allTicketData: [],
  upcomingTicketData: [],
  expiredTicketData: [],
  TicketStatus: "All",
  TicketFilter: ["date", "days", "visitor_type"],
  page: 1,
  per_page: 30,
  from_time: new Date(),
  to_time: new Date(),
  totalEntries: 0,
  phone: "",
  days: 30,
  // date: true,

  date: ["this_month"],
  Ticket_type: ["all"],
  showCancelButton: true,
  TicketDetails: {},
  showTicketDetail:{}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_TICKET_LOADER: {
      const { loader } = action.payload;
      return {
        ...state,
        ticketLoader: loader,
      };
    }
    case LIST_TICKET_DATA: {
      const { name, data, page, per_page, totalEntries } = action.payload;
      console.log(totalEntries, "ttttttttttttttttt",name, page, per_page, totalEntries,data);
      let arr1;
      if (totalEntries < 30) {
        arr1 = data;
      } else if (totalEntries == 0 || state[name].length < totalEntries) {
        arr1 = data.length > 0 && [...new Set([...state[name], ...data])];
      } else if (state.totalEntries != totalEntries) {
        arr1 = data;
      } else {
        console.log("elseee");
        arr1 = state[name];
      }
      console.log({ ...state,
        [name]: arr1,
        page,
        per_page,
        totalEntries,},"kfjfejfef");
      return {
        ...state,
        [name]: arr1,
        page,
        per_page,
        totalEntries,
      };
    }
    case ON_RESET_FILTER: {
      const { name, value } = action.payload;
      return {
        ...state,
        [name]: [value],
      };
    }

    case TICKET_RESET: {
      console.log("reset called33");
      return {
        ...initialState,
      };
    }
    case ON_CLICK_TICKET: {
      const { name, value } = action.payload;
      console.log(name, value, state, "onclick inviteeee");
      let updatedData = "";

      if (name === "date") {
        console.log(state[name].includes(value.toString()), "check existtttt");
        updatedData = {
          ...state,
          [name]: state[name].includes(value.toString())
            ? state[name].filter((item) => item !== value)
            : [...state[name], value],
        };
      } else {
        console.log("elaseeee");
        updatedData = {
          ...state,
          [name]: value,
        };
      }
      return updatedData;
    }

    default:
      return state;
  }
}
