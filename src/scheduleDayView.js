'use strict'

var React = require('react');
import { View, Image, Text } from 'react-native';
var ActionListView = require('./widgets/actionListView');
var ScheduleMedListItemView = require('./scheduleMedListItemView');
var Scheduler = require('./services/scheduler');
var Icons = require('./icons');
var log = require('./services/log');

let opacity = 0.20;

var ScheduleDayView = React.createClass({
    onStatus(patient, tod) {
        return (name, r) => {
            this.props.onStatus && this.props.onStatus(patient, tod, r);
        }
    },
    render() {
        return (
            <View style={{flex: 1, marginTop: 50}}>
                {Scheduler.times().map((t,i) => this.renderTOD(t,i))}
            </View>
        );
    },
    renderTOD(tod, i) {
        let patients = Object.keys(this.props.data[tod]) || [];        
        return (
            <Image key={i} source={this.timeIcon(i)}
                resizeMode='contain'
                opacity={opacity}
                style={{flex: 1, width:null, height:null, backgroundColor: this.timeColor(i)}}
            >
                <ActionListView items={patients} events={this.props.events} marginTop={0}
                    renderItem={(j,patient) => {
                        return (
                            <View key={i+j} style={{borderStyle: 'dotted', borderBottomColor: 'lightgray', borderBottomWidth: j<patients.length-1 ? 1 : 0}}>
                                <ScheduleMedListItemView name={patient} data={this.props.data[tod][patient]}
                                    onSelect={this.props.onSelect}
                                    onStatus={this.onStatus(patient, tod)}
                                />
                            </View>
                        );
                    }}
                />
            </Image>
        );
    },
    timeColor(t) {
        switch(t) {
            case 0:
                return 'rgba(255, 165, 0, '+opacity+')';//'orange';
            case 1:
                return 'rgba(255, 255, 0, '+opacity+')';//'yellow';
            case 2:
                return 'rgba(100, 149, 237, '+opacity+')';//'cornflowerblue';
            case 3:
                //return 'rgba(128, 128, 128, '+opacity+')';//'gray';
                return 'rgba(0, 0, 0, '+opacity+')';
            default:
                break;
        }
        return 'transparent';
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
    }
});

module.exports = ScheduleDayView;
