'use strict'

var Patients = require('../stores/patients');
var Reminders = require('../stores/reminders');
var log = require('./log');

module.exports = {
    cancel(reminder) {
        log.info('>>>>>> canceling reminder');
        return Reminders.remove({notificationid: reminder.id});
    },
    complete(reminder, reschedule) {
        log.info('>>>>>> completing reminder');
        return Reminders.complete({notificationid: reminder.id})
        .then(() => {
            if (reschedule) {
                log.info('>>>>>> rescheduling reminder');
                return Patients.get(reminder.payload.patient.id)
                .then((patient) => {
                    let med = patient.meds.find((m) => {
                        return reminder.payload.med.name == m.name;
                    });
                    log.info('>>>>>> med');
                    log.info(med);
                    return Reminders.reschedule(patient, med, reminder.sendAt);
                });
            }
        });
    }
};
