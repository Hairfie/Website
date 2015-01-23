'use strict';

var hairfieApi = require('../../services/hairfie-api-client');
var BusinessEvents = require('../../constants/BusinessConstants').Events;

module.exports = function (context, payload, done) {
    var done = done || function () {};

    context.dispatch(BusinessEvents.RECEIVE, {
        id: payload.id
    });

    hairfieApi
        .getBusiness(payload.id, context.getAuthToken())
        .then(function (business) {
            context.dispatch(BusinessEvents.RECEIVE_SUCCESS, {
                id      : payload.id,
                business: business
            });
            done();
        })
        .fail(function (error) {
            context.dispatch(BusinessEvents.RECEIVE_FAILURE, {
                id: payload.id
            });
            done(error);
        });
};
