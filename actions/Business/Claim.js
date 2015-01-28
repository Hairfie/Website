'use strict';

var hairfieApi = require('../../services/hairfie-api-client');
var BusinessEvents = require('../../constants/BusinessConstants').Events;
var Navigate = require('flux-router-component/actions/navigate');

module.exports = function (context, payload, done) {
    context.dispatch(BusinessEvents.CLAIM);

    var token = context.getAuthToken();

    return hairfieApi
        .saveBusinessClaim(payload.business, token)
        .then(function (claim) {
            return hairfieApi.submitBusinessClaim(claim, token);
        })
        .then(function (business) {
            context.dispatch(BusinessEvents.CLAIM_SUCCESS, {
                business: business
            });

            var path = context.router.makePath('pro_business', {businessId: business.id});

            context.executeAction(Navigate, {path: path}, done);
        })
        .fail(function (error) {
            context.dispatch(BusinessEvents.CLAIM_FAILURE);
            done(error);
        });
};
