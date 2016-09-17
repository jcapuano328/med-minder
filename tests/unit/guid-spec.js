var chai = require('chai'),
	expect = chai.expect,
	sinon = require('sinon'),
	sandbox = require('sandboxed-module');
chai.use(require('sinon-chai'));

describe('guid', () => {
	var env = {};

	beforeEach(() => {
		env.log = require('../mocks/log')();
		env.guid = sandbox.require('../../src/services/guid', {
			requires: {
				'./log': env.log
			}
		});
	})

	describe('Testing rfc4122 version 1 (timestamp GUID)', () => {
		beforeEach(() => {
			env.timestamp = env.guid.v1();			
		});

        it('should expect timestamp id to be defined', () => {
            expect(env.timestamp).to.not.equal(undefined);
        });
		it('should expect the length of the string to be 36 chars long', () => {
			expect(env.timestamp.length).to.equal(36);
		});
		it('should expect the version number 1 to be at index 14 in the string', () => {
			expect(env.timestamp[14]).to.equal('1');
		});
        it('should have 5 columns', () => {
            var timestamp = env.timestamp.split('-');
            expect(timestamp.length).to.equal(5);
        });
        it('should have 8 hexidecimal characters in column 1', () => {
            var timestamp = env.timestamp.split('-');
            expect(timestamp[0].length).to.equal(8);
        });
        it('should have 4 hexidecimal characters in column 2', () => {
            var timestamp = env.timestamp.split('-');
            expect(timestamp[1].length).to.equal(4);
        });
        it('should have 4 hexidecimal characters in column 3', () => {
            var timestamp = env.timestamp.split('-');
            expect(timestamp[2].length).to.equal(4);
        });
        it('should have 4 hexidecimal characters in column 4', () => {
            var timestamp = env.timestamp.split('-');
            expect(timestamp[3].length).to.equal(4);
        });
        it('should have 12 hexidecimal characters in column 5', () => {
            var timestamp = env.timestamp.split('-');
            expect(timestamp[4].length).to.equal(12);
        });
	});

	describe('Testing rfc4122 version 4 spec (random GUID)', () => {
		beforeEach(() => {
			env.random = env.guid.v4();
		});

        it('should expect random id to be defined', () => {
            expect(env.random).to.not.equal(undefined);
        });

		it('should expect the length of the string to be 36 chars long', () => {
			expect(env.random.length).to.equal(36);
		});
		it('should expect the version number 4 to be at index 14 in the string', () => {
			expect(env.random[14]).to.equal('4');
		});
        it('should have 5 columns', () => {
            var randomarray = env.random.split('-');
            expect(randomarray.length).to.equal(5);
        });
        it('should have 8 hexidecimal characters in column 1', () => {
            var randomarray = env.random.split('-');
            expect(randomarray[0].length).to.equal(8);
        });
        it('should have 4 hexidecimal characters in column 2', () => {
            var randomarray = env.random.split('-');
            expect(randomarray[1].length).to.equal(4);
        });
        it('should have 4 hexidecimal characters in column 3', () => {
            var randomarray = env.random.split('-');
            expect(randomarray[2].length).to.equal(4);
        });
        it('should have 4 hexidecimal characters in column 4', () => {
            var randomarray = env.random.split('-');
            expect(randomarray[3].length).to.equal(4);
        });
        it('should have 12 hexidecimal characters in column 5', () => {
            var randomarray = env.random.split('-');
            expect(randomarray[4].length).to.equal(12);
        });
	});

});
