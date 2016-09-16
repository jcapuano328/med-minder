'use strict'

var React = require('react');
import { View } from 'react-native';
var ScheduleTODView = require('./scheduleTODView');
var log = require('./services/log');

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
        let keys = Object.keys(this.props.data);
        if (keys.length > 0) {
            let tod = keys[0];
            return (
                <ScheduleTODView tod={tod} data={this.props.data[tod]} events={this.props.events} onSelect={this.props.onSelect} onStatus={this.props.onStatus} />
            );
        }
        return (<View />)
    },
});

module.exports = ScheduleNowView;
