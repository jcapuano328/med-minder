import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../reducers';
/*  the "store" will look like so:
    {
        info: {
            version: string,
            releasedate: datetime
        },        
        toast: {
            active: bool,
            message: string,
            duration: integer
        },        
        filter: {   // the filter for the schedule
            period: string
        },        
        patients: { // the list of managed patients
            sort: [ // the ordered list of patient identifiers
            ],
            table: {
                id : {
                    id: string,
                    name: string,
                    dob: datetime,
                    meds: [
                        // ordered list of medication identifiers for this patient
                    ],
                    status: string,
                    created: datetime,
                    modified: datetime                    
                },
                ...
            }
        },
        medications: {  // the list of medications
            id : {
                id: string,
                name: string,
                dosage: string,
                instructions: string,
                schedule: {
                    frequency: string, //Daily,Alternating Days,Weekly,Alternating Weeks,Monthly
                    dow: string, //Today,Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday
                    tod: {
                        morning: bool,
                        noon: bool,
                        evening: bool,
                        bedtime: bool
                    }
                },
                status: string,
                created: datetime,
                modified: datetime
            },
            ...
        },
        currentpatient: {   // currently selected patient
            id: string,
            name: string,
            dob: string/datetime,
            meds: [
                // ordered list of medication identifiers for this patient
            ]                
        },
        currentmedication: {   // currently selected medication for a patient
            id: string,
            name: string,
            dosage: string,
            instructions: string,
            schedule: {
                frequency: string, //Daily,Alternating Days,Weekly,Alternating Weeks,Monthly
                dow: string, //Today,Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday
                tod: {
                    morning: bool,
                    noon: bool,
                    evening: bool,
                    bedtime: bool
                }
            },
            status: string,
            created: datetime,
            modified: datetime
        },
        reminders: [],  // the list of managed reminders
        schedule: [] // the scheduled reminders for the selected period
    }
*/
const middlewares = [thunk];
if (process.env.NODE_ENV !== 'production') {
    const createLogger = require('redux-logger');
    const logger = createLogger();
    middlewares.push(logger);
}
const store = compose(applyMiddleware(...middlewares))(createStore)(rootReducer);

export default store;
