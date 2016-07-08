'use strict'

var React = require('react-native');
var { View, TouchableOpacity, Text } = React;
var IconButton = require('./iconButton');
var log = require('../services/log');

var MedsView = React.createClass({
    onSelect(r) {
        return () => {
            console.log(r);
            this.props.onSelect && this.props.onSelect({payload: r});
        }
    },
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
                            <TouchableOpacity key={i} onPress={this.onSelect(d)}>
                                <View style={{flex: 1, flexDirection: 'row'}}>
                                    <View style={{marginTop: 5}}>
                                        <IconButton image={d.status == 'pending' ? 'open' : 'complete'} width={16} height={16} onPress={this.onStatus(d)}/>
                                    </View>
                                    <Text style={{flex: 1, fontSize: 16, fontWeight: 'bold', textDecorationLine: textdec}}>{med.name} {med.dosage}</Text>
                                    <Text style={{flex: 2, fontSize: 16, textDecorationLine: textdec}}>{med.instructions}</Text>
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>
        );
    }
});

module.exports = MedsView;
