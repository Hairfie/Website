'use strict';

var BookingEvents = require('../../constants/BookingConstants').Events;
var Notify = require('../Flash/Notify');
var Navigate = require('flux-router-component/actions/navigate');
var debug = require('debug')('Action:Booking:Save');

module.exports = function (context, payload, done) {
    context.dispatch(BookingEvents.SAVE);

    context
        .getHairfieApi()
        .saveBooking(payload.booking)
        .then(function (booking) {
            context.dispatch(BookingEvents.SAVE_SUCCESS, {
                booking: booking
            });

            var path = context.router.makePath('booking_confirmation', {bookingId: booking.id});
            context.executeAction(Navigate, {url: path}, done);

            done();
        })
        .fail(function (error) {
            debug('Failed to save booking', error);
            context.dispatch(BookingEvents.SAVE_FAILURE);

            context.executeAction(Notify, {
                type: 'FAILURE',
                body: 'Un problème est survenu, avez vous bien rempli les champs obligatoires ?'
            }, function() {});

            done(error);
        });
};
