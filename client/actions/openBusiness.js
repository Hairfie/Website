'use strict';

var hairfieApi = require('../services/hairfie-api-client');

module.exports = function (context, payload, done) {
    hairfieApi
        .getBusiness(payload.params.id)
        .then(function (business) {
            context.dispatch('OPEN_BUSINESS_SUCCESS', {
                business: business
            });
            done();
        })
        .catch(function () {
            context.dispatch('OPEN_BUSINESS_FAILURE');
            done();
        })
    ;

    context.dispatch('OPEN_BUSINESS');
};
