'use strict';

var _ = require('lodash');

module.exports = function FetchPlaceByAddress(context, payload, done) {
    var done = done || _.noop();

    context
        .getHairfieApi()
        .queryPlaces({address: payload.address})
        .then(function (places) {
            context.dispatch('PLACE.FETCH_BY_ADDRESS_SUCCESS', {
                address : payload.address,
                place   : places.length > 0 ? places[0] : null
            });
            done();
        })
        .fail(done);
};
