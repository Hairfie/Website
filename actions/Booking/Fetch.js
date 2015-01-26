'use strict';

var BookingEvents = require('../../constants/BookingConstants').Events;
var hairfieApi = require('../../services/hairfie-api-client');

module.exports = function (context, payload, done) {
    var done = done || function () {};

    context.dispatch(BookingEvents.RECEIVE, {
        id: payload.id
    });

    hairfieApi
        .getBooking(payload.id, context.getAuthToken())
        .then(function (booking) {
            context.dispatch(BookingEvents.RECEIVE_SUCCESS, {
                id      : payload.id,
                booking : booking
            });
            done();
        })
        .fail(function (error) {
            context.dispatch(BookingEvents.RECEIVE_FAILURE, {
                id: payload.id
            });
            done(error);
        });
};
