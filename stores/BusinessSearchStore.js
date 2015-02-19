'use strict';

var createStore = require('fluxible/utils/createStore');
var makeHandlers = require('../lib/fluxible/makeHandlers');
var BusinessSearchEvents = require('../constants/BusinessSearchConstants').Events;
var BusinessSearchActions = require('../actions/BusinessSearch');
var _ = require('lodash');

module.exports = createStore({
    storeName: 'BusinessSearchStore',
    handlers: makeHandlers({
        handleSearch       : BusinessSearchEvents.SEARCH,
        handleSearchSuccess: BusinessSearchEvents.SEARCH_SUCCESS
    }),
    initialize: function () {
        this.businesses = [];
        this.queryParams = {};
    },
    dehydrate: function () {
        return {
            businesses: this.businesses,
            queryParams: this.queryParams
        };
    },
    rehydrate: function (state) {
        this.businesses = state.businesses || [];
        this.queryParams = state.queryParams || {};
    },
    handleSearch: function(payload) {
        this.queryParams = payload.queryParams;
        this.emitChange();
    },
    handleSearchSuccess: function (payload) {
        this.businesses = payload.businesses;
        this.queryParams = payload.queryParams;
        console.log("search success !!", this.queryParams);
        this.emitChange();
    },
    getBusinesses: function () {
        return this.businesses;
    },
    getQueryParams: function () {
        console.log("getQueryParams", this.queryParams);
        return this.queryParams;
    }
});
