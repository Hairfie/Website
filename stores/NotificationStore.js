'use strict';

var createStore = require('fluxible/addons/createStore');
var makeHandlers = require('../lib/fluxible/makeHandlers');
var _ = require('lodash');
var Actions = require('../constants/Actions');

module.exports = createStore({
    storeName: 'NotificationStore',
    handlers: makeHandlers({
        onReceiveNotification: Actions.RECEIVE_NOTIFICATION,
        onCloseNotification  : Actions.CLOSE_NOTIFICATION
    }),
    initialize: function () {
        this.notifications = [];
    },
    dehydrate: function () {
        return {
            notifications: this.notifications
        };
    },
    rehydrate: function (data) {
        this.notifications = data.notifications;
    },
    onReceiveNotification: function (notification) {
        this.notifications[notification.id] = notification;
        this.emitChange();
    },
    onCloseNotification: function (notificationId) {
        console.log("close notifications");
        this.notifications = _.reject(this.notifications, { id: notificationId });
        this.emitChange();
    },
    getAll: function () {
        return _.values(this.notifications);
    }
});
