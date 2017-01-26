import {UPDATE_SUBITEM,REMOVE_SUBITEM} from '../../src/constants/actionTypes';

describe('subitems actions', () => {
    var env = {};
    beforeEach(() => {
        env = {};
        env.subitem = {
            id: 10,
            name: '10',
            desc: 'ten'
        };
        env.dispatch = jest.fn();
        env.actions = require('../../src/actions/subitems');
    });

    describe('update', () => {
        beforeEach(() => {
            return env.actions.update(env.subitem)(env.dispatch);
        });

        it('should dispatch UPDATE_ITEM', () => {
            expect(env.dispatch).toHaveBeenCalledWith({type: UPDATE_SUBITEM, value: env.subitem});
        });
    });

    describe('remove', () => {
        beforeEach(() => {
            return env.actions.remove(env.subitem)(env.dispatch);
        });

        it('should dispatch REMOVE_SUBITEM', () => {
            expect(env.dispatch).toHaveBeenCalledWith({type: REMOVE_SUBITEM, value: env.subitem});
        });
    });
});
