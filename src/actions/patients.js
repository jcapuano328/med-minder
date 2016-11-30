import types from '../constants/actionTypes';
import patients from '../services/patients';
import {toast} from './toast';

export const getAll = () => (dispatch) => {
    return patients.getAll()
    .then((data) => {
        dispatch({type: types.SET_PATIENTS, value: data});
    })
    .catch((err) => {
        console.error(err);
        toast(err.message || err)(dispatch);
    });
}
