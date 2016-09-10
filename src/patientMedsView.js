'use strict'

var React = require('react');
import { View, ScrollView, Switch, Text } from 'react-native';
var IconButton = require('./widgets/iconButton');
var PatientMedView = require('./patientMedView');
var log = require('./services/log');

var PatientMedsView = React.createClass({
    onSelected(med) {
        return () => {
            log.debug('--- med ' + med.name + ' selected');
            this.props.onSelected && this.props.onSelected(med);
        }
    },
    onRemove(med) {
        return () => {
            this.props.onRemove && this.props.onRemove(med);
        }
    },
    onChanged(med) {
        return (f,v) => {
            this.props.onChanged && this.props.onChanged(med, {field: f, value: v});
        }
    },
    render() {
        return (
            <View>
                <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', margin: 7,
                    backgroundColor: 'goldenrod', borderColor: 'black', borderWidth: 1, borderRadius: 2, borderStyle: 'solid'
                }}>
                    <Text style={{color: 'white', fontSize: 22, fontWeight: 'bold', margin: 10}}>Medications</Text>
                    <View style={{flex: 1, alignItems: 'flex-end', justifyContent: 'center'}}>
                        <IconButton image={'add'} onPress={this.props.onAdd} />
                    </View>
                </View>

                {this.props.meds.length > 0
                ? (
                    <ScrollView
                        automaticallyAdjustContentInsets={false}
                        scrollEventThrottle={200}
                        style={{flex: 1, backgroundColor: 'transparent'}}>
                        {this.props.meds.map((med, i) => {
                            return (
                                <PatientMedView key={i} med={med} events={this.props.events}
                                    onChanged={this.onChanged(med)}
                                    onSelected={this.onSelected(med)}
                                    onRemove={this.onRemove(med)} />
                            );
                        })}
                    </ScrollView>
                )
                : (
                    <View style={{flex:1, marginTop: 250, alignItems: 'center'}}>
                        <Text style={{fontSize: 28, fontWeight: 'bold'}}>No Meds</Text>
                    </View>
                )
                }
            </View>
        );
    }
});

module.exports = PatientMedsView;
