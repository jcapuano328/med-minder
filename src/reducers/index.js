import { combineReducers } from 'redux';
import patients from './patients';
import filter from './filter';
import toast from './toast';

module.exports = combineReducers({
    patients: patients,
    filter: filter,
    toast: toast
});
