'use strict';

var hairfieApi = require('../../services/hairfie-api-client');

var HairdresserEvents = require('../../constants/HairdresserConstants').Events;

module.exports = function (context, payload, done) {
    context.dispatch(HairdresserEvents.SAVE);

    hairfieApi
        .saveHairdresser(payload.hairdresser, context.getAuthToken())
        .then(function (hairdresser) {
            context.dispatch(HairdresserEvents.SAVE_SUCCESS, {
                hairdresser: hairdresser
            });
        })
        .fail(function () {
            context.dispatch(HairdresserEvents.SAVE_FAILURE);
        });
};
