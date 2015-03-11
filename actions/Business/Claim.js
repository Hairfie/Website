'use strict';

var BusinessEvents = require('../../constants/BusinessConstants').Events;

module.exports = function (context, payload, done) {
    context.dispatch(BusinessEvents.CLAIM);

    return context
        .getHairfieApi()
        .saveBusinessClaim(payload.business)
        .then(function (claim) {
            return context.getHairfieApi().submitBusinessClaim(claim);
        })
        .then(function (business) {
            context.dispatch(BusinessEvents.CLAIM_SUCCESS, {
                business: business
            });
            context.redirect(context.router.makePath('pro_business', {businessId: business.id}));
            done();
        })
        .fail(function (error) {
            context.dispatch(BusinessEvents.CLAIM_FAILURE);
            done(error);
        });
};
