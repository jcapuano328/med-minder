import moment from 'moment';
import types from '../constants/actionTypes';

let defaultFilter = {
    period: 'now',
    periods: [
        {label: 'Now', value: 'now'},
        {label: 'Today', value: 'today'},
        {label: 'This Week', value: 'week'},
        {label: 'This Month', value: 'month'}
    ]
};

module.exports = (state = defaultFilter, action) => {
    switch (action.type) {
    case types.SET_FILTER:
        return {
            ...state,
            period: action.value
        };

    default:
        return state;
    }
}
