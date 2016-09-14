'use strict';

var React = require('react');
import { View, TouchableOpacity, Text, Image } from 'react-native';
var Icons = require('../icons');

var Checkbox = React.createClass({
    onSelected() {
        return () => {
            this.props.onSelected && this.props.onSelected(!this.props.selected);
        }
    },
    render() {
        return (
            <TouchableOpacity onPress={this.onSelected()}>
                <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}} >
                    {this.props.labelpos == 'left' ? this.renderLabel(this.props.label) : null}
                    <Image
                        style={{marginTop: 5, marginLeft: 5, marginRight: 5, width: 22, height: 22, resizeMode: 'contain'}}
                        source={Icons[this.props.selected ? 'checked' : 'unchecked']} />
                    {this.props.labelpos != 'left' ? this.renderLabel(this.props.label) : null}
                </View>
            </TouchableOpacity>
        );
    },
    renderLabel(label) {
        return (
            <View style={{flex: 1, flexWrap: 'wrap'}}>
            <Text style={{fontSize: 22, textAlign: 'left'}}>{label}</Text>
            </View>
        );
    }
});

module.exports = Checkbox;
