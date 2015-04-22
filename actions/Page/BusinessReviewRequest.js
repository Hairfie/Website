'use strict';

var BusinessReviewActions = require('../BusinessReview');
var BusinessReviewRequestStore = require('../../stores/BusinessReviewRequestStore');

module.exports = function (context, payload, done) {
    var BusinessReviewRequestId = payload.params.businessReviewRequestId || payload.params.id;

    context.executeAction(BusinessReviewActions.FetchRequest, {id: BusinessReviewRequestId}, function (error) {
        var BusinessReviewRequest = context.getStore(BusinessReviewRequestStore).getById(BusinessReviewRequestId);
        if (!BusinessReviewRequest) done({status: 404, message: 'BusinessReviewRequest not found'});
        done();
    });
};
