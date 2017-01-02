'use strict'
var React = require('react');
import { View, Image } from 'react-native';

var LandingView = React.createClass({
    render() {
        return (
            <View style={{flex: 1,marginTop: this.props.top}}>
                <Image source={this.props.splash} style={{
                    flex: 1,
                    width: null,
                    height: null,
                    backgroundColor: 'transparent',
                    resizeMode: 'stretch'
                }} />
            </View>
        );
    }
});

module.exports = LandingView;
