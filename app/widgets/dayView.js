'use strict'

var React = require('react-native');
var { View, ScrollView, Text } = React;
var TimeHeaderView = require('./timeHeaderView');
var MedsView = require('./medsView');
var Scheduler = require('../services/scheduler');

var DayView = React.createClass({
    onStatus(patient, tod) {
        return (name, r) => {
            this.props.onStatus && this.props.onStatus(patient, tod, r);
        }
    },
    render() {
        return (
            <View style={{flex: 1, marginTop: 50}}>
                {Scheduler.times().map((t,i) => {
                    let patients = Object.keys(this.props.data[t]) || [];
                    return (
                        <View key={i} style={{
                            flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start',
                            backgroundColor: 'cornsilk',
                            borderStyle: 'dotted', borderBottomColor: 'gray', borderBottomWidth: 1
                        }}>
                            <TimeHeaderView code={i} />
                            <ScrollView
                                automaticallyAdjustContentInsets={false}
                                scrollEventThrottle={200}
                                style={{flex: 10, backgroundColor: 'transparent', marginLeft: 15}}>
                                {patients.length > 0
                                ? patients.map((patient,j) => {
                                    //console.log(patient);
                                    return (
                                        <View key={i+j} style={{borderStyle: 'dotted', borderBottomColor: 'lightgray', borderBottomWidth: j<patients.length-1 ? 1 : 0}}>
                                            <MedsView name={patient} data={this.props.data[t][patient]} onPress={this.onSelected} onStatus={this.onStatus(patient, t)}/>
                                        </View>
                                    );
                                })
                                : (
                                    <Text style={{alignSelf:'center'}}>No Meds</Text>
                                )
                                }
                            </ScrollView>
                        </View>
                    );
                })}
            </View>
        );
    }
});

module.exports = DayView;
