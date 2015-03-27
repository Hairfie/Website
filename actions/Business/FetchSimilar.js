'use strict';

var BusinessEvents = require('../../constants/BusinessConstants').Events;
var _ = require('lodash');

module.exports = function FetchSimilar(context, payload, done) {
    var done = done || _.noop;

    context
        .getHairfieApi()
        .getSimilarBusinesses(payload.businessId, payload.limit)
        .then(function (businesses) {
            context.dispatch(BusinessEvents.FETCH_SIMILAR_SUCCESS, {
                businessId  : payload.businessId,
                limit       : payload.limit,
                businesses  : businesses
            });
            done();
        })
        .fail(done);
};
