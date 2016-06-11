'use strict';

var React = require('react-native');
var { View, Text } = React;
var IconButton = require('./iconButton');
var moment = require('moment');

var RemindersItemView = React.createClass({
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
                <View style={{flex: 1}}>
                    <Text style={{fontSize: 24, fontWeight: 'bold', textAlign: 'left',marginLeft: 20}}>{this.props.notification.subject}</Text>
                    <Text style={{fontSize: 15,textAlign: 'left',marginLeft: 20}}>{moment(this.props.notification.sendAt).format('MMM DD, YYYY HH:mm')}</Text>
                </View>
                <View style={{flex: 1}}>
                    <Text style={{fontSize: 15, fontWeight: 'bold',textAlign: 'left',marginLeft: 20}}>{this.props.notification.message}</Text>
                </View>
                <IconButton image={'remove'} onPress={this.props.onRemove} />
            </View>
        );
        //<Text style={{fontSize: 12,textAlign: 'left',marginLeft: 20}}>{this.props.notification.id}</Text>
    }
});

module.exports = RemindersItemView;
