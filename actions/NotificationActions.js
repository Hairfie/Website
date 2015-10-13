'use strict';

var Actions = require('../constants/Actions');
var Uuid = require('uuid');

module.exports = {
    notifySuccess: notify.bind(null, 'success'),
    notifyInfo   : notify.bind(null, 'info'),
    notifyWarning: notify.bind(null, 'warning'),
    notifyError: notify.bind(null, 'error'),
    closeNotification: function (context, notificationId) {
        context.dispatch(Actions.CLOSE_NOTIFICATION, notificationId);
    }
};

function notify(level, context, p) {
    return context.dispatch(Actions.RECEIVE_NOTIFICATION, {
        id: Uuid.v4(),
        level: level,
        title: p.title,
        message: p.message,
        action: p.action || null, //add button action on Notification
        position: p.position || 'tr', //t = top, b = bottom, l = left, c = center ex: tr = top-right
        autoDismiss: p.autoDismiss || 5 //autoDismiss notification after 5 second
    });
}
