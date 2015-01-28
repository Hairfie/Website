'use strict';

var hairfieApi = require('../../services/hairfie-api-client');
var BusinessEvents = require('../../constants/BusinessConstants').Events;

module.exports = function (context, payload, done) {
    var done = done || function () {};

    hairfieApi
        .saveBusiness(payload.business, context.getAuthToken())
        .then(function (business) {
            context.dispatch(BusinessEvents.RECEIVE_SUCCESS, {
                id      : business.id,
                business: business
            });
            done();
        })
        .fail(function (error) {
            done(error);
        });
};
