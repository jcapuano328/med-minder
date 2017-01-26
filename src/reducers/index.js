import { combineReducers } from 'redux';
import info from './info';
import toast from './toast';
import filter from './filter';
import patients from './patients';
import patient from './patient';
import medications from './medications';
import medication from './medication';

module.exports = combineReducers({
    info: info,        
    toast: toast,
    filter: filter,
    patients: patients,
    currentpatient: patient,
    medications: medications,
    currentmedication: medication,    
});