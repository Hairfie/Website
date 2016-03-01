'use strict';

var createStore = require('fluxible/addons/createStore');
var makeHandlers = require('../lib/fluxible/makeHandlers');

var Actions = require('../constants/Actions');

var _ = require('lodash');

module.exports = createStore({
    storeName: 'SelectionStore',
    handlers: makeHandlers({
        onReceiveSelections: Actions.RECEIVE_SELECTIONS
    }),
    initialize: function () {
        this.selections;
    },
    dehydrate: function () {
        return {
            selections: this.selections
        };
    },
    rehydrate: function (data) {
        this.selections = data.selections;
    },
    onReceiveSelections: function (selections) {
        this.selections = _.filter(selections, 'active');
        this.emitChange();
    },
    getSelections: function () {
        return this.selections;
    }
});