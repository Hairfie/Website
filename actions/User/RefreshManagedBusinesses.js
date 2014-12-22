'use strict';

var hairfieApi = require('../../services/hairfie-api-client');
var UserEvents = require('../../constants/UserConstants').Events;

module.exports = function (context, payload, done) {
    hairfieApi
        .getManagedBusinesses(payload.user, context.getAuthToken())
        .then(function (businesses) {
            context.dispatch(UserEvents.RECEIVE_MANAGED_BUSINESSES_SUCCESS, {
                user        : payload.user,
                businesses  : businesses
            });
            done();
        })
        .fail(function (e) {
            done(e);
        });
}
