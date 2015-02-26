'use strict';

var createStore = require('fluxible/utils/createStore');
var makeHandlers = require('../lib/fluxible/makeHandlers');
var BusinessSearchEvents = require('../constants/BusinessSearchConstants').Events;
var BusinessSearchActions = require('../actions/BusinessSearch');
var _ = require('lodash-contrib');

module.exports = createStore({
    storeName: 'BusinessSearchStore',
    handlers: makeHandlers({
        handleSearch       : BusinessSearchEvents.SEARCH,
        handleSearchSuccess: BusinessSearchEvents.SEARCH_SUCCESS
    }),
    initialize: function () {
        this.results = {};
    },
    dehydrate: function () {
        return {
            results: this.results,
        };
    },
    rehydrate: function (state) {
        this.results = state.results || {};
    },
    handleSearch: function(payload) {
        this.results[payload.queryString] = _.assign({}, this.results[payload.queryString], {
            loading: true
        });
        this.emitChange();
    },
    handleSearchSuccess: function (payload) {
        this.results[payload.queryString] = _.assign({}, this.results[payload.queryString], {
            loading : false,
            entity  : payload.businesses
        });
        this.emitChange();
    },
    handleSearchFailure: function (payload) {
        this.results[payload.queryString] = _.assign({}, this.results[payload.queryString], {
            loading : false
        });
        this.emitChange();
    },
    getByQueryString: function (queryString) {
        var businesses = this.results[queryString];

        if (_.isUndefined(businesses)) {
            this._loadByQueryString(queryString);
        }

        return businesses && businesses.entity;
    },
    _loadByQueryString: function (queryString) {
        // TODO
        this.dispatcher.getContext().executeAction(BusinessSearchActions.Search, {
            query: _.fromQuery(queryString)
        });
    }
});
