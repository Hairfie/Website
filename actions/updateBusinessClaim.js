'use strict';

var hairfieApi = require('../services/hairfie-api-client');

module.exports = function (context, payload, done) {
    hairfieApi
        .saveBusinessClaim(payload.businessClaim, payload.authToken)
        .then(function (claim) {
            context.dispatch('UPDATE_BUSINESS_CLAIM_SUCCESS', {
                businessClaim: claim
            });
            done();
        })
        .catch(function () {
            context.dispatch('UPDATE_BUSINESS_CLAIM_FAILURE', {
                businessClaim: payload.businessClaim
            });
            done();
        });

    context.dispatch('UPDATE_BUSINESS_CLAIM', {businessClaim: payload.businessClaim});
};
