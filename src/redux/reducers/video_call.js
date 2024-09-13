import {
  CALL_LOGS,
  ENTRIES,
  RESET,
  CALL_LOGS_INITIALIZE,
  LOADER
} from "../actionTypes";

const initialState = {
  call_logs: [],
  total_entries: 1,
  listCount: 1,
  loader:true
};

export default function(state = initialState, action) {
  switch (action.type) {
    case CALL_LOGS: {
      const { data } = action.payload;
      return {
        ...state,
        call_logs: [...state.call_logs, ...data],
        listCount: [...data].length,
      };
    }
    case CALL_LOGS_INITIALIZE: {
      const { data } = action.payload;
      if (state.call_logs.length > 0) {
        return {
          ...state,
          call_logs: [...data],
          listCount: [...data].length,
        };
      } else {
        return {
          ...state,
          call_logs: [...data],
          listCount: [...data].length,
        };
      }
    }
    case ENTRIES: {
      const { data } = action.payload;
console.log(state.listCount,"state.listCount")
      return {
        ...state,
        total_entries:
          state.listCount > 0
            ? state.total_entries + 1
            : state.total_entries,
      };
    }

    case LOADER: {
      const { data } = action.payload;
      console.log(data,"loader536728");
      return {
        ...state,
        loader:data

      };
    }
    case RESET: {
      return {
        total_entries: 1,
        call_logs: [],
        listCount: 1,

      };
    }
    default:
      return state;
  }
}
