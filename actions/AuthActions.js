'use strict';

var Actions = require('../constants/Actions');
var Promise = require('q');
var NotificationActions = require('./NotificationActions');
var NavigationActions = require('./NavigationActions');
var authStorage = require('../services/auth-storage');

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

                alert('Connection Effectué');
                context.dispatch(Actions.RECEIVE_TOKEN, token);
                context.executeAction(
                    NavigationActions.navigate,
                    { route: 'home' });
                done();
            }, 
            function () {
                return context.executeAction(
                    NotificationActions.notifyFailure,
                    "Un problème est survenu, veuillez vérifier que l'e-mail et le mot de passe soient correct"
                );
            })
    },
    disconnect: function(context) {
        context.dispatch(Actions.DELETE_TOKEN);
    },
    register: function(context, payload) {
        return context.hairfieApi
            .post('/users/login', payload)
            .then(function (token) {
                authStorage.setToken(token);

                alert('Connection Effectué');
                context.dispatch(Actions.RECEIVE_TOKEN, token);
                context.executeAction(
                    NavigationActions.navigate,
                    { route: 'home' });
                done();
            }, 
            function () {
                return context.executeAction(
                    NotificationActions.notifyFailure,
                    "Un problème est survenu, avez-vous bien rempli les champs obligatoires ?"
                );
            })
};
