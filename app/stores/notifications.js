import Notification from 'react-native-system-notification';
var moment = require('moment');
let FIVE_MINUTES = (5 * 60 * 1000);

let get = (ids, notifications) => {
    if (ids.length > 0) {
        var id = ids.shift();
        return Notification.find(id)
        .then((notification) => {
            notifications.push(notification);
            return get(ids, notifications);
        })
        .catch((err) => {
            console.error(err);
            return get(ids, notifications);
        });
    }
    return new Promise((accept,reject) => accept(notifications));
}

module.exports = {
    getById(id) {
        return Notification.find(id);
    },
    get(ids) {
        if (ids) {
            return get(ids, []);
        }
        return Notification.getIDs()
        .then((ids) => {
            return get(ids, []);
        });
    },
    create(reminder) {
        let n = {
            subject: reminder.patient.name + ' has a medication due',
            message: 'Give ' + reminder.patient.name + ' ' + reminder.med.name + ' ' + reminder.med.dosage + ' ' + reminder.med.instructions,
            sendAt: reminder.on.toDate(),
            repeatEvery: FIVE_MINUTES,
            repeatCount: 12,    // repeat for an hour
            autoClear: false,
            onlyAlertOnce: false,
            category: 'reminder',
            payload: reminder
        };

        return Notification.create(n)
        .then((notification) => {
            console.log('***********   ' + notification.subject + ' @ ' + moment(notification.sendAt).format('MMM DD, YYYY HH:mm') + ' (' + notification.id + ')');
            return notification;
        })
        .catch((err) => {
            console.error(err);
        });
    },
    cancel(ids) {
        console.log('***********   cancel');
        console.log(ids);
        if (!ids || ids.length < 1) {
            return Notification.deleteAll();
        }
        let a = [];
        ids.forEach((id) => {
            console.log('***********   cancel ' + id);
            let p = Notification.delete(id);
            a.push(p);
        });
        return Promise.all(a)
        .then(() => {
            console.log('***********   canceled');
        });
    },
    clear(id) {
        if (!id) {
            return Notification.clearAll();
        }
        return Notification.clear(id);
    },
    start(cb) {
        Notification.addListener('press', cb);
    },
    stop() {
        Notification.removeAllListeners('press');
    }
};
