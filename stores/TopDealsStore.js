'use strict';

var createStore = require('fluxible/addons/createStore');
var makeHandlers = require('../lib/fluxible/makeHandlers');
var DealEvents = require('../constants/DealConstants').Events;
var DealActions = require('../actions/Deal');

var _ = require('lodash');

module.exports = createStore({
    storeName: 'TopDealsStore',
    handlers: makeHandlers({
        handleFetchTop        : DealEvents.FETCH_TOP,
        handleFetchTopSuccess : DealEvents.FETCH_TOP_SUCCESS,
        handleFetchTopFailure : DealEvents.FETCH_TOP_FAILURE
    }),
    initialize: function () {
        this.deals = [];
        this.limit = 0;
    },
    dehydrate: function () {
        return {
            deals: this.deals,
            limit: this.limit
        };
    },
    rehydrate: function (data) {
        this.deals = data.deals;
        this.limit = data.limit;
    },
    handleFetchTop: function (payload) {
        this.loading = true;
    },
    handleFetchTopSuccess: function (payload) {
        this.loading = false;
        this.limit = payload.limit;
        this.deals = payload.deals;
        this.emitChange();
    },
    handleFetchTopFailure: function (payload) {
        this.loading = false;
        this.emitChange();
    },
    get: function (limit) {
        if (!this.loading && limit > this.limit) {
            this._load(limit);
        }

        return this.deals;
    },
    _load: function (limit) {
        this.dispatcher.getContext().executeAction(DealActions.FetchTop, {
            limit: limit
        });
    }
});
