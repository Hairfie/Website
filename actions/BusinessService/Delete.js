'use strict';

var hairfieApi = require('../../services/hairfie-api-client');
var BusinessServiceEvents = require('../../constants/BusinessServiceConstants').Events;

module.exports = function (context, payload, done) {
    context.dispatch(BusinessServiceEvents.DELETE);
    hairfieApi
        .deleteBusinessService(payload.businessService, context.getAuthToken())
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
