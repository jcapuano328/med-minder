'use strict'

var React = require('react-native');
var { View, Text, Image } = React;
var Icons = require('../resources/icons');

var TimeHeaderView = React.createClass({
    timeLabel(t) {
        switch(t) {
            case 0:
                return 'Morn';
            case 1:
                return 'Noon';
            case 2:
                return 'Eve';
            case 3:
                return 'Bed';
            default:
                break;
        }
        return t;
    },
    render() {
        return (
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', marginLeft: 5, marginRight: 5}}>
                <Text style={{fontSize: 20, fontWeight: 'bold', color: 'cornflowerblue'}}>
                    {this.timeLabel(this.props.code)}
                </Text>
            </View>
        );
    }
});

module.exports = TimeHeaderView;
