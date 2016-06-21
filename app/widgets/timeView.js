'use strict'

var React = require('react-native');
var { View, Text } = React;

var MedView = React.createClass({
    render() {
        return (
            <View style={{flex:1}}>
                <Text>{this.props.data.patient}</Text>
                <Text>{this.props.data.med.name}: {this.props.data.med.dosage}</Text>
            </View>
        );
    }
});

var TimeView = React.createClass({
    render() {
        //log.debug(this.props.data);
        return (
            <View style={{flex:1}}>
                {this.props.data.map((med,i) => {
                    return (
                        <MedView key={i} data={med} />
                    );
                })}
            </View>
        );
    }
});

module.exports = TimeView;
