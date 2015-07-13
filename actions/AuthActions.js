'use strict';

var Actions = require('../constants/Actions');
var Promise = require('q');
var NotificationActions = require('./NotificationActions');
var NavigationActions = require('./NavigationActions');
var authStorage = require('../services/auth-storage');
var UserActions = require('./UserActions');

var _storeTokenAndGetUser = function(context, token) {
    return Promise.all([
        context.executeAction(UserActions.getUserById, token)
    ]);
};

module.exports = {
    resetPassword: function (context, payload) {
        var token    = payload.token;
        var password = payload.password;

        return context.hairfieApi
            .put('/users/'+token.userId, { password: password }, { token: token })
            .then(function () {
                return Promise.all([
                    context.executeAction(
                        NotificationActions.notifySuccess,
                        'Votre mot de passe a été changé avec succès.'
                    ),
                    context.executeAction(
                        NavigationActions.navigate,
                        { route: 'home' }
                    )
                ]);
            });
    },
    emailConnect: function(context, payload) {
        console.log(withNavigate);
        delete payload.withNavigate;

        return context.hairfieApi
            .post('/users/login', payload)
            .then(function (token) {
                return _storeTokenAndGetUser(context, token)
                    .then(function() {
                        if (!withNavigate)
                            return;
                        context.executeAction(
                            NavigationActions.navigate,
                            { route: 'home' }
                        )
                    })
                }, function () {
                    return context.executeAction(
                        NotificationActions.notifyFailure,
                        "Un problème est survenu, veuillez vérifier votre e-mail et mot de passe"
                    );
            })
    },
    facebookConnect: function(context, payload) {
        var withNavigate = payload.withNavigate;
        delete payload.withNavigate;

        return context.hairfieApi
            .post('/auth/facebook/token', payload)
            .then(function (token) {
                return _storeTokenAndGetUser(context, token)
                    .then(function() {
                        if (!withNavigate)
                            return;
                        context.executeAction(
                            NavigationActions.navigate,
                            { route: 'home' }
                        )
                    })
                }, function () {
                    return context.executeAction(
                        NotificationActions.notifyFailure,
                        "Un problème est survenu, veuillez vérifier votre e-mail et mot de passe"
                    );
            })
    },
    disconnect: function(context, token) {
        return context.hairfieApi
            .post('/users/logout', token, { query: { access_token: token.id }})
            .then(function () {
            return Promise.all([
                authStorage.clearToken(context),
                context.dispatch(Actions.DELETE_TOKEN),
                context.dispatch(Actions.DELETE_USER_INFO)
                ]);
            }, function () {
                return context.executeAction(
                    NotificationActions.notifyFailure,
                    "Un problème est survenu"
                );
            })
    },
    register: function(context, payload) {
        var url = payload.withNavigate;
        delete payload.withNavigate;

        return context.hairfieApi
            .post('/users', payload)
            .then(function (data) {
                return _storeTokenAndGetUser(context, data.accessToken)
                    .then(function() {
                        if (!withNavigate)
                            return;
                        context.executeAction(
                            NavigationActions.navigate,
                            { route: 'home' }
                        )
                    })
                }, function () {
                    return context.executeAction(
                        NotificationActions.notifyFailure,
                        "Un problème est survenu, veuillez vérifier que tous les champs obligatoires ont bien été remplis"
                    );
            })
    },
    loginWithCookie: function(context) {
        var token;

        return Promise.all([
            token = authStorage.getToken(context),
            context.executeAction(UserActions.getUserById, token)
        ]);
    }
};
