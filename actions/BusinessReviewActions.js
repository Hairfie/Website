'use strict';

var _ = require('lodash');
var Actions = require('../constants/Actions');
var NavigationActions = require('./NavigationActions');
var NotificationActions = require('./NotificationActions');
var SubscriberActions = require('./SubscriberActions');
var ga = require('../services/analytics');

module.exports = {
    loadReview: function(context, reviewId) {
        return context.hairfieApi
            .get('/businessReviews/'+reviewId)
            .then(function (review) {
                context.dispatch(Actions.RECEIVE_REVIEW, review);
                return review;
            });
    },
    loadRequest: function (context, requestId) {
        return context.hairfieApi
            .get('/businessReviewRequests/'+requestId)
            .then(function (request) {
                if (!request.canWrite) {
                    return context.executeAction(NavigationActions.navigate, {
                        route: 'business_reviews',
                        params: { businessId: request.business.id, businessSlug: request.business.slug }
                    });
                }
                context.dispatch(Actions.RECEIVE_BUSINESS_REVIEW_REQUEST, request);
                return request;
            });
    },
    loadBusinessReviews: function (context, payload) {
        var businessId = payload.businessId;

        var query = {
            'filter[where][businessId]': businessId,
            'filter[sort]': 'createdAt DESC'
        };

        return context.hairfieApi
            .get('/businessReviews', { query: query })
            .then(function (businessReviews) {
                context.dispatch(Actions.RECEIVE_BUSINESS_REVIEWS, {reviews: businessReviews, businessId: businessId});
            });
    },
    submitReview: function(context, payload) {
        return context.hairfieApi
            .post('/businessReviews', payload.review, {token: payload.token || null})
            .then(function (businessReview) {
                ga('send', 'event', 'Business Reviews', 'Submit');
                context.executeAction(SubscriberActions.hasClosedBanner);

                return context.executeAction(NavigationActions.navigate, {
                    route: 'business_reviews_confirmation',
                    params: {
                        reviewId: businessReview.id
                    }
                });
            });
    },
    getTopReviews: function(context) {
        var query = {'limit': 3};
        var topReviews = context.getStore('BusinessReviewStore').getTopReviews();

        if(!_.isEmpty(topReviews)) {
            return;
        } else {
            return context.hairfieApi
                .get('/tops/businessReviews', {query: query})
                .then(function (topReviews){
                    context.dispatch(Actions.RECEIVE_TOP_REVIEWS, {topReviews: topReviews});
                });
        }
    }
};