import {SET_ITEMS,ADD_ITEM,UPDATE_ITEM,REMOVE_ITEM} from '../../src/constants/actionTypes';

describe('items reducer', () => {
    var env = {};
    beforeEach(() => {
        env = {};
        env.normalized = {
            result: [1,3,2],
            entities: {
                items: {
                    1: {id: 1, status: true, name: '1', desc: 'one', subitems: [10,12,11]},
                    2: {id: 2, status: false, name: '2', desc: 'two', subitems: []},
                    3: {id: 3, status: true, name: '3', desc: 'three', subitems: []}
                }
            }
        };

        env.reducer = require('../../src/reducers/items');
    });

    describe('initial', () => {
        beforeEach(() => {
            env.state = env.reducer(undefined, {action: 'INIT'});
        });

        it('should be empty', () => {
            expect(env.state).toBeDefined();
            expect(env.state.sort).toBeDefined();
            expect(env.state.sort).toHaveLength(0);
            expect(env.state.table).toBeDefined();
            expect(env.state.table).toEqual({});
        });
    });

    describe('SET_ITEMS', () => {
        beforeEach(() => {
            env.state = env.reducer(undefined, {type: SET_ITEMS, value: {ids: env.normalized.result, items: env.normalized.entities.items}});
        });

        it('should be loaded', () => {
            expect(env.state).toBeDefined();
        });

        it('ordered list should be loaded', () => {
            expect(env.state).toBeDefined();
            expect(env.state.sort).toBeDefined();
            expect(env.state.sort).toHaveLength(3);
            expect(env.state.sort).toEqual(env.normalized.result);
        });

        it('table should be loaded', () => {
            expect(env.state.table).toBeDefined();
            expect(env.state.table).toEqual(env.normalized.entities.items);
        });
    });

    describe('ADD_ITEM', () => {
        beforeEach(() => {
            env.initialState = {
                sort: env.normalized.result,
                table: env.normalized.entities.items
            };
            env.item = {
                id: 10,
                status: true,
                name: '10',
                desc: 'ten',
                subitems: []
            };
            env.state = env.reducer(env.initialState, {type: ADD_ITEM, value: env.item});
        });

        it('should be added to ordered list', () => {
            expect(env.state.sort).toBeDefined();
            expect(env.state.sort).toHaveLength(env.initialState.sort.length + 1);
            expect(env.state.sort).toEqual(env.initialState.sort.concat([env.item.id]));
        });

        it('should be added to table', () => {
            expect(env.state.table).toBeDefined();
            expect(env.state.table).toEqual({
                ...env.normalized.entities.items,
                [10]: {
                    ...env.item
                }
            });
        });
    });

    describe('UPDATE_ITEM', () => {
        beforeEach(() => {
            env.initialState = {
                sort: env.normalized.result,
                table: env.normalized.entities.items
            };
            env.item = {
                ...env.initialState.table['1'],
                status: false,
                name: '1-modified',
                desc: 'one-modified'
            };
            env.state = env.reducer(env.initialState, {type: UPDATE_ITEM, value: env.item});
        });

        it('should be in the ordered list', () => {
            expect(env.state.sort).toBeDefined();
            expect(env.state.sort).toHaveLength(env.initialState.sort.length);
            expect(env.state.sort).toEqual(env.initialState.sort);
        });

        it('should be updated in table', () => {
            expect(env.state.table).toBeDefined();
            expect(env.state.table['1']).toEqual(env.item);
        });
    });

    describe('REMOVE_ITEM', () => {
        beforeEach(() => {
            env.initialState = {
                sort: env.normalized.result,
                table: env.normalized.entities.items
            };
            env.item = {
                ...env.initialState.table['1']
            };
            env.state = env.reducer(env.initialState, {type: REMOVE_ITEM, value: env.item});
        });

        it('should be out of the ordered list', () => {
            expect(env.state.sort).toBeDefined();
            expect(env.state.sort).toHaveLength(env.initialState.sort.length - 1);
            expect(env.state.sort).toEqual(env.initialState.sort.slice(1));
        });

        it('should be removed from the table', () => {
            expect(env.state.table).toBeDefined();
            expect(env.state.table['1']).toBeUndefined();
        });
    });

});
