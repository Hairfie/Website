'use strict';

var createStore = require('fluxible/utils/createStore');
var makeHandlers = require('../lib/fluxible/makeHandlers');
var CategoryEvents = require('../constants/CategoryConstants').Events;
var CategoryActions = require('../actions/Category');

var _ = require('lodash');

module.exports = createStore({
    storeName: 'CategoryStore',
    handlers: makeHandlers({
        handleFetchAllSuccess : CategoryEvents.FETCH_ALL_SUCCESS,
        handleFetchAllFailure : CategoryEvents.FETCH_ALL_FAILURE
    }),
    initialize: function () {
        this.categories;
    },
    dehydrate: function () {
        return {
            categories: this.categories
        };
    },
    rehydrate: function (data) {
        this.categories = data.categories;
        this.limit = data.limit;
    },
    all: function () {
        if (!this.loading && _.isUndefined(this.categories)) {
            this._load();
        }

        return this.categories;
    },
    handleFetchAllSuccess: function (payload) {
        this.loading = false;
        this.categories = _.sortBy(payload.categories, 'position');
        this.emitChange();
    },
    handleFetchAllFailure: function (payload) {
        this.loading = false;
        this.emitChange();
    },
    _load: function () {
        this.loading = true;
        this.dispatcher.getContext().executeAction(CategoryActions.FetchAll);
    }
});
