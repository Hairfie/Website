'use strict';

var hairfieApi = require('../services/hairfie-api-client');
var authStorage = require('../services/auth-storage');

module.exports = function (context, payload, done) {
    hairfieApi
        .login(payload.email, payload.password)
        .then(function (result) {
            authStorage.setToken(result.token);

            context.dispatch('RECEIVE_LOGIN_SUCCESS', result);
            done();
        })
        .catch(function (e) {
            context.dispatch('RECEIVE_LOGIN_FAILURE');
            done();
        })
    ;

    context.dispatch('RECEIVE_LOGIN');
};
