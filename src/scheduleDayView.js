'use strict'

var React = require('react');
import { View } from 'react-native';
import {Log} from 'react-native-app-nub';
var ScheduleTODView = require('./scheduleTODView');
var Scheduler = require('./services/scheduler');
var Icons = require('./icons');
var log = Log;

var ScheduleDayView = React.createClass({
    render() {
        return (
            <View style={{flex: 1, marginTop: 55}}>
                {Scheduler.times().map((tod,i) =>
                    <ScheduleTODView key={i}
                        tod={tod} data={this.props.data[tod]} events={this.props.events} onSelect={this.props.onSelect} onStatus={this.props.onStatus}
                    />
                )}
            </View>
        );
    }
});

module.exports = ScheduleDayView;
