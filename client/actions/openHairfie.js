'use strict';

var hairfieApi = require('../services/hairfie-api-client');

module.exports = function (context, payload, done) {
    hairfieApi
        .getHairfie(payload.params.id)
        .then(function (hairfie) {
            context.dispatch('OPEN_HAIRFIE_SUCCESS', {
                hairfie: hairfie
            });
            done();
        })
        .catch(function () {
            context.dispatch('OPEN_HAIRFIE_FAILURE');
            done();
        })
    ;

    context.dispatch('OPEN_HAIRFIE');
};
