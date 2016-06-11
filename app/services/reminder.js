'use strict'

var Patients = require('../stores/patients');
var Reminders = require('../stores/reminders');

module.exports = {
    complete(reminder, reschedule) {
        return Reminders.complete(reminder.id)
        .then(() => {
            if (reschedule) {
                return Patients.get(reminder.payload.patient.id)
                .then((patient) => {
                    let med = patient.meds.find((m) => {
                        return reminder.payload.med.name == m.name;
                    });
                    return Reminders.reschedule(patient, med, reminder.sendAt);
                });
            }
        });
    }
};
