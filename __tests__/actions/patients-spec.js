import {SET_PATIENTS,SET_MEDICATIONS,UPDATE_PATIENT,REMOVE_PATIENT} from '../../src/constants/actionTypes';
import * as Schemas from '../../src/stores/schemas';
import chai, {expect} from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import sandbox from '../fixtures/sandboxModuleES6';
chai.use(sinonChai);

describe('Patients actions', () => {
    var env = {};
    beforeEach(() => {
        env = {};
        env.dispatch = sinon.stub();
        env.toast = {
            toast: sinon.stub()
        };
        env.service = {
            getAll: sinon.stub(),
            update: sinon.stub(),
            remove: sinon.stub()
        };
        env.normalizr = {
            normalize: sinon.stub()
        };
        env.data = {
            patients: require('../fixtures/patients.json'),
            normalized: require('../fixtures/patients-normalized.json')
        };

        env.actions = sandbox('../../src/actions/patients', {
            requires: {
                'normalizr': env.normalizr,         
                '../stores/schemas': Schemas,       
                '../services/patients': env.service,
                './toast': env.toast                
            }
        });
    });

    describe('getAll', () => {
        beforeEach(() => {
            env.service.getAll.returns(new Promise((resolve,reject) => resolve(env.data.patients)));
            env.normalizr.normalize.returns(env.data.normalized);
            return env.actions.getAll()(env.dispatch);
        });

        it('should invoke the patients service', () => {
            expect(env.service.getAll).to.have.been.calledOnce;
        });

        it('should normalize the data', () => {
            expect(env.normalizr.normalize).to.have.been.calledOnce;
            expect(env.normalizr.normalize).to.have.been.calledWith(env.data.patients, Schemas.Patients);
        });

        it('should dispatch SET_PATIENTS', () => {
            expect(env.dispatch).to.have.been.calledWith({type: SET_PATIENTS, value: {ids: env.data.normalized.result, patients: env.data.normalized.entities.patients}});
        });

        it('should dispatch SET_MEDICATIONS', () => {
            expect(env.dispatch).to.have.been.calledWith({type: SET_MEDICATIONS, value: env.data.normalized.entities.medications});
        });

        it('should not raise an error', () => {
            expect(env.toast.toast).to.not.have.been.called;
        });
    });

    describe('remove', () => {
        beforeEach(() => {
            env.service.remove.returns(new Promise((resolve,reject) => resolve()));
            env.patient = env.data.normalized.entities.patients[env.data.normalized.result[0]];
            return env.actions.remove(env.patient)(env.dispatch);
        });

        it('should invoke the patients service', () => {
            expect(env.service.remove).to.have.been.calledOnce;
            expect(env.service.remove).to.have.been.calledWith(env.patient);
        });

        it('should dispatch REMOVE_PATIENT', () => {
            expect(env.dispatch).to.have.been.calledWith({type: REMOVE_PATIENT, value: env.patient});
        });

        it('should not raise an error', () => {
            expect(env.toast.toast).to.not.have.been.called;
        });        
    });

    describe('setStatus', () => {
        beforeEach(() => {
            env.service.update.returns(new Promise((resolve,reject) => resolve()));
            env.patient = {
                ...env.data.normalized.entities.patients[env.data.normalized.result[0]],
                status: 'inactive'
            };
            return env.actions.setStatus(env.patient, 'active')(env.dispatch);
        });

        it('should set status to active', () => {
            expect(env.patient.status).to.equal('active');
        });

        it('should invoke the patients service', () => {
            expect(env.service.update).to.have.been.calledOnce;
            expect(env.service.update).to.have.been.calledWith(env.patient);
        });

        it('should dispatch UPDATE_PATIENT', () => {
            expect(env.dispatch).to.have.been.calledWith({type: UPDATE_PATIENT, value: env.patient});
        });

        it('should not raise an error', () => {
            expect(env.toast.toast).to.not.have.been.called;
        });                
    });

});
