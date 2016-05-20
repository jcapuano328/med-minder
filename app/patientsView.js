'use strict'

var React = require('react-native');
var { View, ScrollView, Text } = React;
var Icons = require('./resources/icons');
var PatientsItemView = require('./widgets/patientsItemView');
var PatientsStore = require('./stores/patients');

var PatientsView = React.createClass({
    getInitialState() {
        return {
            patients: []
        };
    },
    componentWillMount() {
        return PatientsStore.getAll()
        .then((data) => {
            this.setState({patients: data || []});
            return data;
        })
        .catch((e) => {
            console.error(e);
        });
    },
    onSelected(patient) {
        return () => {
            this.props.events.emit('changeroute','patient', patient);
            //this.props.onSelected && this.props.onSelected(patient);
        }
    },
    onRemove(patient) {
        return () => {
            //this.props.onRemove && this.props.onRemove(patient);
        }
    },
    onChanged(patient) {
        return (f,v) => {
            /*
            let idx = this.state.patients.indexOf(patient);
            if (idx > -1) {
                this.state.patients[idx][f] = v;
                this.setState({patients: PatientsStore.sort(this.state.patients)});
            }
            this.props.onChanged && this.props.onChanged(patient, {name: f, value: v});
            */
        }
    },
    render() {
        return (
            <View style={{
                flex: 1,
                marginTop: 60,
                //backgroundColor: 'rgba(0,0,0,0.01)',
            }}>
                {this.state.patients.length > 0
                    ? (
                        <ScrollView
                            automaticallyAdjustContentInsets={false}
                            scrollEventThrottle={200}
                            style={{flex: 1,backgroundColor: 'transparent'}}>
                            {this.state.patients.map((patient, i) => {
                                return (
                                    <View key={i} style={{flex: 1}}>
                                    <PatientsItemView key={i} patient={patient}
                                        onSelected={this.onSelected(patient)}
                                        onRemove={this.onRemove(patient)}
                                        onChanged={this.onChanged(patient)}
                                        />
                                    </View>
                                );
                            })}
                        </ScrollView>
                    )
                    : (
                        <View style={{flex:1, marginTop: 250, alignItems: 'center'}}>
                            <Text style={{fontSize: 28, fontWeight: 'bold'}}>No Patients</Text>
                        </View>
                    )
                }
            </View>
        );
    }
});

module.exports = PatientsView;
