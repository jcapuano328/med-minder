import types from '../constants/actionTypes';

export const update = (med) => (dispatch) => {
    dispatch({type: types.UPDATE_MEDICATION, value: med});
}

export const remove = (med) => (dispatch) => {
    dispatch({type: types.REMOVE_MEDICATION, value: med});
}
