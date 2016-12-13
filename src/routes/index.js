import React from 'react';
import { Scene } from 'react-native-router-flux';
import {NavigationDrawer} from '../widgets';
import {HomeView,AboutView,PlaceholderView/*,ScheduleView,PatientsView,PatientDetailView,MedDetailView,RemindersView,ReminderDetailView*/} from '../views';

export default(
    <Scene key="drawer" component={NavigationDrawer} open={false}>
        <Scene key="Home" component={HomeView} title="" initial={true} />
        <Scene key="Schedule" component={PlaceholderView("ScheduleView")} title="" />
        <Scene key="Patients" component={PlaceholderView("PatientsView")} title="">
            <Scene key="patient" component={PlaceholderView("PatientDetailView")} title="" >
                <Scene key="medication" component={PlaceholderView("MedDetailView")} title="" />
            </Scene>
        </Scene>
        <Scene key="Reminders" component={PlaceholderView("RemindersView")} title="">
            <Scene key="reminder" component={PlaceholderView("ReminderDetailView")} title="" >
            </Scene>
        </Scene>
        <Scene key="about" component={AboutView} title="" />
    </Scene>
);
