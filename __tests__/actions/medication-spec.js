import {SELECT_SUBITEM,UPDATE_SELECTED_SUBITEM,ADD_SUBITEM,UPDATE_SUBITEM} from '../../src/constants/actionTypes';

describe('subitem actions', () => {
    var env = {};
    beforeEach(() => {
        env = {};
        env.dispatch = jest.fn();
        env.getState = jest.fn();
        env.subitem = {
            id: 10,
            name: '10',
            desc: 'ten'
        };
        env.actions = require('../../src/actions/subitem');
    });

    describe('select', () => {
        beforeEach(() => {
            return env.actions.select(env.subitem)(env.dispatch);
        });

        it('should dispatch SELECT_SUBITEM', () => {
            expect(env.dispatch).toHaveBeenCalledWith({type: SELECT_SUBITEM, value: env.subitem});
        });
    });

    describe('create', () => {
        beforeEach(() => {
            env.subitem = {
                name: 'New SubItem',
                desc: ''
            };
            return env.actions.create()(env.dispatch);
        });

        it('should dispatch SELECT_SUBITEM', () => {
            expect(env.dispatch).toHaveBeenCalledWith({type: SELECT_SUBITEM, value: env.subitem});
        });
    });

    describe('accept', () => {
        describe('new', () => {
            beforeEach(() => {
                env.subitem = {
                    name: 'New SubItem',
                    desc: ''
                };
                env.getState.mockReturnValue({currentsubitem: env.subitem});
                return env.actions.accept()(env.dispatch, env.getState);
            });

            it('should dispatch ADD_SUBITEM', () => {
                expect(env.dispatch).toHaveBeenCalledWith({type: ADD_SUBITEM, value: env.subitem});
            });
        });

        describe('existing', () => {
            beforeEach(() => {
                env.getState.mockReturnValue({currentsubitem: env.subitem});
                return env.actions.accept()(env.dispatch, env.getState);
            });

            it('should dispatch UPDATE_SUBITEM', () => {
                expect(env.dispatch).toHaveBeenCalledWith({type: UPDATE_SUBITEM, value: env.subitem});
            });
        });
    });

    describe('setName', () => {
        beforeEach(() => {
            return env.actions.setName('a name')(env.dispatch);
        });

        it('should dispatch UPDATE_SELECTED_SUBITEM', () => {
            expect(env.dispatch).toHaveBeenCalledWith({type: UPDATE_SELECTED_SUBITEM, value: {field: 'name', value: 'a name'}});
        });
    });

    describe('setDesc', () => {
        beforeEach(() => {
            return env.actions.setDesc('a description')(env.dispatch);
        });

        it('should dispatch UPDATE_SELECTED_SUBITEM', () => {
            expect(env.dispatch).toHaveBeenCalledWith({type: UPDATE_SELECTED_SUBITEM, value: {field: 'desc', value: 'a description'}});
        });
    });
});
