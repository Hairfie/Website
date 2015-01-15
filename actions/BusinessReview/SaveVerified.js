'use strict';

var hairfieApi = require('../../services/hairfie-api-client');
var FetchRequest = require('./FetchRequest');
var _ = require('lodash');

module.exports = function (context, payload, done) {
    var done = done || function () {};

    var review = _.cloneDeep(payload.businessReview);
    review.request = payload.businessReviewRequest;

    hairfieApi
        .saveBusinessReview(review)
        .then(function () {
            // refresh the token
            context.executeAction(FetchRequest, {
                id: payload.businessReviewRequest.id
            });
        })
        .fail(done);
};
