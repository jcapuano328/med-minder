'use strict'

var React = require('react-native');
var { View, Switch, Text, TextInput } = React;
var IconButton = require('./widgets/iconButton');
var Subscribable = require('Subscribable');
var moment = require('moment');

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
            modified: this.props.med.modified
        };
    },
    onChangeName(v) {
        this.setState({name: v});
        this.props.onChanged && this.props.onChanged({name: 'name', value: v});
    },
    onChangeDosage(v) {
        this.setState({dosage: v});
        this.props.onChanged && this.props.onChanged({name: 'dosage', value: v});
    },
    onChangeInstructions(v) {
        this.setState({instructions: v});
        this.props.onChanged && this.props.onChanged({name: 'instructions', value: v});
    },
    onStatusChanged(v) {
        let status = v ? 'complete' : 'open';
        this.setState({status: status});
        this.props.onChanged && this.props.onChanged({name: 'status', value: status});
    },
    onFrequencyChanged(v) {
        this.setState({frequency: v});
        this.props.onChanged && this.props.onChanged({name: 'frequency', value: v});
    },
    onDayOfWeekChanged(v) {
        this.setState({dow: v});
        this.props.onChanged && this.props.onChanged({name: 'dow', value: v});
    },
    onTimeOfDayChanged(v) {
        this.setState({tod: v});
        this.props.onChanged && this.props.onChanged({name: 'tod', value: v});
    },
    render() {
        return (
            <View style={{
                flex: 1,
                //marginTop: 30,
                //backgroundColor: 'rgba(0,0,0,0.01)',
            }}>
                <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                    <TextInput style={{flex: 1, margin: 10, fontSize: 20}} placeholder={'Description'} onChangeText={this.onChangeName}>{this.state.name}</TextInput>
                    <IconButton style={{flex: 1}} image={'favorite'} onPress={this.props.onFavorites}/>
                    <TextInput style={{flex: 1, margin: 10, fontSize: 20}} placeholder={'Location'} onChangeText={this.onChangeLocation}>{this.state.location}</TextInput>
                </View>
                <TextInput style={{flex: 1, margin: 10, fontSize: 20}} placeholder={'Details'} multiline={true} onChangeText={this.onChangeDetails}>{this.state.details}</TextInput>
                <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                    <View style={{flex: 1, flexDirection: 'row'}}>
                        <Text style={{flex: 1, textAlign: 'right'}}>Favorite</Text>
                        <View style={{flex: 1, alignItems: 'flex-start', marginLeft: 10}} >
                            <Switch value={!!this.state.favorite} onValueChange={this.onFavoriteChanged} />
                        </View>
                    </View>
                    <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={{flex: 1, textAlign: 'right'}}>Complete</Text>
                        <View style={{flex: 1, alignItems: 'flex-start', marginLeft: 10}} >
                            <Switch value={this.state.status == 'complete'} onValueChange={this.onStatusChanged} />
                        </View>
                    </View>
                </View>
                {this.state.modified ? <Text>modified {moment(this.state.modified).format('MMM DD, YYYY HH:mm')}</Text> : null}
            </View>
        );
        //<Text>created {moment(this.state.created).format('MMM DD, YYYY HH:mm')}</Text>
    }
});

module.exports = MedDetailView;
