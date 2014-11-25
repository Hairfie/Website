'use strict';

var hairfieApi = require('../services/hairfie-api-client');
var AuthStore  = require('../stores/AuthStore');

module.exports = function (context, payload, done) {
    context.dispatch('OPEN_BUSINESS_CLAIM');

    var token = context.getStore(AuthStore).getToken();

    hairfieApi
        .getBusinessClaim(payload.params.id, token)
        .then(function (claim) {
            context.dispatch('OPEN_BUSINESS_CLAIM_SUCCESS', {
                businessClaim: claim
            });
            done();
        })
        .fail(function (e) {
            context.dispatch('OPEN_BUSINESS_CLAIM_FAILURE');
            done(e);
        })
    ;
};
