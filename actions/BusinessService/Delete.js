'use strict';

var BusinessServiceEvents = require('../../constants/BusinessServiceConstants').Events;

module.exports = function (context, payload, done) {
    context.dispatch(BusinessServiceEvents.DELETE);
    context.getHairfieApi()
        .deleteBusinessService(payload.businessService)
        .then(function () {
            context.dispatch(BusinessServiceEvents.DELETE_SUCCESS, {
                businessService: payload.businessService
            });
        })
        .fail(function (error) {
            context.dispatch(BusinessServiceEvents.DELETE_FAILURE);
            done(error);
        });
};
