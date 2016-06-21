'use strict'

let levels = {
	DEBUG: 3,
	INFO: 2,
	WARN: 1,
	ERROR: 0
};
let level = levels.INFO;

module.exports = {
	levels: levels,
	level(l) {
		level = l;
	},
	debug: function(s) {
		if (level >= levels.DEBUG) {
			console.log(s);
		}
    },
	info: function(s) {
		if (level >= levels.INFO) {
			console.log(s);
		}
    },
	warn: function(s) {
		if (level >= levels.WARN) {
			console.log(s);
		}
    },
	error: function(s) {
		if (level >= levels.ERROR) {
			console.error(s);
		}
    }
};
