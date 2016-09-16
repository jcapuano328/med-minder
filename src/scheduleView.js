'use strict'

var React = require('react');
import { View, Text } from 'react-native';
var ScheduleNowView = require('./scheduleNowView');
var ScheduleDayView = require('./scheduleDayView');
var ScheduleWeekView = require('./scheduleWeekView');
var Reminders  = require('./services/reminders');
var log = require('./services/log');

var ScheduleView = React.createClass({
    getInitialState() {
        return {
            schedule: null,
            filter: this.props.filter
        };
    },
    componentWillMount() {
        this.props.events.once('schedulefilterchanged', this.onFilter);
        this.props.events.once('notificationacknowledged', this.onNotification);
        return this.fetch().done();
    },
    fetch() {
        let f = null;
        if (!this.state.filter || this.state.filter == 'now') {
            f = Reminders.getNow;
        } else if (this.state.filter == 'today') {
            f = Reminders.getToday;
        } else if (this.state.filter == 'week') {
            f = Reminders.getThisWeek;
        } else if (this.state.filter == 'month') {
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
    onFilter(filter) {
        this.state.filter = filter;
        this.fetch();
        this.props.events.once('schedulefilterchanged', this.onFilter);
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
                    : (<View />
                        /*<View style={{flex:1, marginTop: 250, alignItems: 'center'}}>
                            <Text style={{fontSize: 28, fontWeight: 'bold'}}>Empty</Text>
                        </View>*/
                    )
                }
            </View>
        );
    },
    renderView() {
        if (this.state.filter == 'now') {
            return this.renderNow();
        }
        if (this.state.filter == 'today') {
            return this.renderToday();
        }
        if (this.state.filter == 'week') {
            return this.renderThisWeek();
        }
        if (this.state.filter == 'month') {
            return this.renderThisMonth();
        }

        return (
            <View style={{flex:1, marginTop: 250, alignItems: 'center'}}>
                <Text style={{fontSize: 28, fontWeight: 'bold'}}>WTH is the filter? [{this.state.filter}]</Text>
            </View>
        );
    },
    renderNow() {
        return (
            <ScheduleNowView data={this.state.schedule} onStatus={this.onStatus} onSelect={this.onSelect}/>
        );
        /*
        return (
            <View style={{flex:1, marginTop: 250, alignItems: 'center'}}>
                <Text style={{fontSize: 28, fontWeight: 'bold'}}>WTH does Now look like?</Text>
            </View>
        );
        */
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
