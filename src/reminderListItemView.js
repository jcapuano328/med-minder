'use strict';

var React = require('react');
import { View, Text } from 'react-native';
var IconButton = require('./widgets/iconButton');
var moment = require('moment');

var ReminderListItemView = React.createClass({
    onNotify() {
        this.props.onNotify && this.props.onNotify(this.props.notification);
    },
    onDelay() {
        this.props.onDelay && this.props.onDelay(this.props.notification);
    },
    onComplete() {
        this.props.onComplete && this.props.onComplete(this.props.notification);
    },
    onRemove() {
        this.props.onRemove && this.props.onRemove(this.props.notification);
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
                <View style={{flex: 1}}>
                    <Text style={{fontSize: 24, fontWeight: 'bold', textAlign: 'left',marginLeft: 20}}>{this.props.notification.subject}</Text>
                    <Text style={{fontSize: 15,textAlign: 'left',marginLeft: 20}}>{moment(this.props.notification.sendAt).format('MMM DD, YYYY HH:mm')}</Text>
                </View>
                <View style={{flex: 1}}>
                    <Text style={{fontSize: 15, fontWeight: 'bold',textAlign: 'left',marginLeft: 20}}>{this.props.notification.message}</Text>
                </View>
                <View>
                    {this.props.onNotify ? (
                        <View style={{marginBottom: 5}} >
                            <IconButton image={'notify'} onPress={this.onNotify} />
                        </View>
                    ) : null}
                    {this.props.onRemove ? <IconButton image={'remove'} onPress={this.onRemove} /> : null}
                    {this.props.onComplete ? (
                        <View style={{marginBottom: 5}} >
                            <IconButton image={'done'} onPress={this.onComplete} />
                        </View>
                    ) : null
                    }
                    {this.props.onDelay ? <IconButton image={'delay'} onPress={this.onDelay} /> : null}
                </View>
            </View>
        );
        //<Text style={{fontSize: 12,textAlign: 'left',marginLeft: 20}}>{this.props.notification.id}</Text>
    }
});

module.exports = ReminderListItemView;
