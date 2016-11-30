import types from '../constants/actionTypes';

export const setPeriod = (period) => (dispatch) => {
    dispatch({type: types.SET_FILTER, value: period});
}
