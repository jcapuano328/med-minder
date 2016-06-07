'use strict'

var React = require('react-native');
var { View, Text } = React;
var DayView = require('./widgets/dayView');
var WeekView = require('./widgets/weekView');
var RemindersStore = require('./stores/reminders');

var ScheduleView = React.createClass({
    getInitialState() {
        return {
            schedule: null
        };
    },
    componentWillMount() {
        this.props.events.once('notificationacknowledged', this.onNotification);
        let f = null;
        if (!this.props.filter || this.props.filter == 'today') {
            f = RemindersStore.getToday;
        } else if (this.props.filter == 'week') {
            f = RemindersStore.getThisWeek;
        } else if (this.props.filter == 'month') {
            f = RemindersStore.getThisMonth;
        }
        return f()
        .then((data) => {
            //console.log(data);
            this.setState({schedule: data});
        })
        .catch((err) => {
            console.log(err)
        })
        .done();
    },
    onStatus(patient, tod, med) {
        var r = this.state.schedule[tod][patient].find((r) => {
            return r.med.name == med.med.name;
        });
        if (r) {
            r.status = med.status;
            RemindersStore.update(r)
            .then(() => {
                this.setState({schedule: this.state.schedule});
            })
            .catch((err) => {
                console.log(err);
            });
        }
    },
    onNotification(reminder) {

        this.props.events.once('notificationacknowledged', onNotification);
    },
    render() {
        return (
            <View style={{
                flex: 1,
                marginTop: 10,
                //backgroundColor: 'rgba(0,0,0,0.01)',
            }}>
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
        console.log('render today');
        return (
            <DayView data={this.state.schedule} onStatus={this.onStatus}/>
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
        console.log('render this week');
        return (
            <WeekView data={this.state.schedule} />
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
        console.log('render this month');
        return (
            <View style={{flex:1, marginTop: 250, alignItems: 'center'}}>
                <Text style={{fontSize: 28, fontWeight: 'bold'}}>WTH does This Month look like?</Text>
            </View>
        );
    }
});

module.exports = ScheduleView;
