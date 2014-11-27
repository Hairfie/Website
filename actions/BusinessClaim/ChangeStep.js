'use strict';

var BusinessClaimEvents = require('../../constants/BusinessClaimConstants').Events;
var hairfieApi = require('../../services/hairfie-api-client');

module.exports = function (context, payload, done) {
    context.dispatch(BusinessClaimEvents.CHANGE_STEP, {
        step: payload.step,
        businessClaim: payload.businessClaim
    });

    hairfieApi
        .saveBusinessClaim(payload.businessClaim, context.getAuthToken())
        .then(function (businessClaim) {
            context.dispatch(BusinessClaimEvents.CHANGE_STEP_SUCCESS, {
                step: payload.step,
                businessClaim: businessClaim,
            });
        })
        .fail(function () {
            context.dispatch(BusinessClaimEvents.CHANGE_STEP_FAILURE, {
                step: payload.step,
                businessClaim: payload.businessClaim
            });
        });
};
