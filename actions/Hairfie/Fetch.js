'use strict';

var hairfieApi = require('../../services/hairfie-api-client');
var HairfieEvents = require('../../constants/HairfieConstants').Events;

module.exports = function (context, payload, done) {
    var done = done || function () {};

    context.dispatch(HairfieEvents.FETCH, {
        id: payload.id
    });

    hairfieApi
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
