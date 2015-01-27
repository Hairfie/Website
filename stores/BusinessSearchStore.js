'use strict';

var createStore = require('fluxible/utils/createStore');
var makeHandlers = require('../lib/fluxible/makeHandlers');
var BusinessSearchEvents = require('../constants/BusinessSearchConstants').Events;
var BusinessSearchActions = require('../actions/BusinessSearch');
var _ = require('lodash');

module.exports = createStore({
    storeName: 'BusinessSearchStore',
    initialize: function () {
        this.businesses = [];
    },
    handlers: makeHandlers({
        handleSearchSuccess: BusinessSearchEvents.SEARCH_SUCCESS
    }),
    handleSearchSuccess: function (payload) {
        this.businesses = payload.businesses;
        this.emitChange();
    },
    getBusinesses: function () {
        return this.businesses;
    }
});
