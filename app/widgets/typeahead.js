'use strict';

var React = require('react-native');
var { View, Text, TextInput, ListView, ScrollView, TouchableOpacity } = React;

var TypeAhead = React.createClass({
    getInitialState() {
        return {
            value: this.props.value,
            values: [],
            focused: false
        };
    },
    fetchValues(v) {
        if (this.props.find) {
            this.props.find(v)
            .then((values) => {
                this.setState({values: values});
            })
            .catch((err) => {
                log.error(err);
            });
        }
    },
    onChangeValue(v) {
        this.setState({value: v});
        this.props.onChangeValue && this.props.onChangeValue(v);
        this.fetchValues(v);
    },
    onFocusName() {
        this.setState({focused: true});
    },
    onSelect(value) {
        return () => {
            log.error('Select ' + value);
            this.setState({value: value, values: []});
            this.props.onChangeValue && this.props.onChangeValue(value);
        }
    },
    render() {
        return (
            <View style={{flex: 1}}>
                <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                    {this.renderLabel()}
                    <TextInput style={{flex: 1, fontSize: 20}}
                        placeholder={this.props.placeholder || ''}
                        onFocus={this.onFocusName}
                        onChangeText={this.onChangeValue}
                        onEndEditing={this.onEndEditing}
                    >
                        {this.state.value}
                    </TextInput>
                </View>
                <View style={{flex:1}}>
                    {this.renderList()}
                </View>
            </View>
        );
    },
    renderLabel() {
        if (!this.props.label) {
            return null;
        }
        return (
            <Text style={{flex: 1}}>{this.props.label}</Text>
        );
    },
    renderList() {
        if (!this.props.focused || !this.state.values || this.state.values.length < 1) {
            return null;
        }
        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        return (
            <ListView dataSource={ds.cloneWithRows(this.state.values)}
                renderRow={this.renderValue}
             />
        );
        /*
        return (
            <ScrollView
                automaticallyAdjustContentInsets={false}
                scrollEventThrottle={200}
                style={{flex: 1,backgroundColor: 'transparent'}}>
                {this.state.values.map((value, i) => {
                    return (
                        <View key={i} style={{flex: 1}}>
                            {this.renderValue(value)}
                        </View>
                    );
                })}
            </ScrollView>
        );
        */
    },
    renderValue(value) {
        return (
            <TouchableOpacity onPress={this.onSelect(value)}>
                <Text style={{fontSize: 20, fontStyle: 'italic'}}>{value}</Text>
            </TouchableOpacity>
        );
    }
});


module.exports = TypeAhead;
