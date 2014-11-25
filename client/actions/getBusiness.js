'use strict';

var hairfieApi = require('../services/hairfie-api-client');

module.exports = function (context, payload, done) {
    context.dispatch('RECEIVE_BUSINESS_START', payload);

    hairfieApi
        .getBusiness(payload.params.id)
        .then(function (business) {
            console.log("get business", business);
            context.dispatch('RECEIVE_BUSINESS_SUCCESS', business);
            done();
        })
        .catch(function (e) {
            console.log("error in getBusiness", e);
            context.dispatch('RECEIVE_BUSINESS_FAILURE');
            done();
        })
    ;

    context.dispatch('RECEIVE_LOGIN');
};