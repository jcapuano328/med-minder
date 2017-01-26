import {SET_ITEMS,SET_SUBITEMS,UPDATE_ITEM,REMOVE_ITEM} from '../../src/constants/actionTypes';
import * as Schemas from '../../src/stores/schemas';

describe('items actions', () => {
    var env = {};
    beforeEach(() => {
        env = {};
        env.dispatch = jest.fn();
        env.toast = {
            toast: jest.fn()
        };
        env.service = {
            getAll: jest.fn()
        };
        env.normalizr = {
            normalize: jest.fn()
        };
        jest.mock('../../src/actions/toast', () => env.toast);
        jest.mock('../../src/services/items', () => env.service);
        jest.mock('normalizr', () => env.normalizr);

        env.items = require('../fixtures/items-nested.json');
        env.normalized = require('../fixtures/items-normalized.json');
        env.actions = require('../../src/actions/items');
    });

    describe('getAll', () => {
        beforeEach(() => {
            env.service.getAll.mockReturnValue(new Promise((resolve,reject) => resolve(env.items)));
            env.normalizr.normalize.mockReturnValue(env.normalized);
            return env.actions.getAll()(env.dispatch);
        });

        it('should invoke the items service', () => {
            expect(env.service.getAll).toHaveBeenCalledTimes(1);
        });

        xit('should normalize the data', () => {
            expect(env.normalizr.normalize).toHaveBeenCalledTimes(1);
            expect(env.normalizr.normalize).toHaveBeenCalledWith(env.items, Schemas.items);
        });

        it('should dispatch SET_ITEMS', () => {
            expect(env.dispatch).toHaveBeenCalledWith({type: SET_ITEMS, value: {ids: env.normalized.result, items: env.normalized.entities.items}});
        });

        it('should dispatch SET_SUBITEMS', () => {
            expect(env.dispatch).toHaveBeenCalledWith({type: SET_SUBITEMS, value: env.normalized.entities.subitems});
        });

        it('should not raise an error', () => {
            expect(env.toast.toast).not.toHaveBeenCalled();
        });
    });

    describe('update', () => {
        beforeEach(() => {
            env.item = env.normalized.entities.items['1'];
            return env.actions.update(env.item)(env.dispatch);
        });

        it('should dispatch UPDATE_ITEM', () => {
            expect(env.dispatch).toHaveBeenCalledWith({type: UPDATE_ITEM, value: env.item});
        });
    });

    describe('remove', () => {
        beforeEach(() => {
            env.item = env.normalized.entities.items['1'];
            return env.actions.remove(env.item)(env.dispatch);
        });

        it('should dispatch REMOVE_ITEM', () => {
            expect(env.dispatch).toHaveBeenCalledWith({type: REMOVE_ITEM, value: env.item});
        });
    });

    describe('setStatus', () => {
        beforeEach(() => {
            env.item = {
                ...env.normalized.entities.items['1'],
                status: false
            };
            return env.actions.setStatus(env.item, 'active')(env.dispatch);
        });

        it('should set status to true', () => {
            expect(env.item.status).toBe(true);
        });

        it('should dispatch UPDATE_ITEM', () => {
            expect(env.dispatch).toHaveBeenCalledWith({type: UPDATE_ITEM, value: env.item});
        });
    });

});
