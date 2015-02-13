'use strict';

var BusinessEvents = require('../../constants/BusinessConstants').Events;

module.exports = function (context, payload, done) {
    var done = done || function () {};

    context.dispatch(BusinessEvents.RECEIVE_HAIRDRESSERS);

    context
        .getHairfieApi()
        .getBusinessHairdressers(payload.business)
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
