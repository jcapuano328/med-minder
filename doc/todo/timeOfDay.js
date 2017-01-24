'use strict'
var React = require('react');
import { View, Text, Image } from 'react-native';
import {IconButton, Log} from 'react-native-app-nub';
var Icons = require('./icons');
var log = Log;

var TimeOfDayView = React.createClass({
    getInitialState() {
        return {
            morning: this.props.tod.morning,
            noon: this.props.tod.noon,
            evening: this.props.tod.evening,
            bedtime: this.props.tod.bedtime
        };
    },
    onSelect(i, tod) {
        return () => {
            log.debug('pressed ' + i + ' ' + tod);
            let v = !this.state[tod];
            this.props.onSelect && this.props.onSelect(tod, v);
            let s = {};
            s[tod] = v;
            this.setState(s);
        }
    },
    clockFace(tod) {
        switch(tod.toLowerCase())
        {
            case 'morning':
                return 'clockAM';
            case 'noon':
                return 'clockNoon';
            case 'evening':
                return 'clockPM';
            case 'bedtime':
                return 'clockBed';
        }
        return 'clock';
    },
    statusIcon(tod) {
        return this.state[tod] ? 'active' : 'inactive';
    },
    todLabel(tod) {
        return tod.substr(0,1).toUpperCase() + tod.substr(1);
    },
    render() {
        return (
            <View style={{flex:1, flexDirection: 'row', marginTop: 15}}>
                {this.props.tods.map((tod,i) => {
                    return (
                        <View key={i} style={{flex: 1, alignItems: 'center'}}>
                            <IconButton image={this.clockFace(tod)} width={64} height={64} onPress={this.onSelect(i, tod)}/>
                            <View style={{marginTop: 5}}>
                                <IconButton image={this.statusIcon(tod)} width={32} height={32} onPress={this.onSelect(i, tod)}/>
                            </View>
                            <View style={{marginTop: 5}}>
                                <Text>{this.todLabel(tod)}</Text>
                            </View>

                        </View>
                    );
                })}
            </View>
        );
        //<Image style={{marginTop: 5, width: 32, height: 32, resizeMode: 'contain'}} source={Icons[this.statusIcon(tod)]} />
    }
});

module.exports = TimeOfDayView;
