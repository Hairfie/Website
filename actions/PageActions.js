'use strict';

var Promise = require('q');
var executeCritical = require('fluxible-action-utils/async/executeCritical');
var Actions = require('../constants/Actions');
var StationActions = require('./StationActions');
var CategoryActions = require('./CategoryActions');
var DealActions = require('./DealActions');
var HairfieActions = require('./HairfieActions');
var BusinessActions = require('./BusinessActions');
var BusinessReviewActions = require('./BusinessReviewActions');
var BusinessServiceActions = require('./BusinessServiceActions');
var PlaceActions = require('./PlaceActions');
var NotificationActions = require('./NotificationActions');
var NavigationActions = require('./NavigationActions');
var SearchUtils = require('../lib/search-utils');

module.exports = {
    home: function (context, route, done) {
        return executeCritical(context, {
            categories: {
                action: CategoryActions.loadAll
            },
            topDeals: {
                action: DealActions.loadTopDeals,
                params: { limit: route.config.numTopDeals }
            },
            topHairfies: {
                action: HairfieActions.loadTopHairfies,
                params: {limit: route.config.numTopHairfies}
            }
        }, function (err) {
            if (err) {
                err = err.categories || err.topDeals || err.topHairfies;
            }
            done(err);
        });
    },
    hairfie: function (context, route) {
        var hairfieId = route.params.hairfieId;

        return context.hairfieApi
            .get('/hairfies/'+hairfieId)
            .then(function (hairfie) {
                context.dispatch(Actions.RECEIVE_HAIRFIE, hairfie);
            });
    },
    business: function (context, route) {
        var businessId   = route.params.businessId;
        var businessSlug = route.params.businessSlug;

        return context.hairfieApi
            .get('/businesses/'+businessId)
            .then(function (business) {
                if (business.slug != businessSlug) { // redirect to canonical URL
                    var error = new Error('Invalid slug');
                    error.status = 301;
                    error.location = context.router.makePath('business', {
                        businessId  : business.id,
                        businessSlug: business.slug
                    });
                    throw error;
                }

                context.dispatch(Actions.RECEIVE_BUSINESS, business);

                return Promise.all([
                    context.executeAction(StationActions.loadStationsNearby, { location: business.gps }),
                    context.executeAction(BusinessServiceActions.loadBusinessServices, { businessId: business.id }),
                    context.executeAction(BusinessActions.loadSimilarBusinesses, { businessId: business.id, limit: 3 }),
                    context.executeAction(BusinessReviewActions.loadBusinessReviews, { businessId: business.id })
                ]);
            });
    },
    businessSearch: function (context, route) {
        var address = SearchUtils.addressFromUrlParameter(route.params.address);

        return context.executeAction(PlaceActions.loadAddressPlace, address)
            .then(function () {
                var place  = context.getStore('PlaceStore').getByAddress(address);
                var search = SearchUtils.searchFromRouteAndPlace(route, place);

                return context.executeAction(BusinessActions.loadSearchResult, search);
            });
    },
    businessBooking: function (context, route) { // TODO: make it DRY
        var businessId   = route.params.businessId;
        var businessSlug = route.params.businessSlug;

        return context.hairfieApi
            .get('/businesses/'+businessId)
            .then(function (business) {
                if (business.slug != businessSlug) { // redirect to canonical URL
                    var error = new Error('Invalid slug');
                    error.status = 301;
                    error.location = context.router.makePath('business', {
                        businessId  : business.id,
                        businessSlug: business.slug
                    });
                    throw error;
                }

                context.dispatch(Actions.RECEIVE_BUSINESS, business);
            });
    },
    bookingConfirmation: function (context, route) {
        var bookingId  = route.params.bookingId;

        return context.hairfieApi
            .get('/bookings/'+bookingId)
            .then(function (booking) {
                context.dispatch(Actions.RECEIVE_BOOKING, booking);
            });
    },
    writeVerifiedBusinessReview: function (context, route) {
        return context.executeAction(BusinessReviewActions.loadRequest, route.params.businessReviewRequestId);
    },
    resetPassword: function (context, route) {
        return context.hairfieApi
            .get('/accessTokens/'+route.params.tokenId)
            .catch(function (e) { if (e.status !== 404) throw e; })
            .then(function (token) {
                if (!token || token.userId != route.params.userId) { // invalid URL or token has expired
                    var body = [
                        'Le jeton de réinitialisation est expiré.',
                        'Si vous êtes toujours à la recherche de votre mot de passe,',
                        'veuillez recommencer le processus de réinitialisation de mot de passe.'
                    ].join(' ');

                    return context.executeAction(NotificationActions.notifyFailure, body)
                        .then(function () {
                            return context.executeAction(NavigationActions.navigate, { route: 'home' });
                        });
                }

                context.dispatch(Actions.RECEIVE_TOKEN, token);
            });
    }
};
