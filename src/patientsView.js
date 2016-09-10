'use strict'

var React = require('react');
import { View, ScrollView, Text, Alert } from 'react-native';
var Icons = require('./icons');
var PatientsItemView = require('./patientsItemView');
var Patients = require('./services/patients');
var Reminders = require('./services/reminders');
var log = require('./services/log');

var PatientsView = React.createClass({
    getInitialState() {
        return {
            patients: []
        };
    },
    componentWillMount() {
        //log.debug('subscribe to addpatient');
        this.props.events.once('addpatient', this.onAdd);
        return Patients.getAll()
        .then((data) => {
            this.setState({patients: data || []});
//this.props.events.emit('changeroute','med', data[0].meds[0]);
            return data;
        })
        .catch((e) => {
            log.error(e);
        })
        .done();
    },
    onSelected(patient) {
        return () => {
            //log.debug('selected: ' + patient.name + ' (' + patient._id + ')');
            //log.debug('subscribe to savepatient for ' + patient.name);
            this.props.events.once('savepatient', this.onSave);
            this.props.events.emit('changeroute','patient', patient);
            //this.props.onSelected && this.props.onSelected(patient);
        }
    },
    onAdd() {
        let patient = Patients.createNewPatient('');
        //log.debug('subscribe to addpatient ' + patient.name);
        this.props.events.once('addpatient', this.onAdd);
        //log.debug('subscribe to savepatient for ' + patient.name);
        this.props.events.once('savepatient', this.onSave);

        this.props.events.emit('changeroute','patient', patient);
    },
    onRemove(patient) {
        return () => {
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
        }
    },
    onStatusChanged(patient, e) {
        //this.onChanged(patient, e);
        patient[e.field] = e.value;
        this.onSave(patient);
    },
    onSave(patient) {
        log.debug('*********** save patient ' + patient.name + ' (' + patient._id + ')');
        var idx = this.state.patients.findIndex((p) => {
            return p._id == patient._id;
        });
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
            })
            .catch((e) => {
                log.error(e);
            });
        } else {
            //log.debug('updating existing patient');
            Object.assign(this.state.patients[idx], patient);
            Patients.update(this.state.patients[idx])
            .then(() => {
                log.debug('patient updated');
                //log.debug('  updated: ' + this.state.patients[idx].name + ' (' + this.state.patients[idx]._id + ')');
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
    render() {
        return (
            <View style={{
                flex: 1,
                marginTop: 60,
                //backgroundColor: 'rgba(0,0,0,0.01)',
            }}>
                {this.state.patients.length > 0                
                    ? (
                        <ScrollView
                            automaticallyAdjustContentInsets={false}
                            scrollEventThrottle={200}
                            style={{flex: 1,backgroundColor: 'transparent'}}>
                            {this.state.patients.map((patient, i) => {
                                return (
                                    <View key={i} style={{flex: 1}}>
                                    <PatientsItemView key={i} patient={patient}
                                        onSelected={this.onSelected(patient)}
                                        onRemove={this.onRemove(patient)}
                                        onChanged={this.onStatusChanged}
                                        />
                                    </View>
                                );
                            })}
                        </ScrollView>
                    )
                    : (
                        <View style={{flex:1, marginTop: 250, alignItems: 'center'}}>
                            <Text style={{fontSize: 28, fontWeight: 'bold'}}>No Patients</Text>
                        </View>
                    )
                }
            </View>
        );
    }
});

module.exports = PatientsView;
