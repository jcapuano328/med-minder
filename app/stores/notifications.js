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
    get(reminders) {
        if (reminders) {
            return get(reminders.map((r) => {return r.notificationid;}), []);
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
            reminder.notificationid = notification.id;
            return notification;
        })
        .catch((err) => {
            console.error(err);
        });
    },
    cancel(reminders) {
        if (!reminders || reminders.length < 1) {
            return Notification.deleteAll();
        }
        reminders.forEach((r) => {
            if (r.notificationid) {
                return Notification.delete(r.notificationid);
            }
        });
    },
    clear(reminder) {
        if (!reminder) {
            return Notification.clearAll();
        }
        return Notification.clear(reminder.notificationid);
    },
    start(cb) {
        Notification.addListener('press', cb);
    },
    stop() {
        Notification.removeAllListeners('press');
    }
};
