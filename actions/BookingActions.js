'use strict';

var _ = require('lodash');
var Actions = require('../constants/Actions');
var NavigationActions = require('./NavigationActions');
var NotificationActions = require('./NotificationActions');
var ga = require('../services/analytics');
var Promise = require('q');

module.exports = {
    submitBooking: function (context, booking) {
        var newsletter = booking.newsletter || false;

        return context.hairfieApi
            .post('/bookings', booking)
            .then(
                function (booking) {
                    ga('send', 'event', 'Booking', 'Confirm');
                    if(typeof fbq !== "undefined") {
                        fbq('track', 'Purchase', {value: '6.00', currency: 'EUR'});
                    }
                    return Promise.all([
                        context.dispatch(Actions.RECEIVE_BOOKING, _.assign(booking, {newsletter: newsletter})),
                        context.executeAction(NavigationActions.navigate, {
                        route: 'booking_confirmation',
                        params: { bookingId: booking.id }
                        })
                    ]);
                },
                function () {
                    return context.executeAction(
                        NotificationActions.notifyError,
                        {
                            title: 'Problème lors de la réservation',
                            message: 'Un problème est survenu, avez-vous bien rempli les champs obligatoires ?'
                        }
                    );
                }
            );
    },
    cancelBooking: function(context, booking) {
        var newsletter = booking.newsletter || false;
        return context.hairfieApi
            .post('/bookings/' + booking.bookingId + '/cancel')
            .then(
                function (booking) {
                    context.dispatch(Actions.RECEIVE_BOOKING, _.assign(booking, {newsletter: newsletter}));
                }, function () {
                    return context.executeAction(
                        NotificationActions.notifyError,
                        {
                            title: 'Erreur',
                            message: 'Un problème est survenu'
                        }
                    );
                }
            );
    },
    submitBookingCheckCode: function (context, params) {
        var newsletter = params.newsletter || false;
        return context.hairfieApi
            .post('/bookings/'+params.bookingId+'/userCheck', { userCheckCode: params.checkCode })
            .then(function (booking) {
                context.dispatch(Actions.RECEIVE_BOOKING, _.assign(booking, {newsletter: newsletter}))
            });
    }
};
