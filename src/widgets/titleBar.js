'use strict';

var React = require('react');
import { View, Text } from 'react-native';
var FilterMenu = require('./filterMenu');
var IconButton = require('./iconButton');
let iconWidth = 32, iconHeight = 32;

var renderTitle = (props) => {
    if (typeof props.title == 'function') {
        return props.title();
    }
    return props.title || '';
}

var TitleBar = (props) => {
    props = props || {};
    return {
        LeftButton(route, navigator, index, navState) {
            route = route || {};
            return (
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                    <IconButton image={props.logo || 'menu'} height={iconHeight} width={iconWidth} resizeMode='stretch' onPress={route.onMenu} />
                    {index > 0 ? <IconButton image={'back'} height={iconHeight} width={iconWidth} resizeMode='stretch' onPress={() => navigator.pop()} /> : null}
                </View>
            );
        },
        Title(route, navigator, index, navState) {
            route = route || {};
            return (
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{
                          color: 'white',
                          fontSize: 28,
                          fontWeight: 'bold',
                          marginLeft: 10,
                          marginVertical: 10,
                          //color: 'blue'
                        }}>
                      {renderTitle(route)}
                    </Text>
                </View>
            );
        },
        RightButton(route, navigator, index, navState) {
            route = route || {};
            if (!route.onAdd && !route.onFilter && !route.onAccept && !route.onDiscard) {
              return null;
            }
            return (
                <View style={{flex: 1, flexDirection: 'row', marginVertical: 10}}>
                    {route.onAccept ? <IconButton border={true} image={'accept'} height={iconHeight} width={iconWidth} onPress={route.onAccept} /> : null}
                    {route.onDiscard ? <IconButton image={'discard'} height={iconHeight} width={iconWidth} onPress={route.onDiscard} /> : null}
                    {route.onAdd ? <IconButton image={'add'} height={iconHeight} width={iconWidth} onPress={route.onAdd} /> : null}
                    {route.onFilter ? <FilterMenu image={'filter'} items={route.filterItems} height={iconHeight} width={iconWidth} onSelect={route.onFilter} /> : null}
                </View>
            );
        }
    };
}

module.exports = TitleBar;
