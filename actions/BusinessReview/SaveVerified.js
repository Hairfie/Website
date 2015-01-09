'use strict';

var hairfieApi = require('../../services/hairfie-api-client');
var BusinessReviewTokenActions = require('../../actions/BusinessReviewToken');

module.exports = function (context, payload, done) {
    var done = done || function () {};

    hairfieApi
        .saveBusinessReview(payload.businessReview)
        .then(function (businessReview) {
            // refresh the token
            context.executeAction(BusinessReviewTokenActions.Fetch, {
                id: payload.businessReviewToken.id
            });
        })
        .fail(function (error) {
            done(error);
        });
};
