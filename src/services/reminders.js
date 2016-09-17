'use strict'
var Patients = require('./patients');
var Notifications = require('./notifications');
var Scheduler = require('./scheduler');
var moment = require('moment');
var log = require('./log');

let create = (patient, med, last) => {
    return {
        "patient": {
            "id": patient.id || patient.id,
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
        let idt = moment(item.sendAt);

        let ftod = Scheduler.getTOD(fdt);
        let itod = Scheduler.getTOD(idt);
        console.log(ftod + ' / ' + itod);

        return (
            (!filter.patient || item.patient.id == filter.patient)
            &&
            (!filter.status || item.status == filter.status)
            &&
            (!filter.now || (fdt.year()==idt.year() && fdt.month()==idt.month() && fdt.date()==idt.date() && ftod==itod))
            &&
            (!filter.day || (fdt.year()==idt.year() && fdt.month()==idt.month() && fdt.date()==idt.date()))
            &&
            (!filter.week || (fdt.year()==idt.year() && fdt.week()==idt.week()))
            &&
            (!filter.month || (fdt.year()==idt.year() && fdt.month()==idt.month()))
        );
    }
}

let sorter = (l,r) => {
    let lon = moment(l.sendAt);
    let ron = moment(r.sendAt);
    if (lon.isBefore(ron)) {
        return -1;
    } else if (lon.isAfter(ron)) {
        return 1;
    } else if (l.payload.patient.name < r.payload.patient.name) {
        return -1;
    } else if (l.payload.patient.name > r.payload.patient.name) {
        return 1;
    } else if (l.payload.med.name < r.payload.med.name) {
        return -1;
    } else if (l.payload.med.name > r.payload.med.name) {
        return 1;
    }
    return 0;
}

let addReminder = (patient, med, i, tods, last) => {
    if (i < tods.length) {
        var tod = tods[i++];
        log.debug('*********** scheduling reminder for ' + med.name + ' for patient ' + patient.name + ' @ ' + tod);
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
            log.error(err);
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

let getForPatient = (patient) => {
    log.debug('*********** get reminders for patient ' + patient.name);
    return Notifications.get()
    .then((notifications) => {
        return notifications.filter((n) => {
            //log.debug(n.payload.patient.name + ' (' + n.payload.patient.id + ' == ' + patient.id + ')');
            return n.payload.patient.id == patient.id;
        }).map((n) => {
            let reminder = n.payload;
            reminder.notificationid = n.id;
            return reminder;
        });
    });
}

let removeForPatient = (patient) => {
    return getForPatient(patient)
    .then((reminders) => {
        let ids = reminders.map((r) => r.notificationid||r.id);
        if (ids && ids.length > 0) {
            log.debug('-- remove reminders for ' + patient.name);
            return Notifications.cancel(ids);
        }
    });
}


module.exports = {
    get(id) {
        return Notifications.getById(id);
    },
    getAll() {
        return Notifications.get()
        .then((data) => {
            return data.sort(sorter);
        });
    },
    getNow() {
        let tod = Scheduler.getTOD();
        return Notifications.get()
        .then((notifications) => {
            let t = Scheduler.mapTOD(tod);
            let now = moment({hour: t.hour, minute: t.minute, second: t.second});
            return notifications.filter(comparer({on: now, now: true})).map((n) => {
                let reminder = n.payload;
                reminder.notificationid = n.id;
                return reminder;
            });
        })
        .then((data) => {
            let schedule = {};
            schedule[tod] = {};
            data.forEach((d) => {
                if (!schedule[tod][d.patient.name]) {
                    schedule[tod][d.patient.name] = [];
                }
                schedule[tod][d.patient.name].push(d);
            });
            return schedule;
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
    schedule(item) {
        if (item.status == 'active') {
            return addMedReminder(item, 0, item.meds);
        } else if (item.patient) {
            return Notifications.create(item);
        }
        return new Promise((a,r) => a());
    },
    reschedule(patient, med, last) {
        let tod = makeTOD(med.schedule.tod);
        return addReminder(patient, med, 0, tod, last);
    },
    reschedulePatient(patient) {
        return removeForPatient(patient)
        .then(() => {
            if (patient.status == 'active') {
                return addMedReminder(patient, 0, patient.meds);
            }
        });
    },
    complete(reminder, reschedule) {
        log.debug('>>>>>> completing reminder');
        //return Reminders.complete({notificationid: reminder.id})
        //.then(() => {
            if (reschedule) {
                log.debug('>>>>>> rescheduling reminder');
                return Patients.get(reminder.payload.patient.id)
                .then((patient) => {
                    let med = (patient.meds||[]).find((m) => reminder.payload.med.name == m.name);
                    if (med) {
                        //log.debug('>>>>>> med');
                        //log.debug(med);
                        return this.reschedule(patient, med, reminder.sendAt);
                    }
                });
            }
            return new Promise((resolve, reject) => resolve());
        //});
    },
    cancel(reminder) {
        return this.remove(reminder);
    },
    remove(reminder) {
        return Notifications.cancel([reminder.notificationid||reminder.id]);
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
