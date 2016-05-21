'use strict'

var React = require('react-native');
var { View, ScrollView, Switch, Text, TextInput } = React;
var DateTimePicker = require('./widgets/datetimePicker');
var IconButton = require('./widgets/iconButton');
var PatientMedsView = require('./widgets/patientMedsView');

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
    onMedAdd() {
        console.log('add med');
        //this.props.onAdd && this.props.onAdd();
    },
    onMedRemove(med) {
        console.log('remove med');
        //this.props.onRemove && this.props.onRemove(med);
    },
    onMedSelected(med) {
        console.log('select med');
        this.props.events.emit('changeroute','med', med);
        //this.props.onSelected && this.props.onSelected(med);
    },
    onMedChanged(med, f, v) {
        console.log('med ' + med.name + ' ' + f + ' = ' + v);
        var idx = this.state.meds.indexOf(med);
        if (idx > -1) {
            this.state.meds[idx][f] = v;
            this.setState({meds: this.state.meds});
        }
        //this.props.onChanged && this.props.onChanged({name: f, value: v});
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
                        onChanged={this.onMedChanged}
                        />
                </View>
            </View>
        );
    }
});

module.exports = PatientDetailView;
