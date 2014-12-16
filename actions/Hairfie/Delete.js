'use strict';

var hairfieApi = require('../../services/hairfie-api-client');
var HairfieEvents = require('../../constants/HairfieConstants').Events;


module.exports = function (context, payload, done) {
    context.dispatch(HairfieEvents.DELETE);
    hairfieApi
        .deleteHairfie(payload.hairfie, context.getAuthToken())
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