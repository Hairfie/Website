'use strict';

var navigateAction = require('flux-router-component/actions/navigate');
var hairfieApi = require('../services/hairfie-api-client');

module.exports = function (context, payload, done) {
    hairfieApi
        .saveBusinessClaim(payload.businessClaim, payload.token)
        .then(function (claim) {
            return hairfieApi.submitBusinessClaim(claim, payload.token);
        })
        .then(function (claim) {
            var path = context.makePath('pro_business', {id: claim.businessId});
            context.executeAction(navigateAction, {path: path}, done);
        })
        .fail(done);
};
