'use strict'

var React = require('react-native');
var { View, ScrollView, Text, TouchableOpacity, Alert } = React;
var moment = require('moment');
var RemindersStore = require('./stores/reminders');
var Notifications = require('./stores/notifications');

var ReminderItem = React.createClass({
    onSelected() {        
        Notifications.getById(this.props.reminder.notificationid)
        .then((notification) => {
            notification = notification || {subject: 'Notification', message: 'Not found?'};
            Alert.alert('Notification ' + notification.subject, notification.message, [
                {text: 'OK', style: 'cancel'}
            ]);
        })
        .catch((err) => {
            console.error(err);
        });
    },
    render() {
        return (
            <TouchableOpacity style={{flex: 1}} onPress={this.onSelected}>
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
                        <Text style={{fontSize: 24, fontWeight: 'bold', textAlign: 'left',marginLeft: 20}}>{this.props.reminder.patient.name}</Text>
                        <Text style={{fontSize: 15,textAlign: 'left',marginLeft: 20}}>{this.props.reminder.med.name + ' ' + this.props.reminder.med.dosage}</Text>
                    </View>
                    <View style={{flex: 1}}>
                        <Text style={{fontSize: 15,textAlign: 'left',marginLeft: 20}}>{moment(this.props.reminder.on).format('MMM DD, YYYY HH:mm')}</Text>
                        <Text style={{fontSize: 12,textAlign: 'left',marginLeft: 20}}>{this.props.reminder.notificationid}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
});

var NotificationItem = React.createClass({
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
                    <Text style={{fontSize: 12,textAlign: 'left',marginLeft: 20}}>{this.props.notification.id}</Text>
                </View>
                <View style={{flex: 1}}>
                    <Text style={{fontSize: 15,textAlign: 'left',marginLeft: 20}}>{moment(this.props.notification.sendAt).format('MMM DD, YYYY HH:mm')}</Text>
                    <Text style={{fontSize: 15, fontWeight: 'bold',textAlign: 'left',marginLeft: 20}}>{this.props.notification.message}</Text>
                </View>
            </View>
        );
    }
});


var RemindersView = React.createClass({
    getInitialState() {
        return {
            data: []
        };
    },
    componentWillMount() {
        return RemindersStore.getAll()
        //return Notifications.get()
        .then((data) => {
            this.setState({data: data || []});
            return data;
        })
        .catch((e) => {
            console.error(e);
        });
    },
    render() {
        return (
            <View style={{
                flex: 1,
                marginTop: 60,
                //backgroundColor: 'rgba(0,0,0,0.01)',
            }}>
                {this.state.data.length > 0
                    ? (
                        <ScrollView
                            automaticallyAdjustContentInsets={false}
                            scrollEventThrottle={200}
                            style={{flex: 1,backgroundColor: 'transparent'}}>
                            {this.state.data.map((item, i) => {
                                return (<ReminderItem key={i} reminder={item} />);
                                //return (<NotificationItem key={i} notification={item} />);
                            })}
                        </ScrollView>
                    )
                    : (
                        <View style={{flex:1, marginTop: 250, alignItems: 'center'}}>
                            <Text style={{fontSize: 28, fontWeight: 'bold'}}>No Reminders</Text>
                        </View>
                    )
                }
            </View>
        );
    }
});

module.exports = RemindersView;
