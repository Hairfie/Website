'use strict';

var HairfieEvents = require('../../constants/HairfieConstants').Events;

module.exports = function (context, payload, done) {
    context.dispatch(HairfieEvents.DELETE);
    context
        .getHairfieApi()
        .deleteHairfie(payload.hairfie)
        .then(function () {
            context.dispatch(HairfieEvents.DELETE_SUCCESS, {
                hairfie: payload.hairfie
            });
        })
        .fail(function (error) {
            context.dispatch(HairfieEvents.DELETE_FAILURE);
            done(error);
        });
};
