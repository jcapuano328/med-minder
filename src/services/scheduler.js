'use strict'
var moment = require('moment');

let _days = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
let _times = ['morning','noon','evening','bedtime'];
let _tods = {
    morning: {
        hour: 6,
        minute: 0,
        second: 0
    },
    noon: {
        hour: 12,
        minute: 0,
        second: 0
    },
    evening: {
        hour: 18,
        minute: 0,
        second: 0
    },
    bedtime: {
        hour: 22,
        minute: 0,
        second: 0
    }
};

let increment = (dt, freq) => {
    //Daily,Alternating Days,Every 3 Days,Every 4 Days,Every 5 Days,Every 6 Days,Weekly,Alternating Weeks,Monthly
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
        case 'every 3 days':
            t = 'd';
            i = 3;
            break;
        case 'every 4 days':
            t = 'd';
            i = 4;
            break;
        case 'every 5 days':
            t = 'd';
            i = 5;
            break;
        case 'every 6 days':
            t = 'd';
            i = 6;
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
    dow = dow.toLowerCase();
    let idx = _days.indexOf(dow);
    if (idx < 0) {
        idx = moment().day() + (dow == 'tomorrow' ? 1 : 0);
    }
    return idx;
}
let mapTOD = (tod) => {
    return _tods[tod.toLowerCase()];
}

let scheduler = (schedule, last) => {
    schedule = schedule || {};
    let now = moment();
    let tod = mapTOD(schedule.tod || 'Morning');
    if (!last && now.hour() > tod.hour) {
        last = moment({
            year: now.year(),
            month: now.month(),
            day: now.date(),
            hour: tod.hour,
            minute: tod.minute,
            second: tod.second
        });
    }

    if (last) {
        let freq = schedule.frequency || 'Daily';
        let next = moment((last || new Date()));
        increment(next, freq);
        return next;
    }
    let dow = mapDOW(schedule.dow || 'Today');
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
        t = t || {hour: moment().hour(), minute: 0};
        let idx = 0;
        if (t.hour >= 0 && t.hour <= _tods.noon.hour) {
            idx = 0;
        } else if (t.hour >= _tods.noon.hour && t.hour < _tods.evening.hour) {
            idx = 1;
        } else if (t.hour >= _tods.evening.hour && t.hour < _tods.bedtime.hour) {
            idx = 2;
        } else {
            idx = 3;
        }
        return _times[idx];
    },
    mapTOD: mapTOD
};
