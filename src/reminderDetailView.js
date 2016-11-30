'use strict'

var React = require('react');
import { View, Text, TouchableOpacity, Image } from 'react-native';
import {IconButton} from 'react-native-app-nub';
var Icons = require('./icons');
var moment = require('moment');

var ReminderDetailView = React.createClass({
    onComplete() {
        this.props.onComplete && this.props.onComplete(this.props.notification);
    },
    onDelay() {
        this.props.onDelay && this.props.onDelay(this.props.notification);
    },
    render() {
        let message = 'Give ' + this.props.notification.payload.patient.name + ' ' + this.props.notification.payload.med.name + ' ' + this.props.notification.payload.med.dosage + ' ' + this.props.notification.payload.med.instructions;
        let at = moment(this.props.notification.payload.on).format('MMM DD, YYYY HH:mm');
        return (
            <View style={{
                flex: 1,
                marginTop: 50,
                padding: 25,
                //backgroundColor: 'rgba(0,0,0,0.01)',
            }}>
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'flex-start'}}>
                    <Text style={{fontSize: 16 }}>{at}</Text>
                </View>
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'flex-start'}}>
                    <Text style={{fontSize: 28 }}>{message}</Text>
                </View>
                <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginTop: 15}}>
                    <TouchableOpacity onPress={this.onComplete}
                        style={{flex: 1, alignItems: 'center', justifyContent: 'center', height: 92, marginRight: 10,
                                borderRadius: 10, backgroundColor: 'green'}}>
                        <Image style={{width: 72, height: 72, resizeMode: 'stretch', marginLeft: 5, marginRight: 5}}
                            source={Icons['done']} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.onDelay}
                        style={{flex: 1, alignItems: 'center', justifyContent: 'center', height: 92, marginLeft: 10,
                            borderRadius: 10, backgroundColor: 'orange'}}>
                        <Image style={{width: 72, height: 72, resizeMode: 'stretch', marginLeft: 5, marginRight: 5}}
                            source={Icons['delay']} />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
});

module.exports = ReminderDetailView;
