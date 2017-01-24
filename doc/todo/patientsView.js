'use strict'

var React = require('react');
import { View, Alert } from 'react-native';
import ActionListView from '../components/actionListView';
import log from '../components/log';
var Patients = require('./services/patients');
var Reminders = require('./services/reminders');
var moment = require('moment');

var PatientsView = React.createClass({
    getInitialState() {
        return {
            patients: [],
            current: null
        };
    },
    componentWillMount() {
        this.props.events.once('addpatient', this.onAdd);
        return Patients.getAll()
        .then((data) => {
            this.setState({patients: data || []});
            return data;
        })
        .catch((e) => {
            log.error(e);
        })
        .done();
    },
    shouldComponentUpdate(nextProps, nextState) {
        return true;
    },
    onStatus(patient, e) {
        //this.onChanged(patient, e);
        var idx = this.state.patients.indexOf(patient);
        if (idx > -1) {
            this.state.patients[idx][e.field] = e.value ? 'active' : 'inactive';
            Patients.update(this.state.patients[idx])
            .then(() => {
                log.debug('patient updated');
                //log.debug('  updated: ' + this.state.patients[idx].name + ' (' + this.state.patients[idx].id + ')');
                return Reminders.reschedulePatient(patient);
            })
            .then(() => {
                this.setState({patients: Patients.sort(this.state.patients)});
            })
            .catch((e) => {
                log.error(e);
            });
        }
    },
    onChanged(patient, props) {
        if (this.state.current) {
            this.state.current[props.field] = props.value;
        }
    },
    onSelect(patient) {
        this.state.current = patient;
        this.props.events.emit('changeroute', 'patient', {
            name: 'patient',
            //title: patient.name,
            data: patient,
            onChanged: this.onChanged,
            onAccept: this.onAccept,
            onDiscard: this.onDiscard
        });
    },
    onAdd() {
        // This is a problem: how to get this handler attached to the route in the main view?
        this.state.current = Patients.createNewPatient('');
        this.props.events.emit('changeroute', 'patient', {
            name: 'patient',
            title: 'New Patient',
            data: this.state.current,
            onChanged: this.onChanged,
            onAccept: this.onAccept,
            onDiscard: this.onDiscard
        });
        this.props.events.once('addpatient', this.onAdd);
    },
    onRemove(patient) {
        Alert.alert('Remove Patient ' + patient.name + '?', 'The patient and all of their medications will be permanently removed', [
            {text: 'No', style: 'cancel'},
            {text: 'Yes', onPress: () => {
                log.debug('*********** remove patient ' + patient.name);
                var idx = this.state.patients.indexOf(patient);
                if (idx > -1) {
                    Patients.remove(patient)
                    .then(() => {
                        //log.debug('patient removed');
                        this.state.patients.splice(idx,1);
                        this.setState({patients: this.state.patients});
                    })
                    .catch((err) => {
                        log.debug(err);
                    });
                }
            }}
        ]);
    },
    onAccept() {
        let patient = this.state.current;
        log.debug('*********** save patient ' + patient.name + ' (' + patient.id + ')');
        var idx = this.state.patients.findIndex((p) => p.id == patient.id);
        if (idx < 0) {
            //log.debug('adding new patient');
            this.state.patients.push(patient);
            Patients.add(patient)
            .then(() => {
                log.debug('patient added');
                return Reminders.reschedulePatient(patient);
            })
            .then(() => {
                this.setState({patients: Patients.sort(this.state.patients)});
                this.props.events.emit('poproute');
            })
            .catch((e) => {
                log.error(e);
                this.props.events.emit('poproute');
            });
        } else {
            //log.debug('updating existing patient');
            Object.assign(this.state.patients[idx], patient);
            Patients.update(this.state.patients[idx])
            .then(() => {
                log.debug('patient updated');
                //log.debug('  updated: ' + this.state.patients[idx].name + ' (' + this.state.patients[idx].id + ')');
                return Reminders.reschedulePatient(patient);
            })
            .then(() => {
                this.setState({patients: Patients.sort(this.state.patients)});
                this.props.events.emit('poproute');
            })
            .catch((e) => {
                log.error(e);
                this.props.events.emit('poproute');
            });
        }
    },
    onDiscard() {
        this.props.events.emit('poproute');
    },
    render() {
        return (
            <ActionListView items={this.state.patients} events={this.props.events}
                backgroundColor={'goldenrod'}
                formatStatus={(p) => p.status}
                formatTitle={(p) => p.name}
                formatSubtitle={(p) => moment(p.dob).format('MMM DD, YYYY')}
                onStatus={this.onStatus}
                onSelect={this.onSelect}
                onRemove={this.onRemove}
            />
        );
    }
});

module.exports = PatientsView;
