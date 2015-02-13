'use strict';

var BusinessEvents = require('../../constants/BusinessCustomersConstants').Events;

module.exports = function (context, payload, done) {
    context.dispatch(BusinessEvents.RECEIVE_CUSTOMERS);

    context
        .getHairfieApi()
        .getBusinessCustomers(payload.businessId)
        .then(function (customers) {
            context.dispatch(BusinessEvents.RECEIVE_CUSTOMERS_SUCCESS, {
                businessId  : payload.businessId,
                customers   : customers
            });
            done();
        })
        .fail(function (error) {
            context.dispatch(BusinessEvents.RECEIVE_CUSTOMERS_FAILURE);
            done(error);
        });
}
