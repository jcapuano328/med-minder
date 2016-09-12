'use strict';

var React = require('react');
import { View, TouchableOpacity, Text, Image } from 'react-native';
var IconButton = require('./widgets/iconButton');
var moment = require('moment');

var ActionListItemView = React.createClass({
    onStatus() {
        let s = this.props.item.status == 'active' ? 'inactive' : 'active';
        this.props.onStatus && this.props.onStatus(this.props.item, {field: 'status', value: s});
    },
    onSelect() {
        this.props.onSelect && this.props.onSelect(this.props.item);
    },
    onRemove() {
        this.props.onRemove && this.props.onRemove(this.props.item);
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
                <IconButton image={this.props.item.status} onPress={this.onStatus}/>
                <TouchableOpacity style={{flex: 2}} onPress={this.onSelect}>
                    <View style={{flex: 1}}>
                        <Text style={{fontSize: 24, fontWeight: 'bold', textAlign: 'left',marginLeft: 20}}>{this.props.item.title}</Text>
                        <Text style={{fontSize: 15,textAlign: 'left',marginLeft: 20}}>{moment(this.props.item.subtitle)}</Text>            
                    </View>
                </TouchableOpacity>
                <IconButton image={'select'} onPress={this.onSelect} />
                <IconButton image={'remove'} onPress={this.onRemove} />
            </View>
        );
    }
});

module.exports = PatientListItemView;
