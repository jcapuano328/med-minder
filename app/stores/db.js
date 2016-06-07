import Store from 'react-native-store';

const DB = {
    'system': Store.model('mm-system'),
    'patients': Store.model('mm-patients')
};

module.exports = DB;
