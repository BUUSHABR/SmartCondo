import { log } from "react-native-reanimated";
import { ticketList, ticketShow } from "../../api/feedback";
import { dateCalculate, findMinMaxDateFromSelectedFilter } from "../../helpers";
import * as RootNavigation from "../../navigation/RootNavigation";
import {
  LIST_TICKET_DATA,
  ON_RESET_FILTER,
  SET_TICKET_LOADER,
  TICKET_CHANGE,
  TICKET_RESET,
  ON_CLICK_TICKET,
} from "../actionTypes";
export const setTicketLoader = (loader) => {
  console.log(loader, "set invitr loader action");
  return (dispatch) => {
    dispatch({
      type: SET_TICKET_LOADER,
      payload: {
        loader,
      },
    });
  };
};
export const TicketList = () => {
  return (dispatch, getState) => {
    const { page, per_page, date, inviteStatus, TicketStatus } = getState()[
      "feedback"
    ];
    console.log(
      page,
      per_page,
      date,
      TicketStatus,

      "inviteStatusbhdd"
    );
    // let filteredVisitor = visitor_type?.map(item => {
    //   return visitorTypeApi(capitalize(item));
    // });
    dispatch(setTicketLoader(true));

    const params = {
      page,
      per_page,
      status: TicketStatus,
      from_time: dateCalculate(findMinMaxDateFromSelectedFilter(date).from_date)
        .from_time,
      to_time: dateCalculate(findMinMaxDateFromSelectedFilter(date).to_date)
        .to_time,
    };
    // alert(JSON.stringify(params));
    console.log(params, "invitepparam");
    ticketList({ params })
      .then((data) => {
        // alert(JSON.stringify(data));
        console.log(TicketStatus, "api ticket status", data.data);
        dispatch(setTicketLoader(false));
        const { total_entries } = data;
        dispatch({
          type: LIST_TICKET_DATA,
          payload: {
            name:
              (TicketStatus === "All" && "allTicketData") ||
              (TicketStatus === "Upcoming" && "upcomingTicketData") ||
              (TicketStatus === "Completed" && "expiredTicketData"),
            data: data.data,
            page: page,
            per_page: 30,
            totalEntries: data.total_entries,
            // page: per_page < total_entries ? page + 1 : page,
            // per_page: per_page < total_entries ? per_page : per_page,
            // totalEntries: total_entries,
          },
        });
        // dispatch(setInviteLoader(false));
      })
      .catch((err) => {
        dispatch(setTicketLoader(true));
        console.log(err, "list myvisitor data");
        ToastMessage(err[0], err[1]?.message);
      });
  };
};

export const ticketChange = ({ name, value }) => {
  console.log(name, value, "invitedata");
  return (dispatch, getState) => {
    dispatch({
      type: TICKET_CHANGE,
      payload: {
        name,
        value,
      },
    });
  };
};
export const onClickTicket = ({ name, value }) => {
  console.log(name, value, "onclickkkkkkkk");
  return (dispatch, getState) => {
    dispatch({
      type: ON_CLICK_TICKET,
      payload: {
        name,
        value,
      },
    });
  };
};

export const onResetFilter = ({ name, value }) => {
  return (dispatch, getState) => {
    dispatch({
      type: ON_RESET_FILTER,
      payload: {
        name,
        value,
      },
    });
  };
};

export const inviteReset = () => {
  return (dispatch, getState) => {
    dispatch({
      type: TICKET_RESET,
    });
  };
};


export const showTicket = (id) => {
  console.log(id, "showcomplaint id actin");
  return (dispatch, getState) => {
    ticketShow(id)
      .then((data) => {
        console.log(data.data, "show  showTicketDetail");
        dispatch({
          type: ON_CLICK_TICKET,
          payload: {
            name: "showTicketDetail",
            value: data.data,
          },
        });
      })
      .catch((err) => {
        ToastMessage(err[0], err[1]?.message);
      });
  };
};
