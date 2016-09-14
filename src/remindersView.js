'use strict'

var React = require('react');
import { View, Text, TouchableOpacity, Alert } from 'react-native';
var ActionListView = require('./widgets/actionListView');
var ReminderListItemView = require('./reminderListItemView');

var Reminders = require('./services/reminders');
var moment = require('moment');
var log = require('./services/log');

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
            this.setState({data: data});
        })
        .catch((e) => {
            log.error(e);
        });
    },
    /*
    onComplete(reminder) => {
        return () => {
            Alert.alert('Accept Reminder "' + reminder.subject + '"?', 'The reminder will be accepted and rescheduled', [
                {text: 'No', style: 'cancel'},
                {text: 'Yes', onPress: () => {
                    log.debug('*********** remove reminder ' + reminder.subject);
                    var idx = this.state.data.indexOf(reminder);
                    if (idx > -1) {
                        Reminders.complete(reminder, true)
                        .then(() => {
                            this.state.data.splice(idx,1);
                            this.setState({data: this.state.data});
                            log.debug('+++++++++++ Notification rescheduled');
                            this.props.events && this.props.events.emit('notificationrescheduled');
                        })
                        .catch((err) => {
                            log.debug(err);
                        });
                    }
                }}
            ]);
        }
    },
    */
    onNotify(reminder) {
        return () => {
            this.props.events && this.props.events.emit('changeroute', 'reminder', {
                data: reminder,
                title: reminder.payload.patient.name + ' has a medication due',
                onComplete: this.props.onComplete || this.onComplete,
                onDelay: this.props.onDelay || this.onDelay
            });
        }
    },
    onRemove(reminder) {
        return () => {
            //this.props.events && this.props.events.emit('raisenotification', reminder);
            Alert.alert('Remove Reminder "' + reminder.subject + '"?', 'The reminder will be permanently removed', [
                {text: 'No', style: 'cancel'},
                {text: 'Yes', onPress: () => {
                    log.debug('*********** remove reminder ' + reminder.subject);
                    var idx = this.state.data.indexOf(reminder);
                    if (idx > -1) {
                        Reminders.cancel(reminder)
                        .then(() => {
                            this.state.data.splice(idx,1);
                            this.setState({data: this.state.data});
                        })
                        .catch((err) => {
                            log.debug(err);
                        });
                    }
                }}
            ]);
        }
    },
    onComplete(n) {
        Reminders.complete(n, true)
        .then(() => {
            log.debug('+++++++++++ Notification acknowledged');
            this.props.events && this.props.events.emit('notificationacknowledged', n.payload);
            this.props.events && this.props.events.emit('notificationrescheduled');
            this.props.events && this.props.events.emit('poproute');
        })
        .catch((err) => {
            log.error(err);
        });
    },
    onDelay(n) {
        Reminders.schedule(n.payload)
        .then(() => {
            log.debug('+++++++++++ Notification delayed');
            this.props.events && this.props.events.emit('poproute');
        })
        .catch((err) => {
            log.error(err);
        });
    },
    render() {
        return (
            <ActionListView items={this.state.data} events={this.props.events}
                renderItem={(i, item) =>
                    <ReminderListItemView key={i} notification={item}
                        onNotify={this.onNotify(item)}
                        onRemove={!this.props.onComplete ? this.onRemove(item) : null}
                        onComplete={this.props.onComplete}
                        onDelay={this.props.onDelay} />
                }
            />
        );
    }
});

module.exports = RemindersView;
