'use strict';

var Actions = require('../constants/Actions');
var NavigationActions = require('./NavigationActions');
var NotificationActions = require('./NotificationActions');
var authStorage = require('../services/auth-storage');

module.exports = {
    submit: function (context, payload) {
        var subscriber = payload.subscriber;

        return context.hairfieApi
            .post('/subscribers', subscriber, { token: null })
            .then(function (subscriber) {
                context.dispatch(Actions.ADD_SUBSCRIBER_SUCCESS);
                return context.dispatch(Actions.CLOSED_POPUP_STATUS, true);

            });
    },
    hasClosedPopup: function (context) {
        authStorage.setHasClosedPopup(context);
        return context.dispatch(Actions.CLOSED_POPUP_STATUS, true);
    },
    getClosedPopupStatus: function (context) {
        var status = authStorage.getClosedPopup(context);
        return context.dispatch(Actions.CLOSED_POPUP_STATUS, status)
    }
};