import types from '../constants/actionTypes';

module.exports = (state = {}, action) => {
    switch (action.type) {
    case types.SELECT_PATIENT:
        return action.value;

    case types.UPDATE_SELECTED_PATIENT:
        return {
            ...state,
            [action.value.field]: action.value.value
        };

    case types.ADD_MEDICATION:
        return {
            ...state,
            meds: [
                ...state.meds,
                action.value.id
            ]
        };

    case types.UPDATE_MEDICATION:
        return {
            ...state
        };

    case types.REMOVE_MEDICATION:
        return {
            ...state,
            meds: state.meds.filter((id) => id !== action.value.id)
        };

    default:
        return state;
    }
}
