import {LIST_UNITS, SWITCH_UNIT} from '../actionTypes';

const initialState = {
  units: [],
  switch_id: '',
  switchLoader: false,
  SwitchShow:false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case LIST_UNITS: {
      const {data} = action.payload;
      return {
        ...state,
        units: data,
      };
    }

    case SWITCH_UNIT: {
      const {name, value} = action.payload;
      console.log(name, value, 'swoitchh unint reducerr');

      return {
        ...state,
        [name]: value,
      };
    }
    default:
      return state;
  }
}
