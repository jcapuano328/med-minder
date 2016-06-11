'use strict'

var React = require('react-native');
var { View, ScrollView, Switch, Text, TextInput, Alert } = React;
var DateTimePicker = require('./widgets/datetimePicker');
var IconButton = require('./widgets/iconButton');
var PatientMedsView = require('./widgets/patientMedsView');
var Patients = require('./stores/patients');

var PatientDetailView = React.createClass({
    getInitialState() {
        return {
            name: this.props.patient.name,
            dob: this.props.patient.dob,
            status: this.props.patient.status,
            created: this.props.patient.created,
            modified: this.props.patient.modified,
            meds: this.props.patient.meds
        };
    },
    componentWillMount() {
        this.props.events.once('acceptpatient', this.onAccept);
        this.props.events.once('discardpatient', this.onDiscard);
    },
    onChangeName(v) {
        this.setState({name: v});
        this.props.events && this.props.events.emit('patientchanged', this.props.patient, {field: 'name', value: v});
    },
    onChangeDob(v) {
        this.setState({dob: v});
        this.props.events && this.props.events.emit('patientchanged', this.props.patient, {field: 'dob', value: v});
    },
    onStatusChanged(v) {
        let status = v ? 'active' : 'inactive';
        this.setState({status: status});
        this.props.events && this.props.events.emit('patientchanged', this.props.patient, {field: 'status', value: status});
    },
    onMedSelected(med) {
        this.state.currentMed = med;
        this.props.events.once('savemed', this.onAcceptMed);
        this.props.events.emit('changeroute','med', med);
        //this.props.onSelected && this.props.onSelected(med);
    },
    onMedAdd() {
        let med = Patients.createNewMed('');
        this.state.currentMed = med;
        this.props.events.once('savemed', this.onAcceptMed);
        this.props.events.emit('changeroute','med', med);
    },
    onMedRemove(med) {
        Alert.alert('Remove Medication ' + med.name + '?', 'The medication will be permanently removed', [
            {text: 'No', style: 'cancel'},
            {text: 'Yes', onPress: () => {
                console.log('*********** remove medication ' + med.name);
                var idx = this.state.meds.indexOf(med);
                if (idx > -1) {
                    this.state.meds.splice(idx,1);
                    this.setState({meds: this.state.meds});
                    this.props.events && this.props.events.emit('patientchanged', this.props.patient, {field: 'meds', value: this.state.meds});
                }
            }}
        ]);
    },
    onMedStatusChanged(med, e) {
        let f = e.field;
        let v = e.value;
        var idx = this.state.meds.indexOf(med);
        if (idx > -1) {
            this.state.meds[idx][f] = v;
            this.setState({meds: this.state.meds});
        }
        //this.props.onChanged && this.props.onChanged({name: f, value: v});
    },
    onAcceptMed(med) {
        let idx = this.state.meds.indexOf(this.state.currentMed);
        if (idx < 0) {
            //console.log('adding new med');
            this.state.meds.push(med);
        } else {
            //console.log('updating existing med');
            Object.assign(this.state.meds[idx], med);
        }
        this.setState({meds: this.state.meds, currentMed: null});
        this.props.events && this.props.events.emit('patientchanged', this.props.patient, {field: 'meds', value: this.state.meds});
    },
    onDiscardMed(med) {
        //this.props.events.removeListener('savemed', this.onAcceptMed);
    },
    onAccept() {
        //console.log('======= patient detail saving patient ' + this.state.name);
        this.props.events.emit('savepatient', {
            _id: this.props.patient._id,
            name: this.state.name,
            dob: this.state.dob,
            status: this.state.status,
            created: this.state.created,
            modified: this.state.modified,
            meds: this.state.meds
        });
    },
    onDiscard() {
        //console.log('unsubscribing from savepatient for ' + this.state.name);
        this.props.events.removeAllListeners('savepatient');
    },
    render() {
        return (
            <View style={{
                flex: 1,
                marginTop: 50,
                //backgroundColor: 'rgba(0,0,0,0.01)',
            }}>
                <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                    <TextInput style={{flex: 3, margin: 10, fontSize: 20}} placeholder={'Description'} onChangeText={this.onChangeName}>{this.state.name}</TextInput>
                    <View style={{flex:1, alignItems: 'center', justifyContent: 'center'}}>
                        <Text>Active</Text>
                        <Switch value={this.state.status == 'active'} onValueChange={this.onStatusChanged} />
                    </View>
                </View>
                <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                    <DateTimePicker label={'DOB'} value={this.state.dob} date={true} time={false} onChanged={this.onChangeDob} />
                </View>
                <View style={{flex: 8}}>
                    <PatientMedsView meds={this.state.meds} events={this.props.events}
                        onAdd={this.onMedAdd}
                        onRemove={this.onMedRemove}
                        onSelected={this.onMedSelected}
                        onChanged={this.onMedStatusChanged}
                        />
                </View>
            </View>
        );
    }
});

module.exports = PatientDetailView;