'use strict';

var hairfieApi = require('../../services/hairfie-api-client');
var BusinessReviewTokenEvents = require('../../constants/BusinessReviewTokenConstants').Events;

module.exports = function (context, payload, done) {
    var done = done || function () {};

    hairfieApi
        .getBusinessReviewToken(payload.id)
        .then(function (businessReviewToken) {
            context.dispatch(BusinessReviewTokenEvents.RECEIVE_SUCCESS, {
                id                  : payload.id,
                businessReviewToken : businessReviewToken
            });
            done();
        })
        .fail(done);
};
