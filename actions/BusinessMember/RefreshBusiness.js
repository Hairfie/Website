'use strict';

var hairfieApi = require('../../services/hairfie-api-client');
var BusinessMemberEvents = require('../../constants/BusinessMemberConstants').Events;

module.exports = function (context, payload, done) {
    var done = done || function () {};

    context.dispatch(BusinessMemberEvents.RECEIVE_BUSINESS, {
        businessId: payload.businessId
    });

    hairfieApi
        .getBusinessMembersByBusiness(payload.businessId, context.getAuthToken())
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
