'use strict';

var hairfieApi = require('../../services/hairfie-api-client');
var BusinessEvents = require('../../constants/BusinessConstants').Events;

module.exports = function (context, payload, done) {
    context.dispatch(BusinessEvents.RECEIVE_HAIRDRESSERS);

    hairfieApi
        .getBusinessHairdressers(payload.business, context.getAuthToken())
        .then(function (hairdressers) {
            context.dispatch(BusinessEvents.RECEIVE_HAIRDRESSERS_SUCCESS, {
                business    : payload.business,
                hairdressers: hairdressers
            });
            done();
        })
        .fail(function (error) {
            context.dispatch(BusinessEvents.RECEIVE_HAIRDRESSERS_FAILURE);
            done(error);
        });
}
