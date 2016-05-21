'use strict'

var React = require('react-native');
var { View, ScrollView, Text, Alert } = React;
var Icons = require('./resources/icons');
var PatientsItemView = require('./widgets/patientsItemView');
var PatientsStore = require('./stores/patients');

var PatientsView = React.createClass({
    getInitialState() {
        return {
            patients: []
        };
    },
    componentWillMount() {
        this.props.events.addListener('addpatient', this.onAdd);
        this.props.events.addListener('acceptpatient', this.onAccept);
        this.props.events.addListener('discardpatient', this.onDiscard);
        this.props.events.addListener('patientchanged', this.onChanged);

        return PatientsStore.getAll()
        .then((data) => {
            this.setState({patients: data || []});
            return data;
        })
        .catch((e) => {
            console.error(e);
        });
    },
    onSelected(patient) {
        return () => {
            this.props.events.emit('changeroute','patient', patient);
            //this.props.onSelected && this.props.onSelected(patient);
        }
    },
    onAdd() {
        let patient = PatientsStore.createNewPatient('');
        this.setState({newPatient: patient});
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
                        PatientsStore.remove(patient)
                        .then(() => {
                            console.log('patient removed');
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
    onChanged(patient, e) {
        console.log('patient ' + patient.name + ' changed: ' + e.field + ' = ' + e.value);
        let field = e.field;
        let value = e.value;
        let idx = this.state.patients.indexOf(patient);
        if (idx > -1) {
            this.state.patients[idx][field] = value;
            this.setState({patients: PatientsStore.sort(this.state.patients)});
        } else if (this.state.newPatient) {
            this.state.newPatient[field] = value;
            this.setState({newPatient: this.state.newPatient});
        }
    },
    onStatusChanged(patient, e) {
        this.onChanged(patient, e);
        this.onAccept(patient);
    },
    onAccept(patient) {
        if (this.state.patients.indexOf(patient) < 0) {
            console.log('adding new patient');
            this.state.patients.push(patient);
            PatientsStore.add(patient)
            .then(() => {
                console.log('patient added');
            })
            .catch((e) => {
                console.error(e);
            });
        } else {
            console.log('updating existing patient');
            PatientsStore.update(patient)
            .then(() => {
                console.log('patient updated');
            })
            .catch((e) => {
                console.error(e);
            });
        }
        this.setState({patients: PatientsStore.sort(this.state.patients)});
    },
    onDiscard(patient) {

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
