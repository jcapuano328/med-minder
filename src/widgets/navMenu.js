import React from 'react';
import {NavMenu,NavMenuItem} from 'react-native-app-nub';
import {home,calendar,patients,notifications,info} from '../res';

const navitems = [
    {id: 1,name: 'Home',image: home},
    {id: 2,name: 'Schedule',image: calendar},
    {id: 3,name: 'Patients',image: patients},
    {id: 4,name: 'Reminders',image: notifications},
    {id: 5,name: 'About',image: info}
];

let Menu = React.createClass({
    render() {        
        return (
            <NavMenu
                items={navitems.map((item,i) =>
                    <NavMenuItem key={i+1} item={{id:item.id,name:item.name,desc:item.desc,image:item.image}} onPress={this.props.navMenuHandler} />
                )}
            />
        );
    }
});

export default Menu;
