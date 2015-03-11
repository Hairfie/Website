'use strict';

var BusinessReviewEvents = require('../../constants/BusinessReviewConstants').Events;

module.exports = function (context, payload, done) {
    var done = done || function () {};
    context
        .getHairfieApi()
        .getBusinessReviewRequest(payload.id)
        .then(function (businessReviewRequest) {
            context.dispatch(BusinessReviewEvents.RECEIVE_REQUEST_SUCCESS, {
                id                      : payload.id,
                businessReviewRequest   : businessReviewRequest
            });
            done();
        })
        .fail(done);
};
