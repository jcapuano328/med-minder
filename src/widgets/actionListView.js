'use strict'

var React = require('react');
import { View, ScrollView } from 'react-native';
var ActionListItemView = require('./actionListItemView');

var ActionListView = React.createClass({
    render() {
        return (
            <View style={{flex: 1,justifyContent: 'flex-start',marginTop: 60}}>
                <ScrollView
                    automaticallyAdjustContentInsets={false}
                    scrollEventThrottle={200}>
                    {(this.props.items||[]).map((item, i) => {
                        return (
                            <ActionListItemView key={i} item={item}
                                onStatus={this.props.onStatus}
                                onSelect={this.props.onSelect}
                                onRemove={this.props.onRemove}
                                events={this.props.events}
                                RenderDetail={this.props.RenderDetail}
                            />
                        );
                    })}
                </ScrollView>
            </View>
        );
    }
});

module.exports = ActionListView;
