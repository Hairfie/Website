'use strict';

var HairdresserEvents = require('../../constants/HairdresserConstants').Events;

module.exports = function (context, payload, done) {
    context.dispatch(HairdresserEvents.SAVE);

    context
        .getHairfieApi()
        .saveHairdresser(payload.hairdresser)
        .then(function (hairdresser) {
            context.dispatch(HairdresserEvents.SAVE_SUCCESS, {
                hairdresser: hairdresser
            });
        })
        .fail(function () {
            context.dispatch(HairdresserEvents.SAVE_FAILURE);
        });
};
