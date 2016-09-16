'use strict';
var chai = require('chai'),
	expect = chai.expect,
	sinon = require('sinon'),
	sandbox = require('sandboxed-module');
chai.use(require('sinon-chai'));
var Store = require('../../src/stores/store')('test');

describe('Patients', () => {
	var env = {};
	beforeEach(() => {
		env = {};
		env.log = sandbox.require('../mocks/log')();
		env.rnfs = {
			DocumentDirectoryPath: '/path/to/doc',
			readFile: sinon.stub(),
			writeFile: sinon.stub(),
			unlink: sinon.stub()
		};
		env.store = {
			select: sinon.stub(),
			save: sinon.stub(),
			remove: sinon.stub(),
			sorter: Store.sorter
		};
		env.uuid = {
			v1: sinon.stub().returns(123)
		};

		env.patients = sandbox.require('../../src/services/patients', {
			requires: {
				"../stores/store": sinon.stub().returns(env.store),
				"react-native-uuid": env.uuid,
				"../services/log": env.log
			}
		});
		env.store = env.Store(env.filename);
    });

	describe('getAll');
	describe('getActive');
	describe('get');
	describe('add');
	describe('update');
	describe('remove');
	describe('removeAll');
	describe('sort');
	describe('createNewPatient');
	describe('createNewMed');
	describe('addMed');
	describe('updateMed');
	describe('removeMed');
});
