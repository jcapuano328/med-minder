describe('items service', () => {
    var env = {};
    beforeEach(() => {
        env = {};
        env.service = require('../../src/services/items');
    });

    describe('getAll', () => {
        beforeEach(() => {
            return env.service.getAll()
            .then((data) => {
                env.items = data;
            });
        });
        it('should retrieve the items', () => {
            expect(env.items).toBeDefined();
            expect(env.items).toHaveLength(5);
        });
    });
});
