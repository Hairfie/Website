'use strict';

var _ = require('lodash');
var UserActions = require('../User');
var UserManagedBusinessStore = require('../../stores/UserManagedBusinessStore');
var Navigate = require('flux-router-component/actions/navigate');

module.exports = function (context, payload, done) {
    var done = done || _.noop;
    var user = context.getAuthUser();

    context.executeAction(UserActions.RefreshManagedBusinesses, {user: user}, function () {
        var managedBusinesses = context.getStore(UserManagedBusinessStore).getManagedBusinessesByUser(user) || [];

        if (0 === managedBusinesses.length) {
            return context.executeAction(Navigate, {url: context.router.makePath('pro_business_new')}, done);
        }

        if (1 === managedBusinesses.length) {
            return context.executeAction(Navigate, {url: context.router.makePath('pro_business', {businessId: managedBusinesses[0].id})}, done);
        }

        done();
    });
}
