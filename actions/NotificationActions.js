'use strict';

var Actions = require('../constants/Actions');
var Uuid = require('uuid');

module.exports = {
    notifySuccess: notify.bind(null, 'success'),
    notifyFailure: notify.bind(null, 'failure'),
    closeNotification: function (context, notificationId) {
        context.dispatch(Actions.CLOSE_NOTIFICATION, notificationId);
    }
};

function notify(type, context, body) {
    return context.dispatch(Actions.RECEIVE_NOTIFICATION, {
        id: Uuid.v4(),
        type: type,
        body: body
    });
}
