'use strict';

var hairfieApi = require('../../services/hairfie-api-client');
var HairfieEvents = require('../../constants/HairfieConstants').Events;

module.exports = function (context, payload, done) {
    context.dispatch(HairfieEvents.OPEN);
    hairfieApi
        .getHairfie(payload.id)
        .then(function (hairfie) {
            context.dispatch(HairfieEvents.OPEN_SUCCESS, {
                hairfie: hairfie
            });
            done();
        })
        .catch(function () {
            context.dispatch(HairfieEvents.OPEN_FAILURE);
            done();
        })
    ;
};
