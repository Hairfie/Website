'use strict';

var UserEvents = require('../../constants/UserConstants').Events;

module.exports = function (context, payload, done) {
    context.dispatch(UserEvents.RECEIVE_SUGGESTIONS);

    context
        .getHairfieApi()
        .getUsersByQuery(payload.query)
        .then(function (users) {
            context.dispatch(UserEvents.RECEIVE_SUGGESTIONS_SUCCESS, {
                query: payload.query,
                users: users
            });
            done();
        })
        .fail(function (error) {
            context.dispatch(UserEvents.RECEIVE_SUGGESTIONS_FAILURE);
            done(error);
        });
};
