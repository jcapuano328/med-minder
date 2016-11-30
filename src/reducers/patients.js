import types from '../constants/actionTypes';

module.exports = (state = [], action) => {
    switch (action.type) {
    case types.SET_PATIENTS:
        return action.value;

    case types.UPDATE_PATIENT:
        return state;

    default:
        return state;
    }
}
