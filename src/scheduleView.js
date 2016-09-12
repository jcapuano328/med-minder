'use strict'

var React = require('react');
import { View, Text } from 'react-native';
var ScheduleDayView = require('./scheduleDayView');
var ScheduleWeekView = require('./scheduleWeekView');
var Reminders  = require('./services/reminders');
var log = require('./services/log');

var ScheduleView = React.createClass({
    getInitialState() {
        return {
            schedule: null
        };
    },
    componentWillMount() {
        this.props.events.once('notificationacknowledged', this.onNotification);
        return this.fetch().done();
    },
    fetch() {
        let f = null;
        if (!this.props.filter || this.props.filter == 'today') {
            f = Reminders.getToday;
        } else if (this.props.filter == 'week') {
            f = Reminders.getThisWeek;
        } else if (this.props.filter == 'month') {
            f = Reminders.getThisMonth;
        }
        return f()
        .then((data) => {
            //log.debug(data);
            this.setState({schedule: data});
        })
        .catch((err) => {
            log.error(err);
        });
    },
    onSelect(reminder) {
        this.props.events.emit('changeroute', 'reminder', {
            data: reminder
        });
    },
    onStatus(patient, tod, med) {
        var r = this.state.schedule[tod][patient].find((r) => r.med.name == med.med.name);
        if (r) {
            r.status = med.status;
            return Reminders.get(r.notificationid)
            .then((n) => {
                return Reminders.complete(n, true);
            })
            .then(() => {
                this.setState({schedule: this.state.schedule});
            })
            .catch((err) => {
                log.debug(err);
            });
        }
    },
    onNotification(reminder) {
        this.props.events.once('notificationacknowledged', this.onNotification);
        this.fetch();
    },
    render() {
        return (
            <View style={{flex: 1}}>
                {this.state.schedule
                    ? (
                        <View style={{flex: 1,backgroundColor: 'transparent'}}>
                            {this.renderView()}
                        </View>
                    )
                    : (
                        <View style={{flex:1, marginTop: 250, alignItems: 'center'}}>
                            <Text style={{fontSize: 28, fontWeight: 'bold'}}>No Meds</Text>
                        </View>
                    )
                }
            </View>
        );
    },
    renderView() {
        if (this.props.filter == 'today') {
            return this.renderToday();
        }
        if (this.props.filter == 'week') {
            return this.renderThisWeek();
        }
        if (this.props.filter == 'month') {
            return this.renderThisMonth();
        }

        return (
            <View style={{flex:1, marginTop: 250, alignItems: 'center'}}>
                <Text style={{fontSize: 28, fontWeight: 'bold'}}>WTH is the filter? [{this.props.filter}]</Text>
            </View>
        );
    },
    renderToday() {
        return (
            <ScheduleDayView data={this.state.schedule} onStatus={this.onStatus} onSelect={this.onSelect}/>
        );
        /*
        return (
            <View style={{flex:1, marginTop: 250, alignItems: 'center'}}>
                <Text style={{fontSize: 28, fontWeight: 'bold'}}>WTH does Today look like?</Text>
            </View>
        );
        */
    },
    renderThisWeek() {
        return (
            <ScheduleWeekView data={this.state.schedule} onStatus={this.onStatus} onSelect={this.onSelect} />
        );
        /*
        return (
            <View style={{flex:1, marginTop: 250, alignItems: 'center'}}>
                <Text style={{fontSize: 28, fontWeight: 'bold'}}>WTH does This Week look like?</Text>
            </View>
        );
        */
    },
    renderThisMonth() {
        return (
            <View style={{flex:1, marginTop: 250, alignItems: 'center'}}>
                <Text style={{fontSize: 28, fontWeight: 'bold'}}>WTH does This Month look like?</Text>
            </View>
        );
    }
});

module.exports = ScheduleView;
