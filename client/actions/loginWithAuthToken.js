'use strict';

var hairfieApi = require('../services/hairfie-api-client');

module.exports = function (context, payload, done) {
    hairfieApi
        .getUser(payload.token.userId, payload.token)
        .then(function (user) {
            context.dispatch('RECEIVE_LOGIN_SUCCESS', {
                user    : user,
                token   : payload.token
            });
            done();
        })
        .catch(function () {
            context.dispatch('RECEIVE_LOGIN_FAILURE');
            done();
        });

    context.dispatch('RECEIVE_LOGIN');
};
