import React from 'react';
import { View, ScrollView } from 'react-native';

var NavMenu = React.createClass({
    render() {
        return (
            <View style={{flex: 1,backgroundColor: '#fff'}}>
                <ScrollView automaticallyAdjustContentInsets={false} scrollEventThrottle={200} style={{backgroundColor: 'transparent',flex: 1}}>
                    {this.props.items.map((m,i) => m)}
                </ScrollView>
            </View>
        );
    }
});

module.exports = NavMenu;
