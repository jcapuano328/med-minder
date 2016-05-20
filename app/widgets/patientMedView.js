'use strict';

var React = require('react-native');
var { View, TouchableOpacity, Text, Image } = React;
var IconButton = require('./iconButton');
var Subscribable = require('Subscribable');

var PatientMedView = React.createClass({
    mixins: [Subscribable.Mixin],

    getInitialState() {
        return {
            name: this.props.med.name,
            dosage: this.props.med.dosage,
            status: this.props.med.status
        };
    },
    componentDidMount() {
        this.addListenerOn(this.props.events, 'medchanged', (med, e) => {
            if (this.props.med == med && this.state.hasOwnProperty(e.name)) {
                console.log('^^^^^^^^^^ med ' + med.name + ' property ' + e.name + ' = ' + e.value);
                let state = {};
                state[e.name] = e.value;
                this.setState(state);
            }
        });
    },
    onStatus() {
        var s = this.state.status == 'open' ? 'complete' : 'open';
        this.props.med.status = s;
        this.setState({status: s});
        this.props.onChanged && this.props.onChanged('status', s);
    },
    render() {
        return (
            <View style={{
                alignItems: 'center',
                justifyContent: 'flex-start',
                flex: 1,
                flexDirection: 'row',
                margin: 5,
                padding: 5,
                backgroundColor: '#eaeaea',
                //backgroundColor: 'gray',
                borderColor: 'gray',
                borderStyle: 'solid',
                borderWidth: 1,
                borderRadius: 10
            }}>
                <IconButton image={this.state.status} onPress={this.onStatus}/>
                <TouchableOpacity style={{flex: 2}} onPress={this.props.onSelected}>
                    <View style={{flex: 1}}>
                        <Text style={{fontSize: 24, fontWeight: 'bold', textAlign: 'left',marginLeft: 20}}>{this.state.name}</Text>
                        <Text style={{fontSize: 15,textAlign: 'left',marginLeft: 20}}>{this.state.dosage}</Text>
                    </View>
                </TouchableOpacity>
                <IconButton image={'select'} onPress={this.props.onSelected} />
                <IconButton image={'remove'} onPress={this.props.onRemove} />
            </View>
        );
    }
});

module.exports = PatientMedView;
