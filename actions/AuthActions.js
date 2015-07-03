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
        var email = payload.email;
        var password = payload.password;
        console.log(payload);

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
            })
    },
    disconnect: function(context) {
        context.dispatch(Actions.RECEIVE_TOKEN, {});
    }
};
