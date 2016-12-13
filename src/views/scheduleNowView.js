'use strict'

var React = require('react');
import { View } from 'react-native';
import {Log} from 'react-native-app-nub';
var ScheduleTODView = require('./scheduleTODView');
var log = Log;

var ScheduleNowView = React.createClass({
    /*
        this.props.data
        {
            <tod>: {  // morning|noon|evening|bedtime
                <patient>: [  // patient name
                    <notification>
                ]
            }
        }
    */
    render() {
        //console.log(this.props.data);
        let keys = Object.keys(this.props.data);
        if (keys.length > 0) {
            let tod = keys[0];
            return (
                <View style={{flex: 1, marginTop: 55}}>
                <ScheduleTODView tod={tod} data={this.props.data[tod]} events={this.props.events} onSelect={this.props.onSelect} onStatus={this.props.onStatus} />
                </View>
            );
        }
        return (<View />)
    },
});

module.exports = ScheduleNowView;
