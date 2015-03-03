'use strict';

var FetchRequest = require('./FetchRequest');
var _ = require('lodash');
var ga = require('../services/analytics');

module.exports = function (context, payload, done) {
    var done = done || function () {};

    var review = _.cloneDeep(payload.businessReview);
    review.request = payload.businessReviewRequest;

    context
        .getHairfieApi()
        .saveBusinessReview(review, {token: null})
        .then(function () {
            // refresh the token
            context.executeAction(FetchRequest, {
                id: payload.businessReviewRequest.id
            });

            // track the event
            ga('send', 'event', 'Business Reviews', 'Submit');
        })
        .fail(done);
};
