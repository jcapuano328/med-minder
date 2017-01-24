import types from '../constants/actionTypes';

export const select = (patient) => (dispatch) => {
    dispatch({type: types.SELECT_PATIENT, value: patient});
}

export const create = () => (dispatch) => {
    select({
        "name": name,
        "dob": new Date(),
        "meds": [],
        "status": 'active',
        "created": new Date(),
        "modified": null
    })(dispatch);
}

export const accept = () => (dispatch,getState) => {
    const {currentpatient} = getState();
    dispatch({type: currentpatient.id ? types.UPDATE_PATIENT : types.ADD_PATIENT, value: currentpatient});
}

export const setStatus = (value) => (dispatch) => {
    dispatch({type: types.UPDATE_SELECTED_PATIENT, value: {field: 'status', value: value}});
}

export const setName = (value) => (dispatch) => {
    dispatch({type: types.UPDATE_SELECTED_PATIENT, value: {field: 'name', value: value}});
}

export const setDOB = (value) => (dispatch) => {
    dispatch({type: types.UPDATE_SELECTED_PATIENT, value: {field: 'dob', value: value}});
}
