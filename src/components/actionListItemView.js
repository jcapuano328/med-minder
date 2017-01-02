'use strict';

var React = require('react');
import { View, TouchableOpacity, Text } from 'react-native';
import Checkbox from './checkbox';

var ActionListItemView = React.createClass({
    onStatus() {
        let s = this.props.status == 'active' ? 'inactive' : 'active';
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
                {this.props.onStatus ? <Checkbox selected={this.props.status=='active'} onSelected={this.onStatus}/> : null}
                <TouchableOpacity style={{flex: 2}} onPress={this.onSelect}>
                    <View style={{flex: 1}}>
                        <Text style={{fontSize: 24, fontWeight: 'bold', textAlign: 'left',marginLeft: 20}}>{this.props.title}</Text>
                        <Text style={{fontSize: 15,textAlign: 'left',marginLeft: 20}}>{this.props.subtitle}</Text>
                    </View>
                </TouchableOpacity>
                {this.props.onSelect ? <IconButton image={'select'} onPress={this.onSelect} /> : null}
                {this.props.onRemove ? <IconButton image={'remove'} onPress={this.onRemove} /> : null}
            </View>
        );
    }
});

module.exports = ActionListItemView;
