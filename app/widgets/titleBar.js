'use strict';

var React = require('react-native');
var { View, Text } = React;
var FilterMenu = require('./filterMenu');
var IconButton = require('./iconButton');

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
                    <IconButton image={props.logo || 'menu'} resizeMode='stretch' onPress={route.onMenu} />
                    {index > 0 ? <IconButton image={'back'} resizeMode='stretch' onPress={() => navigator.pop()} /> : null}
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
                    {route.onAccept ? <IconButton border={true} image={'accept'} onPress={route.onAccept} /> : null}
                    {route.onDiscard ? <IconButton image={'discard'} onPress={route.onDiscard} /> : null}
                    {route.onAdd ? <IconButton image={'add'} onPress={route.onAdd} /> : null}
                    {route.onFilter ? <FilterMenu image={'filter'} onSelect={route.onFilter} /> : null}
                </View>
            );
        }
    };
}

module.exports = TitleBar;
