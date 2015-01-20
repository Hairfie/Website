'use strict';

var createStore = require('fluxible-app/utils/createStore');
var makeHandlers = require('../lib/fluxible/makeHandlers');
var BookingEvents = require('../constants/BookingConstants').Events;
var BookingActions = require('../actions/Booking');
var _ = require('lodash');

module.exports = createStore({
    storeName: 'BookingStore',
    initialize: function () {
        this.booking = {};
    },
    handlers: makeHandlers({
        handleSaveSuccess           : BookingEvents.SAVE_SUCCESS,
        handleOpenSuccess           : BookingEvents.OPEN_SUCCESS,
        handleReceiveBusinessSuccess: BookingEvents.RECEIVE_BUSINESS_SUCCESS
    }),
    handleSaveSuccess: function (payload) {
        this.booking = payload.booking;
        this.emitChange();
    },
    handleOpenSuccess: function (payload) {
        this.booking = payload.booking;
        this.emitChange();
    },
    getBooking: function () {
        return this.booking;
    }
});