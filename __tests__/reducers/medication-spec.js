import {SELECT_SUBITEM,UPDATE_SELECTED_SUBITEM} from '../../src/constants/actionTypes';

describe('subitem reducer', () => {
    var env = {};
    beforeEach(() => {
        env = {};
        env.reducer = require('../../src/reducers/subitem');
    });

    describe('initial', () => {
        beforeEach(() => {
            env.state = env.reducer(undefined, {action: 'INIT'});
        });

        it('should be empty', () => {
            expect(env.state).toBeDefined();
            expect(env.state).toEqual({});
        });
    });

    describe('SELECT_SUBITEM', () => {
        beforeEach(() => {
            env.subitem = {
                id: 1,
                status: true,
                name: '1',
                desc: 'one'
            };

            env.state = env.reducer(undefined, {type: SELECT_SUBITEM, value: env.subitem});
        });

        it('should be loaded', () => {
            expect(env.state).toBeDefined();
            expect(env.state).toEqual(env.subitem);
        });
    });

    describe('UPDATE_SELECTED_SUBITEM', () => {
        beforeEach(() => {
            env.subitem = {
                id: 1,
                name: '1',
                desc: 'one'
            };
        });

        describe('name', () => {
            beforeEach(() => {
                env.modified = {
                    ...env.subitem,
                    name: '1-modified'
                };

                env.state = env.reducer(env.subitem, {type: UPDATE_SELECTED_SUBITEM, value: {field: 'name', value: env.modified.name}});
            });

            it('should not modify the original state', () => {
                expect(env.subitem.name).toEqual('1');
            });
            it('should update new state', () => {
                expect(env.state).toBeDefined();
                expect(env.state).toEqual(env.modified);
            });
        });

        describe('desc', () => {
            beforeEach(() => {
                env.modified = {
                    ...env.subitem,
                    desc: 'one-modified'
                };

                env.state = env.reducer(env.subitem, {type: UPDATE_SELECTED_SUBITEM, value: {field: 'desc', value: env.modified.desc}});
            });

            it('should not modify the original state', () => {
                expect(env.subitem.desc).toEqual('one');
            });
            it('should update new state', () => {
                expect(env.state).toBeDefined();
                expect(env.state).toEqual(env.modified);
            });
        });
    });
});
