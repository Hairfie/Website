'use strict';

var Actions = require('../constants/Actions');
var Promise = require('q');
var NotificationActions = require('./NotificationActions');
var NavigationActions = require('./NavigationActions');
var authStorage = require('../services/auth-storage');
var HairfieActions = require('./HairfieActions');

module.exports = {
    getUserById: function(context, token) {
        return context.hairfieApi
            .get('/users/' + token.userId, { query: { access_token: token.id }})
            .then(function (userInfo) {
                return Promise.all ([
                    authStorage.setToken(context, token),
                    context.dispatch(Actions.RECEIVE_TOKEN, token),
                    context.dispatch(Actions.RECEIVE_USER_INFO, userInfo)
                ]);
            }, function () {
                return context.executeAction(
                    NotificationActions.notifyFailure,
                    "Un problème est survenu, veuillez vous reconnecter"
                );
            })
    },
    haifieLike: function(context, payload) {
        return context.hairfieApi
            .put('/users/' + payload.user_id + '/liked-hairfies/' + payload.hairfie_id, payload)
            .then (function () {
                return context.executeAction(HairfieActions.loadHairfie, payload.hairfie_id);
            }, function() {
                return context.executeAction(
                    NotificationActions.notifyFailure,
                    "Un problème est survenu"
                );
            })
    },
    haifieUnlike: function(context, payload) {
        return context.hairfieApi
            .delete('/users/' + payload.user_id + '/liked-hairfies/' + payload.hairfie_id, payload)
            .then (function () {
                return context.executeAction(HairfieActions.loadHairfie, payload.hairfie_id);
            }, function() {
                return context.executeAction(
                    NotificationActions.notifyFailure,
                    "Un problème est survenu"
                );
            })
    },
    haifieIsLiked: function(context, payload) {
        console.log(context.hairfieApi);
        return context.hairfieApi
            .head('/users/' + payload.user_id + '/liked-hairfies/' + payload.hairfie_id, payload)
            .then (function (response) {
                return response;
            }, function() {
                return context.executeAction(
                    NotificationActions.notifyFailure,
                    "Un problème est survenu"
                );
            })
    }
};