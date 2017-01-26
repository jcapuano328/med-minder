import { normalize } from 'normalizr';
import * as Schemas from '../stores/schemas';
import types from '../constants/actionTypes';
import patients from '../services/patients';
import {toast} from './toast';

export const getAll = () => (dispatch) => {
    return patients.getAll()
    .then((data) => {
        let normalized = normalize(data, Schemas.Patients);
        dispatch({type: types.SET_PATIENTS, value: {ids: normalized.result, patients: normalized.entities.Patients}});
        dispatch({type: types.SET_MEDICATIONS, value: normalized.entities.Medications});
        
        return data;
    })
    .catch((err) => {
        console.error(err);
        toast(err.message || err)(dispatch);
    });
}

export const add = (patient) => (dispatch) => {
    return patients.add(patient)
    .then(() => {
        dispatch({type: types.ADD_PATIENT, value: patient});
    })
    .catch((err) => {
        console.error(err);
        toast(err.message || err)(dispatch);
    });
}

export const update = (patient) => (dispatch) => {
    dispatch({type: types.UPDATE_PATIENT, value: patient});
}

export const remove = (patient) => (dispatch) => {
    dispatch({type: types.REMOVE_PATIENT, value: patient});
}

export const setStatus = (patient, status) => (dispatch) => {
    patient.status = status == 'active';
    dispatch({type: types.UPDATE_PATIENT, value: patient});
}
