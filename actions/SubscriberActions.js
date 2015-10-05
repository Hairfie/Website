'use strict';

var Actions = require('../constants/Actions');
var NavigationActions = require('./NavigationActions');
var NotificationActions = require('./NotificationActions');

module.exports = {
    submit: function (context, payload) {
        var subscriber = payload.subscriber;

        return context.hairfieApi
            .post('/subscribers', subscriber, { token: null })
            .then(function (subscriber) {
                context.dispatch(Actions.ADD_SUBSCRIBER_SUCCESS);
            });
    }
};
