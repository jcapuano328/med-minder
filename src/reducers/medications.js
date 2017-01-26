import types from '../constants/actionTypes';
import guid from '../services/guid';

module.exports = (state = {}, action) => {
    switch (action.type) {
    case types.SET_MEDICATIONS:
        return {
            ...action.value
        };

    case types.ADD_MEDICATION:
        action.value.id = guid.v1();
        return {
            ...state,
            [action.value.id]: {
                id: action.value.id,
                name: action.value.name,
                desc: action.value.desc
            }
        };

    case types.UPDATE_MEDICATION:
        return {
            ...state,
            [action.value.id]: {
                ...action.value
            }
        };

    case types.REMOVE_MEDICATION:
        let table = {...state};        
        if (table.hasOwnProperty(action.value.id)) {
            delete table[action.value.id];
        }
        return {
            ...table
        };

    default:
        return state;
    }
}
