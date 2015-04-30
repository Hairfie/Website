'use strict';

var createStore = require('fluxible/addons/createStore');
var makeHandlers = require('../lib/fluxible/makeHandlers');
var Actions = require('../constants/Actions');

module.exports = createStore({
    storeName: 'StationStore',
    handlers: makeHandlers({
        onReceiveStationsNearby: Actions.RECEIVE_STATIONS_NEARBY
    }),
    initialize: function () {
        this.stations = {};
    },
    dehydrate: function () {
        return {
            stations: this.stations
        };
    },
    rehydrate: function (state) {
        this.stations = state.stations || {};
    },
    onReceiveStationsNearby: function (payload) {
        this.stations[locationKey(payload.location)] = payload.stations;
        this.emitChange();
    },
    getNearby: function (location) {
        return this.stations[locationKey(location)];
    }
});

function locationKey(location) {
    var location = location || {};
    return location.lat+','+location.lng;
}
