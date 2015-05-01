'use strict';

var createStore = require('fluxible/addons/createStore');
var makeHandlers = require('../lib/fluxible/makeHandlers');
var Actions = require('../constants/Actions');

module.exports = createStore({
    storeName: 'BusinessSearchStore',
    handlers: makeHandlers({
        onReceiveBusinessSearchResult: Actions.RECEIVE_BUSINESS_SEARCH_RESULT
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
        this.results = state.results;
    },
    onReceiveBusinessSearchResult: function (payload) {
        this.results[searchKey(payload.search)] = payload.result;
        this.emitChange();
    },
    getResult: function (search) {
        return this.results[searchKey(search)];
    }
});

function searchKey(search) { return JSON.stringify(search) }
