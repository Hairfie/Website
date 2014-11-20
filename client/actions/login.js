'use strict';

var hairfieApi = require('../services/hairfie-api-client');

module.exports = function (context, payload, done) {
    hairfieApi
        .login(payload.email, payload.password)
        .then(function (result) {
            context.dispatch('RECEIVE_LOGIN_SUCCESS', result);
            done();
        })
        .catch(function () {
            context.dispatch('RECEIVE_LOGIN_FAILURE');
            done();
        })
    ;

    context.dispatch('RECEIVE_LOGIN');
};
