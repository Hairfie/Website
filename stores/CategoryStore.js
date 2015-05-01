'use strict';

var createStore = require('fluxible/addons/createStore');
var makeHandlers = require('../lib/fluxible/makeHandlers');

var Actions = require('../constants/Actions');

var _ = require('lodash');

module.exports = createStore({
    storeName: 'CategoryStore',
    handlers: makeHandlers({
        onReceiveCategories: Actions.RECEIVE_CATEGORIES
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
    },
    onReceiveCategories: function (categories) {
        this.categories = categories;
        this.emitChange();
    },
    getAllSorted: function () {
        return _.sortBy(this.categories, 'position');
    }
});
