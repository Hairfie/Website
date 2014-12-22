'use strict';

var hairfieApi = require('../../services/hairfie-api-client');
var BusinessEvents = require('../../constants/BusinessConstants').Events;

module.exports = function (context, payload, done) {
    hairfieApi
        .saveBusiness(payload.business, context.getAuthToken())
        .then(function (business) {
            context.dispatch(BusinessEvents.RECEIVE_SUCCESS, {
                business: business
            });
            done();
        })
        .fail(function (error) {
            done(error);
        });
};
