'use strict';

var authStorage = require('../../services/auth-storage');
var Events = require('../../constants/AuthConstants').Events;
var Notify = require('../Flash/Notify');
var Navigate = require('flux-router-component/actions/navigate');

module.exports = function (context, payload, done) {
    context.dispatch(Events.LOGIN);

    context
        .getHairfieApi()
        .login(payload.email, payload.password)
        .then(function (result) {
            authStorage.setToken(result.token);

            context.dispatch(Events.LOGIN_SUCCESS, result);

            if (payload.successUrl) {
                return context.executeAction(Navigate, {url: payload.successUrl}, done);
            }

            done();
        })
        .fail(function (error) {
            context.dispatch(Events.LOGIN_FAILURE);

            context.executeAction(Notify, {
                type: 'FAILURE',
                body: 'Les identifiants que vous avez saisis sont invalides, veuillez réessayer.'
            }, function() {});

            done(error);
        })
    ;
};
