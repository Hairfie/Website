'use strict';

var HairfieEvents = require('../../constants/HairfieConstants').Events;

module.exports = function (context, payload, done) {
    var done = done || function () {};

    context.dispatch(HairfieEvents.RECEIVE, {
        id: payload.id
    });

    context
        .getHairfieApi()
        .getHairfie(payload.id)
        .then(function (hairfie) {
            context.dispatch(HairfieEvents.RECEIVE_SUCCESS, {
                id      : payload.id,
                hairfie : hairfie
            });
            done();
        })
        .fail(function (error) {
            context.dispatch(HairfieEvents.RECEIVE_FAILURE, {
                id: payload.id
            });
            done(error);
        });
};
