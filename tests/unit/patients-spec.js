'use strict';
var chai = require('chai'),
	expect = chai.expect,
	sinon = require('sinon'),
	sandbox = require('sandboxed-module');
chai.use(require('sinon-chai'));

describe('Patients', () => {
	var env = {};
	beforeEach(() => {
		env = {};
		env.log = sandbox.require('../mocks/log')();
		env.Store = sandbox.require('../../src/stores/store', {
			requires: {
				"react-native-fs": {},
				"../services/log": env.log
			}
		})('test');
		env.store = {
			select: sinon.stub(),
			save: sinon.stub(),
			remove: sinon.stub(),
			sorter: (o) => env.Store.sorter(o)
		};
		sinon.spy(env.store, 'sorter');
		env.uuid = {
			v1: sinon.stub().returns(123)
		};
		env.data = [
			{id: 1, name:'a',status:'active',meds:[{name: '1'},{name: '2'}]},
			{id: 2, name:'b',status:'inactive',meds:[{name: '1'},{name: '2'}]},
			{id: 3, name:'c',status:'active',meds:[{name: '1'},{name: '2'}]}
		];

		env.patients = sandbox.require('../../src/services/patients', {
			requires: {
				"../stores/store": sinon.stub().returns(env.store),
				"./guid": env.uuid,
				"../services/log": env.log
			}
		});
    });

	describe('getAll', () => {
		beforeEach((done) => {
			env.store.select.returns(Promise.accept(env.data));
			env.patients.getAll()
			.then((data) => {
				env.result = data;
				done();
			})
			.catch(done);
		});

		it('should invoke the store', () => {
			expect(env.store.select).to.have.been.calledOnce;
			expect(env.store.select).to.have.been.calledWith(null, ['status','name']);
		});

		it('should retrieve the data', () => {
			expect(env.result).to.be.an.array;
			expect(env.result).to.have.length(env.data.length);
			expect(env.result).to.deep.equal(env.data);
		});
	});
	describe('getActive', () => {
		beforeEach((done) => {
			env.store.select.returns(Promise.accept(env.data));
			env.patients.getActive()
			.then((data) => {
				env.result = data;
				done();
			})
			.catch(done);
		});

		it('should invoke the store', () => {
			expect(env.store.select).to.have.been.calledOnce;
			expect(env.store.select).to.have.been.calledWith({status: 'active'}, ['status','name']);
		});

		it('should retrieve the data', () => {
			expect(env.result).to.be.an.array;
			expect(env.result).to.have.length(env.data.length);
			expect(env.result).to.deep.equal(env.data);
		});
	});
	describe('get', () => {
		beforeEach((done) => {
			env.store.select.returns(Promise.accept([env.data[0]]));
			env.patients.get(1)
			.then((data) => {
				env.result = data;
				done();
			})
			.catch(done);
		});

		it('should invoke the store', () => {
			expect(env.store.select).to.have.been.calledOnce;
			expect(env.store.select).to.have.been.calledWith({id: 1}, ['status','name']);
		});

		it('should retrieve the data', () => {
			expect(env.result).to.be.an.object;
			expect(env.result).to.deep.equal(env.data[0]);
		});
	});
	describe('add', () => {
		beforeEach((done) => {
			env.store.select.returns(Promise.accept(env.data));
			env.store.save.returns(Promise.accept());
			env.newpatient = {
				name: 'foo',
				status: 'active',
				meds: [{name: 'bar'}]
			};
			env.patients.add(env.newpatient)
			.then((data) => {
				env.result = data;
				done();
			})
			.catch(done);
		});

		it('should invoke the store', () => {
			expect(env.store.select).to.have.been.calledOnce;
			expect(env.store.select).to.have.been.calledWith(null, ['status','name']);
			expect(env.store.save).to.have.been.calledOnce;
			expect(env.store.save).to.have.been.calledWith(env.data);
		});

		it('should return the data', () => {
			expect(env.result).to.be.an.array;
			expect(env.result).to.have.length(env.data.length);
			expect(env.result).to.deep.equal(env.data);
		});
	});
	describe('update', () => {
		beforeEach((done) => {
			env.store.select.returns(Promise.accept(env.data));
			env.store.save.returns(Promise.accept());
			env.existingpatient = {};
			Object.assign(env.existingpatient, env.data[1]);
			env.existingpatient.status = 'active';
			env.patients.update(env.existingpatient)
			.then((data) => {
				env.result = data;
				done();
			})
			.catch(done);
		});

		it('should invoke the store', () => {
			expect(env.store.select).to.have.been.calledOnce;
			expect(env.store.select).to.have.been.calledWith(null, ['status','name']);
			expect(env.store.save).to.have.been.calledOnce;
			expect(env.store.save).to.have.been.calledWith(env.data);
		});

		it('should return the data', () => {
			expect(env.result).to.be.an.array;
			expect(env.result).to.have.length(env.data.length);
			expect(env.result).to.deep.equal(env.data);
		});
	});
	describe('remove', () => {
		beforeEach((done) => {
			env.store.select.returns(Promise.accept(env.data));
			env.store.save.returns(Promise.accept());
			env.existingpatient = {};
			Object.assign(env.existingpatient, env.data[1]);
			env.patients.remove(env.existingpatient)
			.then((data) => {
				env.result = data;
				done();
			})
			.catch(done);
		});

		it('should invoke the store', () => {
			expect(env.store.select).to.have.been.calledOnce;
			expect(env.store.select).to.have.been.calledWith(null, ['status','name']);
			expect(env.store.save).to.have.been.calledOnce;
			expect(env.store.save).to.have.been.calledWith(env.data);
		});

		it('should return the data', () => {
			expect(env.result).to.be.an.array;
			expect(env.result).to.have.length(env.data.length);
			expect(env.result).to.deep.equal(env.data);
		});
	});
	describe('removeAll', () => {
		beforeEach((done) => {
			env.store.remove.returns(Promise.accept());
			env.patients.removeAll()
			.then(() => {
				env.result = true;
				done();
			})
			.catch(done);
		});

		it('should invoke the store', () => {
			expect(env.store.select).to.not.have.been.called;
			expect(env.store.save).to.not.have.been.called;
			expect(env.store.remove).to.have.been.calledOnce;
		});

		it('should return', () => {
			expect(env.result).to.be.true;
		});
	});
	describe('sort', () => {
		beforeEach(() => {
			env.result = env.patients.sort([
				{name: 'a', status: 'active'},
				{name: 'c', status: 'inactive'},
				{name: 'b', status: 'inactive'},
				{name: 'd', status: 'active'}
			]);
		});

		it('should invoke the store sorter', () => {
			expect(env.store.sorter).to.have.been.calledOnce;
		});

		it('should return sorted result', () => {
			expect(env.result).to.deep.equal([
				{name: 'a', status: 'active'},
				{name: 'd', status: 'active'},
				{name: 'b', status: 'inactive'},
				{name: 'c', status: 'inactive'}
			]);
		});
	});
	describe('createNewPatient', () => {

	});
	describe('createNewMed', () => {

	});
	describe('addMed', () => {

	});
	describe('updateMed', () => {

	});
	describe('removeMed', () => {

	});
});
