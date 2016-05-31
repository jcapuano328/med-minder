'use strict';

var React = require('react-native');
var { View, Text, Navigator, Alert, ToastAndroid } = React;
var DrawerLayout = require('./widgets/drawerLayout');
var NavMenu = require('./widgets/navMenu');
var TitleBar = require('./widgets/titleBar');
import { MenuContext } from 'react-native-menu';
var LandingView = require('./landingView');
var AboutView = require('./aboutView');
var ScheduleView = require('./scheduleView');
var PatientsView = require('./patientsView');
var PatientDetailView = require('./patientDetailView');
var MedDetailView = require('./medDetailView');
var RemindersView = require('./remindersView');
var EventEmitter = require('EventEmitter');
var Reminders = require('./stores/reminders');
var Notifications = require('./stores/notifications');
var Sample = require('./stores/sample.js');

var MainView = React.createClass({
    getInitialState() {
        return {
            drawer: false,
            routes: {
                landing: {index: 0, name: 'landing', onMenu: this.navMenuHandler},
                schedule: {index: 1, name: 'schedule', title: 'Schedule', onMenu: this.navMenuHandler, onFilter: this.onFilter},
                patients: {index: 2, name: 'patients', title: 'Patients', onMenu: this.navMenuHandler, onAdd: this.onAdd('patient')},
                patient: {index: 3, name: 'patient', title: 'Patient', onMenu: this.navMenuHandler, onAccept: this.onAccept('patient'), onDiscard: this.onDiscard('patient')},
                med: {index: 4, name: 'med', title: 'Medication', onMenu: this.navMenuHandler, onAccept: this.onAccept('med'), onDiscard: this.onDiscard('med')},
                reminders: {index: 5, name: 'reminders', title: 'Reminders', onMenu: this.navMenuHandler},
                about: {index: 6, name: 'about'}
            },
            version: '0.0.1',
            filter: 'today'
        };
    },
    componentWillMount() {
        Notifications.start(this.onNotification);
        this.eventEmitter = new EventEmitter();
        this.eventEmitter.addListener('changeroute', this.onChangeRoute);
        this.state.initialRoute = this.state.routes.landing;
        //return Sample.load()
        return new Promise((a,r) => a())
        .then(() => {
            this.refs.navigator.push(this.state.routes.schedule);
            //this.refs.navigator.push(this.state.routes.patients);
            //this.refs.navigator.push(this.state.routes.reminders);
        })
        .done();
    },
    componentWillUnmount() {
        Notifications.stop();
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
        //console.log(e);
        if (e == 'Home') {
            this.refs.navigator.popToRoute(this.state.routes.landing);
        } else if (e == 'Schedule') {
            this.refs.navigator.push(this.state.routes.schedule);
        } else if (e == 'Patients') {
            this.refs.navigator.push(this.state.routes.patients);
        } else if (e == 'About') {
            this.refs.navigator.push(this.state.routes.about);
        }
        this.toggleDrawer();
    },
    onChangeRoute(route, data) {
        if (this.state.routes[route]) {
            this.state.routes[route].data = data;
            this.refs.navigator.push(this.state.routes[route]);
        }
    },
    onFilter(filter) {
        console.log('filter ' + filter);
        this.setState({filter: filter});
    },
    filterTitle() {
        if (this.state.filter == 'today') {
            return 'Today';
        }
        if (this.state.filter == 'week') {
            return 'This Week';
        }
        if (this.state.filter == 'month') {
            return 'This Month';
        }
    },
    onAdd(type) {
        return () => {
            console.log('Add ' + type);
            this.eventEmitter.emit('add' + type);
        }
    },
    onAccept(type) {
        return () => {
            console.log('Accept ' + type);
            this.eventEmitter.emit('accept' + type);
            //this.state.routes[type].data = null;
            this.refs.navigator.pop();
        }
    },
    onDiscard(type) {
        return () => {
            console.log('Discard ' + type);
            this.eventEmitter.emit('discard' + type);
            this.state.routes[type].data = null;
            this.refs.navigator.pop();
        }
    },
    onNotification(notification) {
        //console.log('+++++++++++ Notification');
        //console.log(notification);
        //ToastAndroid.show(notification.subject, ToastAndroid.LONG);
        let subject = notification.payload.patient.name + ' has a medication due';
        let message = 'Give ' + notification.payload.patient.name + ' ' + notification.payload.med.name + ' ' + notification.payload.med.dosage + ' ' + notification.payload.med.instructions;
        Alert.alert(subject, message, [
            {text: 'Later', style: 'cancel'},
            {text: 'Complete', onPress: () => {
                Reminders.complete(notification.payload)
                .then(() => {
                    console.log('+++++++++++ Notification acknowledged');
                })
                .catch((err) => {
                    console.log(err);
                });
            }}
        ]);
    },
    renderScene(route, navigator) {
        route = route || {};
        //console.log('render scene ' + route.name);
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
            this.state.routes.schedule.title = this.filterTitle();
            return (
                <ScheduleView filter={this.state.filter} events={this.eventEmitter} />
            );
        }

        if (route.name == 'patients') {
            return (
                <PatientsView events={this.eventEmitter} />
            );
        }

        if (route.name == 'patient') {
            return (
                <PatientDetailView patient={route.data} events={this.eventEmitter} />
            );
        }

        if (route.name == 'med') {
            return (
                <MedDetailView med={route.data} events={this.eventEmitter} />
            );
        }

        if (route.name == 'reminders') {
            return (
                <RemindersView events={this.eventEmitter} />
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
