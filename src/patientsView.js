'use strict'

var React = require('react');
import { View, Navigator, Alert } from 'react-native';
var TitleBar = require('./widgets/titleBar');
var PatientListView = require('./patientListView');
var PatientDetailView = require('./patientDetailView');
var Patients = require('./services/patients');
var log = require('./services/log');

var PatientsView = React.createClass({
    getInitialState() {
        return {
            patients: []
        };
    },
    componentDidMount() {
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
    shouldComponentUpdate(nextProps, nextState) {
        return true;
    },
    onStatus(patient, e) {
        //this.onChanged(patient, e);
        var idx = this.state.patients.indexOf(patient);
        if (idx > -1) {
            this.state.patients[idx][e.field] = e.value;
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
    onSelect(patient) {
        console.log('select patient ' + patient.name);
        this.refs.navigator.push({name: 'patient', index: 1, title: patient.name, patient: patient, onAccept: this.onAccept, onDiscard: this.onDiscard});
    },
    onAdd() {
        let patient = Patients.createNewPatient('');
        this.refs.navigator.push({name: 'patient', index: 1, title: patient.name, patient: patient, onAccept: this.onAccept, onDiscard: this.onDiscard});
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
    onAccept(o) {
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
                this.refs.navigator.pop();
            })
            .catch((e) => {
                log.error(e);
                this.refs.navigator.pop();
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
                this.refs.navigator.pop();
            })
            .catch((e) => {
                log.error(e);
                this.refs.navigator.pop();
            });
        }
    },
    onDiscard() {
        this.refs.navigator.pop();
    },
    render() {
        return (
            <View style={{flex: 1, marginTop: 60}}>
                <Navigator
                  ref="navigator"
                  initialRoute={{name: 'list', index: 0, title: 'Patients', onAdd: this.onAdd}}
                  navigationBar={<Navigator.NavigationBar style={{backgroundColor: 'gold'}} routeMapper={TitleBar({nomenu: true})} />}
                  renderScene={(route, navigator) => {
                      if (route.name == 'patient') {
                          return (
                              <PatientDetailView patient={route.patient} events={this.props.events} />
                          );
                      }
                      return (
                          <PatientListView patients={this.state.patients} events={this.props.events}
                            onStatus={this.onStatus}
                            onSelect={this.onSelect}
                            onRemove={this.onRemove}
                          />
                      );
                  }}
                />
            </View>
        );
    }
});

module.exports = PatientsView;
