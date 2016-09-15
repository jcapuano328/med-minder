'use strict';
var chai = require('chai'),
	expect = chai.expect,
	sinon = require('sinon'),
	sandbox = require('sandboxed-module'),
	moment = require('moment');
chai.use(require('sinon-chai'));

describe('Notifications', () => {
	var env = {};
	beforeEach(() => {
		env = {};
		env.log = sandbox.require('../mocks/log')();
		env.rnsn = {
			find: sinon.stub(),
			getIDs: sinon.stub(),
			create: sinon.stub(),
			delete: sinon.stub(),
			deleteAll: sinon.stub(),
			clear: sinon.stub(),
			clearAll: sinon.stub(),
			addListener: sinon.stub(),
			removeAllListeners: sinon.stub()
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
		env.notification = {
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
		};

		env.notifications = sandbox.require('../../src/services/notifications', {
			requires: {
				"react-native-system-notification": env.rnsn,
				"./log": env.log,
				"moment": moment
			}
		});
    });

	describe('get', () => {
		describe('byID', () => {
			beforeEach((done) => {
				env.rnsn.find.returns(Promise.accept(env.notification));
				env.notifications.getById(123)
				.then((n) => {
					env.result = n;
					done();
				})
				.catch(done);
			});

			it('should fetch the notification', () => {
				expect(env.rnsn.find).to.have.been.calledOnce;
				expect(env.rnsn.find).to.have.been.calledWith(123);
			});

			it('should return the notification', () => {
				expect(env.result).to.deep.equal(env.notification);
			});
		});

		describe('by IDs', () => {
			describe('specific', () => {
				beforeEach((done) => {
					env.rnsn.find.returns(Promise.accept(env.notification));
					env.notifications.get([123,789])
					.then((n) => {
						env.result = n;
						done();
					})
					.catch(done);
				});

				it('should not fetch the notification ids', () => {
					expect(env.rnsn.getIDs).to.not.have.been.called;
				});

				it('should fetch the notification', () => {
					expect(env.rnsn.find).to.have.been.calledTwice;
					expect(env.rnsn.find).to.have.been.calledWith(123);
					expect(env.rnsn.find).to.have.been.calledWith(789);
				});

				it('should return the notifications', () => {
					expect(env.result).to.deep.equal([env.notification,env.notification]);
				});
			});

			describe('all', () => {
				beforeEach((done) => {
					env.rnsn.find.returns(Promise.accept(env.notification));
					env.rnsn.getIDs.returns(Promise.accept([123,456,789]))

					env.notifications.get()
					.then((n) => {
						env.result = n;
						done();
					})
					.catch(done);
				});

				it('should fetch the notification ids', () => {
					expect(env.rnsn.getIDs).to.have.been.calledOnce;
				});

				it('should fetch the notification', () => {
					expect(env.rnsn.find).to.have.been.calledThrice;
					expect(env.rnsn.find).to.have.been.calledWith(123);
					expect(env.rnsn.find).to.have.been.calledWith(456);
					expect(env.rnsn.find).to.have.been.calledWith(789);
				});

				it('should return the notification', () => {
					expect(env.result).to.deep.equal([env.notification,env.notification,env.notification]);
				});
			});
		});
	});

	//describe('create');
	//describe('cancel');
	//describe('clear');
	//describe('start');
	//describe('stop');
});
