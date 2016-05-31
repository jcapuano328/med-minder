'use strict'

var Patients = require('./patients');
var Reminders = require('./reminders');

let addPatient = (patients, i) => {
    if (i < patients.length) {
        var patient = patients[i++];
        patient.created = new Date();
        patient.modified = new Date();
        patient.meds.forEach((med) => {
            med.created = new Date();
            med.modified = new Date();
        });
        console.log('*********** add patient ' + patient.name);
        //console.log(l);
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
        let sample = require('./sample.json');
        console.log ('************* Load Sample Data');
        return Patients.removeAll()
        .then(() => {
            return Reminders.removeAll();
        })
        .then(() => {
            return addPatient(sample.patients, 0);
        });
    }
};
