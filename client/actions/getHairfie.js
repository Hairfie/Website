'use strict';

var hairfieApi = require('../services/hairfie-api-client');

module.exports = function (context, payload, done) {
    context.dispatch('RECEIVE_HAIRFIE_START', payload);

    hairfieApi
        .getHairfie(payload.id)
        .then(function (hairfie) {
            console.log("get hairfie", hairfie);
            context.dispatch('RECEIVE_HAIRFIE_SUCCESS', hairfie);
            done();
        })
        .catch(function (e) {
            console.log("error in getHairfie", e);
            context.dispatch('RECEIVE_HAIRFIE_FAILURE');
            done();
        })
    ;

    context.dispatch('RECEIVE_LOGIN');
};