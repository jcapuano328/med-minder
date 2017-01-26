import types from '../constants/actionTypes';

module.exports = (state = {}, action) => {
    switch (action.type) {
    case types.SELECT_MEDICATION:
        return action.value;

    case types.UPDATE_SELECTED_MEDICATION:
        return {
            ...state,
            [action.value.field]: action.value.value
        };

    default:
        return state;
    }
}
