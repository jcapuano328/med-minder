'use strict'
var DB = require('./db');
var Scheduler = require('../scheduler');
var moment = require('moment');

let sorter = (l,r) => {
    var lon = moment(l.on);
    var ron = moment(r.on);
    if (l.status < r.status) {
        return 1;
    } else if (l.status > r.status) {
        return -1;
    } else if (lon.isBefore(ron)) {
        return 1;
    } else if (lon.isAfter(ron)) {
        return -1;
    } else if (l.name < r.name) {
        return -1;
    } else if (l.name > r.name) {
        return 1;
    }
    return 0;
}

let comparer = (filter) => {
    return (item) => {
        let fdt = moment(filter.on);
        let idt = moment(item.on);
        return (
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

let select = (filter) => {
    let query = null;
    /*
    if (filter) {
        query = {
            where = {
                and: []
            }
        };
        if (filter.status) {
            query.where.and.push({status: {eq: filter.status}});
        }
        if (filter.on) {
            query.where.and.push({status: {on: moment(filter.on).format('YYYY-MM-DD')}});
        }
    }
    */
    return DB.reminders.find(query)
    .then((data) => {
        return (data || []).filter(comparer(filter)).sort(sorter);
    });
}

module.exports = {
    getAll() {
        return select();
    },
    getActive() {
        return select({status: 'pending'});
    },
    getToday() {        
        return select({/*status: 'pending', */on: new Date(), day: true})
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
                if (!schedule[tod][d.patient]) {
                    schedule[tod][d.patient] = [];
                }
                schedule[tod][d.patient].push(d);
            });
            return schedule;
        });
    },
    getThisWeek() {
        return select({/*status: 'pending', */on: new Date(), week: true})
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
        return select({/*status: 'pending', */on: new Date(), month: true});
    },
    add(reminder) {
        reminder.created = new Date();
        return DB.reminders.add(reminder);
    },
    update(reminder) {
        reminder.modified = new Date();
		let id = reminder._id;
        return DB.reminders.updateById(reminder, id)
		.then(() => {
			reminder._id = id;
		});
    },
    remove(reminder) {
        if (reminder._id) {
            return DB.reminders.removeById(reminder._id);
        }
        return new Promise((accept,reject) => accept());
    },
    removeAll() {
        return DB.reminders.remove();
    },
    schedule(patient, med, last) {
        let reminder = {
            "patient": patient.name,
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
        return this.add(reminder);
    }
};
