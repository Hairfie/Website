'use strict';

var hairfieApi = require('../../services/hairfie-api-client');
var AuthEvents = require('../../constants/AuthConstants').Events;

module.exports = function (context, payload, done) {
    context.dispatch(AuthEvents.RESET_PASSWORD, {
        userId  : payload.userId,
        token   : payload.token
    });

    hairfieApi
        .saveUser({id: payload.userId, password: payload.password}, {id: payload.token})
        .then(function (user) {
            context.dispatch(AuthEvents.RESET_PASSWORD_SUCCESS, {
                userId  : payload.userId,
                token   : payload.token
            });
            done();
        })
        .fail(function (e) {
            context.dispatch(AuthEvents.RESET_PASSWORD_FAILURE, {
                userId  : payload.userId,
                token   : payload.token
            });
            done(e);
        });
};
