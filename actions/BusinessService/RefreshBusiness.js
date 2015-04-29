'use strict';

var Actions = require('../../constants/Actions');
var _ = require('lodash');

module.exports = function (context, payload) {
    var done = done || _.noop;

    return context
        .getHairfieApi()
        .getBusinessServicesByBusiness(payload.businessId)
        .then(function (businessServices) {
            context.dispatch(Actions.RECEIVE_BUSINESS_SERVICES, {
                businessId      : payload.businessId,
                businessServices: businessServices
            });
        });
};
