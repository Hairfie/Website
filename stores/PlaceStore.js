'use strict';

var createStore = require('fluxible/utils/createStore');
var makeHandlers = require('../lib/fluxible/makeHandlers');
var _ = require('lodash');
var PlaceActions = require('../actions/Place');

module.exports = createStore({
    storeName: 'PlaceStore',
    handlers: {
        'PLACE.FETCH_BY_ADDRESS_SUCCESS': 'handleFetchByAddressSuccess'
    },
    initialize: function () {
        this.places = {};
        this.addressToPlaceIdMap = {};
    },
    dehydrate: function () {
        return {
            places: this.places,
            addressToPlaceIdMap: this.addressToPlaceIdMap
        };
    },
    rehydrate: function (state) {
        this.places = state.places;
        this.addressToPlaceIdMap = state.addressToPlaceIdMap;
    },
    getByAddress: function (address) {
        var id = this.addressToPlaceIdMap[address];

        if (_.isUndefined(id)) {
            this._loadByAddress(address);
        }

        return id && this.places[id];
    },
    handleFetchByAddressSuccess: function (payload) {
        var place   = payload.place,
            placeId = place ? place.id : null;

        this.addressToPlaceIdMap[payload.address] = placeId;

        if (place) {
            this.places[placeId] = place;
        }

        this.emitChange();
    },
    _loadByAddress: function (address) {
        this.dispatcher.getContext().executeAction(PlaceActions.FetchByAddress, {
            address: address
        });
    }
});
