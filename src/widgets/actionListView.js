'use strict'

var React = require('react');
import { View, ScrollView, Text } from 'react-native';
var IconButton = require('./iconButton');
var ActionListItemView = require('./actionListItemView');

var ActionListView = React.createClass({
    render() {
        let marginTop = this.props.hasOwnProperty('marginTop') ? this.props.marginTop : 60;
        let items = this.props.items||[];
        return (
            <View style={{flex: 1,justifyContent: 'flex-start',marginTop: marginTop}}>
                {this.props.onAdd
                    ? (
                        <View>
                            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', margin: 7,
                                backgroundColor: this.props.backgroundColor || 'transparent', borderColor: 'black', borderWidth: 1, borderRadius: 2, borderStyle: 'solid'
                            }}>
                                <Text style={{color: 'white', fontSize: 22, fontWeight: 'bold', margin: 10}}>Medications</Text>
                                <View style={{flex: 1, alignItems: 'flex-end', justifyContent: 'center'}}>
                                    <IconButton image={'add'} onPress={this.props.onAdd} />
                                </View>
                            </View>
                        </View>
                    )
                    : null
                }
                <View style={{flex: 1}}>
                    {items.length > 0
                        ? (
                            <ScrollView
                                automaticallyAdjustContentInsets={false}
                                scrollEventThrottle={200}>
                                {(this.props.items||[]).map((item, i) => {
                                    return this.props.renderItem ? this.props.renderItem(i,item)
                                    : (
                                        <ActionListItemView key={i} item={item}
                                            status={this.props.formatStatus ? this.props.formatStatus(item) : null}
                                            title={this.props.formatTitle ? this.props.formatTitle(item) : null}
                                            subtitle={this.props.formatSubtitle ? this.props.formatSubtitle(item) : null}
                                            onStatus={this.props.onStatus}
                                            onSelect={this.props.onSelect}
                                            onRemove={this.props.onRemove}
                                            events={this.props.events}
                                        />
                                    );
                                })}
                            </ScrollView>
                        )
                        : (
                            <View style={{flex:1, alignItems: 'center'}}>
                                <Text style={{fontSize: 28, fontWeight: 'bold'}}></Text>
                            </View>
                        )
                    }
                </View>
            </View>
        );
    }
});

module.exports = ActionListView;
