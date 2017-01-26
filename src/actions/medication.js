import types from '../constants/actionTypes';

export const select = (med) => (dispatch) => {
    dispatch({type: types.SELECT_MEDICATION, value: med});
}

export const create = (name) => (dispatch) => {
    select({
        "name": name,
        "dosage": '',
        "instructions": '',
        "schedule": {
            "frequency": '',
            "dow": '',
            "tod": {}
        },
        "status": 'active',
        "created": new Date(),
        "modified": null
    })(dispatch);
}

export const accept = () => (dispatch,getState) => {
    const {currentmedication} = getState();
    dispatch({type: currentmedication.id ? types.UPDATE_MEDICATION : types.ADD_MEDICATION, value: currentmedication});
}

export const setStatus = (value) => (dispatch) => {
    dispatch({type: types.UPDATE_SELECTED_MEDICATION, value: {field: 'status', value: value}});
}

export const setName = (value) => (dispatch) => {
    dispatch({type: types.UPDATE_SELECTED_MEDICATION, value: {field: 'name', value: value}});
}

export const setDosage = (value) => (dispatch) => {
    dispatch({type: types.UPDATE_SELECTED_MEDICATION, value: {field: 'dosage', value: value}});
}

export const setInstructions = (value) => (dispatch) => {
    dispatch({type: types.UPDATE_SELECTED_MEDICATION, value: {field: 'instructions', value: value}});
}

export const setFrequency = (value) => (dispatch) => {
    dispatch({type: types.UPDATE_SELECTED_MEDICATION, value: {field: 'frequency', value: value}});
}

export const setDayOfWeek = (value) => (dispatch) => {
    dispatch({type: types.UPDATE_SELECTED_MEDICATION, value: {field: 'dow', value: value}});
}

export const setTimeOfDay = (value) => (dispatch) => {
    dispatch({type: types.UPDATE_SELECTED_MEDICATION, value: {field: 'tod', value: value}});
}
