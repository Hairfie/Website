'use strict';

var BusinessServiceEvents = require('../../constants/BusinessServiceConstants').Events;

module.exports = function (context, payload, done) {

    context.dispatch(BusinessServiceEvents.RECEIVE_BUSINESS, {
        businessId: payload.businessId
    });

    context
        .getHairfieApi()
        .getBusinessServicesByBusiness(payload.businessId)
        .then(function (businessServices) {
            context.dispatch(BusinessServiceEvents.RECEIVE_BUSINESS_SUCCESS, {
                businessId      : payload.businessId,
                businessServices: businessServices
            });
            done();
        })
        .fail(function (error) {
            context.dispatch(BusinessServiceEvents.RECEIVE_BUSINESS_FAILURE, {
                businessId: payload.businessId
            });
            done(error);
        });
};
