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

            context.executeAction(Notify, {
                type: 'SUCCESS',
                body: 'Votre réservation a bien été enregistrée !'
            }, function() {});

            done();
        })
        .fail(function (error) {
            context.dispatch(BookingEvents.SAVE_FAILURE);
                context.executeAction(Notify, {
                    type: 'FAILURE',
                    body: 'Un problème est survenu, avez vous bien rempli les champs obligatoires ?'
                }, function() {});
            done(error);
        });
};