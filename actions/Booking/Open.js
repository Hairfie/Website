'use strict';

var hairfieApi = require('../../services/hairfie-api-client');
var BookingEvents = require('../../constants/BookingConstants').Events;
var Notify = require('../Flash/Notify');

module.exports = function (context, payload, done) {
    context.dispatch(BookingEvents.OPEN);
    hairfieApi
        .getBooking(payload.id)
        .then(function (booking) {
            context.dispatch(BookingEvents.OPEN_SUCCESS, {
                booking: booking
            });
            done();
        })
        .catch(function () {
            context.dispatch(BookingEvents.OPEN_FAILURE);
            done();
        })
    ;
};