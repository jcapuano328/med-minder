import {SELECT_PATIENT,UPDATE_SELECTED_PATIENT,ADD_PATIENT,UPDATE_PATIENT} from '../../src/constants/actionTypes';
import chai, {expect} from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);
import sandbox from '../fixtures/sandboxModuleES6';

describe('Patient actions', () => {
    var env = {};
    beforeEach(() => {
        env = {};
        env.dispatch = sinon.stub();
        env.getState = sinon.stub();
        env.toast = {
            toast: sinon.stub()
        };        
        env.service = {
            add: sinon.stub(),
            update: sinon.stub()
        };        
        env.patient = {
            id: 1,
            name: '1',
            dob: new Date(1993,7,3),
            meds: [10,11,12],
            status: 'active',
            created: new Date(),
            modified: null
        };
        env.actions = sandbox('../../src/actions/patient', {
            requires: {
                '../services/patients': env.service,
                './toast': env.toast                
            }
        });
    });

    describe('select', () => {
        beforeEach(() => {
            return env.actions.select(env.patient)(env.dispatch);
        });

        it('should dispatch SELECT_PATIENT', () => {
            expect(env.dispatch).to.have.been.calledWith({type: SELECT_PATIENT, value: env.patient});
        });
    });

    describe('create', () => {
        beforeEach(() => {
            env.patient = {
                name: 'New Patient',
                dob: null,                                
                meds: [],
                status: 'active',
                created: null,
                modified: null                
            };
            return env.actions.create('New Patient')(env.dispatch);
        });

        it('should dispatch SELECT_PATIENT', () => {
            expect(env.dispatch).to.have.been.calledWith({type: SELECT_PATIENT, value: env.patient});
        });
    });

    describe('accept', () => {
        describe('new', () => {
            beforeEach(() => {
                env.patient = {
                    status: 'active',
                    name: 'New Patient',
                    dob: new Date(2001,2,1),
                    meds: []
                };
                env.getState.returns({currentpatient: env.patient});
                env.service.add.returns(new Promise((resolve,reject) => resolve()));
                return env.actions.accept()(env.dispatch, env.getState);
            });

            it('should invoke the patients service', () => {
                expect(env.service.add).to.have.been.calledOnce;
                expect(env.service.add).to.have.been.calledWith(env.patient);
            });

            it('should dispatch ADD_PATIENT', () => {
                expect(env.dispatch).to.have.been.calledWith({type: ADD_PATIENT, value: env.patient});
            });
        });

        describe('existing', () => {
            beforeEach(() => {
                env.getState.returns({currentpatient: env.patient});
                env.service.update.returns(new Promise((resolve,reject) => resolve()));
                return env.actions.accept()(env.dispatch, env.getState);
            });

            it('should invoke the patients service', () => {
                expect(env.service.update).to.have.been.calledOnce;
                expect(env.service.update).to.have.been.calledWith(env.patient);
            });

            it('should dispatch UPDATE_PATIENT', () => {
                expect(env.dispatch).to.have.been.calledWith({type: UPDATE_PATIENT, value: env.patient});
            });
        });
    });

    describe('setStatus', () => {
        beforeEach(() => {
            return env.actions.setStatus('active')(env.dispatch);
        });

        it('should dispatch UPDATE_SELECTED_PATIENT', () => {
            expect(env.dispatch).to.have.been.calledWith({type: UPDATE_SELECTED_PATIENT, value: {field: 'status', value: 'active'}});
        });
    });

    describe('setName', () => {
        beforeEach(() => {
            return env.actions.setName('a name')(env.dispatch);
        });

        it('should dispatch UPDATE_SELECTED_PATIENT', () => {
            expect(env.dispatch).to.have.been.calledWith({type: UPDATE_SELECTED_PATIENT, value: {field: 'name', value: 'a name'}});
        });
    });

    describe('setDOB', () => {
        beforeEach(() => {
            env.dob = new Date(1995,10,20);
            return env.actions.setDOB(env.dob)(env.dispatch);
        });

        it('should dispatch UPDATE_SELECTED_PATIENT', () => {
            expect(env.dispatch).to.have.been.calledWith({type: UPDATE_SELECTED_PATIENT, value: {field: 'dob', value: env.dob}});
        });
    });
});
