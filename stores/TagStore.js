'use strict';

var createStore = require('fluxible/addons/createStore');
var makeHandlers = require('../lib/fluxible/makeHandlers');

var Actions = require('../constants/Actions');

var _ = require('lodash');

module.exports = createStore({
    storeName: 'TagStore',
    handlers: makeHandlers({
        onReceiveTags: Actions.RECEIVE_TAGS
    }),
    initialize: function () {
        this.tags;
    },
    dehydrate: function () {
        return {
            tags: this.tags
        };
    },
    rehydrate: function (data) {
        this.tags = data.tags;
    },
    onReceiveCategories: function (tags) {
        this.tags = tags;
        this.emitChange();
    },
    getAllSorted: function () {
        return _.sortBy(this.tags, 'position');
    }
});
