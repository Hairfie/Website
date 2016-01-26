'use strict';

var createStore = require('fluxible/addons/createStore');
var makeHandlers = require('../lib/fluxible/makeHandlers');
var Actions = require('../constants/Actions');
var _ = require('lodash');

module.exports = createStore({
    storeName: 'BusinessLeadStore',
    handlers: makeHandlers({
        onHairdresserRegistration: Actions.HAIRDRESSER_REGISTRATION_SUCCESS
    }),
    initialize: function () {
        this.registeredHairdresser = false;
    },
    dehydrate: function () {
        return { registeredHairdresser: this.registeredHairdresser };
    },
    rehydrate: function (state) {
        this.registeredHairdresser = state.registeredHairdresser;
    },
    onHairdresserRegistration: function (subscriber) {
        this.registeredHairdresser = true;
        this.emitChange();
    },
    getHairdresserRegistrationStatus: function () {
        return this.registeredHairdresser;
    }
});