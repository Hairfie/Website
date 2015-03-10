'use strict';

var createStore = require('fluxible/utils/createStore');
var makeHandlers = require('../lib/fluxible/makeHandlers');
var CategoryEvents = require('../constants/CategoryConstants').Events;
var CategoryActions = require('../actions/Categories');

var _ = require('lodash');

module.exports = createStore({
    storeName: 'CategoriesStore',
    handlers: makeHandlers({
        handleFetchAll        : CategoryEvents.FETCH_ALL,
        handleFetchAllSuccess : CategoryEvents.FETCH_ALL_SUCCESS,
        handleFetchAllFailure : CategoryEvents.FETCH_ALL_FAILURE
    }),
    initialize: function () {
        this.categories = [];
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
    get: function () {
        if (!this.loading && this.categories.length === 0) {
            this._load();
        }
        return this.categories;
    },
    handleFetchAll: function (payload) {
        this.loading = true;
    },
    handleFetchAllSuccess: function (payload) {
        this.loading = false;
        this.categories = _.sortBy(payload.categories, 'position');
        try {
        this.emitChange();
        } catch (e) {console.log(e); };
    },
    handleFetchAllFailure: function (payload) {
        this.loading = false;
        this.emitChange();
    },
    _load: function () {
        this.dispatcher.getContext().executeAction(CategoryActions.FetchAll);
    }
});
