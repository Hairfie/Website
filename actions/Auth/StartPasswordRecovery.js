'use strict';

var AuthEvents = require('../../constants/AuthConstants').Events;

module.exports = function (context, payload, done) {
    var done = done || function () {};

    var token = {};
    token.id = payload.token;

    context
        .getHairfieApi()
        .getUser(payload.userId, {token: token})
        .then(function (user) {
            context.dispatch(AuthEvents.START_PASSWORD_RECOVERY_SUCCESS, {
                userId  : payload.userId,
                token   : payload.token,
                user    : user
            });
            done();
        })
        .fail(function (error) {
            context.dispatch(AuthEvents.START_PASSWORD_RECOVERY_FAILURE, {
                userId  : payload.userId,
                token   : payload.token
            });
            done(error);
        });

};
