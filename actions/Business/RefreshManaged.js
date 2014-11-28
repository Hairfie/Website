'use strict';

var hairfieApi = require('../../services/hairfie-api-client');
var BusinessEvents = require('../../constants/BusinessConstants').Events;

module.exports = function (context, payload, done) {
    context.dispatch(BusinessEvents.RECEIVE_MANAGED);

    var user  = context.getAuthUser(),
        token = context.getAuthToken();

    hairfieApi
        .getManagedBusinesses(user, token)
        .then(function (businesses) {
            context.dispatch(BusinessEvents.RECEIVE_MANAGED_SUCCESS, {
                user: user,
                token: token,
                businesses: businesses
            });
        })
        .fail(function () {
            context.dispatch(BusinessEvents.RECEIVE_MANAGED_FAILURE);
        });
}
