'use strict';

var BusinessReviewEvents = require('../../constants/BusinessReviewConstants').Events;
var _ = require('lodash');

module.exports = function FetchQuery(context, payload, done) {
    var done = done || _.noop;

    context
        .getHairfieApi()
        .getBusinessReviews(payload.query)
        .then(function (reviews) {
            context.dispatch(BusinessReviewEvents.FETCH_QUERY_SUCCESS, {
                query: payload.query,
                reviews: reviews
            });
            done();
        })
        .fail(done);
};
