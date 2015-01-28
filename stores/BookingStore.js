'use strict';

var createStore = require('fluxible/utils/createStore');
var makeHandlers = require('../lib/fluxible/makeHandlers');
var BookingEvents = require('../constants/BookingConstants').Events;
var BookingActions = require('../actions/Booking');
var _ = require('lodash');

module.exports = createStore({
    storeName: 'BookingStore',
    handlers: makeHandlers({
        handleReceive       : BookingEvents.RECEIVE,
        handleReceiveSuccess: BookingEvents.RECEIVE_SUCCESS,
        handleReceiveFailure: BookingEvents.RECEIVE_FAILURE
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
        this.bookings = state.bookings || {};
    },
    handleReceive: function (payload) {
        this.bookings[payload.id] = _.assign({}, this.bookings[payload.id], {
            loading: true
        });
        this.emitChange();
    },
    handleReceiveSuccess: function (payload) {
        this.bookings[payload.id] = _.assign({}, this.bookings[payload.id], {
            loading : false,
            entity  : payload.booking
        });
        this.emitChange();
    },
    handleReceiveFailure: function (payload) {
        this.bookings[payload.id] = _.assign({}, this.bookings[payload.id], {
            loading: false
        });
        this.emitChange();
    },
    getById: function (bookingId) {
        var booking = this.bookings[bookingId];

        if (_.isUndefined(booking)) {
            this._loadById(bookingId);
        }

        return booking && booking.entity;
    },
    _loadById: function (bookingId) {
        this.dispatcher.getContext().executeAction(BookingActions.Fetch, {
            id: bookingId
        });
    }
});
