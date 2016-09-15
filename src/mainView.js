'use strict';

var React = require('react');
import { View, Text, Navigator, Alert, ToastAndroid } from 'react-native';
var DrawerLayout = require('./widgets/drawerLayout');
var NavMenu = require('./widgets/navMenu');
var TitleBar = require('./widgets/titleBar');
import { MenuContext } from 'react-native-menu';
var EventEmitter = require('EventEmitter');
var LandingView = require('./landingView');
var AboutView = require('./aboutView');
var ScheduleView = require('./scheduleView');
var PatientsView = require('./patientsView');
var PatientDetailView = require('./patientDetailView');
var MedDetailView = require('./medDetailView');
var RemindersView = require('./remindersView');
var ReminderDetailView = require('./reminderDetailView');
var Sample = require('./services/sample.js');
var log = require('./services/log');

var scheduleFilterItems = [
    {type: 'schedule', label: 'Now', value: 'now'},
    {type: 'schedule', label: 'Today', value: 'today'},
    {type: 'schedule', label: 'This Week', value: 'week'},
    {type: 'schedule', label: 'This Month', value: 'month'}
];
/*
var remindersFilterItems = () => {
    return Patients.getAll()
    .then((patients) => {
        return (patients || []).map((patient) => {
            return {type: 'reminder', label: patient.name, value: patient._id};
        });
    });
}
*/

