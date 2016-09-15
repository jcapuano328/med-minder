'use strict';
var chai = require('chai'),
	expect = chai.expect,
	sinon = require('sinon'),
	sandbox = require('sandboxed-module');
chai.use(require('sinon-chai'));

describe('Store', () => {
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
		env.filename = 'test.json';
		env.data = {
			a: {
				b: 1,
				c: {
					d: [
						'1','2','3'
					]
				}
			}
		};
		env.datastr = JSON.stringify(env.data);

		env.Store = sandbox.require('../../src/stores/store', {
			requires: {
				"react-native-fs": env.rnfs,
				"../services/log": env.log
			}
		});
		env.store = env.Store(env.filename);
    });

	describe('load', () => {
		describe('found', () => {
			beforeEach((done) => {
				env.rnfs.readFile.returns(Promise.accept(env.datastr));
				env.store.load()
				.then((data) => {
					env.result = data;
					done();
				})
				.catch(done);
			});

			it('should read the proper file', () => {
				expect(env.rnfs.readFile).to.have.been.calledOnce;
				expect(env.rnfs.readFile).to.have.been.calledWith(env.rnfs.DocumentDirectoryPath + '/' + env.filename);
			});

			it('should parse the result into json', () => {
				expect(env.result).to.exist;
				expect(env.result).to.deep.equal(env.data);
			});
		});

		describe('not found', () => {
			beforeEach((done) => {
				env.rnfs.readFile.returns(Promise.reject('no file found'));
				env.store.load()
				.then((data) => {
					env.result = data;
					done();
				})
				.catch(done);
			});

			it('should read the proper file', () => {
				expect(env.rnfs.readFile).to.have.been.calledOnce;
				expect(env.rnfs.readFile).to.have.been.calledWith(env.rnfs.DocumentDirectoryPath + '/' + env.filename);
			});

			it('should return null', () => {
				//expect(env.result).to.exist;
				expect(env.result).to.be.null;
			});
		});
	});

	describe('save', () => {
		beforeEach((done) => {
			env.rnfs.writeFile.returns(Promise.accept());
			env.store.save(env.data)
			.then(done)
			.catch(done);
		});

		it('should write the proper file', () => {
			expect(env.rnfs.writeFile).to.have.been.calledOnce;
			expect(env.rnfs.writeFile).to.have.been.calledWith(env.rnfs.DocumentDirectoryPath + '/' + env.filename, sinon.match.string);
		});

		it('should convert the json to a string', () => {
			expect(env.rnfs.writeFile).to.have.been.calledWith(sinon.match.string, env.datastr);
		});
	});

	describe('remove', () => {
		beforeEach((done) => {
			env.rnfs.unlink.returns(Promise.accept());
			env.store.remove()
			.then(done)
			.catch(done);
		});

		it('should remove the proper file', () => {
			expect(env.rnfs.unlink).to.have.been.calledOnce;
			expect(env.rnfs.unlink).to.have.been.calledWith(env.rnfs.DocumentDirectoryPath + '/' + env.filename);
		});
	});

	describe('sorter', () => {
		beforeEach(() => {
			env.list = [
				{a: 1, b: 2},
				{a: 1, b: 3},
				{a: 2, b: 2},
				{a: 3, b: 1}
			];
			env.orderby = ['b','a'];
			env.expected = [
				{a: 3, b: 1},
				{a: 1, b: 2},
				{a: 2, b: 2},
				{a: 1, b: 3}
			];

			env.actual = env.list.sort(env.store.sorter(env.orderby));
		});

		it('should order the list', () => {
			expect(env.actual).to.deep.equal(env.expected);
		});
	});

	describe('comparer', () => {
		beforeEach(() => {
			env.list = [
				{a: 1, b: 2},
				{a: 1, b: 3},
				{a: 2, b: 2},
				{a: 3, b: 1}
			];
			env.filter = {b: 2};
			env.expected = [
				{a: 1, b: 2},
				{a: 2, b: 2}
			];

			env.actual = env.list.filter(env.store.comparer(env.filter));
		});

		it('should filter the list', () => {
			expect(env.actual).to.deep.equal(env.expected);
		});
	});

	describe('select', () => {
		beforeEach((done) => {
			env.data = [
				{a: 1, b: 2},
				{a: 1, b: 3},
				{a: 2, b: 2},
				{a: 3, b: 1}
			];
			env.datastr = JSON.stringify(env.data);
			env.orderby = ['b','a'];
			env.filter = {b: 2};
			env.expected = [
				{a: 1, b: 2},
				{a: 2, b: 2}
			];

			env.rnfs.readFile.returns(Promise.accept(env.datastr));

			env.store.select(env.filter, env.orderby)
			.then((result) => {
				env.actual = result;
				done();
			})
		});

		it('should read the proper file', () => {
			expect(env.rnfs.readFile).to.have.been.calledOnce;
			expect(env.rnfs.readFile).to.have.been.calledWith(env.rnfs.DocumentDirectoryPath + '/' + env.filename);
		});

		it('should parse the result into json, order, and filter the data', () => {
			expect(env.actual).to.deep.equal(env.expected);
		});
	});

});
