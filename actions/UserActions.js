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
            "Vous devez vous connecter pour éxécuter cette action"    
        ),
        context.executeAction(
            NavigationActions.navigate,
            { route: 'connect_page' }
        )
    ]);
};

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
    hairfieLike: function(context, payload) {
        var token = context.getStore('AuthStore').getToken();
        if (!token || !token.userId)
            _mustBeConnected(context);

        return context.hairfieApi
            .put('/users/' + token.userId + '/liked-hairfies/' + payload.hairfieId, payload)
            .then (function () {
                return Promise.all([
                        context.executeAction(HairfieActions.loadHairfie, payload.hairfieId),
                        context.dispatch('RECEIVE_USER_LIKE_HAIRFIE', {hairfieId: payload.hairfieId, isLiked: true})
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
        if (!token || !token.userId)
            _mustBeConnected(context);
        return context.hairfieApi
            .delete('/users/' + token.userId + '/liked-hairfies/' + payload.hairfieId, payload)
            .then (function () {
                return Promise.all([
                        context.executeAction(HairfieActions.loadHairfie, payload.hairfieId),
                        context.dispatch('RECEIVE_USER_LIKE_HAIRFIE', {hairfieId: payload.hairfieId, isLiked: false})
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
            .head('/users/' + token.userId + '/liked-hairfies/' + payload.hairfieId, payload)
            .then(function () {
                return true;
            })
            .catch(function (e) { 
                if (e.status == 404) {
                    return false;
                }
            })
            .then(function(isLiked) {
                return context.dispatch('RECEIVE_USER_LIKE_HAIRFIE', {hairfieId: payload.hairfieId, isLiked: isLiked});
            })
    }
};