'use strict'

var React = require('react-native');
var { View, Text } = React;
var IconButton = require('./iconButton');
var log = require('../services/log');

var MedsView = React.createClass({
    onStatus(r) {
        return () => {
            r.status = r.status == 'pending' ? 'complete' : 'pending';
            this.props.onStatus && this.props.onStatus(this.props.name, r);
        }
    },
    render() {
        //log.debug(this.props.data);
        return (
            <View style={{flex:1, flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'flex-start'}}>
                <Text style={{flex: 1, marginLeft: 5, fontSize: 18, fontWeight: 'bold', fontStyle: 'italic'}}>{this.props.name}</Text>
                <View style={{flex: 5}}>
                    {this.props.data.map((d, i) => {
                        let med = d.med;
                        let textdec = d.status == 'pending' ? 'none' : 'line-through';
                        //log.debug(med.name);
                        return (
                            <View key={i} style={{flex: 1, flexDirection: 'row'}}>
                                <View style={{marginTop: 5}}>
                                    <IconButton image={d.status == 'pending' ? 'open' : 'complete'} width={16} height={16} onPress={this.onStatus(d)}/>
                                </View>
                                <Text style={{flex: 1, fontSize: 16, fontWeight: 'bold', textDecorationLine: textdec}}>{med.name} {med.dosage}</Text>
                                <Text style={{flex: 2, fontSize: 16, textDecorationLine: textdec}}>{med.instructions}</Text>
                            </View>
                        );
                    })}
                </View>
            </View>
        );
    }
});

module.exports = MedsView;
