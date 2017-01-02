import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import Icons from '../res';

let getImage = (image) => {
    if (typeof image == 'string') {
        return Icons[image];
    }
    return image;
}

var NavMenuItem = React.createClass({
    onPress() {
        this.props.onPress && this.props.onPress(this.props.item.key);
    },
    render() {
        return (
            <TouchableOpacity onPress={this.onPress}>
                <View style={{flex: 1,backgroundColor: '#fff'}}>
                    <View style={{
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        flex: 1,
                        flexDirection: 'row',
                        margin: 5,
                        padding: 5,
                        backgroundColor: '#eaeaea',
                        borderRadius: 3
                    }}>
                        {this.props.item.image
                            ? <Image style={{
                               //flex: 1,
                               //width: null,
                               //height: null,
                               width: 64,
                               height: 96,
                               resizeMode: 'contain',
                               //backgroundColor: 'transparent',
                           }} source={getImage(this.props.item.image)} />
                           : null
                        }
                        <View style={{flex: 1}}>
                            <Text style={{fontSize: 20,textAlign: 'center',margin: 10}}>{this.props.item.name}</Text>
                            <Text style={{fontSize: 15,textAlign: 'center',margin: 10}}>{this.props.item.desc}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
});

module.exports = NavMenuItem;
