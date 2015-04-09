'use strict';

var createStore = require('fluxible/addons/createStore');
var makeHandlers = require('../lib/fluxible/makeHandlers');
var StationEvents = require('../constants/StationConstants').Events;
var StationActions = require('../actions/Station');
var _ = require('lodash');

module.exports = createStore({
    storeName: 'StationStore',
    handlers: makeHandlers({
        handleFetchSuccess: StationEvents.FETCH_BY_LOCATION_SUCCESS
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
    handleFetchSuccess: function (payload) {
        var key = this._locationKey(payload.location);
        this.stations[key] = _.assign({}, this.stations[key], {
            stations: payload.stations
        });
        this.emitChange();
    },
    getByLocation: function (location) {
        var key = this._locationKey(location);
        var cache = this.stations[key];

        if (_.isUndefined(cache)) {
            this._load(location);
        }

        return cache && cache.stations;
    },
    _load: function (location) {
        var key = this._locationKey(location);
        this.stations[key] = _.assign({}, this.stations[key]);
        this.dispatcher.getContext().executeAction(StationActions.FetchByLocation, {
            location: location
        });
    },
    _locationKey: function (location) {
        return location.lat+','+location.lng;
    }
});
