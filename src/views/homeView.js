import React from 'react';
import { connect } from 'react-redux';
import LandingView from '../components/landingView';
import {splash} from '../res';
import {getAll} from '../actions/patients';

var HomeView = React.createClass({
    getInitialState() {
        return {show: true};
    },
    componentWillMount() {
        this.props.getAll()
        .then((data) => {
            if (data) {
                this.state.show = false;
                Actions.patients();
            }            
        })
        .done();
    },    
    render() {
        if (this.state.show) {
            return (
                <Landing splash={splash} top={50} />
            );
        }
    }
});

const mapDispatchToProps = ({load});

module.exports = connect(
  null,
  mapDispatchToProps
)(HomeView);

