'use strict'

let levels = {
	TRACE: 4,
	DEBUG: 3,
	INFO: 2,
	WARN: 1,
	ERROR: 0
};
let level = levels.DEBUG;

module.exports = {
	levels: levels,
	level(l) {
		level = l;
	},
	trace(s) {
		if (level >= levels.TRACE) {
			console.log(s);
		}
    },
	debug(s) {
		if (level >= levels.DEBUG) {
			console.log(s);
		}
    },
	info(s) {
		if (level >= levels.INFO) {
			console.log(s);
		}
    },
	warn(s) {
		if (level >= levels.WARN) {
			console.log(s);
		}
    },
	error(s) {
		if (level >= levels.ERROR) {
			console.error(s);
		}
    }
};
