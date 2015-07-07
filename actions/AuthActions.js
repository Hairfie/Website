'use strict';

var Actions = require('../constants/Actions');
var Promise = require('q');
var NotificationActions = require('./NotificationActions');
var NavigationActions = require('./NavigationActions');
var authStorage = require('../services/auth-storage');
var UserActions = require('./UserActions');

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
        return context.hairfieApi
            .post('/users/login', payload)
            .then(function (token) {
                authStorage.setToken(token);
                // fonction differente : loginWithToken
                context.executeAction(UserActions.getUserById, token);
                alert('Connection Effectué');
                context.dispatch(Actions.RECEIVE_TOKEN, token);
                context.executeAction(
                    NavigationActions.navigate,
                    { route: 'home' });
            }, 
            function () {
                return context.executeAction(
                    NotificationActions.notifyFailure,
                    "Un problème est survenu, veuillez vérifier que l'e-mail et le mot de passe soient correct"
                );
            })
    },
    loginWithCookie: function(context) {
        // GET COOKIE
        // on aura tokenId + userId
        // getUserById
        // prendre en compte le fail normal
    },
    disconnect: function(context) {
        context.dispatch(Actions.DELETE_TOKEN);
    },
    register: function(context, payload) {
        return context.hairfieApi
            .post('/users', payload)
            .then(function (data) {
                authStorage.setToken(token);

                UserActions.getUserById();
                alert('Inscription Effectué');
                context.dispatch(Actions.RECEIVE_TOKEN, data.accessToken);
                context.executeAction(
                    NavigationActions.navigate,
                    { route: 'home' });
            }, 
            function () {
                return context.executeAction(
                    NotificationActions.notifyFailure,
                    "Un problème est survenu, avez-vous bien rempli les champs obligatoires ?"
                );
            })
        }
};
