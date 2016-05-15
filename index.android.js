'use strict';
import React, {AppRegistry} from 'react-native';
var { View } = React;
let medminder = require('./app/mainView');

AppRegistry.registerComponent('medminder', () => medminder);
