'use strict'

var React = require('react-native');
var { View, Text } = React;
var Icons = require('./resources/icons');
var WeekView = require('./widgets/weekView');
var DayView = require('./widgets/dayView');
var RemindersStore = require('./stores/reminders');

var ScheduleView = React.createClass({
    getInitialState() {
        return {
            schedule: null
        };
    },
    componentWillMount() {
        let f = null;
        if (!this.props.filter || this.props.filter == 'today') {
            f = RemindersStore.getActiveToday;
        } else if (this.props.filter == 'week') {
            f = RemindersStore.getActiveThisWeek;
        } else if (this.props.filter == 'month') {
            f = RemindersStore.getActiveThisMonth;
        }
        return f()
        .then((data) => {
            this.setState({schedule: data});
        })
        .catch((err) => {
            console.log(err)
        })
        .done();
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
            <DayView data={this.state.schedule} />
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
