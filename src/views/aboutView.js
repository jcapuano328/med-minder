import React from 'react';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import {AboutView} from 'react-native-app-nub';
import {logo} from '../res';

const About = () => {
    return (
        <AboutView logo={logo}
            title={'About Med Minder'}
            version={this.props.version}
            releasedate={this.props.releasedate}
            description={'A no frills meds reminder.'}
            dependencies={[
                {description: 'react-native-system-notification', url: ''},
                {description: 'react-native-fs', url: ''},
                {description: 'react-native-menu', url: ''},
                {description: 'moment', url: ''}
            ]}
            onClose={() => {Actions.back();}}
        />
    );
}

const mapStateToProps = (state) => ({
    version: state.info.version,
    releasedate: state.info.releasedate
});

module.exports = connect(
  mapStateToProps
)(About);
