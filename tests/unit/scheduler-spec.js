'use strict';
var chai = require('chai'),
	expect = chai.expect,
	sinon = require('sinon'),
	sandbox = require('sandboxed-module'),
	moment = require('moment');
chai.use(require('sinon-chai'));

describe('Scheduler', () => {
	var env = {};
	beforeEach(() => {
		env = {};
		env.schedule = {};

		env.now = moment();
		//env.date = moment({year: 2016, month: 5, day: 12, hour: 13, minute: 25});
		//env.moment = sinon.stub();
		env.scheduler = sandbox.require('../../src/services/scheduler', {
			requires: {
				moment: moment
			}
		});
    });

	describe('Daily', () => {
		beforeEach(() => {
			env.schedule.frequency = 'Daily';
		});

		describe('first', () => {
			describe('Sunday', () => {
				beforeEach(() => {
					env.schedule.dow = 'Sunday';
				});
				describe('Morning', () => {
					beforeEach(() => {
						env.schedule.tod = 'Morning';
						env.on = env.scheduler.next(env.schedule);
					});
					it('should be the next sunday @ 0600', () => {
						expect(env.on.year()).to.equal(env.now.year());
						expect(env.on.month()).to.equal(env.now.month());
						expect(env.on.date()).to.equal(env.now.date() + (7-env.now.day()));
						expect(env.on.day()).to.equal(0);	// sunday
						expect(env.on.hour()).to.equal(6);
						expect(env.on.minute()).to.equal(0);
						expect(env.on.second()).to.equal(0);
					});
				});

				describe('Evening', () => {
					beforeEach(() => {
						env.schedule.tod = 'Evening';
						env.on = env.scheduler.next(env.schedule);
					});
					it('should be the next sunday @ 1800', () => {
						expect(env.on.year()).to.equal(env.now.year());
						expect(env.on.month()).to.equal(env.now.month());
						expect(env.on.date()).to.equal(env.now.date() + (7-env.now.day()));
						expect(env.on.day()).to.equal(0);	// sunday
						expect(env.on.hour()).to.equal(18);
						expect(env.on.minute()).to.equal(0);
						expect(env.on.second()).to.equal(0);
					});
				});
			});

			describe('Wednesday', () => {
				beforeEach(() => {
					env.schedule.dow = 'Wednesday';
				});
				describe('Morning', () => {
					beforeEach(() => {
						env.schedule.tod = 'Morning';
						env.on = env.scheduler.next(env.schedule);
					});
					it('should be the next wednesday @ 0600', () => {
						expect(env.on.year()).to.equal(env.now.year());
						expect(env.on.month()).to.equal(env.now.month());
						expect(env.on.date()).to.equal(env.now.date() + (7 - env.now.day() + 3));
						expect(env.on.day()).to.equal(3);	// wednesday
						expect(env.on.hour()).to.equal(6);
						expect(env.on.minute()).to.equal(0);
						expect(env.on.second()).to.equal(0);
					});
				});

				describe('Evening', () => {
					beforeEach(() => {
						env.schedule.tod = 'Evening';
						env.on = env.scheduler.next(env.schedule);
					});
					it('should be the next wednesday @ 1800', () => {
						expect(env.on.year()).to.equal(env.now.year());
						expect(env.on.month()).to.equal(env.now.month());
						expect(env.on.date()).to.equal(env.now.date() + (7 - env.now.day() + 3));
						expect(env.on.day()).to.equal(3);	// wednesday
						expect(env.on.hour()).to.equal(18);
						expect(env.on.minute()).to.equal(0);
						expect(env.on.second()).to.equal(0);
					});
				});
			});
		});

		describe('subsequent', () => {
			beforeEach(() => {
				env.last = moment({
					year: env.now.year(),
					month: env.now.month(),
					day: env.now.date()
				});
			});

			describe('Sunday', () => {
				beforeEach(() => {
					env.schedule.dow = 'Sunday';
					env.last.date(env.now.date() + (7 - env.now.day()));
				});
				describe('Morning', () => {
					beforeEach(() => {
						env.schedule.tod = 'Morning';
						env.last.hour(6);env.last.minute(0);env.last.second(0);
						env.on = env.scheduler.next(env.schedule,env.last);
					});
					it('should be the next monday @ 0600', () => {
						expect(env.on.year()).to.equal(env.now.year());
						expect(env.on.month()).to.equal(env.now.month());
						expect(env.on.date()).to.equal(env.now.date() + (7-env.now.day()+1));
						expect(env.on.day()).to.equal(1);	// monday
						expect(env.on.hour()).to.equal(6);
						expect(env.on.minute()).to.equal(0);
						expect(env.on.second()).to.equal(0);
					});
				});

				describe('Evening', () => {
					beforeEach(() => {
						env.schedule.tod = 'Evening';
						env.last.hour(18);env.last.minute(0);env.last.second(0);
						env.on = env.scheduler.next(env.schedule,env.last);
					});
					it('should be the next monday @ 1800', () => {
						expect(env.on.year()).to.equal(env.now.year());
						expect(env.on.month()).to.equal(env.now.month());
						expect(env.on.date()).to.equal(env.now.date() + (7-env.now.day()+1));
						expect(env.on.day()).to.equal(1);	// monday
						expect(env.on.hour()).to.equal(18);
						expect(env.on.minute()).to.equal(0);
						expect(env.on.second()).to.equal(0);
					});
				});
			});

			describe('Wednesday', () => {
				beforeEach(() => {
					env.schedule.dow = 'Wednesday';
					env.last.date(env.now.date() + (7 - env.now.day() + 3));
				});
				describe('Morning', () => {
					beforeEach(() => {
						env.schedule.tod = 'Morning';
						env.last.hour(6);env.last.minute(0);env.last.second(0);
						env.on = env.scheduler.next(env.schedule,env.last);
					});
					it('should be the next thursday @ 0600', () => {
						expect(env.on.year()).to.equal(env.now.year());
						expect(env.on.month()).to.equal(env.now.month());
						expect(env.on.date()).to.equal(env.now.date() + (7 - env.now.day() + 4));
						expect(env.on.day()).to.equal(4);	// thursday
						expect(env.on.hour()).to.equal(6);
						expect(env.on.minute()).to.equal(0);
						expect(env.on.second()).to.equal(0);
					});
				});

				describe('Evening', () => {
					beforeEach(() => {
						env.schedule.tod = 'Evening';
						env.last.hour(18);env.last.minute(0);env.last.second(0);
						env.on = env.scheduler.next(env.schedule,env.last);
					});
					it('should be the next thursday @ 1800', () => {
						expect(env.on.year()).to.equal(env.now.year());
						expect(env.on.month()).to.equal(env.now.month());
						expect(env.on.date()).to.equal(env.now.date() + (7 - env.now.day() + 4));
						expect(env.on.day()).to.equal(4);	// thursday
						expect(env.on.hour()).to.equal(18);
						expect(env.on.minute()).to.equal(0);
						expect(env.on.second()).to.equal(0);
					});
				});
			});
		});
	});

	describe('Alternating Days', () => {
		beforeEach(() => {
			env.schedule.frequency = 'Alternating Days';
		});

		describe('first', () => {
			describe('Sunday', () => {
				beforeEach(() => {
					env.schedule.dow = 'Sunday';
				});
				describe('Morning', () => {
					beforeEach(() => {
						env.schedule.tod = 'Morning';
						env.on = env.scheduler.next(env.schedule);
					});
					it('should be the next sunday @ 0600', () => {
						expect(env.on.year()).to.equal(env.now.year());
						expect(env.on.month()).to.equal(env.now.month());
						expect(env.on.date()).to.equal(env.now.date() + (7-env.now.day()));
						expect(env.on.day()).to.equal(0);	// sunday
						expect(env.on.hour()).to.equal(6);
						expect(env.on.minute()).to.equal(0);
						expect(env.on.second()).to.equal(0);
					});
				});

				describe('Evening', () => {
					beforeEach(() => {
						env.schedule.tod = 'Evening';
						env.on = env.scheduler.next(env.schedule);
					});
					it('should be the next sunday @ 1800', () => {
						expect(env.on.year()).to.equal(env.now.year());
						expect(env.on.month()).to.equal(env.now.month());
						expect(env.on.date()).to.equal(env.now.date() + (7-env.now.day()));
						expect(env.on.day()).to.equal(0);	// sunday
						expect(env.on.hour()).to.equal(18);
						expect(env.on.minute()).to.equal(0);
						expect(env.on.second()).to.equal(0);
					});
				});
			});

			describe('Wednesday', () => {
				beforeEach(() => {
					env.schedule.dow = 'Wednesday';
				});
				describe('Morning', () => {
					beforeEach(() => {
						env.schedule.tod = 'Morning';
						env.on = env.scheduler.next(env.schedule);
					});
					it('should be the next wednesday @ 0600', () => {
						expect(env.on.year()).to.equal(env.now.year());
						expect(env.on.month()).to.equal(env.now.month());
						expect(env.on.date()).to.equal(env.now.date() + (7 - env.now.day() + 3));
						expect(env.on.day()).to.equal(3);	// wednesday
						expect(env.on.hour()).to.equal(6);
						expect(env.on.minute()).to.equal(0);
						expect(env.on.second()).to.equal(0);
					});
				});

				describe('Evening', () => {
					beforeEach(() => {
						env.schedule.tod = 'Evening';
						env.on = env.scheduler.next(env.schedule);
					});
					it('should be the next wednesday @ 1800', () => {
						expect(env.on.year()).to.equal(env.now.year());
						expect(env.on.month()).to.equal(env.now.month());
						expect(env.on.date()).to.equal(env.now.date() + (7 - env.now.day() + 3));
						expect(env.on.day()).to.equal(3);	// wednesday
						expect(env.on.hour()).to.equal(18);
						expect(env.on.minute()).to.equal(0);
						expect(env.on.second()).to.equal(0);
					});
				});
			});
		});

		describe('subsequent', () => {
			beforeEach(() => {
				env.last = moment({
					year: env.now.year(),
					month: env.now.month(),
					day: env.now.date()
				});
			});

			describe('Sunday', () => {
				beforeEach(() => {
					env.schedule.dow = 'Sunday';
					env.last.date(env.now.date() + (7 - env.now.day()));
				});
				describe('Morning', () => {
					beforeEach(() => {
						env.schedule.tod = 'Morning';
						env.last.hour(6);env.last.minute(0);env.last.second(0);
						env.on = env.scheduler.next(env.schedule,env.last);
					});
					it('should be the next tuesday @ 0600', () => {
						expect(env.on.year()).to.equal(env.now.year());
						expect(env.on.month()).to.equal(env.now.month());
						expect(env.on.date()).to.equal(env.now.date() + (7-env.now.day()+2));
						expect(env.on.day()).to.equal(2);	// tuesday
						expect(env.on.hour()).to.equal(6);
						expect(env.on.minute()).to.equal(0);
						expect(env.on.second()).to.equal(0);
					});
				});

				describe('Evening', () => {
					beforeEach(() => {
						env.schedule.tod = 'Evening';
						env.last.hour(18);env.last.minute(0);env.last.second(0);
						env.on = env.scheduler.next(env.schedule,env.last);
					});
					it('should be the next tuesday @ 1800', () => {
						expect(env.on.year()).to.equal(env.now.year());
						expect(env.on.month()).to.equal(env.now.month());
						expect(env.on.date()).to.equal(env.now.date() + (7-env.now.day()+2));
						expect(env.on.day()).to.equal(2);	// tuesday
						expect(env.on.hour()).to.equal(18);
						expect(env.on.minute()).to.equal(0);
						expect(env.on.second()).to.equal(0);
					});
				});
			});

			describe('Wednesday', () => {
				beforeEach(() => {
					env.schedule.dow = 'Wednesday';
					env.last.date(env.now.date() + (7 - env.now.day() + 3));
				});
				describe('Morning', () => {
					beforeEach(() => {
						env.schedule.tod = 'Morning';
						env.last.hour(6);env.last.minute(0);env.last.second(0);
						env.on = env.scheduler.next(env.schedule,env.last);
					});
					it('should be the next friday @ 0600', () => {
						expect(env.on.year()).to.equal(env.now.year());
						expect(env.on.month()).to.equal(env.now.month());
						expect(env.on.date()).to.equal(env.now.date() + (7 - env.now.day() + 5));
						expect(env.on.day()).to.equal(5);	// friday
						expect(env.on.hour()).to.equal(6);
						expect(env.on.minute()).to.equal(0);
						expect(env.on.second()).to.equal(0);
					});
				});

				describe('Evening', () => {
					beforeEach(() => {
						env.schedule.tod = 'Evening';
						env.last.hour(18);env.last.minute(0);env.last.second(0);
						env.on = env.scheduler.next(env.schedule,env.last);
					});
					it('should be the next friday @ 1800', () => {
						expect(env.on.year()).to.equal(env.now.year());
						expect(env.on.month()).to.equal(env.now.month());
						expect(env.on.date()).to.equal(env.now.date() + (7 - env.now.day() + 5));
						expect(env.on.day()).to.equal(5);	// friday
						expect(env.on.hour()).to.equal(18);
						expect(env.on.minute()).to.equal(0);
						expect(env.on.second()).to.equal(0);
					});
				});
			});
		});
	});

	describe('Weekly', () => {
		beforeEach(() => {
			env.schedule.frequency = 'Weekly';
		});

		describe('first', () => {
			describe('Sunday', () => {
				beforeEach(() => {
					env.schedule.dow = 'Sunday';
				});
				describe('Morning', () => {
					beforeEach(() => {
						env.schedule.tod = 'Morning';
						env.on = env.scheduler.next(env.schedule);
					});
					it('should be the next sunday @ 0600', () => {
						expect(env.on.year()).to.equal(env.now.year());
						expect(env.on.month()).to.equal(env.now.month());
						expect(env.on.date()).to.equal(env.now.date() + (7-env.now.day()));
						expect(env.on.day()).to.equal(0);	// sunday
						expect(env.on.hour()).to.equal(6);
						expect(env.on.minute()).to.equal(0);
						expect(env.on.second()).to.equal(0);
					});
				});

				describe('Evening', () => {
					beforeEach(() => {
						env.schedule.tod = 'Evening';
						env.on = env.scheduler.next(env.schedule);
					});
					it('should be the next sunday @ 1800', () => {
						expect(env.on.year()).to.equal(env.now.year());
						expect(env.on.month()).to.equal(env.now.month());
						expect(env.on.date()).to.equal(env.now.date() + (7-env.now.day()));
						expect(env.on.day()).to.equal(0);	// sunday
						expect(env.on.hour()).to.equal(18);
						expect(env.on.minute()).to.equal(0);
						expect(env.on.second()).to.equal(0);
					});
				});
			});

			describe('Wednesday', () => {
				beforeEach(() => {
					env.schedule.dow = 'Wednesday';
				});
				describe('Morning', () => {
					beforeEach(() => {
						env.schedule.tod = 'Morning';
						env.on = env.scheduler.next(env.schedule);
					});
					it('should be the next wednesday @ 0600', () => {
						expect(env.on.year()).to.equal(env.now.year());
						expect(env.on.month()).to.equal(env.now.month());
						expect(env.on.date()).to.equal(env.now.date() + (7 - env.now.day() + 3));
						expect(env.on.day()).to.equal(3);	// wednesday
						expect(env.on.hour()).to.equal(6);
						expect(env.on.minute()).to.equal(0);
						expect(env.on.second()).to.equal(0);
					});
				});

				describe('Evening', () => {
					beforeEach(() => {
						env.schedule.tod = 'Evening';
						env.on = env.scheduler.next(env.schedule);
					});
					it('should be the next wednesday @ 1800', () => {
						expect(env.on.year()).to.equal(env.now.year());
						expect(env.on.month()).to.equal(env.now.month());
						expect(env.on.date()).to.equal(env.now.date() + (7 - env.now.day() + 3));
						expect(env.on.day()).to.equal(3);	// wednesday
						expect(env.on.hour()).to.equal(18);
						expect(env.on.minute()).to.equal(0);
						expect(env.on.second()).to.equal(0);
					});
				});
			});
		});

		describe('subsequent', () => {
			beforeEach(() => {
				env.last = moment({
					year: env.now.year(),
					month: env.now.month(),
					day: env.now.date()
				});
			});

			describe('Sunday', () => {
				beforeEach(() => {
					env.schedule.dow = 'Sunday';
					env.last.date(env.now.date() + (7 - env.now.day()));
				});
				describe('Morning', () => {
					beforeEach(() => {
						env.schedule.tod = 'Morning';
						env.last.hour(6);env.last.minute(0);env.last.second(0);
						env.on = env.scheduler.next(env.schedule,env.last);
					});
					it('should be the next sunday @ 0600', () => {
						expect(env.on.year()).to.equal(env.now.year());
						expect(env.on.month()).to.equal(env.now.month());
						expect(env.on.date()).to.equal(env.now.date() + (14-env.now.day()));
						expect(env.on.day()).to.equal(0);
						expect(env.on.hour()).to.equal(6);
						expect(env.on.minute()).to.equal(0);
						expect(env.on.second()).to.equal(0);
					});
				});

				describe('Evening', () => {
					beforeEach(() => {
						env.schedule.tod = 'Evening';
						env.last.hour(18);env.last.minute(0);env.last.second(0);
						env.on = env.scheduler.next(env.schedule,env.last);
					});
					it('should be the next sunday @ 1800', () => {
						expect(env.on.year()).to.equal(env.now.year());
						expect(env.on.month()).to.equal(env.now.month());
						expect(env.on.date()).to.equal(env.now.date() + (14-env.now.day()));
						expect(env.on.day()).to.equal(0);
						expect(env.on.hour()).to.equal(18);
						expect(env.on.minute()).to.equal(0);
						expect(env.on.second()).to.equal(0);
					});
				});
			});

			describe('Wednesday', () => {
				beforeEach(() => {
					env.schedule.dow = 'Wednesday';
					env.last.date(env.now.date() + (7 - env.now.day() + 3));
				});
				describe('Morning', () => {
					beforeEach(() => {
						env.schedule.tod = 'Morning';
						env.last.hour(6);env.last.minute(0);env.last.second(0);
						env.on = env.scheduler.next(env.schedule,env.last);
					});
					it('should be the next wednesday @ 0600', () => {
						expect(env.on.year()).to.equal(env.now.year());
						expect(env.on.month()).to.equal(env.now.month());
						expect(env.on.date()).to.equal(env.now.date() + (14 - env.now.day() + 3));
						expect(env.on.day()).to.equal(3);
						expect(env.on.hour()).to.equal(6);
						expect(env.on.minute()).to.equal(0);
						expect(env.on.second()).to.equal(0);
					});
				});

				describe('Evening', () => {
					beforeEach(() => {
						env.schedule.tod = 'Evening';
						env.last.hour(18);env.last.minute(0);env.last.second(0);
						env.on = env.scheduler.next(env.schedule,env.last);
					});
					it('should be the next wednesday @ 1800', () => {
						expect(env.on.year()).to.equal(env.now.year());
						expect(env.on.month()).to.equal(env.now.month());
						expect(env.on.date()).to.equal(env.now.date() + (14 - env.now.day() + 3));
						expect(env.on.day()).to.equal(3);
						expect(env.on.hour()).to.equal(18);
						expect(env.on.minute()).to.equal(0);
						expect(env.on.second()).to.equal(0);
					});
				});
			});
		});
	});

	describe('Alternating Weeks', () => {
		beforeEach(() => {
			env.schedule.frequency = 'Alternating Weeks';
		});

		describe('first', () => {
			describe('Sunday', () => {
				beforeEach(() => {
					env.schedule.dow = 'Sunday';
				});
				describe('Morning', () => {
					beforeEach(() => {
						env.schedule.tod = 'Morning';
						env.on = env.scheduler.next(env.schedule);
					});
					it('should be the next sunday @ 0600', () => {
						expect(env.on.year()).to.equal(env.now.year());
						expect(env.on.month()).to.equal(env.now.month());
						expect(env.on.date()).to.equal(env.now.date() + (7-env.now.day()));
						expect(env.on.day()).to.equal(0);	// sunday
						expect(env.on.hour()).to.equal(6);
						expect(env.on.minute()).to.equal(0);
						expect(env.on.second()).to.equal(0);
					});
				});

				describe('Evening', () => {
					beforeEach(() => {
						env.schedule.tod = 'Evening';
						env.on = env.scheduler.next(env.schedule);
					});
					it('should be the next sunday @ 1800', () => {
						expect(env.on.year()).to.equal(env.now.year());
						expect(env.on.month()).to.equal(env.now.month());
						expect(env.on.date()).to.equal(env.now.date() + (7-env.now.day()));
						expect(env.on.day()).to.equal(0);	// sunday
						expect(env.on.hour()).to.equal(18);
						expect(env.on.minute()).to.equal(0);
						expect(env.on.second()).to.equal(0);
					});
				});
			});

			describe('Wednesday', () => {
				beforeEach(() => {
					env.schedule.dow = 'Wednesday';
				});
				describe('Morning', () => {
					beforeEach(() => {
						env.schedule.tod = 'Morning';
						env.on = env.scheduler.next(env.schedule);
					});
					it('should be the next wednesday @ 0600', () => {
						expect(env.on.year()).to.equal(env.now.year());
						expect(env.on.month()).to.equal(env.now.month());
						expect(env.on.date()).to.equal(env.now.date() + (7 - env.now.day() + 3));
						expect(env.on.day()).to.equal(3);	// wednesday
						expect(env.on.hour()).to.equal(6);
						expect(env.on.minute()).to.equal(0);
						expect(env.on.second()).to.equal(0);
					});
				});

				describe('Evening', () => {
					beforeEach(() => {
						env.schedule.tod = 'Evening';
						env.on = env.scheduler.next(env.schedule);
					});
					it('should be the next wednesday @ 1800', () => {
						expect(env.on.year()).to.equal(env.now.year());
						expect(env.on.month()).to.equal(env.now.month());
						expect(env.on.date()).to.equal(env.now.date() + (7 - env.now.day() + 3));
						expect(env.on.day()).to.equal(3);	// wednesday
						expect(env.on.hour()).to.equal(18);
						expect(env.on.minute()).to.equal(0);
						expect(env.on.second()).to.equal(0);
					});
				});
			});
		});

		describe('subsequent', () => {
			beforeEach(() => {
				env.last = moment({
					year: env.now.year(),
					month: env.now.month(),
					day: env.now.date()
				});
			});

			describe('Sunday', () => {
				beforeEach(() => {
					env.schedule.dow = 'Sunday';
					env.last.date(env.now.date() + (7 - env.now.day()));
				});
				describe('Morning', () => {
					beforeEach(() => {
						env.schedule.tod = 'Morning';
						env.last.hour(6);env.last.minute(0);env.last.second(0);
						env.on = env.scheduler.next(env.schedule,env.last);
					});
					it('should be the next sunday @ 0600', () => {
						expect(env.on.year()).to.equal(env.now.year());
						expect(env.on.month()).to.equal(env.now.month());
						expect(env.on.date()).to.equal(env.now.date() + (21-env.now.day()));
						expect(env.on.day()).to.equal(0);
						expect(env.on.hour()).to.equal(6);
						expect(env.on.minute()).to.equal(0);
						expect(env.on.second()).to.equal(0);
					});
				});

				describe('Evening', () => {
					beforeEach(() => {
						env.schedule.tod = 'Evening';
						env.last.hour(18);env.last.minute(0);env.last.second(0);
						env.on = env.scheduler.next(env.schedule,env.last);
					});
					it('should be the next sunday @ 1800', () => {
						expect(env.on.year()).to.equal(env.now.year());
						expect(env.on.month()).to.equal(env.now.month());
						expect(env.on.date()).to.equal(env.now.date() + (21-env.now.day()));
						expect(env.on.day()).to.equal(0);
						expect(env.on.hour()).to.equal(18);
						expect(env.on.minute()).to.equal(0);
						expect(env.on.second()).to.equal(0);
					});
				});
			});

			describe('Wednesday', () => {
				beforeEach(() => {
					env.schedule.dow = 'Wednesday';
					env.last.date(env.now.date() + (7 - env.now.day() + 3));
				});
				describe('Morning', () => {
					beforeEach(() => {
						env.schedule.tod = 'Morning';
						env.last.hour(6);env.last.minute(0);env.last.second(0);
						env.on = env.scheduler.next(env.schedule,env.last);
					});
					it('should be the next wednesday @ 0600', () => {
						let next = moment(env.now);
						next.add((21 - env.now.day() + 3), 'd');
						expect(env.on.year()).to.equal(next.year());
						expect(env.on.month()).to.equal(next.month());
						expect(env.on.date()).to.equal(next.date());
						expect(env.on.day()).to.equal(3);
						expect(env.on.hour()).to.equal(6);
						expect(env.on.minute()).to.equal(0);
						expect(env.on.second()).to.equal(0);
					});
				});

				describe('Evening', () => {
					beforeEach(() => {
						env.schedule.tod = 'Evening';
						env.last.hour(18);env.last.minute(0);env.last.second(0);
						env.on = env.scheduler.next(env.schedule,env.last);
					});
					it('should be the next wednesday @ 1800', () => {
						let next = moment(env.now);
						next.add((21 - env.now.day() + 3), 'd');
						expect(env.on.year()).to.equal(next.year());
						expect(env.on.month()).to.equal(next.month());
						expect(env.on.date()).to.equal(next.date());
						expect(env.on.day()).to.equal(3);
						expect(env.on.hour()).to.equal(18);
						expect(env.on.minute()).to.equal(0);
						expect(env.on.second()).to.equal(0);
					});
				});
			});
		});
	});

	describe('Monthly', () => {
		beforeEach(() => {
			env.schedule.frequency = 'Monthly';
		});

		describe('first', () => {
			describe('Sunday', () => {
				beforeEach(() => {
					env.schedule.dow = 'Sunday';
				});
				describe('Morning', () => {
					beforeEach(() => {
						env.schedule.tod = 'Morning';
						env.on = env.scheduler.next(env.schedule);
					});
					it('should be the next sunday @ 0600', () => {
						expect(env.on.year()).to.equal(env.now.year());
						expect(env.on.month()).to.equal(env.now.month());
						expect(env.on.date()).to.equal(env.now.date() + (7-env.now.day()));
						expect(env.on.day()).to.equal(0);	// sunday
						expect(env.on.hour()).to.equal(6);
						expect(env.on.minute()).to.equal(0);
						expect(env.on.second()).to.equal(0);
					});
				});

				describe('Evening', () => {
					beforeEach(() => {
						env.schedule.tod = 'Evening';
						env.on = env.scheduler.next(env.schedule);
					});
					it('should be the next sunday @ 1800', () => {
						expect(env.on.year()).to.equal(env.now.year());
						expect(env.on.month()).to.equal(env.now.month());
						expect(env.on.date()).to.equal(env.now.date() + (7-env.now.day()));
						expect(env.on.day()).to.equal(0);	// sunday
						expect(env.on.hour()).to.equal(18);
						expect(env.on.minute()).to.equal(0);
						expect(env.on.second()).to.equal(0);
					});
				});
			});

			describe('Wednesday', () => {
				beforeEach(() => {
					env.schedule.dow = 'Wednesday';
				});
				describe('Morning', () => {
					beforeEach(() => {
						env.schedule.tod = 'Morning';
						env.on = env.scheduler.next(env.schedule);
					});
					it('should be the next wednesday @ 0600', () => {
						expect(env.on.year()).to.equal(env.now.year());
						expect(env.on.month()).to.equal(env.now.month());
						expect(env.on.date()).to.equal(env.now.date() + (7 - env.now.day() + 3));
						expect(env.on.day()).to.equal(3);	// wednesday
						expect(env.on.hour()).to.equal(6);
						expect(env.on.minute()).to.equal(0);
						expect(env.on.second()).to.equal(0);
					});
				});

				describe('Evening', () => {
					beforeEach(() => {
						env.schedule.tod = 'Evening';
						env.on = env.scheduler.next(env.schedule);
					});
					it('should be the next wednesday @ 1800', () => {
						expect(env.on.year()).to.equal(env.now.year());
						expect(env.on.month()).to.equal(env.now.month());
						expect(env.on.date()).to.equal(env.now.date() + (7 - env.now.day() + 3));
						expect(env.on.day()).to.equal(3);	// wednesday
						expect(env.on.hour()).to.equal(18);
						expect(env.on.minute()).to.equal(0);
						expect(env.on.second()).to.equal(0);
					});
				});
			});
		});

		describe('subsequent', () => {
			beforeEach(() => {
				env.last = moment({
					year: env.now.year(),
					month: env.now.month(),
					day: env.now.date()
				});
			});

			describe('Sunday', () => {
				beforeEach(() => {
					env.schedule.dow = 'Sunday';
					env.last.date(env.now.date() + (7 - env.now.day()));
				});
				describe('Morning', () => {
					beforeEach(() => {
						env.schedule.tod = 'Morning';
						env.last.hour(6);env.last.minute(0);env.last.second(0);
						env.on = env.scheduler.next(env.schedule,env.last);
					});
					it('should be the next sunday @ 0600', () => {
						let next = moment(env.now);
						next.add(1, 'M');
						expect(env.on.year()).to.equal(next.year());
						expect(env.on.month()).to.equal(next.month());
						//expect(env.on.date()).to.equal(next.date());
						//expect(env.on.day()).to.equal(0);
						expect(env.on.hour()).to.equal(6);
						expect(env.on.minute()).to.equal(0);
						expect(env.on.second()).to.equal(0);
					});
				});

				describe('Evening', () => {
					beforeEach(() => {
						env.schedule.tod = 'Evening';
						env.last.hour(18);env.last.minute(0);env.last.second(0);
						env.on = env.scheduler.next(env.schedule,env.last);
					});
					it('should be the next sunday @ 1800', () => {
						let next = moment(env.now);
						next.add(1, 'M');
						expect(env.on.year()).to.equal(next.year());
						expect(env.on.month()).to.equal(next.month());
						//expect(env.on.date()).to.equal(next.date());
						//expect(env.on.day()).to.equal(0);
						expect(env.on.hour()).to.equal(18);
						expect(env.on.minute()).to.equal(0);
						expect(env.on.second()).to.equal(0);
					});
				});
			});

			describe('Wednesday', () => {
				beforeEach(() => {
					env.schedule.dow = 'Wednesday';
					env.last.date(env.now.date() + (7 - env.now.day() + 3));
				});
				describe('Morning', () => {
					beforeEach(() => {
						env.schedule.tod = 'Morning';
						env.last.hour(6);env.last.minute(0);env.last.second(0);
						env.on = env.scheduler.next(env.schedule,env.last);
					});
					it('should be the next wednesday @ 0600', () => {
						let next = moment(env.now);
						next.add(1, 'M');
						expect(env.on.year()).to.equal(next.year());
						expect(env.on.month()).to.equal(next.month());
						//expect(env.on.date()).to.equal(next.date());
						//expect(env.on.day()).to.equal(next.day());
						expect(env.on.hour()).to.equal(6);
						expect(env.on.minute()).to.equal(0);
						expect(env.on.second()).to.equal(0);
					});
				});

				describe('Evening', () => {
					beforeEach(() => {
						env.schedule.tod = 'Evening';
						env.last.hour(18);env.last.minute(0);env.last.second(0);
						env.on = env.scheduler.next(env.schedule,env.last);
					});
					it('should be the next wednesday @ 1800', () => {
						let next = moment(env.now);
						next.add(1, 'M');
						expect(env.on.year()).to.equal(next.year());
						expect(env.on.month()).to.equal(next.month());
						//expect(env.on.date()).to.equal(next.date());
						//expect(env.on.day()).to.equal(next.day());
						expect(env.on.hour()).to.equal(18);
						expect(env.on.minute()).to.equal(0);
						expect(env.on.second()).to.equal(0);
					});
				});
			});
		});
	});

	describe.only('getTOD', () => {
		/*
		describe('now', () => {
			beforeEach(() => {
				env.tod = env.scheduler.getTOD();
			});

			it('should be morning', () => {
				expect(env.tod).to.equal('morning');
			});
		});
		*/

		describe('morning', () => {
			describe('6 am', () => {
				beforeEach(() => {
					let now = moment({year: 2016, month: 9, day: 15, hour: 6, minute: 14, second: 34});
					env.tod = env.scheduler.getTOD(now);
				});

				it('should be morning', () => {
					expect(env.tod).to.equal('morning');
				});
			});
			describe('9 am', () => {
				beforeEach(() => {
					let now = moment({year: 2016, month: 9, day: 15, hour: 9, minute: 59, second: 34});
					env.tod = env.scheduler.getTOD(now);
				});

				it('should be morning', () => {
					expect(env.tod).to.equal('morning');
				});
			});
			describe('11:59 am', () => {
				beforeEach(() => {
					let now = moment({year: 2016, month: 9, day: 15, hour: 11, minute: 59, second: 59});
					env.tod = env.scheduler.getTOD(now);
				});

				it('should be morning', () => {
					expect(env.tod).to.equal('morning');
				});
			});
		});

		describe('morning', () => {
			describe('6 am', () => {
				beforeEach(() => {
					let now = moment({year: 2016, month: 9, day: 15, hour: 6, minute: 14, second: 34});
					env.tod = env.scheduler.getTOD(now);
				});

				it('should be morning', () => {
					expect(env.tod).to.equal('morning');
				});
			});
			describe('9 am', () => {
				beforeEach(() => {
					let now = moment({year: 2016, month: 9, day: 15, hour: 9, minute: 59, second: 34});
					env.tod = env.scheduler.getTOD(now);
				});

				it('should be morning', () => {
					expect(env.tod).to.equal('morning');
				});
			});
			describe('11:59 am', () => {
				beforeEach(() => {
					let now = moment({year: 2016, month: 9, day: 15, hour: 11, minute: 59, second: 59});
					env.tod = env.scheduler.getTOD(now);
				});

				it('should be morning', () => {
					expect(env.tod).to.equal('morning');
				});
			});

		});
		describe('noon', () => {
			describe('12 pm', () => {
				beforeEach(() => {
					let now = moment({year: 2016, month: 9, day: 15, hour: 12, minute: 0, second: 0});
					env.tod = env.scheduler.getTOD(now);
				});

				it('should be noon', () => {
					expect(env.tod).to.equal('noon');
				});
			});
			describe('5:59 pm', () => {
				beforeEach(() => {
					let now = moment({year: 2016, month: 9, day: 15, hour: 17, minute: 59, second: 59});
					env.tod = env.scheduler.getTOD(now);
				});

				it('should be noon', () => {
					expect(env.tod).to.equal('noon');
				});
			});
		});

		describe('bedtime', () => {
			describe('11:01 am', () => {
				beforeEach(() => {
					let now = moment({year: 2016, month: 9, day: 15, hour: 23, minute: 1, second: 0});
					env.tod = env.scheduler.getTOD(now);
				});

				it('should be bedtime', () => {
					expect(env.tod).to.equal('bedtime');
				});
			});
		});

		describe('overnight', () => {
			describe('12:01 am', () => {
				beforeEach(() => {
					let now = moment({year: 2016, month: 9, day: 15, hour: 0, minute: 1, second: 0});
					env.tod = env.scheduler.getTOD(now);
				});

				it('should be morning', () => {
					expect(env.tod).to.equal('morning');
				});
			});
		});
	});
});
