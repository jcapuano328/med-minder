'use strict'

var React = require('react-native');
var { View, Image } = React;
var Icons = require('./resources/icons');

var LandingView = React.createClass({
    render() {
        return (
            //Icons.splash
            <View style={{
                flex: 1,
                //marginTop: 30,
                //backgroundColor: 'rgba(0,0,0,0.01)',
            }}>
                <Image source={Icons.splash} style={{
                    flex: 1,
                    width: null,
                    height: null,
                    backgroundColor: 'transparent',
                }} />
            </View>
        );
    }
});

module.exports = LandingView;
