'use strict';

var Promise = require('q');
var _ = require('lodash');
var executeCritical = require('fluxible-action-utils/async/executeCritical');
var Actions = require('../constants/Actions');
var StationActions = require('./StationActions');
var CategoryActions = require('./CategoryActions');
var DealActions = require('./DealActions');
var HairfieActions = require('./HairfieActions');
var BusinessActions = require('./BusinessActions');
var BusinessReviewActions = require('./BusinessReviewActions');
var BusinessServiceActions = require('./BusinessServiceActions');
var HairdresserActions = require('./HairdresserActions');
var PlaceActions = require('./PlaceActions');
var NotificationActions = require('./NotificationActions');
var NavigationActions = require('./NavigationActions');
var UserActions = require('./UserActions');
var SearchUtils = require('../lib/search-utils');

var RouteStore = require('../stores/RouteStore');

module.exports = {
    home: function (context) {
        return Promise.all([
            context.executeAction(CategoryActions.loadAll),
            context.executeAction(DealActions.loadTopDeals),
            context.executeAction(HairfieActions.loadTopHairfies)
        ]);
    },
    hairfie: function (context, route) {
        var id = route.get('params').get('hairfieId');
        return context.executeAction(HairfieActions.loadHairfie, id);
    },
    hairfieSearch: function (context, route) {
        var address = SearchUtils.addressFromUrlParameter(route.get('params').get('address'));
        var hairfiePath = oldHairfiePath(context, route);

        return context.executeAction(PlaceActions.loadAddressPlace, address)
            .then(function () {
                var place  = context.getStore('PlaceStore').getByAddress(address);
                var search = SearchUtils.searchFromRouteAndPlace(route, place);

                return context.executeAction(HairfieActions.loadSearchResult, search);
            }, function(e) {
                var error = new Error('Invalid URL');
                error.status = 301;
                error.location = hairfiePath;
                throw error;
            });
    },
    business: function (context, route) {
        return businessWithSlug(context, route).then(function (business) {
            return Promise.all([
                context.executeAction(StationActions.loadStationsNearby, { location: business.gps }),
                context.executeAction(BusinessServiceActions.loadBusinessServices, { businessId: business.id }),
                context.executeAction(BusinessActions.loadSimilarBusinesses, { businessId: business.id, limit: 3 })
            ]);
        });
    },
    businessReviews: function (context, route) {
        return businessWithSlug(context, route).then(function (business) {
            return context.executeAction(BusinessReviewActions.loadBusinessReviews, { businessId: business.id });
        });
    },
    businessHairfies: function (context, route) {
        return businessWithSlug(context, route).then(function (business) {
            return context.executeAction(HairfieActions.loadBusinessHairfies, {
                businessId: business.id,
                page: route.get('query').get('page')
            });
        });
    },
    businessSearch: function (context, route) {
        var address = SearchUtils.addressFromUrlParameter(route.get('params').get('address'));

        return context.executeAction(PlaceActions.loadAddressPlace, address)
            .then(function () {
                var place  = context.getStore('PlaceStore').getByAddress(address);
                var search = SearchUtils.searchFromRouteAndPlace(route, place);

                return context.executeAction(BusinessActions.loadSearchResult, search);
            });
    },
    businessBooking: businessWithSlug,
    bookingConfirmation: function (context, route) {
        var bookingId  = route.get('params').get('bookingId');

        return context.hairfieApi
            .get('/bookings/'+bookingId)
            .then(function (booking) {
                context.dispatch(Actions.RECEIVE_BOOKING, booking);
            });
    },
    writeVerifiedBusinessReview: function (context, route) {
        var businessReviewRequestId  = route.get('params').get('businessReviewRequestId');

        return context.executeAction(BusinessReviewActions.loadRequest, businessReviewRequestId);
    },
    resetPassword: function (context, route) {
        return context.hairfieApi
            .get('/accessTokens/'+route.get('params').get('tokenId'))
            .catch(function (e) { if (e.status !== 404) throw e; })
            .then(function (token) {
                if (!token || token.userId != route.get('params').get('userId')) { // invalid URL or token has expired
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
    },
    userHairfies: function (context, route) {
        return Promise.all([
            context.executeAction(UserActions.getUserById, route.get('params').get('userId')),
            context.executeAction(HairfieActions.loadUserHairfies, route.get('params').get('userId'))
        ]);
    },
    userReviews: function (context, route) {
        return Promise.all([
            context.executeAction(UserActions.getUserById, route.get('params').get('userId')),
            context.executeAction(UserActions.getUserReviews, route.get('params').get('userId'))
        ]);
    },
    userLikes: function (context, route) {
        return Promise.all([
            context.executeAction(UserActions.getUserById, route.get('params').get('userId'))
        ]);
    },
    hairdresser: function(context, route) {
        return Promise.all([
            context.executeAction(HairdresserActions.loadHairdresser, route.get('params').get('id'))
        ]);
    },
    hairdresserHairfies: function(context, route) {
        return Promise.all([
            context.executeAction(HairdresserActions.loadHairdresser, route.get('params').get('id'))
        ]);
    }
};

function businessWithSlug(context, route) {
    return context.hairfieApi
        .get('/businesses/'+route.get('params').get('businessId'))
        .then(function (business) {
            if (business.slug != route.get('params').get('businessSlug')) { // redirect to canonical URL
                var error = new Error('Invalid slug');
                error.status = 301;
                error.location = context.getStore('RouteStore').makePath('business', {
                    businessId  : business.id,
                    businessSlug: business.slug
                });
                throw error;
            }
            context.dispatch(Actions.RECEIVE_BUSINESS, business);

            return business;
        });
}

function oldHairfiePath(context, route) {
    return context.getStore('RouteStore').makePath('hairfie', {
        hairfieId  : route.get('params').get('address')
    });
}
