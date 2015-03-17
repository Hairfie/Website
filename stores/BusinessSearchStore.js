'use strict';

var createStore = require('fluxible/utils/createStore');
var makeHandlers = require('../lib/fluxible/makeHandlers');
var BusinessEvents = require('../constants/BusinessConstants').Events;
var BusinessActions = require('../actions/Business');
var _ = require('lodash-contrib');

module.exports = createStore({
    storeName: 'BusinessSearchStore',
    handlers: makeHandlers({
        handleFetch         : BusinessEvents.FETCH_SEARCH,
        handleFetchSuccess  : BusinessEvents.FETCH_SEARCH_SUCCESS,
        handleFetchFailure  : BusinessEvents.FETCH_SEARCH_FAILURE
    }),
    initialize: function () {
        this.searches = {};
    },
    dehydrate: function () {
        return {
            searches: this.searches,
        };
    },
    rehydrate: function (state) {
        this.searches = state.searches || {};
    },
    handleFetch: function (payload) {
        var key = this._searchKey(payload.query);
        this.searches[key] = _.assign({}, this.searches[key], {
            loading: true
        });
    },
    handleFetchSuccess: function (payload) {
        var key = this._searchKey(payload.query);
        this.searches[key] = _.assign({}, this.searches[key], {
            loading: false,
            result: payload.result
        });
        this.emitChange();
    },
    handleFetchFailure: function (payload) {
        var key = this._searchKey(payload.query);
        this.searches[key] = _.assign({}, this.searches[key], {
            loading: false
        });
        this.emitChange();
    },
    getResult: function (query) {
        var key = this._searchKey(query);
        var search = this.searches[key];

        if (_.isUndefined(search)) {
            this._loadResult(query);
        }

        return search && search.result;
    },
    _loadResult: function (query) {
        this.dispatcher.getContext().executeAction(BusinessActions.FetchSearch, {
            query: query
        });
    },
    _searchKey: function (search) {
        return JSON.stringify(search); // TODO: order keys
    }
});
