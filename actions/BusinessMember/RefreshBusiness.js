'use strict';

var hairfieApi = require('../../services/hairfie-api-client');
var BusinessMemberEvents = require('../../constants/BusinessMemberConstants').Events;

module.exports = function (context, payload, done) {
    var done = done || function () {};
    context.dispatch(BusinessMemberEvents.RECEIVE_BUSINESS);

    hairfieApi
        .getBusinessMembersByBusiness(payload.business, context.getAuthToken())
        .then(function (businessMembers) {
            context.dispatch(BusinessMemberEvents.RECEIVE_BUSINESS_SUCCESS, {
                business        : payload.business,
                businessMembers : businessMembers
            });
            done();
        })
        .fail(function (error) {
            console.log(error);
            context.dispatch(BusinessMemberEvents.RECEIVE_BUSINESS_FAILURE);
            done(error);
        });
};
