'use strict'
var Scheduler = require('../services/scheduler');
var Notifications = require('./notifications');
var moment = require('moment');

let create = (patient, med, last) => {
    return {
        "patient": {
            "id": patient._id || patient.id,
            "name": patient.name
        },
        "med": {
            "name": med.name,
            "dosage": med.dosage,
            "instructions": med.instructions
        },
        "status": 'pending',
        "on": Scheduler.next(med.schedule, last),
        "created": null,
        "modified": null
    };
}

let comparer = (filter) => {
    filter = filter || {};
    return (item) => {
        let fdt = moment(filter.on);
        let idt = moment(item.on);
        return (
            (!filter.patient || item.patient.id == filter.patient)
            &&
            (!filter.status || item.status == filter.status)
            &&
            (!filter.day || (fdt.year()==idt.year() && fdt.month()==idt.month() && fdt.date()==idt.date()))
            &&
            (!filter.week || (fdt.year()==idt.year() && fdt.week()==idt.week()))
            &&
            (!filter.month || (fdt.year()==idt.year() && fdt.month()==idt.month()))
        );
    }
}

let addReminder = (patient, med, i, tods, last) => {
    if (i < tods.length) {
        var tod = tods[i++];
        console.log('*********** scheduling reminder for ' + med.name + ' for patient ' + patient.name + ' @ ' + tod);
        let reminder = create(patient, {
            "name": med.name,
            "dosage": med.dosage,
            "instructions": med.instructions,
            "schedule": {
                "frequency": med.schedule.frequency,
                "dow": med.schedule.dow,
                "tod": tod
            }
        }, last);

        return Notifications.create(reminder)
        .then(() => {
            return addReminder(patient, med, i, tods);
        })
        .catch((err) => {
            console.error(err);
        });
    }
    return new Promise((accept,reject) => accept());
}

let addMedReminder = (patient, i, meds) => {
    if (i < meds.length) {
        var med = meds[i++];
        if (med.status == 'active') {
            let tod = makeTOD(med.schedule.tod);
            return addReminder(patient, med, 0, tod)
            .then(() => {
                return addMedReminder(patient, i, meds);
            });
        }
        return addMedReminder(patient, i, meds);
    }
    return new Promise((accept,reject) => accept());
}

let makeTOD = (tod) => {
    return Object.keys(tod).filter((k) => tod[k]);
}


module.exports = {
    get(id) {
        return Notifications.getById(id);
    },
    getAll() {
        return Notifications.get();
    },
    getPatient(patient) {
        console.log('*********** get reminders for patient ' + patient.name);
        return Notifications.get()
        .then((notifications) => {
            return notifications.filter((n) => {
                //console.log(n.payload.patient.name + ' (' + n.payload.patient.id + ' == ' + patient._id + ')');
                return n.payload.patient.id == patient._id;
            }).map((n) => {
                let reminder = n.payload;
                reminder.notificationid = n.id;
                return reminder;
            });
        });
    },
    getToday() {
        return Notifications.get()
        .then((notifications) => {
            return notifications.filter(comparer({on: new Date(), day: true})).map((n) => {
                let reminder = n.payload;
                reminder.notificationid = n.id;
                return reminder;
            });
        })
        .then((data) => {
            let schedule = {
                morning: {},
                noon: {},
                evening: {},
                bedtime: {}
            };
            data.forEach((d) => {
                let on = moment(d.on);
                let tod = Scheduler.getTOD({hour: on.hour(),minute: on.minute()});
                if (!schedule[tod][d.patient.name]) {
                    schedule[tod][d.patient.name] = [];
                }
                schedule[tod][d.patient.name].push(d);
            });
            return schedule;
        });
    },
    getThisWeek() {
        return Notifications.get()
        .then((notifications) => {
            return notifications.filter(comparer({on: new Date(), week: true})).map((n) => {
                let reminder = n.payload;
                reminder.notificationid = n.id;
                return reminder;
            });
        })
        .then((data) => {
            let schedule = {
                sunday: {morning: [], noon: [], evening: [], bedtime: []},
                monday: {morning: [], noon: [], evening: [], bedtime: []},
                tuesday: {morning: [], noon: [], evening: [], bedtime: []},
                wednesday: {morning: [], noon: [], evening: [], bedtime: []},
                thursday: {morning: [], noon: [], evening: [], bedtime: []},
                friday: {morning: [], noon: [], evening: [], bedtime: []},
                saturday: {morning: [], noon: [], evening: [], bedtime: []}
            };

            data.forEach((d) => {
                let on = moment(d.on);
                let dow = Scheduler.getDOW(on.day());
                let tod = Scheduler.getTOD({hour: on.hour(),minute: on.minute()});
                schedule[dow][tod].push(d);
            });
            return schedule;
        });
    },
    getThisMonth() {
        return Notifications.get()
        .then((notifications) => {
            return notifications.filter(comparer({on: new Date(), month: true})).map((n) => {
                let reminder = n.payload;
                reminder.notificationid = n.id;
                return reminder;
            });
        });
    },
    create(patient, med, last) {
        return create(patient, med, last);
    },
    schedule(patient) {
        if (patient.status == 'active') {
            return addMedReminder(patient, 0, patient.meds);
        }
        return new Promise((a,r) => a());
    },
    reschedule(patient, med, last) {
        let tod = makeTOD(med.schedule.tod);
        return addReminder(patient, med, 0, tod, last);
    },
    reschedulePatient(patient) {
        return this.removePatient(patient)
        .then(() => {
            if (patient.status == 'active') {
                return addMedReminder(patient, 0, patient.meds);
            }
        });
    },
    complete(reminder) {
        return Notifications.clear(reminder.notificationid);
    },
    removePatient(patient) {
        return this.getPatient(patient)
        .then((reminders) => {
            let ids = reminders.map((r) => {return r.notificationid;});
            if (ids && ids.length > 0) {
                console.log('-- remove reminders for ' + patient.name);
                return Notifications.cancel(ids);
            }
        });
    },
    removeAll() {
        return Notifications.cancel();
    },
    start(cb) {
        return Notifications.start(cb);
    },
    stop() {
        return Notifications.stop();
    }
};
