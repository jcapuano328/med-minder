'use strict';

var React = require('react-native');
var { View, Image, ScrollView, Text, TouchableOpacity } = React;
var Icons = require('../resources/icons');

var NavMenuItem = React.createClass({
    onPress() {
        this.props.onPress && this.props.onPress(this.props.name);
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
                        <Image style={{
                            //flex: 1,
                            //width: null,
                            //height: null,
                            width: 64,
                            height: 96,
                            resizeMode: 'contain',
                            //backgroundColor: 'transparent',
                        }} source={Icons[this.props.image]} />
                        <Text style={{fontSize: 20,textAlign: 'center',margin: 10}}>{this.props.name}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
});

var NavMenu = React.createClass({
    onPress(e) {
        //console.log(this.props);
        this.props.onSelected && this.props.onSelected(e);
    },
    render() {
        return (
            <View style={{flex: 1,backgroundColor: '#fff'}}>
                <ScrollView
                    automaticallyAdjustContentInsets={false}
                    scrollEventThrottle={200}
                    style={{backgroundColor: 'transparent',flex: 1}}>
                    <NavMenuItem image={'home'} name={'Home'} onPress={this.onPress} />
                    <NavMenuItem image={'calendar'} name={'Schedule'} onPress={this.onPress} />
                    <NavMenuItem image={'patients'} name={'Patients'} onPress={this.onPress} />
                    <NavMenuItem image={'info'} name={'About'} onPress={this.onPress}/>
                </ScrollView>
            </View>
        );
    }
});

module.exports = NavMenu;
