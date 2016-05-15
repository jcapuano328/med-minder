'use strict'

var React = require('react-native');
var { View, Text } = React;
var TimeHeaderView = require('./timeHeaderView');
var MedsView = require('./medsView');
var Scheduler = require('../scheduler');

var DayView = React.createClass({
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
            <View style={{flex: 1, marginTop: 50}}>
                {Scheduler.times().map((t,i) => {
                    return (
                        <View key={i} style={{
                            flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start',
                            backgroundColor: 'cornsilk',
                            borderStyle: 'dotted', borderBottomColor: 'gray', borderBottomWidth: 1
                        }}>
                            <TimeHeaderView code={i} />
                            <View style={{flex: 10}}>
                            {Object.keys(this.props.data[t]).map((patient,j) => {
                                console.log(patient);
                                return (
                                    <MedsView key={i+j} name={patient} data={this.props.data[t][patient]} onPress={this.onSelected} />
                                );
                            })}
                            </View>
                        </View>
                    );
                })}
            </View>
        );
    }
});

module.exports = DayView;
