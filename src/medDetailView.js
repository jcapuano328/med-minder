'use strict'

var React = require('react');
import { View, Switch, Text, TextInput, Picker } from 'react-native';
var TypeAhead = require('./widgets/typeahead');
var SelectList = require('./widgets/selectList');
var TimeOfDay = require('./timeOfDay');
var RxNav = require('./services/rxnav');
var Scheduler = require('./services/scheduler');
var moment = require('moment');

var frequencies = [
    {name: 'Daily', value: 'Daily', filter: 1},
    {name: 'Alternating Days', value: 'Alternating Days', filter: 1},
    {name: 'Every 3 Days', value: 'Every 3 Days', filter: 2},
    {name: 'Every 4 Days', value: 'Every 4 Days', filter: 2},
    {name: 'Every 5 Days', value: 'Every 5 Days', filter: 2},
    {name: 'Every 6 Days', value: 'Every 6 Days', filter: 2},
    {name: 'Weekly', value: 'Weekly', filter: 2},
    {name: 'Alternating Weeks', value: 'Alternating Weeks', filter: 2},
    {name: 'Monthly', value: 'Monthly', filter: 2}
];

var days = [
    {name: 'Today', value: 'Today', filter: 1},
    {name: 'Tomorrow', value: 'Tomorrow', filter: 1},
    {name: 'Sunday', value: 'Sunday', filter: 2},
    {name: 'Monday', value: 'Monday', filter: 2},
    {name: 'Tuesday', value: 'Tuesday', filter: 2},
    {name: 'Wednesday', value: 'Wednesday', filter: 2},
    {name: 'Thursday', value: 'Thursday', filter: 2},
    {name: 'Friday', value: 'Friday', filter: 2},
    {name: 'Saturday', value: 'Saturday', filter: 2}
];

var MedDetailView = React.createClass({
    getInitialState() {
        return {
            name: this.props.med.name,
            nameFocused: false,
            dosage: this.props.med.dosage,
            instructions: this.props.med.instructions,
            frequency: this.props.med.schedule.frequency,
            dow: this.props.med.schedule.dow,
            tod: this.props.med.schedule.tod,
            status: this.props.med.status,
            created: this.props.med.created,
            modified: this.props.med.modified,
            dows: this.filterDOW(this.props.med.schedule.frequency)
        };
    },
    filterDOW(frequency) {
        var f = frequencies.find((f) => frequency == f.value) || {filter: 1};
        return days.filter((day) => f.filter == day.filter);
    },
    onChangeName(v) {
        this.setState({name: v, nameFocused: true});
        this.props.onChanged && this.props.onChanged(this.props.med, {field: 'name', value: v});
    },
    onChangeDosage(v) {
        this.setState({dosage: v, nameFocused: false});
        this.props.onChanged && this.props.onChanged(this.props.med, {field: 'dosage', value: v});
    },
    onChangeInstructions(v) {
        this.setState({instructions: v, nameFocused: false});
        this.props.onChanged && this.props.onChanged(this.props.med, {field: 'instructions', value: v});
    },
    onStatusChanged(v) {
        let status = v ? 'active' : 'inactive';
        this.setState({status: status, nameFocused: false});
        this.props.onChanged && this.props.onChanged(this.props.med, {field: 'status', value: v});
    },
    onFrequencyChanged(v) {
        let dows = this.filterDOW(v);
        let dow = dows.find((d) => d.value == this.state.dow) ? this.state.dow : dows[0].value;
        this.setState({frequency: v, dows: dows, dow: dow, nameFocused: false});
        this.props.onChanged && this.props.onChanged(this.props.med, {field: 'frequency', value: v});
    },
    onDayOfWeekChanged(v) {
        this.setState({dow: v, nameFocused: false});
        this.props.onChanged && this.props.onChanged(this.props.med, {field: 'dow', value: v});
    },
    onTimeOfDayChanged(tod, v) {
        let s = this.state.tod;
        s[tod] = v;
        this.setState({tod: s, nameFocused: false});
        this.props.onChanged && this.props.onChanged(this.props.med, {field: 'tod', value: s});
    },
    onFocus() {
        this.setState({nameFocused: false});
    },
    render() {
        //<TextInput style={{flex: 2, margin: 10, fontSize: 20}} placeholder={'Name'} onChangeText={this.onChangeName}>{this.state.name}</TextInput>
        return (
            <View style={{
                //flex: 1,
                marginTop: 50
            }}>
                <View style={{flex: 1, flexDirection: 'row'}}>
                    <View style={{flex: 2, margin: 10}}>
                        <TypeAhead value={this.state.name} placeholder={'Name'} onChangeValue={this.onChangeName} find={RxNav.find} focused={this.state.nameFocused}/>
                    </View>
                    <TextInput style={{flex: 1, margin: 10, fontSize: 20}} placeholder={'Dosage'} onChangeText={this.onChangeDosage} onFocus={this.onFocus}>{this.state.dosage}</TextInput>
                </View>
                <TextInput style={{margin: 10, fontSize: 20}} placeholder={'Instructions'} multiline={true} onChangeText={this.onChangeInstructions} onFocus={this.onFocus}>{this.state.instructions}</TextInput>
                <View style={{margin: 10}}>
                    <View style={{flex: .5, flexDirection: 'row', justifyContent: 'center'}}>
                        <Text style={{flex: 3, fontSize: 20,fontWeight: 'bold', fontStyle: 'italic', marginLeft: 5, marginTop: 10}}>Schedule</Text>
                        <View style={{flex:1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                            <Text>Active</Text>
                            <Switch value={this.state.status == 'active'} onValueChange={this.onStatusChanged} />
                        </View>
                    </View>
                    <View style={{flex: 4, flexDirection: 'row', justifyContent: 'center'}}>
                        <View style={{flex: 1, borderRightWidth: 1, borderRightColor: 'gray'}}>
                            <SelectList title={'Interval'} titleonly={true} items={frequencies.map((f) => {return {label: f.name, value: f.value};})} selected={this.state.frequency} onChanged={this.onFrequencyChanged}/>
                        </View>
                        <View style={{flex: 1}}>
                            <SelectList title={'Day of Week'} titleonly={true} items={this.state.dows.map((f) => {return {label: f.name, value: f.value};})} selected={this.state.dow} onChanged={this.onDayOfWeekChanged}/>
                        </View>
                    </View>
                    <View style={{flex: 1, justifyContent: 'center'}}>
                        {/*<Text style={{flex: 1, fontSize: 16,fontWeight: 'bold', marginLeft: 15, marginTop: 13}}>Time of Day</Text>*/}
                        <View style={{flex: 1}}>
                            <TimeOfDay tods={Scheduler.times()} tod={this.state.tod} onSelect={this.onTimeOfDayChanged}/>
                        </View>
                    </View>
                </View>
            </View>
        );
        //{this.state.modified ? <Text>modified {moment(this.state.modified).format('MMM DD, YYYY HH:mm')}</Text> : null}
        //<Text>created {moment(this.state.created).format('MMM DD, YYYY HH:mm')}</Text>
    }
});

module.exports = MedDetailView;
