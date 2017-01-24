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
