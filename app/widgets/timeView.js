'use strict'

var React = require('react-native');
var { View, Text } = React;
var log = require('../services/log');

var MedView = React.createClass({
    render() {
        return (
            <View style={{flex:1}}>
                <Text>{this.props.data.patient.name}</Text>
                <Text>{this.props.data.med.name}: {this.props.data.med.dosage}</Text>
            </View>
        );
    }
});

var TimeView = React.createClass({
    render() {
        return (
            <View style={{flex:1}}>
                {this.props.data.map((med,i) => {
                    //log.info(med);
                    return (
                        <MedView key={i} data={med} />
                    );
                })}
            </View>
        );
    }
});

module.exports = TimeView;
