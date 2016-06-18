'use strict'

var React = require('react-native');
var { View, ScrollView, Text, TouchableOpacity, Alert } = React;
var RemindersItemView = require('./widgets/remindersItemView');
var moment = require('moment');
var Reminder = require('./services/reminder');
var Reminders = require('./stores/reminders');

var RemindersView = React.createClass({
    getInitialState() {
        return {
            data: []
        };
    },
    componentWillMount() {
        return this.reload();
    },
    reload() {
        this.props.events && this.props.events.once('notificationrescheduled', this.reload);        
        return Reminders.getAll()
        .then((data) => {
            data = data || [];
            /*
            if (this.props.filter) {
                data = data.filter((d) => {
                    return d.payload.patient.id == d.value;
                });
            }
            */
            data.sort((l,r) => {
                let lon = moment(l.sendAt);
                let ron = moment(r.sendAt);
                if (lon.isBefore(ron)) {
                    return -1;
                } else if (lon.isAfter(ron)) {
                    return 1;
                } else if (l.payload.patient.name < r.payload.patient.name) {
                    return -1;
                } else if (l.payload.patient.name > r.payload.patient.name) {
                    return 1;
                } else if (l.payload.med.name < r.payload.med.name) {
                    return -1;
                } else if (l.payload.med.name > r.payload.med.name) {
                    return 1;
                }
                return 0;
            });
            this.setState({data: data});
        })
        .catch((e) => {
            console.error(e);
        });
    },
    /*
    onComplete(reminder) => {
        return () => {
            Alert.alert('Accept Reminder "' + reminder.subject + '"?', 'The reminder will be accepted and rescheduled', [
                {text: 'No', style: 'cancel'},
                {text: 'Yes', onPress: () => {
                    console.log('*********** remove reminder ' + reminder.subject);
                    var idx = this.state.data.indexOf(reminder);
                    if (idx > -1) {
                        Reminder.complete(reminder, true)
                        .then(() => {
                            this.state.data.splice(idx,1);
                            this.setState({data: this.state.data});
                            console.log('+++++++++++ Notification rescheduled');
                            this.props.events && this.props.events.emit('notificationrescheduled');
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                    }
                }}
            ]);
        }
    },
    */
    onNotify(reminder) {
        return () => {
            //console.log(reminder);
            this.props.events && this.props.events.emit('changeroute', 'reminder', reminder);
        }
    },
    onRemove(reminder) {
        return () => {
            //this.props.events && this.props.events.emit('raisenotification', reminder);
            Alert.alert('Remove Reminder "' + reminder.subject + '"?', 'The reminder will be permanently removed', [
                {text: 'No', style: 'cancel'},
                {text: 'Yes', onPress: () => {
                    console.log('*********** remove reminder ' + reminder.subject);
                    var idx = this.state.data.indexOf(reminder);
                    if (idx > -1) {
                        Reminder.cancel(reminder)
                        .then(() => {
                            this.state.data.splice(idx,1);
                            this.setState({data: this.state.data});
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                    }
                }}
            ]);
        }
    },
    render() {
        //onComplete={this.onComplete(item)}
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
                                return (
                                    <RemindersItemView key={i} notification={item}
                                        onNotify={this.onNotify(item)}
                                        onRemove={!this.props.onComplete ? this.onRemove(item) : null}
                                        onComplete={this.props.onComplete}
                                        onDelay={this.props.onDelay} />
                                );
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
