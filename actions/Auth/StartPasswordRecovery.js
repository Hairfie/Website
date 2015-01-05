'use strict';

var hairfieApi = require('../../services/hairfie-api-client');
var AuthEvents = require('../../constants/AuthConstants').Events;

module.exports = function (context, payload, done) {
    var done = done || function () {};

    hairfieApi
        .getUser(payload.userId, {id: payload.token})
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
