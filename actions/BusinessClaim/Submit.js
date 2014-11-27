'use strict';

var BusinessClaimEvents = require('../../constants/BusinessClaimConstants').Events;
var hairfieApi = require('../../services/hairfie-api-client');
var navigateAction = require('flux-router-component/actions/navigate');

module.exports = function (context, payload, done) {
    context.dispatch(BusinessClaimEvents.SUBMIT, {
        businessClaim: payload.businessClaim
    });

    hairfieApi
        .saveBusinessClaim(payload.businessClaim, context.getAuthToken())
        .then(function (businessClaim) {
            return hairfieApi.submitBusinessClaim(businessClaim, context.getAuthToken());
        })
        .then(function (businessClaim) {
            context.dispatch(BusinessClaimEvents.SUBMIT_SUCCESS, {
                businessClaim: businessClaim,
            });

            var path = context.makePath('pro_business', {id: businessClaim.businessId});
            context.executeAction(navigateAction, {path: path}, done);
        })
        .fail(function () {
            context.dispatch(BusinessClaimEvents.SUBMIT_FAILURE, {
                businessClaim: payload.businessClaim
            });
        });
};
