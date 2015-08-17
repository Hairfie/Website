'use strict';

var createStore = require('fluxible/addons/createStore');
var makeHandlers = require('../lib/fluxible/makeHandlers');
var _ = require('lodash');
var Actions = require('../constants/Actions');

module.exports = createStore({
    storeName: 'BusinessReviewStore',
    handlers: makeHandlers({
        onReceiveBusinessReviews: Actions.RECEIVE_BUSINESS_REVIEWS,
        onReceiveUserReviews: Actions.RECEIVE_USER_REVIEWS
    }),
    initialize: function () {
        this.reviews = {};
        this.userReviews = {};
    },
    dehydrate: function () {
        return {
            reviews: this.reviews,
            userReviews: this.userReviews
        };
    },
    rehydrate: function (state) {
        this.reviews = state.reviews;
        this.userReviews = state.userReviews;
    },
    onReceiveBusinessReviews: function (reviews) {
        this.reviews = _.assign({}, this.reviews, _.indexBy(reviews, 'id'));
        this.emitChange();
    },
    onReceiveUserReviews: function (payload) {
        this.userReviews[payload.userId] = payload.reviews;
        this.emitChange();
    },
    getLatestByBusiness: function (businessId) {
        var matches = _.filter(this.reviews, function (review) {
            return review.business && review.business.id == businessId;
        });

        return _.sortByOrder(matches, ['createdAt'], [false]);
    },
    getReviewsByUser: function (id) {
        return this.userReviews[id];
    }
});
