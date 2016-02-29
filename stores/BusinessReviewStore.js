'use strict';

var createStore = require('fluxible/addons/createStore');
var makeHandlers = require('../lib/fluxible/makeHandlers');
var _ = require('lodash');
var Actions = require('../constants/Actions');
var BusinessReviewActions = require('../actions/BusinessReviewActions.js');

module.exports = createStore({
    storeName: 'BusinessReviewStore',
    handlers: makeHandlers({
        onReceiveBusinessReviews: Actions.RECEIVE_BUSINESS_REVIEWS,
        onReceiveUserReviews: Actions.RECEIVE_USER_REVIEWS,
        onReceiveReview: Actions.RECEIVE_REVIEW,
        onReceiveTopReviews: Actions.RECEIVE_TOP_REVIEWS
    }),
    initialize: function () {
        this.reviews = {};
        this.userReviews = {};
        this.businessReviews = {};
        this.topReviews = [];
    },
    dehydrate: function () {
        return {
            reviews: this.reviews,
            userReviews: this.userReviews,
            businessReviews: this.businessReviews,
            topReviews: this.topReviews
        };
    },
    rehydrate: function (state) {
        this.reviews = state.reviews;
        this.userReviews = state.userReviews;
        this.businessReviews = state.businessReviews;
        this.topReviews = state.topReviews;
    },
    onReceiveReview: function(review) {
        this.reviews[review.id] = review;
        this.emitChange();
    },
    onReceiveBusinessReviews: function (payload) {
        this.reviews = _.assign({}, this.reviews, _.indexBy(payload.reviews, 'id'));

        this.businessReviews[payload.businessId] = _.map(_.sortByOrder(payload.reviews, 'createdAt', [false]), 'id');
        this.emitChange();
    },
    onReceiveUserReviews: function (payload) {
        this.reviews = _.assign({}, this.reviews, _.indexBy(payload.reviews, 'id'));
        this.userReviews[payload.userId] = _.map(_.sortBy(payload.reviews, 'createdAt', [false]), 'id');
        this.emitChange();
    },
    onReceiveTopReviews: function (payload) {
        this.topReviews = _.assign({}, this.topReviews, _.indexBy(payload.topReviews, 'id'));
        this.emitChange();
    },
    getLatestByBusiness: function (businessId) {
        if (!this.businessReviews[businessId]) return null;

        return _.map(this.businessReviews[businessId], function(reviewId) {
            return this.reviews[reviewId];
        }, this);
    },
    getReviewsByUser: function (userId) {
        if (!this.userReviews[userId]) return null;

        return _.map(this.userReviews[userId], function(reviewId) {
            return this.reviews[reviewId];
        }, this);
    },
    getById: function (id) {
        return this.reviews[id];
    },
    getTopReviews: function () {
        if (!this.topReviews) return;
        return this.topReviews;
    }
});
