'use strict';

var FetchBusiness = require('../Business/Fetch');
var StationActions = require('../Station');
var BusinessServiceActions = require('../BusinessService');
var BusinessStore = require('../../stores/BusinessStore');
var debug = require('debug')('App:Action:PageBusiness');

module.exports = function (context, payload, done) {
    context.executeAction(FetchBusiness, {id: payload.params.businessId}, function (error) {
        if (error) return done(error);

        var business  = context.getStore(BusinessStore).getById(payload.params.businessId),
            routeSlug = payload.params.businessSlug;

        // redirect user to URL with proper slug
        if (business.slug != routeSlug) {
            debug('Invalid slug used in current URL, redirecting');
            context.redirect(context.router.makePath('show_business', {
                locale      : payload.params.locale,
                businessId  : business.id,
                businessSlug: business.slug
            }), true);
        }

        context.executeActions([
            [StationActions.FetchForBusiness, {businessId: business.id,location: business.gps}],
            [BusinessServiceActions.RefreshBusiness, {businessId: business.id}]
        ], done);
    });
};
