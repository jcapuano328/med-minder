'use strict'

var Patients = require('../stores/patients');
var Reminders = require('../stores/reminders');
var Notifications = require('../stores/notifications');
var log = require('./log');

module.exports = {
    start(cb) {
        return Reminders.start(cb);
    },
    stop() {
        return Reminders.stop();
    },
    schedule(reminder) {
        return Notifications.create(reminder);
    },
    cancel(reminder) {
        log.debug('>>>>>> canceling reminder');
        return Reminders.remove({notificationid: reminder.id});
    },
    complete(reminder, reschedule) {
        log.debug('>>>>>> completing reminder');
        //return Reminders.complete({notificationid: reminder.id})
        //.then(() => {
            if (reschedule) {
                log.debug('>>>>>> rescheduling reminder');
                return Patients.get(reminder.payload.patient.id)
                .then((patient) => {
                    let med = patient.meds.find((m) => {
                        return reminder.payload.med.name == m.name;
                    });
                    //log.debug('>>>>>> med');
                    //log.debug(med);
                    return Reminders.reschedule(patient, med, reminder.sendAt);
                });
            }
            return new new Promise((resolve, reject) => resolve());
        //});
    }
};
