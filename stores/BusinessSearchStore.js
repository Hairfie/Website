'use strict';

var createStore = require('fluxible/utils/createStore');
var makeHandlers = require('../lib/fluxible/makeHandlers');
var BusinessEvents = require('../constants/BusinessConstants').Events;
var BusinessActions = require('../actions/Business');
var _ = require('lodash-contrib');

module.exports = createStore({
    storeName: 'BusinessSearchStore',
    handlers: makeHandlers({
        handleFetch         : BusinessEvents.FETCH_SEARCH_RESULT,
        handleFetchSuccess  : BusinessEvents.FETCH_SEARCH_RESULT_SUCCESS,
        handleFetchFailure  : BusinessEvents.FETCH_SEARCH_RESULT_FAILURE
    }),
    initialize: function () {
        this.exchanges = {};
    },
    dehydrate: function () {
        return {
            exchanges: this.exchanges,
        };
    },
    rehydrate: function (state) {
        this.exchanges = state.exchanges || {};
    },
    handleFetch: function (payload) {
        var key = this._searchKey(payload.search);
        this.exchanges[key] = _.assign({}, this.exchanges[key], {
            loading: true
        });
    },
    handleFetchSuccess: function (payload) {
        var key = this._searchKey(payload.search);
        this.exchanges[key] = _.assign({}, this.exchanges[key], {
            loading: false,
            result: payload.result
        });
        this.emitChange();
    },
    handleFetchFailure: function (payload) {
        var key = this._searchKey(payload.search);
        this.exchanges[key] = _.assign({}, this.exchanges[key], {
            loading: false
        });
        this.emitChange();
    },
    getResult: function (search) {
        var key      = this._searchKey(search);
        var exchange = this.exchanges[key];

        if (_.isUndefined(exchange)) {
            this._loadResult(search);
        }

        return exchange && exchange.result;
    },
    _loadResult: function (search) {
        console.log('load', search);
        this.dispatcher.getContext().executeAction(BusinessActions.FetchSearchResult, {
            search: search
        });
    },
    _searchKey: JSON.stringify // TODO: order keys
});
