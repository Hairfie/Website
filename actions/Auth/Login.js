'use strict';

var hairfieApi = require('../../services/hairfie-api-client');
var authStorage = require('../../services/auth-storage');
var Events = require('../../constants/AuthConstants').Events;
var Notify = require('../Flash/Notify');

module.exports = function (context, payload, done) {
    context.dispatch(Events.LOGIN);

    hairfieApi
        .login(payload.email, payload.password)
        .then(function (result) {
            authStorage.setToken(result.token);

            context.dispatch(Events.LOGIN_SUCCESS, result);
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
