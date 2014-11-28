'use strict';

var hairfieApi = require('../../services/hairfie-api-client');
var authStorage = require('../../services/auth-storage');
var Events = require('../../constants/AuthConstants').Events;

module.exports = function (context, payload, done) {
    context.dispatch(Events.LOGIN);

    hairfieApi
        .login(payload.email, payload.password)
        .then(function (result) {
            authStorage.setToken(result.token);

            context.dispatch(Events.LOGIN_SUCCESS, result);
            done();
        })
        .catch(function (e) {
            context.dispatch(Events.LOGIN_FAILURE);
            done();
        })
    ;
};
