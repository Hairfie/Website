'use strict';

var hairfieApi = require('../../services/hairfie-api-client');
var BusinessServiceEvents = require('../../constants/BusinessServiceConstants').Events;

module.exports = function (context, payload, done) {
    context.dispatch(BusinessServiceEvents.RECEIVE_BUSINESS);
    hairfieApi
        .getBusinessServicesByBusiness(payload.business)
        .then(function (businessServices) {
            context.dispatch(BusinessServiceEvents.RECEIVE_BUSINESS_SUCCESS, {
                business        : payload.business,
                businessServices: businessServices
            });
            done();
        })
        .fail(function (error) {
            context.dispatch(BusinessServiceEvents.RECEIVE_BUSINESS_FAILURE);
            done(error);
        });
};
