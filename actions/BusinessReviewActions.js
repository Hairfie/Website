'use strict';

var _ = require('lodash');
var Actions = require('../constants/Actions');
var NavigationActions = require('./NavigationActions');
var NotificationActions = require('./NotificationActions');
var ga = require('../services/analytics');

module.exports = {
    loadRequest: function (context, requestId) {
        console.log(requestId);
        if (!requestId) return;
        return context.hairfieApi
            .get('/businessReviewRequests/'+requestId)
            .then(function (request) {
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
                context.dispatch(Actions.RECEIVE_BUSINESS_REVIEWS, businessReviews);
            });
    },
    submitReview: function(context, payload) {
        return context.hairfieApi
            .post('/businessReviews', payload.review, {token: payload.token || null})
            .then(function (businessReview) {
                ga('send', 'event', 'Business Reviews', 'Submit');

                return context.executeAction(
                    NotificationActions.notifySuccess,
                    'Votre avis a bien été pris en compte, merci !'
                ).then(function () {
                    return context.executeAction(NavigationActions.navigate, {
                        route: 'business',
                        params: {
                            businessId: businessReview.business.id,
                            businessSlug: businessReview.business.slug
                        }
                    });
                });
            });
    }
};