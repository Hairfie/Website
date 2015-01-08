'use strict';

var hairfieApi = require('../../services/hairfie-api-client');
var BookingEvents = require('../../constants/BookingConstants').Events;
var Notify = require('../Flash/Notify');

module.exports = function (context, payload, done) {
    context.dispatch(BookingEvents.SAVE);

    hairfieApi
        .saveBooking(payload.booking)
        .then(function (booking) {
            context.dispatch(BookingEvents.SAVE_SUCCESS, {
                booking: booking
            });

            done();
        })
        .fail(function (error) {
            context.dispatch(BookingEvents.SAVE_FAILURE);
                context.executeAction(Notify, {
                    type: 'FAILURE',
                    body: 'Un problème est survenu'
                }, function() {});
            done(error);
        });
};