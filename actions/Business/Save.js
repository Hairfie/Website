'use strict';

var BusinessEvents = require('../../constants/BusinessConstants').Events;

module.exports = function (context, payload, done) {
    var done = done || function () {};

    context
        .getHairfieApi()
        .saveBusiness(payload.business)
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
