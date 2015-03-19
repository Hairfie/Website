'use strict';

var createStore = require('fluxible/utils/createStore');
var makeHandlers = require('../lib/fluxible/makeHandlers');
var StationEvents = require('../constants/StationConstants').Events;
var StationActions = require('../actions/Station');
var _ = require('lodash');

module.exports = createStore({
    storeName: 'StationStore',
    handlers: makeHandlers({
        handleFetchSuccess: StationEvents.FETCH_FOR_BUSINESS_SUCCESS
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
        this.stations = state.stations | {};
    },
    handleFetchSuccess: function (payload) {
        this.stations[payload.businessId] = payload.stations;
        this.emitChange();
    },
    getByBusiness: function (business) {
        if (!this.stations[business.id] && business.gps) {
            this._load(business.id, business.gps);
        }
        return this.stations[business.id];
    },
    _load: function (businessId, location) {
        this.dispatcher.getContext().executeAction(StationActions.FetchForBusiness, {
            businessId: businessId,
            location: location
        });
    }
});