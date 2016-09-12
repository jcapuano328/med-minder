'use strict'

var React = require('react');
import { View, ScrollView, Text } from 'react-native';
var PatientListItemView = require('./patientListItemView');
var log = require('./services/log');

var PatientListView = React.createClass({
    render() {
        return (
            <View style={{flex: 1,justifyContent: 'flex-start',marginTop: 60}}>
                <ScrollView
                    automaticallyAdjustContentInsets={false}
                    scrollEventThrottle={200}>
                    {(this.props.patients||[]).map((patient, i) => {
                        return (
                            <PatientListItemView key={i} patient={patient}
                                onStatus={this.props.onStatus}
                                onSelect={this.props.onSelect}
                                onRemove={this.props.onRemove}
                                events={this.props.events}
                            />
                        );
                    })}
                </ScrollView>
            </View>
        );
    }
});

module.exports = PatientListView;
