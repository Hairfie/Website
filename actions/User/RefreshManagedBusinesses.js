'use strict';

var UserEvents = require('../../constants/UserConstants').Events;

module.exports = function (context, payload, done) {
    context
        .getHairfieApi()
        .getManagedBusinesses(payload.user)
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
