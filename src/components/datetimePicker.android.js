var React = require('react');
import {View, Text, Image, DatePickerAndroid, TimePickerAndroid, StyleSheet} from 'react-native';
var IconButton = require('./iconButton');
var moment = require('moment');

var styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    label: {
        margin: 10,
        fontSize: 18,
        //fontWeight: 'bold'
    }
});

var DatePicker = React.createClass({
    getInitialState() {
        return {
            value: moment(this.props.value)
        };
    },
    async onPick() {
        try {
            const {action, year, month, day} = await DatePickerAndroid.open({date: this.state.value.toDate()});
            if (action !== DatePickerAndroid.dismissedAction) {
                let d = moment({year: year, month: month, day: day});
                this.setState({value: d});
                this.props.onChanged && this.props.onChanged(d);
            }
        } catch ({code, message}) {
          console.warn('Cannot open date picker', message);
        }
    },
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.label}>{this.state.value.format('MMM DD, YYYY')}</Text>
                <IconButton image={'calendar'} onPress={this.onPick} />
            </View>
        );
    }
});

var TimePicker = React.createClass({
    getInitialState() {
        return {
            value: moment(this.props.value)
        };
    },
    async onPick() {
        try {
            const {action, hour, minute} = await TimePickerAndroid.open({
                hour: this.state.value.hour(), minute: this.state.value.minute(), is24Hour: true
            });
            if (action !== DatePickerAndroid.dismissedAction) {
                let t = moment({hour: hour, minute: minute});
                this.setState({value: t});
                this.props.onChanged && this.props.onChanged(t);
            }
        } catch ({code, message}) {
          console.warn('Cannot open time  picker', message);
        }
    },
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.label}>{this.state.value.format('HH:mm')}</Text>
                <IconButton image={'clock'} onPress={this.onPick} />
            </View>
        );
    }
});

var DateTimePicker = React.createClass({
    getInitialState() {
        return {
            value: moment(this.props.value)
        };
    },
    onDateChanged(d) {
        let dt = moment({
            year: d.year(),
            month: d.month(),
            day: d.date(),
            hour: this.state.value.hour(),
            minute: this.state.value.minute()
        });
        this.setState({value: dt.toDate()});
        this.props.onChanged && this.props.onChanged(dt.toDate());
    },
    onTimeChanged(t) {
        let dt = moment({
            year: this.state.value.year(),
            month: this.state.value.month(),
            day: this.state.value.date(),
            hour: t.hour(),
            minute: t.minute()
        });
        this.setState({value: dt.toDate()});
        this.props.onChanged && this.props.onChanged(dt.toDate());
    },
    render() {
        return (
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                {this.props.label ? <Text style={{margin: 15, fontSize: 16}}>{this.props.label}</Text> : null}
                {this.props.date ? <DatePicker value={this.state.value} onChanged={this.onDateChanged} /> : null}
                {this.props.time ? <TimePicker value={this.state.value} onChanged={this.onTimeChanged} /> : null}
            </View>
        );
    }
});

module.exports = DateTimePicker;
