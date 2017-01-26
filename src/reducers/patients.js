import types from '../constants/actionTypes';

const defaultState = {
    sort: [],
    table: {}
};

module.exports = (state = defaultState, action) => {
    switch (action.type) {
    case types.SET_PATIENTS:
        return {
            sort: [...action.value.ids],
            table: {...action.value.patients}
        };

    case types.ADD_PATIENT:        
        return {
            sort: [...state.sort, action.value.id],
            table: {
                ...state.table,
                [action.value.id]: {
                    id: action.value.id,
                    status: action.value.status,
                    name: action.value.name,
                    dob: action.value.dob,
                    meds: action.value.meds,
                    created: action.value.created,
                    modified: action.value.modified
                }
            }
        };

    case types.UPDATE_PATIENT:
        return {
            sort: [...state.sort],
            table: {
                ...state.table,
                [action.value.id]: {
                    ...action.value
                }
            }
        };

    case types.REMOVE_PATIENT:
        let sort = state.sort.filter((id) => id !== action.value.id);
        let table = {...state.table};
        if (table.hasOwnProperty(action.value.id)) {
            delete table[action.value.id];
        }
        return {
            sort: sort,
            table: {...table}
        };

    default:
        return state;
    }
}
