'use strict';

var Actions = require('../constants/Actions');
var Promise = require('q');
var NotificationActions = require('./NotificationActions');
var NavigationActions = require('./NavigationActions');
var authStorage = require('../services/auth-storage');
var HairfieActions = require('./HairfieActions');

var _mustBeConnected = function(context) {
    return Promise.all([
        context.executeAction(
            NotificationActions.notifyFailure,
            "Vous devez vous connecter pour exécuter cette action"
        ),
        context.executeAction(
            NavigationActions.navigate,
            { route: 'connect_page' }
        )
    ]);
};

module.exports = {
    userConnect: function(context, token) {
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
    editUser: function(context, payload) {
        return context.hairfieApi
            .put('/users/', payload)
            .then(function (data) {
                console.log(data);
            })
    },
    getUserById: function(context, id) {
        return context.hairfieApi
            .get('/users/' + id)
            .then(function (userInfo) {
                return Promise.all ([
                    context.dispatch(Actions.RECEIVE_USER_INFO, userInfo)
                ]);
            }, function () {
                return context.executeAction(
                    NotificationActions.notifyFailure,
                    "Un problème est survenu, veuillez vous reconnecter"
                );
            })
    },
    hairfieLike: function(context, payload) {
        var token = context.getStore('AuthStore').getToken();
        if (!token || !token.userId) {
            _mustBeConnected(context);
            return;
        }
        return context.hairfieApi
            .put('/users/' + token.userId + '/liked-hairfies/' + payload.id, {hairfieId: payload.id})
            .then (function () {
                return Promise.all([
                        context.executeAction(HairfieActions.loadHairfie, payload.id),
                        context.dispatch('RECEIVE_USER_LIKE_HAIRFIE', {userId:token.userId, hairfie: payload, isLiked: true})
                        ]);
            }, function() {
                return context.executeAction(
                    NotificationActions.notifyFailure,
                    "Un problème est survenu"
                );
            })
    },
    hairfieUnlike: function(context, payload) {
        var token = context.getStore('AuthStore').getToken();
        if (!token || !token.userId) {
            _mustBeConnected(context);
            return;
        }
        return context.hairfieApi
            .delete('/users/' + token.userId + '/liked-hairfies/' + payload.id, {hairfieId: payload.id})
            .then (function () {
                return Promise.all([
                        context.executeAction(HairfieActions.loadHairfie, payload.id),
                        context.dispatch('RECEIVE_USER_LIKE_HAIRFIE', {userId:token.userId, hairfie: payload, isLiked: false})
                        ]);
            }, function() {
                return context.executeAction(
                    NotificationActions.notifyFailure,
                    "Un problème est survenu"
                );
            })
    },
    isLikedHairfie: function(context, payload) {
        var token = context.getStore('AuthStore').getToken();
        if (!token || !token.userId)
            return;
        return context.hairfieApi
            .head('/users/' + token.userId + '/liked-hairfies/' + payload.id, {haifieId: payload.id })
            .then(function () {
                return true;
            })
            .catch(function (e) {
                if (e.status == 404) {
                    return false;
                }
            })
            .then(function(isLiked) {
                return context.dispatch('RECEIVE_USER_LIKE_HAIRFIE', {userId:token.userId, hairfie: payload, isLiked: isLiked});
            })
    }
};