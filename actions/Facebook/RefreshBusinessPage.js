'use strict';

var hairfieApi = require('../../services/hairfie-api-client');
var FacebookEvents = require('../../constants/FacebookConstants').Events;

module.exports = function (context, payload, done) {
    context.dispatch(FacebookEvents.REFRESH_BUSINESS_PAGE, {
        business: payload.business
    });

    hairfieApi
        .getBusinessFacebookPage(payload.business, context.getAuthToken())
        .then(function (facebookPage) {
            context.dispatch(FacebookEvents.REFRESH_BUSINESS_PAGE_SUCCESS, {
                business    : payload.business,
                facebookPage: facebookPage
            });
            done();
        })
        .fail(function (error) {
            context.dispatch(FacebookEvents.REFRESH_BUSINESS_PAGE_FAILURE, {
                business: payload.business
            });
            done(error);
        });
};
