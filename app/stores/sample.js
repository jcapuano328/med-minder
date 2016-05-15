'use strict'

var Patients = require('./patients');
var Reminders = require('./reminders');
var Scheduler = require('../scheduler');

let addReminder = (patient, med, tods) => {
    if (tods.length > 0) {
        var tod = tods.shift();
        console.log('*********** scheduling reminder for ' + med.name + ' for patient ' + patient.name + ' @ ' + tod);
        return Reminders.schedule(patient, {
            "name": med.name,
            "dosage": med.dosage,
            "instructions": med.instructions,
            "schedule": {
                "frequency": med.schedule.frequency,
                "dow": med.schedule.dow,
                "tod": tod
            }
        })
        .then(() => {
            return addReminder(patient, med, tods);
        });
    }
    return new Promise((accept,reject) => accept());
}

let addMedReminder = (patient, meds) => {
    if (meds.length > 0) {
        var med = meds.shift();
        return addReminder(patient, med, med.schedule.tod)
        .then(() => {
            return addMedReminder(patient, meds);
        });
    }
    return new Promise((accept,reject) => accept());
}

let addPatient = (patients) => {
    if (patients.length > 0) {
        var patient = patients.shift();
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
            return addMedReminder(patient, patient.meds);
        })
        .then(() => {
            return addPatient(patients);
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
            return addPatient(sample.patients);
        });
    }
};
