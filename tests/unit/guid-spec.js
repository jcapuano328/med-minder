var chai = require('chai'),
	expect = chai.expect,
	sinon = require('sinon'),
	sandbox = require('sandboxed-module');
chai.use(require('sinon-chai'));

describe('Generating a new GUID', function() {
	var env = {};

	beforeEach(() => {
		env.log = require('../mocks/log')();
		env.guid = sandbox.require('../../src/services/guid', {
			requires: {
				'./log': env.log
			}
		});
	})

	describe('Testing server-side module for guid generator', function() {

		beforeEach(function() {
			id.random = id.guid.getId('random');
			id.timestamp = id.guid.getId('timestamp');
		});

		describe('getGUID()', function() {
            it('should expect the GUID module to exist', function() {
                expect(id.guid).to.exist;
            });
			it('should not return an undefined value for the guid', function () {
				expect(id.random).to.not.equal(undefined);
			});
			it('should not be able to call private function getRandomGUID', function(){
				expect(id.guid.getRandomGUID).to.not.exist;
			});
			it('should not be able to call private function randomIdHex', function(){
				expect(id.guid.randomHex).to.not.exist;
			});
			it('should not be able to call private function random', function(){
				expect(id.guid.random).to.not.exist;
			});
			it('should return a value type string', function() {
				expect(typeof id.random).to.equal('string');
			});
			it('should not return duplicate guids', function () {
				expect(id.random).to.not.equal(id.timestamp);
			});
		});
		describe('Testing rfc4122 version 4 spec (random GUID)', function() {
            it('should expect timestamp id to be defined', function() {
                expect(id.random).to.not.equal(undefined);
            });
			it('should expect the length of the string to be 36 chars long', function() {
				expect(id.random.length).to.equal(36);
			});
			it('should expect the version number 4 to be at index 14 in the string', function() {
				expect(id.random[14]).to.equal('4');
			});
            it('should have 5 columns', function() {
                var randomarray = id.random.split('-');
                expect(randomarray.length).to.equal(5);
            });
            it('should have 8 hexidecimal characters in column 1', function() {
                var randomarray = id.random.split('-');
                expect(randomarray[0].length).to.equal(8);
            });
            it('should have 4 hexidecimal characters in column 2', function() {
                var randomarray = id.random.split('-');
                expect(randomarray[1].length).to.equal(4);
            });
            it('should have 4 hexidecimal characters in column 3', function() {
                var randomarray = id.random.split('-');
                expect(randomarray[2].length).to.equal(4);
            });
            it('should have 4 hexidecimal characters in column 4', function() {
                var randomarray = id.random.split('-');
                expect(randomarray[3].length).to.equal(4);
            });
            it('should have 12 hexidecimal characters in column 5', function() {
                var randomarray = id.random.split('-');
                expect(randomarray[4].length).to.equal(12);
            });
		});
		describe('Testing rfc4122 version 1 (timestamp GUID)', function() {
            it('should expect timestamp id to be defined', function() {
                expect(id.timestamp).to.not.equal(undefined);
            });
			it('should expect the length of the string to be 36 chars long', function() {
				expect(id.timestamp.length).to.equal(36);
			});
			it('should expect the version number 1 to be at index 14 in the string', function() {
				expect(id.timestamp[14]).to.equal('1');
			});
            it('should have 5 columns', function() {
                var timestamp = id.timestamp.split('-');
                expect(timestamp.length).to.equal(5);
            });
            it('should have 8 hexidecimal characters in column 1', function() {
                var timestamp = id.timestamp.split('-');
                expect(timestamp[0].length).to.equal(8);
            });
            it('should have 4 hexidecimal characters in column 2', function() {
                var timestamp = id.timestamp.split('-');
                expect(timestamp[1].length).to.equal(4);
            });
            it('should have 4 hexidecimal characters in column 3', function() {
                var timestamp = id.timestamp.split('-');
                expect(timestamp[2].length).to.equal(4);
            });
            it('should have 4 hexidecimal characters in column 4', function() {
                var timestamp = id.timestamp.split('-');
                expect(timestamp[3].length).to.equal(4);
            });
            it('should have 12 hexidecimal characters in column 5', function() {
                var timestamp = id.timestamp.split('-');
                expect(timestamp[4].length).to.equal(12);
            });
		});
	});

});
