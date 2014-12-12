'use strict';

var hairfieApi = require('../../services/hairfie-api-client');
var UserEvents = require('../../constants/UserConstants').Events;

module.exports = function (context, payload, done) {
    context.dispatch(UserEvents.RECEIVE_SUGGESTIONS);

    hairfieApi
        .getUsersByQuery(payload.query, context.getAuthToken())
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
