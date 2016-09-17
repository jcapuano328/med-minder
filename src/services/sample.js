'use strict'

var Patients = require('./patients');
var Reminders = require('./reminders');
var uuid = require('./guid');
var log = require('./log');

let addPatient = (patients, i) => {
    if (i < patients.length) {
        var patient = patients[i++];
        patient.id = uuid.v1();
        patient.created = new Date();
        patient.modified = new Date();
        patient.meds.forEach((med) => {
            med.created = new Date();
            med.modified = new Date();
        });
        log.debug('*********** add patient ' + patient.name);
        //log.debug(l);
        return Patients.add(patient)
        .then(() => {
            return Reminders.schedule(patient);
        })
        .then(() => {
            return addPatient(patients, i);
        });
    }
    return new Promise((accept,reject) => accept());
}

module.exports = {
    load() {
        let sample = require('../stores/sample.json');
        log.debug ('************* Load Sample Data');
        return Patients.removeAll()
        .then(() => {
            return Reminders.removeAll();
        })
        .then(() => {
            return addPatient(sample.patients, 0);
        });
    }
};
