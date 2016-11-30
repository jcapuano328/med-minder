import types from '../constants/actionTypes';

let defaultToast = {
    active: false,
    message: '',
    duration: 5000
};

module.exports = (state = defaultToast, action) => {
    switch (action.type) {
    case types.TOAST:
        return {
            ...state,
            active: !!action.value.message,
            message: action.value.message || '',
            duration: action.value.duration || state.duration
        };

    default:
        return state;
    }
}
