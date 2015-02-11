'use strict';

var BusinessEvents = require('../../constants/BusinessConstants').Events;
var Navigate = require('flux-router-component/actions/navigate');
var debug = require('debug')('Action:Business:ClaimExisting');

module.exports = function (context, payload, done) {
    context.dispatch(BusinessEvents.CLAIM_EXISTING);

    debug("business to claim", payload.business);

    return context
        .getHairfieApi()
        .claimExistingBusiness(payload.business)
        .then(function (success) {
            context.dispatch(BusinessEvents.CLAIM_EXISTING_SUCCESS, {
                business: payload.business
            });

            var path = context.router.makePath('pro_business', {id: payload.business.id});

            context.executeAction(Navigate, {url: path}, done);
        })
        .fail(function (error) {
            context.dispatch(BusinessEvents.CLAIM_EXISTING_FAILURE);
            done(error);
        });
};
