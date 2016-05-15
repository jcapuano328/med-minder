'use strict';

var React = require('react-native');
var { View, Text, Navigator, Alert } = React;
var DrawerLayout = require('./widgets/drawerLayout');
var NavMenu = require('./widgets/navMenu');
var TitleBar = require('./widgets/titleBar');
import { MenuContext } from 'react-native-menu';
var LandingView = require('./landingView');
var AboutView = require('./aboutView');
var ScheduleView = require('./scheduleView');
var EventEmitter = require('EventEmitter');
var Sample = require('./stores/sample.js');

var MainView = React.createClass({
    getInitialState() {
        return {
            drawer: false,
            routes: {
                landing: {index: 0, name: 'landing', onMenu: this.navMenuHandler},
                schedule: {index: 1, name: 'schedule', title: 'Schedule', onMenu: this.navMenuHandler, onFilter: this.onFilter},
                about: {index: 5, name: 'about'}
            },
            version: '0.0.1',
            filter: 'today'
        };
    },
    componentWillMount() {
        //console.log('set initial route');
        this.eventEmitter = new EventEmitter();
        this.state.initialRoute = this.state.routes.landing;
        //return Sample.load()
        return new Promise((a,r) => a())
        .then(() => {
            this.refs.navigator.push(this.state.routes.schedule);
        })
        .done();
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
