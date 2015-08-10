'use strict';

var React = require('react');
var connectToStores = require('fluxible-addons-react/connectToStores');
var NotificationActions = require('../actions/NotificationActions');
var Alert = require('react-bootstrap').Alert;

var Notifications = React.createClass({
    contextTypes: {
        executeAction: React.PropTypes.func
    },
    render: function () {
        return (
            <div>
                {(this.props.notifications || []).map(this.renderNotification)}
            </div>
        );
    },
    renderNotification: function (notification) {
        var type;
        switch (notification.type) {
            case 'success':
                type = 'success';
                break;
            case 'failure':
                type = 'danger';
                break;
        }

        return (
            <Alert key={notification.id} bsStyle={type} onDismiss={this.close.bind(this, notification.id)}>
                {notification.body}
            </Alert>
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
