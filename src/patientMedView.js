'use strict';

var React = require('react');
import { View, TouchableOpacity, Text, Image } from 'react-native';
var IconButton = require('./widgets/iconButton');

var PatientMedView = React.createClass({
    onStatus() {
        var s = this.props.med.status == 'active' ? 'inactive' : 'active';
        this.props.med.status = s;
        this.props.onChanged && this.props.onChanged('status', s);
    },
    render() {
        return (
            <View style={{
                alignItems: 'center',
                justifyContent: 'flex-start',
                flex: 1,
                flexDirection: 'row',
                margin: 5,
                padding: 5,
                backgroundColor: '#eaeaea',
                //backgroundColor: 'gray',
                borderColor: 'gray',
                borderStyle: 'solid',
                borderWidth: 1,
                borderRadius: 10
            }}>
                <IconButton image={this.props.med.status} onPress={this.onStatus}/>
                <TouchableOpacity style={{flex: 2}} onPress={this.props.onSelected}>
                    <View style={{flex: 1}}>
                        <Text style={{fontSize: 24, fontWeight: 'bold', textAlign: 'left',marginLeft: 20}}>{this.props.med.name}</Text>
                        <Text style={{fontSize: 15,textAlign: 'left',marginLeft: 20}}>{this.props.med.dosage}</Text>
                    </View>
                </TouchableOpacity>
                <IconButton image={'select'} onPress={this.props.onSelected} />
                <IconButton image={'remove'} onPress={this.props.onRemove} />
            </View>
        );
    }
});

module.exports = PatientMedView;
