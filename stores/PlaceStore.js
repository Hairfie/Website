'use strict';

var createStore = require('fluxible/addons/createStore');
var makeHandlers = require('../lib/fluxible/makeHandlers');
var Actions = require('../constants/Actions');

module.exports = createStore({
    storeName: 'PlaceStore',
    handlers: makeHandlers({
        onReceiveAddressPlace: Actions.RECEIVE_ADDRESS_PLACE,
        onReceiveCurrentPosition: Actions.RECEIVE_CURRENT_POSITION
    }),
    initialize: function () {
        this.places = {};
        this.addresses = {};
        this.currentPosition = "";
    },
    dehydrate: function () {
        return {
            places: this.places,
            addresses: this.addresses,
            currentPosition: this.currentPosition
        };
    },
    rehydrate: function (state) {
        this.places = state.places;
        this.addresses = state.addresses;
        this.currentPosition = state.currentPosition;
    },
    onReceiveAddressPlace: function (payload) {
        var address = payload.address;
        var place = payload.place;

        if (place) {
            this.places[place.id] = place;
            this.addresses[address] = place.id;
        } else {
            this.addresses[address] = null;
        }

        this.emitChange();
    },
    onReceiveCurrentPosition: function(address) {
        this.currentPosition = address;
        this.emitChange();
    },
    getByAddress: function (address) {
        var id = this.addresses[address];

        return id && this.places[id];
    },
    getCurrentPosition: function() {
        return this.currentPosition;
    }
});
