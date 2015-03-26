'use strict';

var createStore = require('fluxible/utils/createStore');
var makeHandlers = require('../lib/fluxible/makeHandlers');
var BusinessReviewEvents = require('../constants/BusinessReviewConstants').Events;
var BusinessReviewActions = require('../actions/BusinessReview');
var _ = require('lodash');

module.exports = createStore({
    storeName: 'BusinessReviewStore',
    handlers: makeHandlers({
        handleFetchQuerySuccess: BusinessReviewEvents.FETCH_QUERY_SUCCESS
    }),
    initialize: function () {
        this.queries = {};
    },
    dehydrate: function () {
        return {
            queries: this.queries
        };
    },
    rehydrate: function (data) {
        this.queries = data.queries;
    },
    handleFetchQuerySuccess: function (payload) {
        var key = this._queryKey(payload.query);
        this.queries[key] = _.assign({}, this.queries[key], {
            reviews: payload.reviews
        });
        this.emitChange();
    },
    getLatestByBusiness: function (businessId, limit) {
        return this._query({
            where: {
                businessId: businessId
            },
            sort: 'createdAt DESC',
            limit: limit
        })
    },
    _query: function (query) {
        var key = this._queryKey(query);
        var cache = this.queries[key];

        if (_.isUndefined(cache)) {
            this._fetchQuery(query);
        }

        return cache && cache.reviews;
    },
    _fetchQuery: function (query) {
        var key = this._queryKey(query);
        this.queries[key] = _.assign({}, this.queries[key]);
        this.dispatcher.getContext().executeAction(BusinessReviewActions.FetchQuery, {
            query: query
        });
    },
    _queryKey: JSON.stringify
});
