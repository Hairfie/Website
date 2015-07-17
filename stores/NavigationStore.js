'use strict';

var createStore = require('fluxible/addons/createStore');
var makeHandlers = require('../lib/fluxible/makeHandlers');
var _ = require('lodash');
var Actions = require('../constants/Actions');

module.exports = createStore({
    storeName: 'NavigationStore',
    handlers: makeHandlers({
        onReceiveBooking: Actions.NAVIGATE_SUCCESS
    }),
    initialize: function () {
        this.bookings = {};
    },
    dehydrate: function () {
        return {
            bookings: this.bookings
        };
    },
    rehydrate: function (state) {
        this.bookings = state.bookings;
    },
    onReceiveBooking: function (booking) {
        this.bookings[booking.id] = booking;
        this.emitChange();
    },
    getById: function (bookingId) {
        return this.bookings[bookingId];
    }
});
