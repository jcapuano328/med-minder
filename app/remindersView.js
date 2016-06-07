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
            console.error(e);
        });
    },
    onRemove(reminder) {
        return () => {
            Alert.alert('Remove Reminder ' + reminder.subject + '?', 'The reminder will be permanently removed and rescheduled', [
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
                                return (<RemindersItemView key={i} notification={item} onRemove={this.onRemove(item)} />);
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
