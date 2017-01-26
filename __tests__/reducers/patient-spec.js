import {SELECT_ITEM,UPDATE_SELECTED_ITEM,ADD_SUBITEM,UPDATE_SUBITEM,REMOVE_SUBITEM} from '../../src/constants/actionTypes';

describe('item reducer', () => {
    var env = {};
    beforeEach(() => {
        env = {};
        env.reducer = require('../../src/reducers/item');
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

    describe('SELECT_ITEM', () => {
        beforeEach(() => {
            env.item = {
                id: 1,
                status: true,
                name: '1',
                desc: 'one',
                subitems: [10,12,13]
            };

            env.state = env.reducer(undefined, {type: SELECT_ITEM, value: env.item});
        });

        it('should be loaded', () => {
            expect(env.state).toBeDefined();
            expect(env.state).toEqual(env.item);
        });
    });

    describe('UPDATE_SELECTED_ITEM', () => {
        beforeEach(() => {
            env.item = {
                id: 1,
                status: true,
                name: '1',
                desc: 'one',
                subitems: [10,12,13]
            };
        });

        describe('name', () => {
            beforeEach(() => {
                env.modified = {
                    ...env.item,
                    name: '1-modified'
                };

                env.state = env.reducer(env.item, {type: UPDATE_SELECTED_ITEM, value: {field: 'name', value: env.modified.name}});
            });

            it('should not modify the original state', () => {
                expect(env.item.name).toEqual('1');
            });
            it('should update new state', () => {
                expect(env.state).toBeDefined();
                expect(env.state).toEqual(env.modified);
            });
        });

        describe('desc', () => {
            beforeEach(() => {
                env.modified = {
                    ...env.item,
                    desc: 'one-modified'
                };

                env.state = env.reducer(env.item, {type: UPDATE_SELECTED_ITEM, value: {field: 'desc', value: env.modified.desc}});
            });

            it('should not modify the original state', () => {
                expect(env.item.desc).toEqual('one');
            });
            it('should update new state', () => {
                expect(env.state).toBeDefined();
                expect(env.state).toEqual(env.modified);
            });
        });
    });

    describe('ADD_SUBITEM', () => {
        beforeEach(() => {
            env.item = {
                id: 1,
                status: true,
                name: '1',
                desc: 'one',
                subitems: [10,12,13]
            };
            env.subitem = {
                id: 50,
                name: '50',
                desc: 'fifty'
            };

            env.state = env.reducer(env.item, {type: ADD_SUBITEM, value: env.subitem});
        });

        it('should be added to subitem list', () => {
            expect(env.state).toBeDefined();
            expect(env.state.subitems).toHaveLength(env.item.subitems.length+1);
            expect(env.state.subitems).toEqual(env.item.subitems.concat([env.subitem.id]));
        });
    });

    describe('UPDATE_SUBITEM', () => {
        beforeEach(() => {
            env.item = {
                id: 1,
                status: true,
                name: '1',
                desc: 'one',
                subitems: [10,12,13]
            };
            env.subitem = {
                id: 10,
                name: '10',
                desc: 'ten'
            };

            env.state = env.reducer(env.item, {type: UPDATE_SUBITEM, value: env.subitem});
        });

        it('should not modify the item', () => {
            expect(env.state).toBeDefined();
            expect(env.state).toEqual(env.item);
        });
    });

    describe('REMOVE_SUBITEM', () => {
        beforeEach(() => {
            env.item = {
                id: 1,
                status: true,
                name: '1',
                desc: 'one',
                subitems: [10,12,13]
            };
            env.subitem = {
                id: 10,
                name: '10',
                desc: 'ten'
            };

            env.state = env.reducer(env.item, {type: REMOVE_SUBITEM, value: env.subitem});
        });

        it('should remove the subitem from the list', () => {
            expect(env.state).toBeDefined();
            expect(env.state.subitems).toHaveLength(env.item.subitems.length-1);
            expect(env.state.subitems).not.toContain(env.subitem.id);
        });
    });


});
