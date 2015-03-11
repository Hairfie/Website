'use strict';

var BookingEvents = require('../../constants/BookingConstants').Events;
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
            context.redirect(context.router.makePath('booking_confirmation', {
                bookingId: booking.id
            }), done);
        })
        .fail(function (error) {
            debug('Failed to save booking', error);
            context.dispatch(BookingEvents.SAVE_FAILURE);
            context.notify('Failure', 'Un problème est survenu, avez vous bien rempli les champs obligatoires ?');
            done(error);
        });
};
