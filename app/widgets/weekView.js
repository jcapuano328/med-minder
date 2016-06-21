'use strict'

var React = require('react-native');
var { View, Text } = React;
var TimeView = require('./timeView');
var Scheduler = require('../services/scheduler');
var log = require('../services/log');

var WeekHeader = React.createClass({
    dayHeader(s) {
        if (!s) {
            return s;
        }
        return s.substr(0,1).toUpperCase() + s.substr(1,2);
    },
    render() {
        return (
            <View style={{
                flex:1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                marginTop: 20,
                borderStyle: 'solid', borderBottomColor: 'black', borderBottomWidth: 2
            }}>
                {[''].concat(Scheduler.days()).map((d,i) => {
                    return (
                        <View key={i} style={{flex: 1, height: 78, alignItems: 'center', borderStyle: 'dashed', borderLeftColor: 'gray', borderLeftWidth: i > 0 ? 2 : 0,
                            backgroundColor: 'cornflowerblue'}}>
                            <Text style={{marginTop: 50, fontSize: 20,fontWeight: 'bold',}}>{this.dayHeader(d)}</Text>
                        </View>
                    );
                })}
            </View>
        );
    }
});


var WeekView = React.createClass({
    timeLabel(t) {
        switch(t) {
            case 0:
                return 'Morn';
            case 1:
                return 'Noon';
            case 2:
                return 'Eve';
            case 3:
                return 'Bed';
            default:
                break;
        }
        return t;
    },
    render() {
        return (
            <View style={{flex:1}}>
                <WeekHeader style={{flex: 1}}/>
                <View style={{flex: 10}}>
                {Scheduler.times().map((t,i) => {
                    log.debug('render time ' + t);
                    return (
                        <View key={i} style={{
                            flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start',
                            borderStyle: 'dotted', borderBottomColor: 'gray', borderBottomWidth: 1
                        }}>
                            <View style={{backgroundColor: 'cornflowerblue'}}>
                                <Text style={{marginLeft: 10, fontSize: 20, fontWeight: 'bold'}}>
                                    {this.timeLabel(i)}
                                </Text>
                            </View>
                            {Scheduler.days().map((d,j) => {
                                log.debug(d + ' / ' + t);
                                log.debug(this.props.data[d][t]);
                                return (
                                    <TimeView key={i+j} data={this.props.data[d][t]} onPress={this.onSelected} />
                                );
                            })}
                        </View>
                    );
                })}
                </View>
            </View>
        );
    }
});

module.exports = WeekView;
