import {SELECT_ITEM,UPDATE_SELECTED_ITEM,ADD_ITEM,UPDATE_ITEM} from '../../src/constants/actionTypes';

describe('item actions', () => {
    var env = {};
    beforeEach(() => {
        env = {};
        env.dispatch = jest.fn();
        env.getState = jest.fn();
        env.item = {
            id: 1,
            status: true,
            name: '1',
            desc: 'one',
            subitems: [10,11,12]
        };
        env.actions = require('../../src/actions/item');
    });

    describe('select', () => {
        beforeEach(() => {
            return env.actions.select(env.item)(env.dispatch);
        });

        it('should dispatch SELECT_ITEM', () => {
            expect(env.dispatch).toHaveBeenCalledWith({type: SELECT_ITEM, value: env.item});
        });
    });

    describe('create', () => {
        beforeEach(() => {
            env.item = {
                status: true,
                name: 'New Item',
                desc: '',
                subitems: []
            };
            return env.actions.create()(env.dispatch);
        });

        it('should dispatch SELECT_ITEM', () => {
            expect(env.dispatch).toHaveBeenCalledWith({type: SELECT_ITEM, value: env.item});
        });
    });

    describe('accept', () => {
        describe('new', () => {
            beforeEach(() => {
                env.item = {
                    status: true,
                    name: 'New Item',
                    desc: '',
                    subitems: []
                };
                env.getState.mockReturnValue({currentitem: env.item});
                return env.actions.accept()(env.dispatch, env.getState);
            });

            it('should dispatch ADD_ITEM', () => {
                expect(env.dispatch).toHaveBeenCalledWith({type: ADD_ITEM, value: env.item});
            });
        });

        describe('existing', () => {
            beforeEach(() => {
                env.getState.mockReturnValue({currentitem: env.item});
                return env.actions.accept()(env.dispatch, env.getState);
            });

            it('should dispatch UPDATE_ITEM', () => {
                expect(env.dispatch).toHaveBeenCalledWith({type: UPDATE_ITEM, value: env.item});
            });
        });
    });

    describe('setStatus', () => {
        beforeEach(() => {
            return env.actions.setStatus('active')(env.dispatch);
        });

        it('should dispatch UPDATE_SELECTED_ITEM', () => {
            expect(env.dispatch).toHaveBeenCalledWith({type: UPDATE_SELECTED_ITEM, value: {field: 'status', value: 'active'}});
        });
    });

    describe('setName', () => {
        beforeEach(() => {
            return env.actions.setName('a name')(env.dispatch);
        });

        it('should dispatch UPDATE_SELECTED_ITEM', () => {
            expect(env.dispatch).toHaveBeenCalledWith({type: UPDATE_SELECTED_ITEM, value: {field: 'name', value: 'a name'}});
        });
    });

    describe('setDesc', () => {
        beforeEach(() => {
            return env.actions.setDesc('a description')(env.dispatch);
        });

        it('should dispatch UPDATE_SELECTED_ITEM', () => {
            expect(env.dispatch).toHaveBeenCalledWith({type: UPDATE_SELECTED_ITEM, value: {field: 'desc', value: 'a description'}});
        });
    });
});
