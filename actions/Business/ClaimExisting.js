'use strict';

var hairfieApi = require('../../services/hairfie-api-client');
var BusinessEvents = require('../../constants/BusinessConstants').Events;
var Navigate = require('flux-router-component/actions/navigate');

module.exports = function (context, payload, done) {
    context.dispatch(BusinessEvents.CLAIM_EXISTING);

    var token = context.getAuthToken();
    console.log("business to claim", payload.business);
    return hairfieApi
        .claimExistingBusiness(payload.business, token)
        .then(function (success) {
            context.dispatch(BusinessEvents.CLAIM_EXISTING_SUCCESS, {
                business: payload.business
            });

            var path = context.router.makePath('pro_business', {id: payload.business.id});

            context.executeAction(Navigate, {path: path}, done);
        })
        .fail(function (error) {
            context.dispatch(BusinessEvents.CLAIM_EXISTING_FAILURE);
            done(error);
        });
};
