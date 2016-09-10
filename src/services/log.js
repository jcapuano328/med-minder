'use strict'

let levels = {
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
