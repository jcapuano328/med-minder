import guid from '../../src/services/guid';

describe('guid', () => {
	var env = {};

	beforeEach(() => {
        env = {};
	})

	describe('Testing rfc4122 version 1 (timestamp GUID)', () => {
		beforeEach(() => {
			env.timestamp = guid.v1();			
		});

        it('should expect timestamp id to be defined', () => {
            expect(env.timestamp).toBeDefined();
        });
		it('should expect the length of the string to be 36 chars long', () => {
			expect(env.timestamp).toHaveLength(36);
		});
		it('should expect the version number 1 to be at index 14 in the string', () => {
			expect(env.timestamp[14]).toBe('1');
		});
        it('should have 5 columns', () => {
            var timestamp = env.timestamp.split('-');
            expect(timestamp).toHaveLength(5);
        });
        it('should have 8 hexidecimal characters in column 1', () => {
            var timestamp = env.timestamp.split('-');
            expect(timestamp[0]).toHaveLength(8);
        });
        it('should have 4 hexidecimal characters in column 2', () => {
            var timestamp = env.timestamp.split('-');
            expect(timestamp[1]).toHaveLength(4);
        });
        it('should have 4 hexidecimal characters in column 3', () => {
            var timestamp = env.timestamp.split('-');
            expect(timestamp[2]).toHaveLength(4);
        });
        it('should have 4 hexidecimal characters in column 4', () => {
            var timestamp = env.timestamp.split('-');
            expect(timestamp[3]).toHaveLength(4);
        });
        it('should have 12 hexidecimal characters in column 5', () => {
            var timestamp = env.timestamp.split('-');
            expect(timestamp[4]).toHaveLength(12);
        });
	});

	describe('Testing rfc4122 version 4 spec (random GUID)', () => {
		beforeEach(() => {
			env.random = guid.v4();
		});

        it('should expect random id to be defined', () => {
            expect(env.random).toBeDefined();
        });

		it('should expect the length of the string to be 36 chars long', () => {
			expect(env.random).toHaveLength(36);
		});
		it('should expect the version number 4 to be at index 14 in the string', () => {
			expect(env.random[14]).toBe('4');
		});
        it('should have 5 columns', () => {
            var randomarray = env.random.split('-');
            expect(randomarray).toHaveLength(5);
        });
        it('should have 8 hexidecimal characters in column 1', () => {
            var randomarray = env.random.split('-');
            expect(randomarray[0]).toHaveLength(8);
        });
        it('should have 4 hexidecimal characters in column 2', () => {
            var randomarray = env.random.split('-');
            expect(randomarray[1]).toHaveLength(4);
        });
        it('should have 4 hexidecimal characters in column 3', () => {
            var randomarray = env.random.split('-');
            expect(randomarray[2]).toHaveLength(4);
        });
        it('should have 4 hexidecimal characters in column 4', () => {
            var randomarray = env.random.split('-');
            expect(randomarray[3]).toHaveLength(4);
        });
        it('should have 12 hexidecimal characters in column 5', () => {
            var randomarray = env.random.split('-');
            expect(randomarray[4]).toHaveLength(12);
        });
	});

});
