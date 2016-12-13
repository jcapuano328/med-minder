import { combineReducers } from 'redux';
import info from './info';
import patients from './patients';
import filter from './filter';
import toast from './toast';

module.exports = combineReducers({
    info: info,
    patients: patients,
    filter: filter,
    toast: toast
});
