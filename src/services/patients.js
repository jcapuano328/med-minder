'use strict'
var Store = require('../stores/store')('medminder.patients');
var uuid = require('./guid');

let orderby = ['status','name'];

module.exports = {
    getAll() {
        return Store.select(null, orderby);
    },
    getActive() {
        return Store.select({status: 'active'}, orderby);
    },
    get(id) {
        return Store.select({id: id}, orderby)
        .then((data) => {
            if (data && data.length > 0) {
                return data[0];
            }
            return data;
        });
    },
    add(patient) {
        patient.created = new Date();
        return this.getAll()
        .then((patients) => {
            patient.id = uuid.v1();
            patients.push(patient);
            return Store.save(patients)
            .then(() => {
                return patients;
            });
        });
    },
    update(patient) {
        patient.modified = new Date();
        return this.getAll()
        .then((patients) => {
            let idx = patients.findIndex((p) => p.id == patient.id);
            if (idx > -1) {
                patients[idx] = patient;
                return Store.save(patients)
                .then(() => {
                    return patients;
                });
            }
        });
    },
    remove(patient) {
        if (patient.id) {
            return this.getAll()
            .then((patients) => {
                let idx = patients.findIndex((p) => p.id == patient.id);
                if (idx > -1) {
                    patients.splice(idx,1);
                    return Store.save(patients)
                    .then(() => {
                        return patients;
                    });
                }
            });
        }
        return new Promise((accept,reject) => accept());
    },
    removeAll() {
        return Store.remove();
    },
    sort(a) {
        return a.sort(Store.sorter(orderby));
    },
    createNewPatient(name) {
        return {
            "name": name,
            "dob": new Date(),
            "meds": [],
            "status": 'active',
            "created": new Date(),
            "modified": null
        };
    },
    createNewMed(name) {
        return {
            "name": name,
            "dosage": '',
            "instructions": '',
            "schedule": {
                "frequency": '',
                "dow": '',
                "tod": {}
            },
            "status": 'active',
            "created": new Date(),
            "modified": null
        };
    },
    addMed(patient, med) {
        let idx = patient.meds.findIndex((m) => m == med || m._id == med._id);
        if (idx < 0) {
            patient.meds.push(med);
        } else {
            patient.meds[idx] = med;
        }
    },
    updateMed(patient, med) {
        let idx = patient.meds.findIndex((m) => m == med || m._id == med._id);
        med.modified = new Date();
        if (idx < 0) {
            patient.meds.push(med);
        } else {
            patient.meds[idx] = med;
        }
    },
    removeMed(patient, med) {
        let idx = patient.meds.findIndex((m) => m == med || m._id == med._id);
        if (idx > -1) {
            patient.meds.slice(idx, 1);
        }
    }
};