var MainView = React.createClass({
    getInitialState() {
        return {
            drawer: false,
            routes: {
                landing: {index: 0, name: 'landing', title: '', onMenu: this.navMenuHandler},
                schedule: {index: 1, name: 'schedule', title: 'Schedule', onMenu: this.navMenuHandler, onFilter: this.onFilter, filterItems: scheduleFilterItems},
                patients: {index: 2, name: 'patients', title: 'Patients', onMenu: this.navMenuHandler, onAdd: this.onAdd('patient')},
                patient: {index: 3, name: 'patient', title: 'Patient', onMenu: this.navMenuHandler},
                med: {index: 4, name: 'med', title: 'Medication', onMenu: this.navMenuHandler},
                reminders: {index: 5, name: 'reminders', title: 'Reminders', onMenu: this.navMenuHandler},// onFilter: this.onFilter, filterItems: remindersFilterItems},
                reminder: {index: 6, name: 'reminder', title: 'Reminder'},
                about: {index: 7, name: 'about', title: 'About'}
            },
            version: '0.0.1',
            scheduleFilter: scheduleFilterItems[0],
            reminderFilter: {}
        };
    },
    componentWillMount() {
        //Reminder.start(this.onNotification);
        this.eventEmitter = new EventEmitter();
        this.eventEmitter.addListener('changeroute', this.onChangeRoute);
        this.eventEmitter.addListener('poproute', () => this.refs.navigator.pop());
        this.eventEmitter.addListener('raisenotification', this.onNotification);
        this.state.initialRoute = this.state.routes.landing;
        //return Sample.load()
        return new Promise((a,r) => a())
        .then(() => {
            this.refs.navigator.resetTo(this.state.routes.schedule);
            //this.refs.navigator.resetTo(this.state.routes.patients);
            //this.refs.navigator.resetTo(this.state.routes.reminders);
            /*
            this.onChangeRoute('med', {
                name: 'med',
                data: {
                    name: 'Stuff',
                    dosage: '10 mg',
                    instructions: 'Take it already',
                    schedule: {
                        frequency: 'Daily',
                        dow: 'Today',
                        tod: {
							morning: true,
							noon: false,
							evening: true,
							bedtime: false
						}
                    },
                    status: 'active'
                },
                onChanged: (m,p) => console.log(p),
                onAccept: () => this.refs.navigator.pop(),
                onDiscard: () => this.refs.navigator.pop()
            });
            */
        })
        .done();
    },
    componentWillUnmount() {
        //Reminder.stop();
    },
    toggleDrawer() {
        if (!this.state.drawer) {
            let open = this.refs.drawer.openDrawer || this.refs.drawer.open;
            open();
        } else {
            let close = this.refs.drawer.closeDrawer || this.refs.drawer.close;
            close();
        }
        this.state.drawer = !this.state.drawer;
    },
    menuHandler() {
        this.toggleDrawer();
    },
    navMenuHandler(e) {
        //log.debug(e);
        if (e == 'Home') {
            this.refs.navigator.resetTo(this.state.routes.landing);
        } else if (e == 'Schedule') {
            this.refs.navigator.resetTo(this.state.routes.schedule);
        } else if (e == 'Patients') {
            this.refs.navigator.resetTo(this.state.routes.patients);
        } else if (e == 'Reminders') {
            this.refs.navigator.resetTo(this.state.routes.reminders);
        } else if (e == 'About') {
            this.refs.navigator.push(this.state.routes.about);
        }
        this.toggleDrawer();
    },
    onChangeRoute(route, data) {
        log.debug('Change route to ' + route);
        if (this.state.routes[route]) {
            this.state.routes[route].title = data.title || this.state.routes[route].title;
            this.state.routes[route].data = data.data;
			this.state.routes[route].onAdd = data.onAdd;
			this.state.routes[route].onAccept = data.onAccept;
			this.state.routes[route].onDiscard = data.onDiscard;
			this.state.routes[route].onFilter = data.onFilter;
            this.state.routes[route].onChanged = data.onChanged;
            this.state.routes[route].onComplete = data.onComplete;
            this.state.routes[route].onDelay = data.onDelay;
            this.refs.navigator.push(this.state.routes[route]);
        }
    },
    onAdd(type) {
        // now what? don't want to go the eventing route again...
        return () => {
            log.debug('Add ' + type);
            this.eventEmitter.emit('add' + type);
        }
    },
    onFilter(filter) {
        log.debug('filter ' + filter);
        if (filter.type == 'schedule') {
            this.setState({scheduleFilter: filter});
        }
        if (filter.type == 'reminder') {
            this.setState({reminderFilter: filter});
        }
    },
    onNotification(notification) {
        //console.log(notification);
        this.onChangeRoute('reminder', {
            data: notification,
            title: notification.payload.patient.name + ' has a medication due',
            onComplete: (n) => {
                Reminders.complete(n, true)
                .then(() => {
                    log.debug('+++++++++++ Notification acknowledged');
                    this.eventEmitter.emit('notificationacknowledged', notification.payload);
                    this.eventEmitter.emit('notificationrescheduled');
                    this.refs.navigator.pop();
                })
                .catch((err) => {
                    log.error(err);
                });
            },
            onDelay: (n) => {
                Reminders.schedule(n.payload)
                .then(() => {
                    log.debug('+++++++++++ Notification delayed');
                    this.refs.navigator.pop();
                })
                .catch((err) => {
                    log.error(err);
                });
            }
        });
    },
    renderScene(route, navigator) {
        route = route || {};
        log.debug('render scene ' + route.name);
        if (route.name == 'landing') {
            return (
                <LandingView events={this.eventEmitter} />
            );
        }
        if (route.name == 'about') {
            return (
                <AboutView version={this.state.version} events={this.eventEmitter} onClose={() => {navigator.pop();}} />
            );
        }

        if (route.name == 'schedule') {
            this.state.routes.schedule.title = this.state.scheduleFilter.label;
            return (
                <ScheduleView filter={this.state.scheduleFilter.value} events={this.eventEmitter} />
            );
        }

        if (route.name == 'patients') {
            return (
                <PatientsView events={this.eventEmitter} />
            );
        }

        if (route.name == 'patient') {
            return (
                <PatientDetailView patient={route.data} events={this.eventEmitter} onChanged={route.onChanged}/>
            );
        }

        if (route.name == 'med') {
            return (
                <MedDetailView med={route.data} events={this.eventEmitter} onChanged={route.onChanged} />
            );
        }

        if (route.name == 'reminders') {
            return (
                <RemindersView filter={this.state.reminderFilter.value} events={this.eventEmitter} />
            );
        }

        if (route.name == 'reminder') {
            return (
                <ReminderDetailView notification={route.data} events={this.eventEmitter} onComplete={route.onComplete} onDelay={route.onDelay}/>
            );
        }

        return (
            <LandingView events={this.eventEmitter} />
        );
    },
    render() {
        return (
            <View style={{flex: 1,backgroundColor: 'rgba(0,0,0,0.01)'}}>
                <DrawerLayout
                    ref="drawer"
                    onDrawerClosed={() => {this.state.drawer = false;} }
                    onDrawerOpened={() => {this.state.drawer = true;} }
                    onDrawerSlide={(e) => this.setState({drawerSlideOutput: JSON.stringify(e.nativeEvent)})}
                    onDrawerStateChanged={(e) => this.setState({drawerStateChangedOutput: JSON.stringify(e)})}
                    drawerWidth={300}
                    renderNavigationView={() => <NavMenu onSelected={this.navMenuHandler} /> }>
                    <MenuContext style={{flex: 1}}>
                        <Navigator
                            ref="navigator"
                            debugOverlay={false}
                            initialRoute={this.state.initialRoute}
                            renderScene={this.renderScene}
                            navigationBar={<Navigator.NavigationBar style={{backgroundColor: 'gold'}} routeMapper={TitleBar()} />}
                        />
                    </MenuContext>
                </DrawerLayout>
            </View>
        );
    }
});

module.exports = MainView;
