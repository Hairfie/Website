'use strict';

var HairfieEvents = require('../../constants/HairfieConstants').Events;

module.exports = function FetchTop(context, payload, done) {
    var done = done || function () {};

    context.dispatch(HairfieEvents.RECEIVE_TOP, {
        limit: payload.limit
    });

    context
        .getHairfieApi()
        .getTopHairfies(payload.limit)
        .then(function (hairfies) {
            context.dispatch(HairfieEvents.RECEIVE_TOP_SUCCESS, {
                limit   : payload.limit,
                hairfies: hairfies
            });

            done();
        })
        .fail(function (error) {
            context.dispatch(HairfieEvents.RECEIVE_TOP_FAILURE, {
                limit: payload.limit
            });

            done(error);
        });
};
