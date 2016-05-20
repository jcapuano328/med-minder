'use strict'

var React = require('react-native');
var { View, Text, Image } = React;
var Icons = require('../resources/icons');

var TimeHeaderView = React.createClass({
    timeLabel(t) {
        switch(t) {
            case 0:
                return 'M';//orn';
            case 1:
                return 'N';//oon';
            case 2:
                return 'E';//ve';
            case 3:
                return 'B';//ed';
            default:
                break;
        }
        return t;
    },
    timeIcon(t) {
        switch(t) {
            case 0:
                return Icons['clockAM'];
            case 1:
                return Icons['clockNoon'];
            case 2:
                return Icons['clockPM'];
            case 3:
                return Icons['clockBed'];
            default:
                break;
        }
        return Icons['clock'];
    },
    render() {
        /*
        <Text style={{fontSize: 20, fontWeight: 'bold', color: 'cornflowerblue'}}>
            {this.timeLabel(this.props.code)}
        </Text>
        */
        return (
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', marginLeft: 5, marginRight: 5}}>
                <Image source={this.timeIcon(this.props.code)} style={{marginLeft: 5, width:64, height:64}}/>
            </View>
        );
    }
});

module.exports = TimeHeaderView;
