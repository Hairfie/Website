'use strict';

var _ = require('lodash');
var HairfieEvents = require('../../constants/HairfieConstants').Events;

module.exports = function (context, payload, done) {
    var done = done || _.noop;

    context
        .getHairfieApi()
        .getHairfies(payload.filter)
        .then(function (hairfies) {
            context.dispatch(HairfieEvents.FETCH_QUERY_SUCCESS, {
                filter  : payload.filter,
                hairfies: hairfies
            });
            done();
        })
        .fail(function (error) {
            context.dispatch(HairfieEvents.FETCH_QUERY_FAILURE, {
                filter: payload.filter
            });
            done(error);
        });
};
