'use strict';

var React = require('react');
import { View, TouchableOpacity, Text } from 'react-native';

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
                    <View style={{
                        width: 20,
                        height: 20,
                        borderRadius: 3,
                        borderColor: 'black',
                        borderWidth: 2,
                        //marginTop: 5,
                        marginLeft: 5,
                        marginRight: 5
                    }}>
                        {this.props.selected
                            ? <View style={{flex: 1,justifyContent: 'center',alignItems: 'center',marginLeft:1, marginRight:1, marginTop:-1}}>
                                <Text style={{fontSize: 16, fontWeight: 'bold', textAlign: 'center', color:'black'}}>X</Text>
                            </View>
                            : null
                        }
                    </View>
                    {this.props.labelpos != 'left' ? this.renderLabel(this.props.label) : null}
                </View>
            </TouchableOpacity>
        );
    },
    renderLabel(label) {
        return (<Text style={{fontSize: 18, textAlign: 'left'}}>{label}</Text>)
    }
});

module.exports = Checkbox;
