'use strict'

var React = require('react-native');
var { View, ScrollView, Text } = React;

var PatientMedView = React.createClass({
    render() {
        return (
            <View style={{flex:1, flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'flex-start'}}>
                <Text style={{flex: 1, fontSize: 8, fontWeight: 'bold', fontStyle: 'italic'}}>{this.props.name}</Text>
                <View style={{flex: 5, flexDirection: 'column'}}>
                {this.props.meds.map((d, i) => {
                    let med = d.med;
                    console.log(med.name);
                    return (
                        <View key={i} style={{flex: 1, flexDirection: 'row'}}>
                            <Text style={{flex: 1, fontSize: 6, fontWeight: 'bold'}}>{med.name} {med.dosage}</Text>
                            <Text style={{flex: 2, fontSize: 6}}>{med.instructions}</Text>
                        </View>
                    );
                })}
                </View>
            </View>
        );
    }
});


var MedsView = React.createClass({
    render() {
        //console.log(this.props.data);
        return (
            <ScrollView
                automaticallyAdjustContentInsets={false}
                scrollEventThrottle={200}
                style={{flex: 1,backgroundColor: 'transparent'}}>
                <PatientMedView name={this.props.name} meds={this.props.data} />
            </ScrollView>
        );
    }
});

module.exports = MedsView;
