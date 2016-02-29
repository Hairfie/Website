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
var TagActions = require('./TagActions');
var CategoryActions = require('./CategoryActions');
var BlogPostActions = require('./BlogPostActions');
var SearchUtils = require('../lib/search-utils');

var RouteStore = require('../stores/RouteStore');

module.exports = {
    redirectToHome: function(context) {
        var error = new Error('Invalid URL');
        error.status = 301;
        error.location = context.getStore('RouteStore').makeUrl('home');

        throw error;
    },
    home: function (context) {
        return Promise.all([
            context.executeAction(DealActions.loadTopDeals),
            // context.executeAction(HairfieActions.loadTopHairfies),
            // context.executeAction(TagActions.loadAll),
            // context.executeAction(CategoryActions.loadAll),
            context.executeAction(BlogPostActions.getRecent)
        ]);
    },
    hairfie: function (context, route) {
        var id = route.params.hairfieId;
        return context.executeAction(HairfieActions.loadHairfie, id);
    },
    hairfieSearch: function (context, route) {
        var address = SearchUtils.addressFromUrlParameter(route.params.address);
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
                context.executeAction(HairdresserActions.loadHairdresserByBusiness, business.id),
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
                page: route.query.page
            });
        });
    },
    businessSearch: function (context, route) {
        var address = SearchUtils.addressFromUrlParameter(route.params.address);

        return context.executeAction(PlaceActions.loadAddressPlace, address)
            .then(function () {
                var place  = context.getStore('PlaceStore').getByAddress(address);
                var search = SearchUtils.searchFromRouteAndPlace(route, place);

                return context.executeAction(BusinessActions.loadSearchResult, search);
            })
            .then(function() {
                return context.executeAction(BusinessReviewActions.getTopReviews);
            })
    },
    businessBooking: businessWithSlug,
    bookingConfirmation: function (context, route) {
        var bookingId  = route.params.bookingId;

        return context.hairfieApi.get('/bookings/'+bookingId)
            .then(function (booking) {
                context.dispatch(Actions.RECEIVE_BOOKING, booking);
            });
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

                    return context.executeAction(NotificationActions.notifyError, {
                        title: 'Réinitialisation du mot de passe',
                        message: body
                    })
                        .then(function () {
                            return context.executeAction(NavigationActions.navigate, { route: 'home' });
                        });
                }

                context.dispatch(Actions.RECEIVE_TOKEN, token);
            });
    },
    userPage: function(context, route) {
        var error = new Error('Invalid slug');
        error.status = 302;
        error.location = context.getStore('RouteStore').makePath('user_hairfies', {
            userId: route.params.userId
        });
        throw error;
    },
    userHairfies: function (context, route) {
        return Promise.all([
            context.executeAction(UserActions.getUserById, route.params.userId),
            context.executeAction(HairfieActions.loadUserHairfies, {
                id: route.params.userId,
                page: 1,
                pageSize: 10
            })
        ]);
    },
    userReviews: function (context, route) {
        return Promise.all([
            context.executeAction(UserActions.getUserById, route.params.userId),
            context.executeAction(UserActions.getUserReviews, route.params.userId)
        ]);
    },
    userLikes: function (context, route) {
        return Promise.all([
            context.executeAction(UserActions.getUserById, route.params.userId),
            context.executeAction(HairfieActions.loadUserLikes, {
                id: route.params.userId,
                page: 1,
                pageSize: 10
            })
        ]);
    },
    hairdresser: function(context, route) {
        return Promise.all([
            context.executeAction(HairdresserActions.loadHairdresser, route.params.id)
        ]);
    },
    hairdresserHairfies: function(context, route) {
        return Promise.all([
            context.executeAction(HairdresserActions.loadHairdresser, route.params.id),
            context.executeAction(HairfieActions.loadHairdresserHairfies, {
                id: route.params.id,
                page: 1,
                pageSize: 10
            })
        ]);
    },
    writeBusinessReview: function(context, route) {
        //if OLD PATH
        if (!route.query.businessId && route.params.businessReviewRequestId) {
            return context.executeAction(BusinessReviewActions.loadRequest, route.params.businessReviewRequestId)
                .then(function (brr) {
                    var error = new Error('Invalid URL');
                    error.status = 301;
                    error.location = oldBusinessRequestReviewPath(context, route, brr && brr.business ? brr.business.id : undefined);
                    throw error;
            });
        }

        var businessId = route.query.businessId;
        var requestId = route.query.requestId;
        if (!businessId) return;
        return Promise.all([
            requestId ? context.executeAction(BusinessReviewActions.loadRequest, requestId) : '',
            businessId ? context.executeAction(BusinessActions.loadBusiness, businessId) : ''
        ]);
    },
    writeBusinessReviewConfirmation: function(context, route) {
        return Promise.all([
            context.executeAction(BusinessReviewActions.loadReview, route.params.reviewId)
        ]);
    }
};

function businessWithSlug(context, route) {
    return context.hairfieApi
        .get('/businesses/'+route.params.businessId)
        .then(function (business) {
            if (business.slug != route.params.businessSlug) { // redirect to canonical URL
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
        hairfieId  : route.params.address
    });
}

function oldBusinessRequestReviewPath(context, route, businessId) {
    return context.getStore('RouteStore').makeUrl('write_business_review', {},
        {
            requestId: route.params.businessReviewRequestId,
            businessId: businessId
        }
    );
}
