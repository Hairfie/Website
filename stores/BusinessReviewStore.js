'use strict';

var createStore = require('fluxible/addons/createStore');
var makeHandlers = require('../lib/fluxible/makeHandlers');
var _ = require('lodash');
var Actions = require('../constants/Actions');

module.exports = createStore({
    storeName: 'BusinessReviewStore',
    handlers: makeHandlers({
        onReceiveBusinessReviews: Actions.RECEIVE_BUSINESS_REVIEWS
    }),
    initialize: function () {
        this.reviews = {};
    },
    dehydrate: function () {
        return { reviews: this.reviews };
    },
    rehydrate: function (state) {
        this.reviews = state.reviews;
    },
    onReceiveBusinessReviews: function (reviews) {
        this.reviews = _.merge({}, this.reviews, _.indexBy(reviews, 'id'));
        this.emitChange();
    },
    getLatestByBusiness: function (businessId) {
        var matches = _.filter(this.reviews, function (review) {
            return review.business && review.business.id == businessId;
        });

        return _.sortByOrder(matches, ['createdAt'], [false]);
    }
});
