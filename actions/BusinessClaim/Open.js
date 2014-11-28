'use strict';

var BusinessClaimEvents = require('../../constants/BusinessClaimConstants').Events;
var hairfieApi = require('../../services/hairfie-api-client');

module.exports = function (context, payload, done) {
    context.dispatch(BusinessClaimEvents.OPEN);

    hairfieApi
        .getBusinessClaim(payload.id, context.getAuthToken())
        .then(function (businessClaim) {
            context.dispatch(BusinessClaimEvents.OPEN_SUCCESS, {
                businessClaim: businessClaim
            });
            done();
        })
        .fail(function () {
            context.dispatch(BusinessClaimEvents.OPEN_FAILURE);
        });
};
