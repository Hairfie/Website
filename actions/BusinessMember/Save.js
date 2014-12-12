'use strict';

var hairfieApi = require('../../services/hairfie-api-client');
var BusinessMemberEvents = require('../../constants/BusinessMemberConstants').Events;

module.exports = function (context, payload, done) {
    var done = done || function () {};

    context.dispatch(BusinessMemberEvents.SAVE);

    hairfieApi
        .saveBusinessMember(payload.businessMember, context.getAuthToken())
        .then(function (businessMember) {
            context.dispatch(BusinessMemberEvents.SAVE_SUCCESS, {
                businessMember: businessMember
            });
            done();
        })
        .fail(function (error) {
            context.dispatch(BusinessMemberEvents.SAVE_FAILURE);
            done(error);
        });
};
