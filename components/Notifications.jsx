'use strict';

var React = require('react');
var connectToStores = require('fluxible-addons-react/connectToStores');
var NotificationActions = require('../actions/NotificationActions');
var Alert = require('react-bootstrap').Alert;
var NotificationSystem = require('react-notification-system');
var _ = require('lodash');

var Notifications = React.createClass({
    contextTypes: {
        executeAction: React.PropTypes.func
    },
    _notificationSystem: null,
    _addNotification: function(notif) {
        if(this._notificationSystem) {
            this._notificationSystem.addNotification({
                uid: notif.id,
                title: notif.title,
                message: notif.message,
                level: notif.level,
                autoDismiss: notif.autoDismiss,
                position: notif.position,
                action: notif.action,
                onRemove: function() {
                    this.close();
                }.bind(this)
            });
        }
    },
    componentWillReceiveProps: function(nextProps) {
        if (nextProps.notifications)
            _.map(nextProps.notifications, function(notif) {
                this._addNotification(notif);
            }, this);
    },
    componentDidMount: function() {
        this._notificationSystem = this.refs.notificationSystem;
    },
    render: function (notification) {
        return (
            <NotificationSystem ref="notificationSystem"/>
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
