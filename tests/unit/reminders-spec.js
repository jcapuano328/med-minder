'use strict';
var chai = require('chai'),
	expect = chai.expect,
	sinon = require('sinon'),
	sandbox = require('sandboxed-module');
var moment = require('moment');
chai.use(require('sinon-chai'));

describe('Reminders', () => {
	var env = {};
	beforeEach(() => {
		env = {};
		env.log = sandbox.require('../mocks/log')();

		env.Patients = {
			get: sinon.stub()
		};
		env.Notifications = {
			getById: sinon.stub(),
			get: sinon.stub(),
			create: sinon.stub(),
			cancel: sinon.stub(),
			start: sinon.stub(),
			stop: sinon.stub()
		};

		env.reminder = {
			patient: {
				name: 'patient'
			},
			med: {
				name: 'med',
				dosage: 'dosage',
				instructions: 'instructions'
			},
			on: moment()
		};
		env.notifications = [
			{
				id: 123,
				subject: 'patient has a medication due',
				message: 'Give patient med dosage instructions',
				sendAt: moment(),
				repeatEvery: (5 * 60 * 1000),
				repeatCount: 12,
				autoClear: true,
				onlyAlertOnce: false,
				category: 'reminder',
				payload: env.reminder
			},
			{
				id: 456,
				subject: 'patient has a medication due',
				message: 'Give patient med dosage instructions',
				sendAt: moment(),
				repeatEvery: (5 * 60 * 1000),
				repeatCount: 12,
				autoClear: true,
				onlyAlertOnce: false,
				category: 'reminder',
				payload: env.reminder
			},
			{
				id: 789,
				subject: 'patient has a medication due',
				message: 'Give patient med dosage instructions',
				sendAt: moment(),
				repeatEvery: (5 * 60 * 1000),
				repeatCount: 12,
				autoClear: true,
				onlyAlertOnce: false,
				category: 'reminder',
				payload: env.reminder
			}
		];

        env.handler = sinon.stub();

		env.reminders = sandbox.require('../../src/services/reminders', {
			requires: {
				"./patients": env.Patients,
				"./notifications": env.Notifications,
				"moment": moment,
				"./log": env.log
			}
		});
    });

	describe('get', () => {
		beforeEach((done) => {
			env.Notifications.getById.returns(Promise.accept(env.notifications[0]));
			env.reminders.get(123)
			.then((data) => {
				env.result = data;
				done();
			})
			.catch(done);
		});

		it('should fetch the notifications', () => {
			expect(env.Notifications.getById).to.have.been.calledOnce;
			expect(env.Notifications.getById).to.have.been.calledWith(123);
		});

		it('should return the data', () => {
			expect(env.result).to.deep.equal(env.notifications[0]);
		});
	});
	describe('getAll', () => {
		beforeEach((done) => {
			env.Notifications.get.returns(Promise.accept(env.notifications));
			env.reminders.getAll()
			.then((data) => {
				env.result = data;
				done();
			})
			.catch(done);
		});

		it('should fetch the notifications', () => {
			expect(env.Notifications.get).to.have.been.calledOnce;
			expect(env.Notifications.get).to.have.been.calledWithExactly();
		});

		it('should return the sorted data', () => {
			expect(env.result).to.deep.equal(env.notifications);
		});
	});
	describe('getNow', () => {});
	describe('getToday', () => {});
	describe('getThisWeek', () => {});
	describe('getThisMonth', () => {});
	describe('create', () => {});
	describe('schedule', () => {});
	describe('reschedule', () => {});
	describe('reschedulePatient', () => {});
	describe('complete', () => {});
	describe('cancel', () => {});
	describe('remove', () => {});
	describe('removeAll', () => {});
	describe('start', () => {});
	describe('stop', () => {});
});
