'use strict';

var Actions = require('../constants/Actions');
var Uuid = require('uuid');

module.exports = {
    notifySuccess: notify.bind(null, 'success'),
    notifyInfo   : notify.bind(null, 'info'),
    notifyWarning: notify.bind(null, 'warning'),
    notifyFailure: notify.bind(null, 'error'),
    closeNotification: function (context, notificationId) {
        context.dispatch(Actions.CLOSE_NOTIFICATION, notificationId);
    }
};

function notify(level, context, title, message) {
    return context.dispatch(Actions.RECEIVE_NOTIFICATION, {
        id: Uuid.v4(),
        level: level,
        title: title,
        message: message
    });
}
