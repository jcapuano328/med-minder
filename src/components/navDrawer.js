import React, {PropTypes} from 'react';
import Drawer from 'react-native-drawer';
import {Actions} from 'react-native-router-flux';
import NavMenu from './navDrawerMenu';

let NavigationDrawer = React.createClass({
    getInitialState() {
        return {
            open: false
        };
    },
    onSelect(e) {
        console.log(e);
        //this.setState({open:false});
        this.drawer.close();
        Actions[e] && Actions[e]();
    },
    render(){
        return (
            <Drawer
                ref={c => this.drawer = c}
                type="overlay"
                side="left"
                open={this.state.open}
                onOpen={()=>this.setState({open: true})}
                onClose={()=>this.setState({open: false})}
                content={<NavMenu items={this.props.items} onSelect={this.onSelect} />}
                tapToClose={true}
                openDrawerOffset={0.2}
                panCloseMask={0.2}
                negotiatePan={true}
                tweenHandler={(ratio) => ({
                 main: { opacity:Math.max(0.54,1-ratio) }
            })}>
                {this.props.children}
            </Drawer>
        );
    }
});

export default NavigationDrawer;
