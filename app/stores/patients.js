'use strict'
var DB = require('./db');

let sorter = (l,r) => {
    if (l.status < r.status) {
        return -1;
    } else if (l.status > r.status) {
        return 1;
    } else if (l.name < r.name) {
        return -1;
    } else if (l.name > r.name) {
        return 1;
    }
    return 0;
}

let comparer = (filter) => {
    filter = filter || {};
    return (item) => {
        return (!filter.status || item.status == filter.status);
    }
}

let select = (filter) => {
    let query = null;
    /*
    if (filter) {
        if (filter.status) {
            query = {
                where: {
                    and: [
                        {status: {eq: filter.status}}
                    ]
                }
            };
        }
    }
    */
    return DB.patients.find(query)
    .then((data) => {
        return (data || []).filter(comparer(filter)).sort(sorter);
    });
}

module.exports = {
    getAll() {
        return select();
    },
    getActive() {
        return select({status: 'active'});
    },
    add(patient) {
        patient.created = new Date();
        return DB.patients.add(patient);
    },
    update(patient) {
        patient.modified = new Date();
        let id = patient._id;
        return DB.patients.updateById(patient, id)
        .then(() => {
            if (!patient._id) {
                patient._id = id;
            }
        });
    },
    remove(patient) {
        if (patient._id) {
            return DB.patients.removeById(patient._id);
        }
        return new Promise((accept,reject) => accept());
    },
    removeAll() {
        return DB.patients.remove();
    },
    sort(a) {
        return a.sort(sorter);
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
                "tod": []
            },
            "status": 'active',
            "created": new Date(),
            "modified": null
        };
    },
    addMed(patient, med) {
        var idx = patient.meds.findIndex((m) => {
            return m == med || m._id == med._id;
        });
        if (idx < 0) {
            patient.meds.push(med);
        } else {
            patient.meds[idx] = med;
        }
    },
    updateMed(patient, med) {
        var idx = patient.meds.findIndex((m) => {
            return m == med || m._id == med._id;
        });
        med.modified = new Date();
        if (idx < 0) {
            patient.meds.push(med);
        } else {
            patient.meds[idx] = med;
        }
    },
    removeMed(patient, med) {
        var idx = patient.meds.findIndex((m) => {
            return m == med || m._id == med._id;
        });
        if (idx > -1) {
            patient.meds.slice(idx, 1);
        }
    }
};
