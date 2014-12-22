'use strict';

var hairfieApi = require('../../services/hairfie-api-client');
var BusinessEvents = require('../../constants/BusinessCustomersConstants').Events;

module.exports = function (context, payload, done) {
    context.dispatch(BusinessEvents.RECEIVE_CUSTOMERS);

    hairfieApi
        .getBusinessCustomers(payload.business, context.getAuthToken())
        .then(function (customers) {
            context.dispatch(BusinessEvents.RECEIVE_CUSTOMERS_SUCCESS, {
                business    : payload.business,
                customers   : customers
            });
            done();
        })
        .fail(function (error) {
            context.dispatch(BusinessEvents.RECEIVE_CUSTOMERS_FAILURE);
            done(error);
        });
}
