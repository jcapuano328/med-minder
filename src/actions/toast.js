import types from '../constants/actionTypes';

export const toast = (message,duration) => (dispatch) => {
    dispatch({type: types.TOAST, value: {message:message,duration:duration}});
}
