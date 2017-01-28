import { normalize } from 'normalizr';
import { denormalize } from 'denormalizr';
import * as Schemas from '../../src/stores/schemas';

describe('schemas', () => {
    var before = require('../fixtures/patients.json');
    var expected = require('../fixtures/patients-normalized.json');    
    var env = {};
    beforeEach(() => {
        env = {};
        env.after = normalize(before, Schemas.Patients);
        env.back = denormalize(env.after.result, env.after.entities, Schemas.Patients);
    });    

    it('should be normalized', () => {
        //console.log(JSON.stringify(env.after, null, 4));
        expect(env.after).toBeDefined();
        expect(env.after).toEqual(expected);
    });

    it('should be back to denormalized', () => {
        //console.log(JSON.stringify(env.back, null, 4));
        expect(env.back).toEqual(before);
    });
});
