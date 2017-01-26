import {SET_SUBITEMS,ADD_SUBITEM,UPDATE_SUBITEM,REMOVE_SUBITEM} from '../../src/constants/actionTypes';

describe('subitems reducer', () => {
    var env = {};
    beforeEach(() => {
        env = {};
        env.normalized = {
            entities: {
                subitems: {
                    1: {id: 1, name: '1', desc: 'one'},
                    2: {id: 2, name: '2', desc: 'two'},
                    3: {id: 3, name: '3', desc: 'three'}
                }
            }
        };

        env.reducer = require('../../src/reducers/subitems');
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

    describe('SET_SUBITEMS', () => {
        beforeEach(() => {
            env.state = env.reducer(undefined, {type: SET_SUBITEMS, value: env.normalized.entities.subitems});
        });

        it('table should be loaded', () => {
            expect(env.state).toBeDefined();
            expect(env.state).toEqual(env.normalized.entities.subitems);
        });
    });

    describe('ADD_SUBITEM', () => {
        beforeEach(() => {
            env.subitem = {
                id: 10,
                name: '10',
                desc: 'ten'
            };
            env.state = env.reducer(env.normalized.entities.subitems, {type: ADD_SUBITEM, value: env.subitem});
        });

        it('should be added to table', () => {
            expect(env.state).toBeDefined();
            expect(env.state).toEqual({
                ...env.normalized.entities.subitems,
                [env.subitem.id]: {
                    ...env.subitem
                }
            });
        });
    });

    describe('UPDATE_SUBITEM', () => {
        beforeEach(() => {
            env.subitem = {
                ...env.normalized.entities.subitems['1'],
                name: '1-modified',
                desc: 'one-modified'
            };
            env.state = env.reducer(env.normalized.entities.subitems, {type: UPDATE_SUBITEM, value: env.subitem});
        });

        it('should be updated in table', () => {
            expect(env.state).toBeDefined();
            expect(env.state['1']).toEqual(env.subitem);
        });
    });

    describe('REMOVE_SUBITEM', () => {
        beforeEach(() => {
            env.subitem = {
                ...env.normalized.entities.subitems['1']
            };
            env.state = env.reducer(env.normalized.entities.subitems, {type: REMOVE_SUBITEM, value: env.subitem});
        });

        it('should be removed from the table', () => {
            expect(env.state).toBeDefined();
            expect(env.state['1']).toBeUndefined();
        });
    });

});
