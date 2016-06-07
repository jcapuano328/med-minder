'use strict';

var React = require('react-native');
var { View, Image, Text } = React;
import Menu, { MenuOptions, MenuOption, MenuTrigger } from 'react-native-menu';
var Icons = require('../resources/icons');

var FilterMenu = React.createClass({
    render() {
        /*
        <MenuOption value={'today'}><Text style={{fontSize: 20}}>Today</Text></MenuOption>
        <MenuOption value={'week'}><Text style={{fontSize: 20}}>This Week</Text></MenuOption>
        <MenuOption value={'month'}><Text style={{fontSize: 20}}>This Month</Text></MenuOption>
        */
        return (
            <Menu onSelect={this.props.onSelect}>
                <MenuTrigger>
                    {this.props.image
                        ? <Image style={{marginLeft: 5, marginRight: 5, width: this.props.width || 32, height: this.props.height || 32, resizeMode: this.props.resizeMode || 'contain'}} source={Icons[this.props.image]} />
                        : <Text style={{ fontSize: 20 }}>&#8942;</Text>
                    }
                </MenuTrigger>
                <MenuOptions>
                    {this.props.items.map((item, i) => {
                        return (
                            <MenuOption key={i} value={item}><Text style={{fontSize: 20}}>{item.label}</Text></MenuOption>
                        );
                    })}
                </MenuOptions>
            </Menu>
        );
    }
});

module.exports = FilterMenu;
