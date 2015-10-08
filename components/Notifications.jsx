'use strict';

var React = require('react');
var connectToStores = require('fluxible-addons-react/connectToStores');
var NotificationActions = require('../actions/NotificationActions');
var Alert = require('react-bootstrap').Alert;
var NotificationSystem = require('react-notification-system');

var Notifications = React.createClass({
    contextTypes: {
        executeAction: React.PropTypes.func
    },
    _notificationSystem: null,
    _addNotification: function(event) {
        event.preventDefault();
        this._notificationSystem.addNotification({
          message: 'Notification message',
          level: 'success'
        });
    },
    componentDidMount: function() {
        this._notificationSystem = this.refs.notificationSystem;
    },
    render: function (notification) {
        return (
            <NotificationSystem ref="notificationSystem" />
        );
    },
    close: function (notificationId) {
        this.context.executeAction(NotificationActions.closeNotification, notificationId);
    },
    onChange: function () {
        this.setState(this.getStateFromStores());
    }
});

Notifications = connectToStores(Notifications, [
    'NotificationStore'
], function (context) {
    return {
        notifications: context.getStore('NotificationStore').getAll()
    };
});

module.exports = Notifications;
