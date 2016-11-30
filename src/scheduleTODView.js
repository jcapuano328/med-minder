'use strict'

var React = require('react');
import { View, Image, Text } from 'react-native';
import {Log} from 'react-native-app-nub';
var ActionListView = require('./widgets/actionListView');
var ScheduleMedListItemView = require('./scheduleMedListItemView');
var Icons = require('./icons');
var log = Log;

let opacity = 0.20;

var ScheduleTODView = React.createClass({
    onStatus(patient, tod) {
        return (name, r) => {
            this.props.onStatus && this.props.onStatus(patient, tod, r);
        }
    },
    render() {
        let patients = this.props.data ? Object.keys(this.props.data) : [];
        return (
            <View style={{flex: 1}}>
                <Image source={this.timeIcon()} opacity={opacity} style={{flex: 1, width:null, height:null, backgroundColor: this.timeColor()}} resizeMode='contain'>
                    <ActionListView items={patients} events={this.props.events} marginTop={0}
                        renderItem={(i,patient) => {
                            return (
                                <View key={i} style={{borderStyle: 'dotted', borderBottomColor: 'lightgray', borderBottomWidth: i<patients.length-1 ? 1 : 0}}>
                                    <ScheduleMedListItemView name={patient} data={this.props.data[patient]}
                                        onSelect={this.props.onSelect}
                                        onStatus={this.onStatus(patient, this.props.tod)}
                                    />
                                </View>
                            );
                        }}
                    />
                </Image>
            </View>
        );
    },
    timeColor() {
        switch(this.props.tod) {
            case 'morning':
                return 'rgba(255, 165, 0, '+opacity+')';//'orange';
            case 'noon':
                return 'rgba(255, 255, 0, '+opacity+')';//'yellow';
            case 'evening':
                return 'rgba(100, 149, 237, '+opacity+')';//'cornflowerblue';
            case 'bedtime':
                //return 'rgba(128, 128, 128, '+opacity+')';//'gray';
                return 'rgba(0, 0, 0, '+opacity+')';
            default:
                break;
        }
        return 'transparent';
    },
    timeIcon() {
        switch(this.props.tod) {
            case 'morning':
                return Icons['clockAM'];
            case 'noon':
                return Icons['clockNoon'];
            case 'evening':
                return Icons['clockPM'];
            case 'bedtime':
                return Icons['clockBed'];
            default:
                break;
        }
        return Icons['clock'];
    }
});

module.exports = ScheduleTODView;
