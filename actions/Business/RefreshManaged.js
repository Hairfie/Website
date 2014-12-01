'use strict';

var hairfieApi = require('../../services/hairfie-api-client');
var BusinessEvents = require('../../constants/BusinessConstants').Events;

module.exports = function (context, payload, done) {
    context.dispatch(BusinessEvents.RECEIVE_MANAGED);

    var user  = payload.user,
        token = payload.token;

    hairfieApi
        .getManagedBusinesses(user, token)
        .then(function (businesses) {
            context.dispatch(BusinessEvents.RECEIVE_MANAGED_SUCCESS, {
                user        : user,
                token       : token,
                businesses  : businesses
            });
        })
        .fail(function (e) {
            context.dispatch(BusinessEvents.RECEIVE_MANAGED_FAILURE);
        });
}
