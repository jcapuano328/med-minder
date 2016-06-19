'use strict'

var React = require('react-native');
var { View, ScrollView, Text, Alert } = React;
var Icons = require('./resources/icons');
var PatientsItemView = require('./widgets/patientsItemView');
var Patients = require('./stores/patients');
var Reminders = require('./stores/reminders');

var PatientsView = React.createClass({
    getInitialState() {
        return {
            patients: []
        };
    },
    componentWillMount() {
        //console.log('subscribe to addpatient');
        this.props.events.once('addpatient', this.onAdd);
        return Patients.getAll()
        .then((data) => {
            this.setState({patients: data || []});
//this.props.events.emit('changeroute','med', data[0].meds[0]);
            return data;
        })
        .catch((e) => {
            console.error(e);
        });
    },
    onSelected(patient) {
        return () => {
            //console.log('selected: ' + patient.name + ' (' + patient._id + ')');
            //console.log('subscribe to savepatient for ' + patient.name);
            this.props.events.once('savepatient', this.onSave);
            this.props.events.emit('changeroute','patient', patient);
            //this.props.onSelected && this.props.onSelected(patient);
        }
    },
    onAdd() {
        let patient = Patients.createNewPatient('');
        //console.log('subscribe to addpatient ' + patient.name);
        this.props.events.once('addpatient', this.onAdd);
        //console.log('subscribe to savepatient for ' + patient.name);
        this.props.events.once('savepatient', this.onSave);

        this.props.events.emit('changeroute','patient', patient);
    },
    onRemove(patient) {
        return () => {
            Alert.alert('Remove Patient ' + patient.name + '?', 'The patient and all of their medications will be permanently removed', [
                {text: 'No', style: 'cancel'},
                {text: 'Yes', onPress: () => {
                    console.log('*********** remove patient ' + patient.name);
                    var idx = this.state.patients.indexOf(patient);
                    if (idx > -1) {
                        Patients.remove(patient)
                        .then(() => {
                            //console.log('patient removed');
                            this.state.patients.splice(idx,1);
                            this.setState({patients: this.state.patients});
                        })
                        .catch((err) => {
                            console.log(err);
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
        console.log('*********** save patient ' + patient.name + ' (' + patient._id + ')');
        var idx = this.state.patients.findIndex((p) => {
            return p._id == patient._id;
        });
        if (idx < 0) {
            //console.log('adding new patient');
            this.state.patients.push(patient);
            Patients.add(patient)
            .then(() => {
                console.log('patient added');
                return Reminders.reschedulePatient(patient);
            })
            .then(() => {
                this.setState({patients: Patients.sort(this.state.patients)});
            })            
            .catch((e) => {
                console.error(e);
            });
        } else {
            //console.log('updating existing patient');
            Object.assign(this.state.patients[idx], patient);
            Patients.update(this.state.patients[idx])
            .then(() => {
                console.log('patient updated');
                //console.log('  updated: ' + this.state.patients[idx].name + ' (' + this.state.patients[idx]._id + ')');
                return Reminders.reschedulePatient(patient);
            })
            .then(() => {
                this.setState({patients: Patients.sort(this.state.patients)});
            })
            .catch((e) => {
                console.error(e);
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
