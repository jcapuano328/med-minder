import info from '../../src/reducers/info';
import toast from '../../src/reducers/toast';
import items from '../../src/reducers/items';
import item from '../../src/reducers/item';
import subitems from '../../src/reducers/subitems';
import subitem from '../../src/reducers/subitem';

describe('reducers index', () => {
    var env = {};
    beforeEach(() => {
        env = {};
        env.redux = {
            combineReducers: jest.fn()
        };
        jest.mock('redux', () => env.redux);

        env.reducers = require('../../src/reducers');
    });

    it('should combine all reducers', () => {
        expect(env.redux.combineReducers).toHaveBeenCalledWith({
            info: info,
            toast: toast,
            items: items,
            currentitem: item,
            subitems: subitems,
            currentsubitem: subitem
        });
    });
});
