'use strict';

var hairfieApi = require('../services/hairfie-api-client');

module.exports = function (context, payload, done) {
    hairfieApi
        .createUser({
            gender      : payload.gender,
            firstName   : payload.firstName,
            lastName    : payload.lastName,
            email       : payload.email,
            password    : 'password', // TODO: remove it and allow generation from backend
            phoneNumber : payload.phoneNumber
        })
        .fail(done)
        .then(function (user) {
            context.dispatch('RECEIVE_LOGIN_SUCCESS', {
                user: user,
                token: user.token
            });
            done();
        });
};
