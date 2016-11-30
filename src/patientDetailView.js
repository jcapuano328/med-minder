'use strict'

var React = require('react');
import { View, Switch, Text, TextInput, Alert } from 'react-native';
import {DateTimePicker, IconButton, Log} from 'react-native-app-nub';
var ActionListView = require('./widgets/actionListView');
var Patients = require('./services/patients');
var log = Log;

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
    onChangeName(v) {
        this.setState({name: v});
        this.props.onChanged && this.props.onChanged(this.props.patient, {field: 'name', value: v});
    },
    onChangeDob(v) {
        this.setState({dob: v});
        this.props.onChanged && this.props.onChanged(this.props.patient, {field: 'dob', value: v});
    },
    onStatusChanged(v) {
        let status = v ? 'active' : 'inactive';
        this.setState({status: status});
        this.props.onChanged && this.props.onChanged(this.props.patient, {field: 'status', value: status});
    },
    onMedSelected(med) {
        this.setState({currentMed: med});
        this.props.events.emit('changeroute', 'med', {
            name: 'med',
            //title: med.name,
            data: med,
            onChanged: this.onMedChanged,
            onAccept: this.onMedAccept,
            onDiscard: this.onMedDiscard
        });
    },
    onMedAdd() {
        let med = Patients.createNewMed('');
        this.setState({currentMed: med});
        this.props.events.emit('changeroute', 'med', {
            name: 'med',
            title: 'New Medication',
            data: med,
            onChanged: this.onMedChanged,
            onAccept: this.onMedAccept,
            onDiscard: this.onMedDiscard
        });
    },
    onMedRemove(med) {
        Alert.alert('Remove Medication ' + med.name + '?', 'The medication will be permanently removed', [
            {text: 'No', style: 'cancel'},
            {text: 'Yes', onPress: () => {
                log.debug('*********** remove medication ' + med.name);
                var idx = this.state.meds.indexOf(med);
                if (idx > -1) {
                    this.state.meds.splice(idx,1);
                    this.setState({meds: this.state.meds});
                    this.props.onChanged && this.props.onChanged(this.props.patient, {field: 'meds', value: this.state.meds});
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
        //this.props.onChanged && this.props.onChanged(this.props.patient, {fields: meds, value: this.state.meds});
    },
    onMedChanged(med, props) {
        if (this.state.currentMed) {
            this.state.currentMed[props.field] = props.value;
        }
    },
    onMedAccept() {
        let med = this.state.currentMed;
        let idx = this.state.meds.findIndex((m) => m.id == med.id);
        if (idx < 0) {
            //log.debug('adding new med');
            this.state.meds.push(med);
        } else {
            //log.debug('updating existing med');
            Object.assign(this.state.meds[idx], med);
        }
        this.setState({meds: this.state.meds, currentMed: null});
        this.props.onChanged && this.props.onChanged(this.props.patient, {field: 'meds', value: this.state.meds});
        this.props.events.emit('poproute');
    },
    onMedDiscard(med) {
        this.props.events.emit('poproute');
    },
    render() {
        return (
            <View style={{flex: 1,marginTop: 50}}>
                <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                    <TextInput style={{flex: 3, marginLeft: 10, fontSize: 20}} placeholder={'Name'} onChangeText={this.onChangeName}>{this.state.name}</TextInput>
                    <View style={{flex:1, alignItems: 'center', justifyContent: 'center'}}>
                        <Text>Active</Text>
                        <Switch value={this.state.status == 'active'} onValueChange={this.onStatusChanged} />
                    </View>
                </View>
                <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                    <DateTimePicker label={'DOB'} value={this.state.dob} date={true} time={false} onChanged={this.onChangeDob} />
                </View>
                <View style={{flex: 8}}>
                    <ActionListView items={this.state.meds} events={this.props.events}
                        marginTop={0}
                        backgroundColor={'goldenrod'}
                        formatStatus={(m) => m.status}
                        formatTitle={(m) => m.name}
                        formatSubtitle={(m) => m.dosage}
                        onStatus={this.onMedStatusChanged}
                        onAdd={this.onMedAdd}
                        onRemove={this.onMedRemove}
                        onSelect={this.onMedSelected}
                        />
                </View>
            </View>
        );
    }
});

module.exports = PatientDetailView;
