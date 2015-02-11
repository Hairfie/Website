'use strict';

var BusinessMemberEvents = require('../../constants/BusinessMemberConstants').Events;

module.exports = function (context, payload, done) {
    var done = done || function () {};

    context.dispatch(BusinessMemberEvents.RECEIVE_BUSINESS, {
        businessId: payload.businessId
    });

    context
        .getHairfieApi()
        .getBusinessMembersByBusiness(payload.businessId)
        .then(function (businessMembers) {
            context.dispatch(BusinessMemberEvents.RECEIVE_BUSINESS_SUCCESS, {
                businessId      : payload.businessId,
                businessMembers : businessMembers
            });
            done();
        })
        .fail(function (error) {
            context.dispatch(BusinessMemberEvents.RECEIVE_BUSINESS_FAILURE, {
                businessId: payload.businessId
            });
            done(error);
        });
};
