'use strict';

var _ = require('lodash');

var DealEvents = require('../../constants/DealConstants').Events;

module.exports = function FetchTop(context, payload, done) {
    var done = done || _.noop();

    context.dispatch(DealEvents.FETCH_TOP, {
        limit: payload.limit
    });

    context
        .getHairfieApi()
        .getTopDeals(payload.limit)
        .then(function (deals) {
            context.dispatch(DealEvents.FETCH_TOP_SUCCESS, {
                limit: payload.limit,
                deals: deals
            });
            done();
        })
        .fail(function (error) {
            context.dispatch(DealEvents.FETCH_TOP_FAILURE, {
                limit: payload.limit
            });
            done(error);
        });
}
