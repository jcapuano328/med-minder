import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../reducers';
/*  the "store" will look like so:
    {
        patients: [], // the list of managed patients
        reminders: [],  // the list of managed reminders
        filter: {   // the filter for the schedule
            period: string
        },
        schedule: [], // the scheduled reminders for the selected period
        toast: {
            active: bool,
            message: string,
            duration: integer
        }
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
