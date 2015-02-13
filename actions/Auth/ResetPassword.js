'use strict';

var AuthEvents = require('../../constants/AuthConstants').Events;

module.exports = function (context, payload, done) {
    context.dispatch(AuthEvents.RESET_PASSWORD, {
        userId  : payload.userId,
        token   : payload.token
    });

    var user = {};
    user.id = payload.id;
    user.password = payload.password;

    var token = {};
    token.id = payload.token;

    context
        .getHairfieApi()
        .saveUser(user, {token: token})
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
