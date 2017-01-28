import types from '../constants/actionTypes';
import patients from '../services/patients';
import {toast} from './toast';

export const select = (patient) => (dispatch) => {
    dispatch({type: types.SELECT_PATIENT, value: patient});
}

export const create = (name) => (dispatch) => {
    select({
        "name": name,
        "dob": null,
        "meds": [],
        "status": 'active',
        "created": null,
        "modified": null
    })(dispatch);
}

export const accept = () => (dispatch,getState) => {
    const {currentpatient} = getState();
    const type = currentpatient.id ? types.UPDATE_PATIENT : types.ADD_PATIENT;
    const op = type == types.ADD_PATIENT ? patients.add : patients.update;
    return op(currentpatient)
    .then(() => {
        dispatch({type: type, value: currentpatient});        
    })
    .catch((err) => {
        console.error(err);
        toast(err.message || err)(dispatch);
    });    
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
