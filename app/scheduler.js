'use strict'
var moment = require('moment');

let _days = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
let _times = ['morning','noon','evening','bedtime'];

let increment = (dt, freq) => {
    //Daily,Alternating Days,Weekly,Alternating Weeks,Monthly
    let t = 'd';
    let i = 1;
    switch(freq.toLowerCase()) {
        case 'daily':
            t = 'd';
            i = 1;
            break;
        case 'alternating days':
            t = 'd';
            i = 2;
            break;
        case 'weekly':
            t = 'w';
            i = 1;
            break;
        case 'alternating weeks':
            t = 'w';
            i = 2;
            break;
        case 'monthly':
            t = 'M';
            i = 1;
            break;
    }
    dt.add(i, t);
    return dt;
}

let mapDOW = (dow) => {
    let idx = _days.indexOf(dow.toLowerCase());
    if (idx < 0) {
        idx = moment().day();
    }
    return idx;
}
let mapTOD = (tod) => {
    switch(_times.indexOf(tod.toLowerCase())) {
        case 0:
            return {
                hour: 6,
                minute: 0,
                second: 0
            };
        case 1:
            return {
                hour: 12,
                minute: 0,
                second: 0
            };
        case 2:
            return {
                hour: 18,
                minute: 0,
                second: 0
            };
        case 3:
            return {
                hour: 22,
                minute: 0,
                second: 0
            };
        default:
            return {
                hour: 0,
                minute: 0,
                second: 0
            };
    }
}

let scheduler = (schedule, last) => {
    schedule = schedule || {};

    if (last) {
        let freq = schedule.frequency || 'Daily';
        let next = moment((last || new Date()));
        increment(next, freq);
        return next;
    }
    let dow = mapDOW(schedule.dow || 'Today');
    let tod = mapTOD(schedule.tod || 'Morning');
    let now = moment();
    let next = moment({
        year: now.year(),
        month: now.month(),
        day: now.date(),
        hour: tod.hour,
        minute: tod.minute,
        second: tod.second
    });
    if (now.day() != dow) {
        next.add(7 - (now.day() - dow), 'd');
    }
    return next;
}

module.exports = {
    next(schedule, last) {
        return scheduler(schedule, last);
    },
    days() {
        return _days;
    },
    times() {
        return _times;
    },
    getDOW(d) {
        return _days.find((day) => {
            return d == mapDOW(day);
        });
    },
    getTOD(t) {
        return _times.find((time) => {
            let mt = mapTOD(time);
            return mt.hour == t.hour && mt.minute == t.minute;
        });
    }
};
