'use strict'

var React = require('react-native');
var { View, ScrollView, Switch, Text, TextInput } = React;
var DateTimePicker = require('./widgets/datetimePicker');
var IconButton = require('./widgets/iconButton');

var PatientDetailView = React.createClass({
    getInitialState() {
        return {
            name: this.props.patient.name,
            dob: this.props.patient.on,
            status: this.props.patient.status,
            created: this.props.patient.created,
            modified: this.props.patient.modified,
            meds: this.props.patient.meds
        };
    },
    onChangeName(v) {
        this.setState({name: v});
        this.props.onChanged && this.props.onChanged({name: 'name', value: v});
    },
    onChangeDob(v) {
        this.setState({dob: v});
        this.props.onChanged && this.props.onChanged({name: 'dob', value: v});
    },
    onStatusChanged(v) {
        let status = v ? 'complete' : 'open';
        this.setState({status: status});
        this.props.onChanged && this.props.onChanged({name: 'status', value: status});
    },
    onMedAdd() {
        this.props.onAdd && this.props.onAdd();
    },
    onMedRemove(med) {
        return () => {
            this.props.onRemove && this.props.onRemove(med);
        }
    },
    onMedSelected(med) {
        return () => {
            this.props.onSelected && this.props.onSelected(med);
        }
    },
    onMedChanged(med) {
        return (f,v) => {
            console.log('med ' + med.name + ' ' + f + ' = ' + v);
            var idx = this.state.meds.indexOf(med);
            if (idx > -1) {
                this.state.meds[idx][f] = v;
            }
            this.props.onChanged && this.props.onChanged({name: f, value: v});
        }
    },
    render() {
        return (
            <View style={{
                flex: 1,
                //marginTop: 30,
                //backgroundColor: 'rgba(0,0,0,0.01)',
            }}>
                <View style={{flex: 1, flexDirection: 'row'}}>
                    <TextInput style={{flex: 1, margin: 10, fontSize: 20}} placeholder={'Description'} onChangeText={this.onChangeName}>{this.state.name}</TextInput>
                    <DateTimePicker label={'DOB'} value={this.state.dob} date={true} time={false} onChanged={this.onChangeDob} />
                </View>
                <View style={{flex: 1, flexDirection: 'row', alignMeds: 'center', justifyContent: 'center'}}>
                    <Text>Active</Text>
                    <Switch value={this.state.status == 'active'} onValueChange={this.onStatusChanged} />
                </View>
                <View>
                    <View style={{flex: 1, flexDirection: 'row', alignMeds: 'center', justifyContent: 'flex-start', margin: 7,
                        backgroundColor: 'cornflowerblue', borderColor: 'black', borderWidth: 1, borderRadius: 2, borderStyle: 'solid'
                    }}>
                        <Text style={{color: 'white', fontSize: 22, fontWeight: 'bold', margin: 10}}>Meds</Text>
                        <View style={{flex: 1, alignMeds: 'flex-end', justifyContent: 'center'}}>
                            <IconButton image={'add'} onPress={this.onMedAdd} />
                        </View>
                    </View>
                    {this.state.meds.length > 0
                    ? (
                        <ScrollView
                            automaticallyAdjustContentInsets={false}
                            scrollEventThrottle={200}
                            style={{backgroundColor: 'transparent',flex: 1}}>
                            {this.state.meds.map((med, i) => {
                                return (
                                    <PatientMedView key={i} med={med} events={this.props.events} onChanged={this.onMedChanged(med)} onSelected={this.onMedSelected(med)} onRemove={this.onMedRemove(med)} />
                                );
                            })}
                        </ScrollView>
                    )
                    : (
                        <View style={{flex:1, marginTop: 250, alignMeds: 'center'}}>
                            <Text style={{fontSize: 28, fontWeight: 'bold'}}>No Meds</Text>
                        </View>
                    )
                    }
                </View>
            </View>
        );
    }
});

module.exports = PatientDetailView;
