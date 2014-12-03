'use strict';

var hairfieApi = require('../../services/hairfie-api-client');
var BusinessEvents = require('../../constants/BusinessConstants').Events;

module.exports = function (context, payload, done) {
    context.dispatch(BusinessEvents.SAVE);

    hairfieApi
        .saveBusiness(payload.business, context.getAuthToken())
        .then(function (business) {
            context.dispatch(BusinessEvents.SAVE_SUCCESS, {
                business: business
            });
        })
        .fail(function () {
            context.dispatch(BusinessEvents.SAVE_FAILURE);
        });
};
