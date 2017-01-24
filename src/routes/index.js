import React from 'react';
import { connect } from 'react-redux';
import { Actions, Scene } from 'react-native-router-flux';
import {NavBar as navBar} from 'react-native-nub';
import {HomeView,AboutView,PlaceholderView/*,ScheduleView,PatientsView,PatientDetailView,MedDetailView,RemindersView,ReminderDetailView*/} from '../views';
import Icons from '../res';
import {getAll} from '../actions/patients';


const NavBar = connect(null, {getAll})(navBar({
    style: {
        backgroundColor: 'gold'
    },
    onBack: Actions.pop,
    rightButtons: [
        {image:'refresh-light', onPress: (props) => props.getAll()},
        {image:'info-light', onPress: () => Actions.about() }
    ]
}));

export const MenuItems = [
    {key: 'home',name: 'Home',image: Icons['home-light']},
    {key: 'schedule',name: 'Schedule',image: Icons.calendar},
    {key: 'patients',name: 'Patients',image: Icons.patients},
    {key: 'reminders',name: 'Reminders',image: Icons.notifications},
    {key: 'about',name: 'About',image: Icons['info-light']}
];

export default Actions.create(
    <Scene key="root" navBar={NavBar}>
        <Scene key="home" type='reset' component={HomeView} title="" initial={true} />
        <Scene key="schedule" component={PlaceholderView("ScheduleView")} title="" />
        <Scene key="patients" component={PlaceholderView("PatientsView")} title="">
            <Scene key="patient" component={PlaceholderView("PatientDetailView")} title="" >
                <Scene key="medication" component={PlaceholderView("MedDetailView")} title="" />
            </Scene>
        </Scene>
        <Scene key="reminders" component={PlaceholderView("RemindersView")} title="">
            <Scene key="reminder" component={PlaceholderView("ReminderDetailView")} title="" >
            </Scene>
        </Scene>
        <Scene key="about" component={AboutView} title="" />
    </Scene>
);
