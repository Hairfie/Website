'use strict';

var BusinessEvents = require('../../constants/BusinessConstants').Events;
var debug = require('debug')('Action:Business:ClaimExisting');
var Navigate = require('flux-router-component/actions/navigate');

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
            context.executeAction(Navigate, {
                url: context.router.makePath('pro_business', {businessId: payload.business.id})
            }, done);
        })
        .fail(function (error) {
            context.dispatch(BusinessEvents.CLAIM_EXISTING_FAILURE);
            done(error);
        });
};
