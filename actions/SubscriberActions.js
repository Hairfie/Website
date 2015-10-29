'use strict';

var Actions = require('../constants/Actions');
var NavigationActions = require('./NavigationActions');
var NotificationActions = require('./NotificationActions');
var authStorage = require('../services/auth-storage');
var q = require('q');
var ga = require('../services/analytics');

module.exports = {
    submit: function (context, payload) {
        var subscriber = payload.subscriber;

        return context.hairfieApi
            .post('/subscribers', subscriber, { token: null })
            .then(function (subscriber) {
                context.dispatch(Actions.ADD_SUBSCRIBER_SUCCESS);
                context.executeAction(
                    NotificationActions.notifySuccess,
                    {
                        title: 'Newsletter',
                        message: 'Vous vous êtes bien abonné à la Newsletter'
                    }
                );
                ga('send', 'event', 'Newsletter', 'Submit');
                return q.all([
                    context.dispatch(Actions.CLOSED_POPUP_STATUS, true),
                    context.dispatch(Actions.CLOSED_BANNER_STATUS, true)
                    ]);
            });
    },
    hasClosedPopup: function (context) {
        authStorage.setHasClosedPopup(context);
        return context.dispatch(Actions.CLOSED_POPUP_STATUS, true);
    },
    getClosedPopupStatus: function (context) {
        var status = authStorage.getClosedPopup(context);
        return context.dispatch(Actions.CLOSED_POPUP_STATUS, status);
    },
    hasClosedBanner: function (context) {
        authStorage.setHasClosedBanner(context);
        return context.dispatch(Actions.CLOSED_BANNER_STATUS, true);
    },
    getClosedBannerStatus: function (context) {
        var status = authStorage.getClosedBanner(context);
        return context.dispatch(Actions.CLOSED_BANNER_STATUS, status);
    }
};