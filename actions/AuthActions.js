'use strict';

var Actions = require('../constants/Actions');
var Promise = require('q');
var NotificationActions = require('./NotificationActions');
var NavigationActions = require('./NavigationActions');
var authStorage = require('../services/auth-storage');
var UserActions = require('./UserActions');
var SubscriberActions = require('./SubscriberActions');

var _storeTokenAndGetUser = function(context, token) {
    return Promise.all([
        authStorage.setToken(context, token),
        context.dispatch(Actions.RECEIVE_TOKEN, token),
        context.executeAction(UserActions.userConnect, token)
    ]);
};

module.exports = {
    askResetPassword: function (context, payload) {
        return context.hairfieApi
            .post('/users/reset', {email: payload.email})
            .then(function () {
                context.executeAction(
                    NotificationActions.notifyInfo,
                    {
                        title: 'Changement de mot de passe',
                        message: 'Vous allez recevoir, un mail pour vous permettre de changer votre mot de passe'
                    }
                );
            }, function () {
                context.executeAction(
                    NotificationActions.notifyError,
                    {
                        title: 'Echec',
                        message: 'Votre requête pour obtenir un nouveau mot de passe a échoué, vérifiez bien que vous avez rentré un adresse e-mail valide'
                    }
                );
            })
    },
    resetPassword: function (context, payload) {
        var token    = payload.token;
        var password = payload.password;

        return context.hairfieApi
            .put('/users/'+token.userId, { password: password }, { token: token })
            .then(function () {
                return Promise.all([
                    context.executeAction(
                        NotificationActions.notifySuccess,
                        {
                            title: 'Nouveau mot de passe',
                            message: 'Votre mot de passe a été changé avec succès.'
                        }
                    ),
                    context.executeAction(
                        NavigationActions.navigate,
                        { route: 'connect_page' }
                    )
                ]);
            }, function () {
                return Promise.all([
                    context.executeAction(
                        NotificationActions.notifyError,
                        {
                            title: 'Echec',
                            message: "Votre mot de passe n'a pas pu être changé, veuillez réessayer"
                        }
                    ),
                    context.executeAction(
                        NavigationActions.navigate,
                        { route: 'connect_page' }
                    )
                ]);
            }
        );
    },
    emailConnect: function(context, payload) {
        var withNavigate = payload.withNavigate;
        delete payload.withNavigate;

        return context.hairfieApi
            .post('/users/login', payload)
            .then(function (token) {
                return _storeTokenAndGetUser(context, token)
                    .then(function() {
                        context.executeAction(
                            NotificationActions.notifySuccess,
                            {
                                title: 'Connexion',
                                message: "Vous êtes à présent connecté"
                            }
                        );
                        if (!withNavigate)
                            return;
                        context.executeAction(
                            NavigationActions.navigate,
                            { route: 'home' }
                        )
                    })
                }, function () {
                    return context.executeAction(
                        NotificationActions.notifyError,
                        {
                            title: 'Echec de connexion',
                            message: "Un problème est survenu, veuillez vérifier votre e-mail et mot de passe"
                        }
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
                        context.executeAction(
                            NotificationActions.notifySuccess,
                            {
                                title: 'Connexion',
                                message: "Vous êtes à présent connecté"
                            }
                        );
                        if (!withNavigate)
                            return;
                        context.executeAction(
                            NavigationActions.navigate,
                            { route: 'home' }
                        )
                    })
                }, function () {
                    return context.executeAction(
                        NotificationActions.notifyError,
                        {
                            title: 'Echec de connexion',
                            message: "Un problème est survenu, veuillez réessayer"
                        }
                    );
            })
    },
    disconnect: function(context, token) {
        authStorage.clearToken(context);
        return context.hairfieApi
            .post('/users/logout', token, { query: { access_token: token.id }})
            .then(function () {
                context.executeAction(
                    NotificationActions.notifyInfo,
                    {
                        title: 'Déconnexion',
                        message: "Vous êtes à présent déconnecté"
                    }
                );
                return Promise.all([
                    context.dispatch(Actions.DELETE_TOKEN),
                    context.dispatch(Actions.DELETE_USER_INFO)
                    ]);
                }, function () {
                    return Promise.all([
                        context.dispatch(Actions.DELETE_TOKEN),
                        context.dispatch(Actions.DELETE_USER_INFO)
                    ]);
                })
    },
    register: function(context, payload) {
        var withNavigate = payload.withNavigate;
        delete payload.withNavigate;

        return context.hairfieApi
            .post('/users', payload)
            .then(function (data) {
                return _storeTokenAndGetUser(context, data.accessToken)
                    .then(function() {
                        context.executeAction(
                            NotificationActions.notifySuccess,
                            {
                                title: 'Inscription',
                                message: "Félicitations ! Vous êtes maintenant inscrit sur Hairfie, vous êtes à présent connecté"
                            }
                        );
                        if (!withNavigate)
                            return;
                        context.executeAction(
                            NavigationActions.navigate,
                            { route: 'home' }
                        )
                    })
                }, function () {
                    return context.executeAction(
                        NotificationActions.notifyError,
                        {
                            title: "Problème lors de l'inscription",
                            message: "Un problème est survenu, veuillez vérifier que tous les champs obligatoires ont bien été remplis"
                        }
                    );
            })
    },
    loginWithCookie: function(context) {
        var token = authStorage.getToken(context) || {};

        return context.executeAction(UserActions.userConnect, token)
            .then(function () {
                return Promise.all([
                    context.dispatch(Actions.RECEIVE_TOKEN, token),
                    context.executeAction(SubscriberActions.hasClosedPopup)
                ])
            });
    }
};
