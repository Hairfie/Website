'use strict';

var createStore = require('fluxible/addons/createStore');
var makeHandlers = require('../lib/fluxible/makeHandlers');
var Actions = require('../constants/Actions');
var _ = require('lodash');

module.exports = createStore({
    storeName: 'HairdresserStore',
    handlers: makeHandlers({
        onReceiveHairdresser: Actions.RECEIVE_HAIRDRESSER
    }),
    initialize: function () {
        this.hairdressers = {};
    },
    dehydrate: function () {
        return { hairdressers: this.hairdressers };
    },
    rehydrate: function (state) {
        this.hairdressers = state.hairdressers;
    },
    onReceiveHairdresser: function (payload) {
        this.hairdressers[payload.hairdresser.id] = payload.hairdresser;
        this.emitChange();
    },
    getById: function(hairdresserId) {
        return this.hairdressers[hairdresserId];
    }
});