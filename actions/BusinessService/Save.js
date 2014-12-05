'use strict';

var hairfieApi = require('../../services/hairfie-api-client');
var BusinessServiceEvents = require('../../constants/BusinessServiceConstants').Events;

module.exports = function (context, payload, done) {
    context.dispatch(BusinessServiceEvents.SAVE);
    hairfieApi
        .saveBusinessService(payload.businessService, context.getAuthToken())
        .then(function (businessService) {
            context.dispatch(BusinessServiceEvents.SAVE_SUCCESS, {
                businessService: businessService
            });
            done();
        })
        .fail(function (error) {
            context.dispatch(BusinessServiceEvents.SAVE_FAILURE);
            done(error);
        });
};
