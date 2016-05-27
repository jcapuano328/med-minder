'use strict'

var React = require('react-native');
var { View, Switch, Text, TextInput, Picker } = React;
var IconButton = require('./widgets/iconButton');
var Subscribable = require('Subscribable');
var moment = require('moment');

let frequencies = [
    {name: 'Daily', value: 'Daily', filter: 1},
    {name: 'Alternating Days', value: 'Alternating Days', filter: 1},
    {name: 'Weekly', value: 'Weekly', filter: 2},
    {name: 'Alternating Weeks', value: 'Alternating Weeks', filter: 2},
    {name: 'Monthly', value: 'Monthly', filter: 2}
];

let days = [
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

let times = [
    {name: 'Morning', value: 'Morning'},
    {name: 'Noon', value: 'Noon'},
    {name: 'Evening', value: 'Evening'},
    {name: 'Bedtime', value: 'Bedtime'}
];

var MedDetailView = React.createClass({
    mixins: [Subscribable.Mixin],

    getInitialState() {
        return {
            name: this.props.med.name,
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
    componentWillMount() {
        this.props.events.once('acceptmed', this.onAccept);
        this.props.events.once('discardmed', this.onDiscard);
    },
    filterDOW(frequency) {
        var f = frequencies.find((f) => { return frequency == f.value; });
        return days.filter((day) => { return f.filter == day.filter; });
    },
    onChangeName(v) {
        this.setState({name: v});
        this.props.events && this.props.events.emit('medchanged', this.props.med, {field: 'name', value: v});
    },
    onChangeDosage(v) {
        this.setState({dosage: v});
        this.props.events && this.props.events.emit('medchanged', this.props.med, {field: 'dosage', value: v});
    },
    onChangeInstructions(v) {
        this.setState({instructions: v});
        this.props.events && this.props.events.emit('medchanged', this.props.med, {field: 'instructions', value: v});
    },
    onStatusChanged(v) {
        let status = v ? 'active' : 'inactive';
        this.setState({status: status});
        this.props.events && this.props.events.emit('medchanged', this.props.med, {field: 'status', value: v});
    },
    onFrequencyChanged(v) {
        this.setState({frequency: v, dows: this.filterDOW(v)});
        this.props.events && this.props.events.emit('medchanged', this.props.med, {field: 'frequency', value: v});
    },
    onDayOfWeekChanged(v) {
        this.setState({dow: v});
        this.props.events && this.props.events.emit('medchanged', this.props.med, {field: 'dow', value: v});
    },
    onTimeOfDayChanged(v) {
        this.setState({tod: v});
        this.props.events && this.props.events.emit('medchanged', this.props.med, {field: 'tod', value: v});
    },
    onAccept() {
        this.props.events.emit('savemed', {
            name: this.state.name,
            dosage: this.state.dosage,
            instructions: this.state.instructions,
            schedule: {
                frequency: this.state.frequency,
                dow: this.state.dow,
                tod: this.state.tod
            },
            status: this.state.status,
            created: this.state.created,
            modified: this.state.modified
        });
    },
    onDiscard() {

    },
    render() {
        return (
            <View style={{
                //flex: 1,
                marginTop: 50,
                //backgroundColor: 'rgba(0,0,0,0.01)',
            }}>
                <View style={{flex: 1, flexDirection: 'row'}}>
                    <TextInput style={{flex: 2, margin: 10, fontSize: 20}} placeholder={'Name'} onChangeText={this.onChangeName}>{this.state.name}</TextInput>
                    <TextInput style={{flex: 1, margin: 10, fontSize: 20}} placeholder={'Dosage'} onChangeText={this.onChangeDosage}>{this.state.dosage}</TextInput>
                </View>
                <TextInput style={{margin: 10, fontSize: 20}} placeholder={'Instructions'} multiline={true} onChangeText={this.onChangeInstructions}>{this.state.instructions}</TextInput>
                <View style={{margin: 10}}>
                    <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
                        <Text style={{flex: 3, fontSize: 20,fontWeight: 'bold', fontStyle: 'italic', marginLeft: 5, marginTop: 10}}>Schedule</Text>
                        <View style={{flex:1, alignItems: 'center', justifyContent: 'center'}}>
                            <Text>Active</Text>
                            <Switch value={this.state.status == 'active'} onValueChange={this.onStatusChanged} />
                        </View>
                    </View>
                    <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
                        <Text style={{flex: 1, fontSize: 16,fontWeight: 'bold', marginLeft: 15, marginTop: 13}}>Interval</Text>
                        <Picker style={{flex: 3}}
                            selectedValue={this.state.frequency}
                            onValueChange={this.onFrequencyChanged}
                        >
                            {frequencies.map((f,i) => {return (<Picker.Item key={i} label={f.name} value={f.value} />);})}
                        </Picker>
                    </View>

                    <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
                        <Text style={{flex: 1, fontSize: 16,fontWeight: 'bold', marginLeft: 15, marginTop: 13}}>Day of Week</Text>
                        <Picker style={{flex: 3}}
                            selectedValue={this.state.dow}
                            onValueChange={this.onDayOfWeekChanged}
                        >
                            {this.state.dows.map((f,i) => {return (<Picker.Item key={i} label={f.name} value={f.value} />);})}
                        </Picker>
                    </View>

                    <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
                        <Text style={{flex: 1, fontSize: 16,fontWeight: 'bold', marginLeft: 15, marginTop: 13}}>Time of Day</Text>
                        <Picker style={{flex: 3}}
                            selectedValue={this.state.tod}
                            onValueChange={this.onTimeOfDayChanged}
                        >
                            {times.map((f,i) => {return (<Picker.Item key={i} label={f.name} value={f.value} />);})}
                        </Picker>
                    </View>
                </View>
            </View>
        );
        //{this.state.modified ? <Text>modified {moment(this.state.modified).format('MMM DD, YYYY HH:mm')}</Text> : null}
        //<Text>created {moment(this.state.created).format('MMM DD, YYYY HH:mm')}</Text>
    }
});

module.exports = MedDetailView;
